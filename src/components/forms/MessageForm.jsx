import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

const MessageForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('Current Page:', window.location.pathname);
    console.log('Submite Form Data = ', formData);
    
    // 基础验证
    if (!formData.name.trim() || !formData.email.trim()) {
      setSubmitError('请填写姓名和邮箱');
      alert('请填写姓名和邮箱');
      return;
    }

    setIsSubmitting(true);
    setSubmitSuccess(false);
    setSubmitError('');

    try {
      console.log('开始提交到Supabase...');
      
      // 生成匿名用户ID
      const anonymousUserId = 'anonymous-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
      
      // 准备提交数据
      const submissionData = {
        user_id: anonymousUserId,
        form_type: 'contact',
        data: {
          ...formData,
          submitted_at: new Date().toISOString(),
          page: window.location.pathname,
          user_agent: navigator.userAgent
        },
        status: 'pending'
      };

      console.log('准备提交的数据:', submissionData);

      // 提交到Supabase
      const { data, error } = await supabase
        .from('bf3599cd-07a7-4490-a47d-631b6fa295f8_submissions')
        .insert(submissionData)
        .select()
        .single();

      console.log('Supabase响应:', { data, error });

      if (error) {
        console.error('Supabase错误:', error);
        throw new Error(`数据库错误: ${error.message}`);
      }

      console.log('提交成功!', data);
      
      // 成功处理
      setSubmitSuccess(true);
      setSubmitError('');
      
      // 重置表单
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      
      alert('表单提交成功！感谢您的留言。');
      
      // 5秒后隐藏成功消息
      setTimeout(() => setSubmitSuccess(false), 5000);

    } catch (err) {
      console.error('提交失败:', err);
      const errorMessage = err.message || '提交失败，请稍后重试';
      setSubmitError(errorMessage);
      alert(`提交失败: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="aximo-form-wrap2">
      <h3>发送消息</h3>
      <p>请填写下面的表格，我们会尽快回复您。</p>
      
      {submitSuccess && (
        <div style={{
          padding: '15px',
          backgroundColor: '#d4edda',
          border: '1px solid #c3e6cb',
          borderRadius: '5px',
          color: '#155724',
          marginBottom: '20px'
        }}>
          ✅ 表单提交成功！我们会尽快与您联系。
        </div>
      )}

      {submitError && (
        <div style={{
          padding: '15px',
          backgroundColor: '#f8d7da',
          border: '1px solid #f5c6cb',
          borderRadius: '5px',
          color: '#721c24',
          marginBottom: '20px'
        }}>
          ❌ {submitError}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-lg-6">
            <div className="aximo-form-field2">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="您的姓名 *"
                required
                disabled={isSubmitting}
              />
            </div>
          </div>
          <div className="col-lg-6">
            <div className="aximo-form-field2">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="您的邮箱 *"
                required
                disabled={isSubmitting}
              />
            </div>
          </div>
          <div className="col-lg-6">
            <div className="aximo-form-field2">
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="您的电话"
                disabled={isSubmitting}
              />
            </div>
          </div>
          <div className="col-lg-6">
            <div className="aximo-form-field2">
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                placeholder="主题"
                disabled={isSubmitting}
              />
            </div>
          </div>
          <div className="col-lg-12">
            <div className="aximo-form-field2">
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="您的消息"
                disabled={isSubmitting}
                rows="5"
              ></textarea>
            </div>
          </div>
          <div className="col-lg-12">
            <button 
              type="submit"
              disabled={isSubmitting}
              style={{
                opacity: isSubmitting ? 0.7 : 1,
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                minWidth: '150px',
                padding: '12px 24px',
                backgroundColor: isSubmitting ? '#ccc' : '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '5px'
              }}
            >
              <span>
                {isSubmitting ? '提交中...' : '发送消息'}
              </span>
            </button>
          </div>
        </div>
      </form>

      {/* 调试信息 */}
      <div style={{ 
        marginTop: '20px', 
        padding: '10px', 
        backgroundColor: '#f8f9fa', 
        borderRadius: '5px',
        fontSize: '12px',
        color: '#666'
      }}>
        <strong>调试信息:</strong><br/>
        提交状态: {isSubmitting ? '提交中' : '就绪'}<br/>
        成功状态: {submitSuccess ? '是' : '否'}<br/>
        错误信息: {submitError || '无'}<br/>
        表单数据: {JSON.stringify(formData, null, 2)}
      </div>
    </div>
  );
};

export default MessageForm;