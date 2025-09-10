import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { fileIds } = await req.json();

    if (!fileIds || !Array.isArray(fileIds)) {
      throw new Error('Invalid fileIds provided');
    }

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

    // Get user's Google access token
    const { data: profile } = await supabase
      .from('profiles')
      .select('google_access_token')
      .eq('user_id', user.id)
      .single();

    if (!profile?.google_access_token) {
      throw new Error('No Google access token found');
    }

    // Get files to delete
    const { data: filesToDelete } = await supabase
      .from('files')
      .select('id, google_drive_id, name')
      .eq('user_id', user.id)
      .in('id', fileIds);

    if (!filesToDelete || filesToDelete.length === 0) {
      throw new Error('No files found to delete');
    }

    const deletionResults = [];

    // Delete files from Google Drive
    for (const file of filesToDelete) {
      try {
        const deleteResponse = await fetch(
          `https://www.googleapis.com/drive/v3/files/${file.google_drive_id}`,
          {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${profile.google_access_token}`,
            },
          }
        );

        if (deleteResponse.ok) {
          // Remove from our database
          await supabase
            .from('files')
            .delete()
            .eq('id', file.id);

          // Remove associated analysis
          await supabase
            .from('file_analysis')
            .delete()
            .eq('file_id', file.id);

          deletionResults.push({
            fileId: file.id,
            fileName: file.name,
            status: 'deleted',
          });
        } else {
          deletionResults.push({
            fileId: file.id,
            fileName: file.name,
            status: 'failed',
            error: `HTTP ${deleteResponse.status}`,
          });
        }
      } catch (error) {
        deletionResults.push({
          fileId: file.id,
          fileName: file.name,
          status: 'failed',
          error: error.message,
        });
      }
    }

    const successCount = deletionResults.filter(r => r.status === 'deleted').length;
    const failCount = deletionResults.filter(r => r.status === 'failed').length;

    return new Response(
      JSON.stringify({
        success: true,
        message: `Deleted ${successCount} files, ${failCount} failed`,
        results: deletionResults,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in google-drive-delete:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});