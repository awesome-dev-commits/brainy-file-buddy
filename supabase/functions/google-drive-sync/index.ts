import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface GoogleDriveFile {
  id: string;
  name: string;
  mimeType: string;
  size?: string;
  modifiedTime: string;
  createdTime: string;
  parents?: string[];
  shared?: boolean;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      throw new Error('Invalid token');
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('google_access_token')
      .eq('user_id', user.id)
      .single();

    if (!profile?.google_access_token) {
      throw new Error('No Google access token found');
    }

    // Fetch files from Google Drive
    const driveResponse = await fetch(
      'https://www.googleapis.com/drive/v3/files?q=trashed=false&fields=files(id,name,mimeType,size,modifiedTime,createdTime,parents,shared)',
      {
        headers: {
          'Authorization': `Bearer ${profile.google_access_token}`,
        },
      }
    );

    if (!driveResponse.ok) {
      throw new Error('Failed to fetch from Google Drive');
    }

    const driveData = await driveResponse.json();
    const files: GoogleDriveFile[] = driveData.files || [];

    // Process and store files in batches
    const processedFiles = files.map(file => ({
      user_id: user.id,
      google_drive_id: file.id,
      name: file.name,
      mime_type: file.mimeType,
      size_bytes: file.size ? parseInt(file.size) : null,
      modified_time: file.modifiedTime,
      created_time: file.createdTime,
      parent_folders: file.parents || [],
      is_shared: file.shared || false,
      analysis_status: 'pending',
    }));

    // Upsert files to avoid duplicates
    const { error: upsertError } = await supabase
      .from('files')
      .upsert(processedFiles, {
        onConflict: 'user_id,google_drive_id',
        ignoreDuplicates: false,
      });

    if (upsertError) {
      throw upsertError;
    }

    // Start background analysis
    EdgeRuntime.waitUntil(analyzeFiles(supabase, user.id));

    return new Response(
      JSON.stringify({
        success: true,
        filesProcessed: processedFiles.length,
        message: 'Files synced successfully',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in google-drive-sync:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

async function analyzeFiles(supabase: any, userId: string) {
  try {
    console.log('Starting file analysis for user:', userId);

    // Get files that need analysis
    const { data: files } = await supabase
      .from('files')
      .select('*')
      .eq('user_id', userId)
      .eq('analysis_status', 'pending')
      .limit(100);

    if (!files || files.length === 0) {
      console.log('No files to analyze');
      return;
    }

    // Update status to processing
    await supabase
      .from('files')
      .update({ analysis_status: 'processing' })
      .in('id', files.map(f => f.id));

    const analyses = [];

    for (const file of files) {
      // Analyze for duplicates
      const { data: duplicates } = await supabase
        .from('files')
        .select('id')
        .eq('user_id', userId)
        .eq('name', file.name)
        .eq('size_bytes', file.size_bytes)
        .neq('id', file.id);

      if (duplicates && duplicates.length > 0) {
        analyses.push({
          user_id: userId,
          file_id: file.id,
          analysis_type: 'duplicate',
          confidence_score: 0.95,
          potential_savings_bytes: file.size_bytes,
          recommendation: `Duplicate file found. Consider removing ${duplicates.length} duplicate(s).`,
        });
      }

      // Analyze for large files (>100MB)
      if (file.size_bytes && file.size_bytes > 100 * 1024 * 1024) {
        analyses.push({
          user_id: userId,
          file_id: file.id,
          analysis_type: 'large_file',
          confidence_score: 0.9,
          potential_savings_bytes: file.size_bytes,
          recommendation: 'Large file detected. Consider compressing or archiving.',
        });
      }

      // Analyze for old files (>2 years)
      const fileAge = Date.now() - new Date(file.modified_time).getTime();
      const twoYears = 2 * 365 * 24 * 60 * 60 * 1000;
      
      if (fileAge > twoYears) {
        analyses.push({
          user_id: userId,
          file_id: file.id,
          analysis_type: 'old_file',
          confidence_score: 0.7,
          potential_savings_bytes: file.size_bytes,
          recommendation: 'File not modified in over 2 years. Consider archiving or deleting.',
        });
      }
    }

    // Insert analyses
    if (analyses.length > 0) {
      await supabase.from('file_analysis').insert(analyses);
    }

    // Update file status to completed
    await supabase
      .from('files')
      .update({ analysis_status: 'completed' })
      .in('id', files.map(f => f.id));

    console.log(`Analysis completed for ${files.length} files, ${analyses.length} recommendations generated`);
  } catch (error) {
    console.error('Error in file analysis:', error);
  }
}