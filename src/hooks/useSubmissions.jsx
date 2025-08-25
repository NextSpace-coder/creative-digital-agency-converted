import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useSubmissions = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  // Get current user
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch submissions data
  const fetchData = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data: result, error } = await supabase
        .from('bf3599cd-07a7-4490-a47d-631b6fa295f8_submissions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setData(result || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching submissions:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Insert new submission
  const insertSubmission = async (formData, formType = 'general') => {
    if (!user) {
      const error = new Error('User must be authenticated to submit data');
      setError(error.message);
      return { data: null, error };
    }

    try {
      const { data, error } = await supabase
        .from('bf3599cd-07a7-4490-a47d-631b6fa295f8_submissions')
        .insert({
          user_id: user.id,
          form_type: formType,
          data: formData,
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;

      // Refresh data after successful insert
      await fetchData();
      setError(null);
      
      return { data, error: null };
    } catch (err) {
      console.error('Error inserting submission:', err);
      setError(err.message);
      return { data: null, error: err };
    }
  };

  // Update submission status
  const updateSubmissionStatus = async (submissionId, status) => {
    if (!user) {
      const error = new Error('User must be authenticated');
      setError(error.message);
      return { data: null, error };
    }

    try {
      const { data, error } = await supabase
        .from('bf3599cd-07a7-4490-a47d-631b6fa295f8_submissions')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', submissionId)
        .eq('user_id', user.id) // Ensure user can only update their own submissions
        .select()
        .single();

      if (error) throw error;

      // Refresh data after successful update
      await fetchData();
      setError(null);
      
      return { data, error: null };
    } catch (err) {
      console.error('Error updating submission:', err);
      setError(err.message);
      return { data: null, error: err };
    }
  };

  // Delete submission
  const deleteSubmission = async (submissionId) => {
    if (!user) {
      const error = new Error('User must be authenticated');
      setError(error.message);
      return { error };
    }

    try {
      const { error } = await supabase
        .from('bf3599cd-07a7-4490-a47d-631b6fa295f8_submissions')
        .delete()
        .eq('id', submissionId)
        .eq('user_id', user.id); // Ensure user can only delete their own submissions

      if (error) throw error;

      // Refresh data after successful delete
      await fetchData();
      setError(null);
      
      return { error: null };
    } catch (err) {
      console.error('Error deleting submission:', err);
      setError(err.message);
      return { error: err };
    }
  };

  useEffect(() => {
    if (user) {
      fetchData();
    } else {
      setData([]);
      setLoading(false);
    }
  }, [user]);

  return { 
    data, 
    loading, 
    error, 
    user,
    fetchData, 
    insertSubmission,
    updateSubmissionStatus,
    deleteSubmission
  };
};