import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

const AuthWrapper = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial user
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    getUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="text-center" style={{ padding: '50px' }}>
        <div className="aximo-loading-dots">
          <div className="aximo-loading-dots--dot"></div>
          <div className="aximo-loading-dots--dot"></div>
          <div className="aximo-loading-dots--dot"></div>
        </div>
        <p>加载中...</p>
      </div>
    );
  }

  return children;
};

export default AuthWrapper;