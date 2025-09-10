import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface FileStats {
  totalFiles: number;
  totalSize: number;
  duplicateCount: number;
  potentialSavings: number;
  analysisCount: number;
}

interface FileBreakdown {
  videos: number;
  images: number;
  documents: number;
  audio: number;
  other: number;
}

export const useRealTimeData = () => {
  const [stats, setStats] = useState<FileStats>({
    totalFiles: 0,
    totalSize: 0,
    duplicateCount: 0,
    potentialSavings: 0,
    analysisCount: 0,
  });
  const [breakdown, setBreakdown] = useState<FileBreakdown>({
    videos: 0,
    images: 0,
    documents: 0,
    audio: 0,
    other: 0,
  });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchStats = async () => {
    if (!user) return;

    try {
      // Get file statistics
      const { data: files } = await supabase
        .from('files')
        .select('size_bytes, mime_type')
        .eq('user_id', user.id);

      // Get analysis data
      const { data: analysis } = await supabase
        .from('file_analysis')
        .select('analysis_type, potential_savings_bytes')
        .eq('user_id', user.id);

      if (files) {
        const totalFiles = files.length;
        const totalSize = files.reduce((sum, file) => sum + (file.size_bytes || 0), 0);
        
        // Calculate breakdown by mime type
        const typeBreakdown = files.reduce((acc, file) => {
          const mimeType = file.mime_type || '';
          if (mimeType.startsWith('video/')) {
            acc.videos += file.size_bytes || 0;
          } else if (mimeType.startsWith('image/')) {
            acc.images += file.size_bytes || 0;
          } else if (mimeType.includes('document') || mimeType.includes('text') || mimeType.includes('pdf')) {
            acc.documents += file.size_bytes || 0;
          } else if (mimeType.startsWith('audio/')) {
            acc.audio += file.size_bytes || 0;
          } else {
            acc.other += file.size_bytes || 0;
          }
          return acc;
        }, { videos: 0, images: 0, documents: 0, audio: 0, other: 0 });

        setBreakdown(typeBreakdown);

        if (analysis) {
          const duplicateCount = analysis.filter(a => a.analysis_type === 'duplicate').length;
          const potentialSavings = analysis.reduce((sum, a) => sum + (a.potential_savings_bytes || 0), 0);
          
          setStats({
            totalFiles,
            totalSize,
            duplicateCount,
            potentialSavings,
            analysisCount: analysis.length,
          });
        } else {
          setStats({
            totalFiles,
            totalSize,
            duplicateCount: 0,
            potentialSavings: 0,
            analysisCount: 0,
          });
        }
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchStats();

      // Subscribe to real-time updates
      const filesChannel = supabase
        .channel('files-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'files',
            filter: `user_id=eq.${user.id}`,
          },
          () => {
            fetchStats();
          }
        )
        .subscribe();

      const analysisChannel = supabase
        .channel('analysis-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'file_analysis',
            filter: `user_id=eq.${user.id}`,
          },
          () => {
            fetchStats();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(filesChannel);
        supabase.removeChannel(analysisChannel);
      };
    }
  }, [user]);

  return {
    stats,
    breakdown,
    loading,
    refetch: fetchStats,
  };
};