import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

const SimpleAuth = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSignIn = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: window.location.origin
        }
      });

      if (error) throw error;

      setMessage('请检查您的邮箱，点击登录链接完成登录！');
    } catch (error) {
      setMessage(`错误: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setMessage('已成功登出');
  };

  return (
    <div className="aximo-account-wrap" style={{ maxWidth: '400px', margin: '20px auto' }}>
      <div className="aximo-account-title">
        <h3>快速登录</h3>
      </div>

      {message && (
        <div 
          className={`alert ${message.includes('错误') ? 'alert-danger' : 'alert-success'}`}
          style={{
            padding: '15px',
            marginBottom: '20px',
            borderRadius: '5px',
            backgroundColor: message.includes('错误') ? '#f8d7da' : '#d4edda',
            border: `1px solid ${message.includes('错误') ? '#f5c6cb' : '#c3e6cb'}`,
            color: message.includes('错误') ? '#721c24' : '#155724'
          }}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSignIn}>
        <div className="aximo-account-field">
          <label>邮箱地址</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="请输入您的邮箱"
            required
            disabled={isLoading}
          />
        </div>

        <button 
          type="submit" 
          id="aximo-account-btn"
          disabled={isLoading || !email}
          style={{
            opacity: (isLoading || !email) ? 0.7 : 1,
            cursor: (isLoading || !email) ? 'not-allowed' : 'pointer'
          }}
        >
          {isLoading ? '发送中...' : '发送登录链接'}
        </button>
      </form>

      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <button 
          onClick={handleSignOut}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--body-color)',
            textDecoration: 'underline',
            cursor: 'pointer'
          }}
        >
          登出
        </button>
      </div>
    </div>
  );
};

export default SimpleAuth;