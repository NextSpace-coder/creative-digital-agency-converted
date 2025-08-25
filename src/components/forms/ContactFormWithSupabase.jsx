import React, { useState } from 'react';
import { useSubmissions } from '@/hooks/useSubmissions';
import { FormTypes } from '@/integrations/supabase/types';

const ContactFormWithSupabase = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const { insertSubmission, error, user } = useSubmissions();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      alert('请先登录后再提交表单');
      return;
    }

    setIsSubmitting(true);
    setSubmitSuccess(false);

    try {
      const { data, error } = await insertSubmission(formData, FormTypes.CONTACT);
      
      if (error) {
        console.error('提交失败:', error);
        alert('提交失败，请稍后重试');
      } else {
        console.log('提交成功:', data);
        setSubmitSuccess(true);
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });
        
        // Hide success message after 3 seconds
        setTimeout(() => setSubmitSuccess(false), 3000);
      }
    } catch (err) {
      console.error('提交过程中出错:', err);
      alert('提交失败，请稍后重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="aximo-form-wrap2">
        <h3>联系我们</h3>
        <p>请先登录后再提交联系表单</p>
        <button 
          onClick={() => window.location.href = '/login'}
          className="aximo-default-btn"
        >
          <span className="aximo-label-up">前往登录</span>
        </button>
      </div>
    );
  }

  return (
    <div className="aximo-form-wrap2">
      <h3>联系我们</h3>
      <p>我们很乐意听到您的声音。请填写下面的表格，我们会尽快回复您。</p>
      
      {submitSuccess && (
        <div className="alert alert-success mb-4" style={{
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

      {error && (
        <div className="alert alert-danger mb-4" style={{
          padding: '15px',
          backgroundColor: '#f8d7da',
          border: '1px solid #f5c6cb',
          borderRadius: '5px',
          color: '#721c24',
          marginBottom: '20px'
        }}>
          ❌ 错误: {error}
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
                placeholder="您的消息 *"
                required
                disabled={isSubmitting}
              ></textarea>
            </div>
          </div>
          <div className="col-lg-12">
            <button 
              type="submit" 
              id="aximo-submit-btn2"
              disabled={isSubmitting}
              style={{
                opacity: isSubmitting ? 0.7 : 1,
                cursor: isSubmitting ? 'not-allowed' : 'pointer'
              }}
            >
              <span className="aximo-label-up">
                {isSubmitting ? '提交中...' : '发送消息'}
              </span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ContactFormWithSupabase;