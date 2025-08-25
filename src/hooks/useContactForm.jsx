import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const submitContactForm = async (formData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      console.log('Submitting contact form to Supabase:', formData);

      // 生成一个临时用户ID用于匿名提交
      const anonymousUserId = 'anonymous-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);

      const { data, error } = await supabase
        .from('bf3599cd-07a7-4490-a47d-631b6fa295f8_submissions')
        .insert({
          user_id: anonymousUserId, // 使用临时ID
          form_type: 'contact',
          data: {
            ...formData,
            submitted_at: new Date().toISOString(),
            ip_address: 'unknown', // 可以从请求中获取
            user_agent: navigator.userAgent
          },
          status: 'pending'
        })
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Contact form submitted successfully:', data);
      return { success: true, data };

    } catch (err) {
      console.error('Contact form submission error:', err);
      setError(err.message);
      return { success: false, error: err };
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    submitContactForm,
    isSubmitting,
    error
  };
};