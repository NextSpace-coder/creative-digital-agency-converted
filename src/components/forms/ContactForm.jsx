import React, { useState } from 'react';
import { useSubmissions } from '@/hooks/useSubmissions';
import { FormTypes } from '@/integrations/supabase/types';

const ContactForm = () => {
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

  const { insertSubmission, error, user } = useSubmissions();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log('Input changed:', name, value); // Debug log
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('Form submit triggered'); // Debug log
    console.log('Form data:', formData); // Debug log
    console.log('User:', user); // Debug log
    
    if (!user) {
      setSubmitError('请先登录后再提交表单');
      alert('请先登录后再提交表单');
      return;
    }

    // Basic validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setSubmitError('请填写必填字段');
      alert('请填写所有必填字段（姓名、邮箱、消息）');
      return;
    }

    setIsSubmitting(true);
    setSubmitSuccess(false);
    setSubmitError('');

    try {
      console.log('Calling insertSubmission...'); // Debug log
      
      const { data, error } = await insertSubmission(formData, FormTypes.CONTACT);
      
      console.log('Insert result:', { data, error }); // Debug log
      
      if (error) {
        console.error('提交失败:', error);
        setSubmitError(`提交失败: ${error.message || error}`);
        alert(`提交失败: ${error.message || error}`);
      } else {
        console.log('提交成功:', data);
        setSubmitSuccess(true);
        setSubmitError('');
        
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });
        
        alert('表单提交成功！我们会尽快与您联系。');
        
        // Hide success message after 5 seconds
        setTimeout(() => setSubmitSuccess(false), 5000);
      }
    } catch (err) {
      console.error('提交过程中出错:', err);
      const errorMessage = err.message || '未知错误';
      setSubmitError(`提交失败: ${errorMessage}`);
      alert(`提交失败: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle button click specifically
  const handleButtonClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Button clicked directly'); // Debug log
    
    // Trigger form submission
    const form = e.target.closest('form');
    if (form) {
      console.log('Found form, triggering submit'); // Debug log
      const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
      form.dispatchEvent(submitEvent);
    } else {
      console.log('No form found, calling handleSubmit directly'); // Debug log
      handleSubmit(e);
    }
  };

  if (!user) {
    return (
      <div className="aximo-form-wrap2">
        <h3>联系我们</h3>
        <p>请先登录后再提交联系表单</p>
        <div style={{ marginTop: '20px' }}>
          <button 
            type="button"
            onClick={() => {
              console.log('Redirect to auth');
              // You can implement auth redirect logic here
              alert('请先完成登录');
            }}
            className="aximo-default-btn"
          >
            <span className="aximo-label-up">前往登录</span>
          </button>
        </div>
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

      {submitError && (
        <div className="alert alert-danger mb-4" style={{
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

      {error && (
        <div className="alert alert-danger mb-4" style={{
          padding: '15px',
          backgroundColor: '#f8d7da',
          border: '1px solid #f5c6cb',
          borderRadius: '5px',
          color: '#721c24',
          marginBottom: '20px'
        }}>
          ❌ 系统错误: {error}
        </div>
      )}

      <form onSubmit={handleSubmit} id="contact-form">
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
                rows="5"
              ></textarea>
            </div>
          </div>
          <div className="col-lg-12">
            <button 
              type="submit"
              onClick={handleButtonClick}
              id="aximo-submit-btn2"
              disabled={isSubmitting}
              style={{
                opacity: isSubmitting ? 0.7 : 1,
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                backgroundColor: isSubmitting ? '#ccc' : '',
                minWidth: '150px'
              }}
            >
              <span className="aximo-label-up">
                {isSubmitting ? '提交中...' : '发送消息'}
              </span>
            </button>
          </div>
        </div>
      </form>

      {/* Debug info - remove in production */}
      <div style={{ 
        marginTop: '20px', 
        padding: '10px', 
        backgroundColor: '#f8f9fa', 
        borderRadius: '5px',
        fontSize: '12px',
        color: '#666'
      }}>
        <strong>调试信息:</strong><br/>
        用户登录状态: {user ? '已登录' : '未登录'}<br/>
        表单状态: {isSubmitting ? '提交中' : '就绪'}<br/>
        表单数据: {JSON.stringify(formData, null, 2)}
      </div>
    </div>
  );
};

export default ContactForm;