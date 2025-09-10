import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export const useGoogleDrive = () => {
  const [loading, setLoading] = useState(false);
  const { session } = useAuth();

  const syncFiles = async () => {
    if (!session) {
      toast.error('Not authenticated');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('google-drive-sync', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;

      toast.success(`Successfully synced ${data.filesProcessed} files`);
      return data;
    } catch (error) {
      console.error('Sync error:', error);
      toast.error('Failed to sync files');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteFiles = async (fileIds: string[]) => {
    if (!session) {
      toast.error('Not authenticated');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('google-drive-delete', {
        body: { fileIds },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;

      toast.success(data.message);
      return data;
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete files');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    syncFiles,
    deleteFiles,
    loading,
  };
};