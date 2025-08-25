import React, { useState } from 'react';
import { useContactForm } from '@/hooks/useContactForm';

const ContactFormSupabase = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const { submitContactForm, isSubmitting, error } = useContactForm();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log('Input changed:', name, value);
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('Form submit triggered');
    console.log('Form data:', formData);
    
    // Basic validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setSubmitError('请填写必填字段');
      return;
    }

    setSubmitSuccess(false);
    setSubmitError('');

    try {
      const result = await submitContactForm(formData);
      
      if (result.success) {
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
        
        // Hide success message after 5 seconds
        setTimeout(() => setSubmitSuccess(false), 5000);
      } else {
        setSubmitError(result.error?.message || '提交失败，请稍后重试');
      }
    } catch (err) {
      console.error('Submit error:', err);
      setSubmitError(err.message || '提交失败，请稍后重试');
    }
  };

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

      {(submitError || error) && (
        <div className="alert alert-danger mb-4" style={{
          padding: '15px',
          backgroundColor: '#f8d7da',
          border: '1px solid #f5c6cb',
          borderRadius: '5px',
          color: '#721c24',
          marginBottom: '20px'
        }}>
          ❌ {submitError || error}
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
              id="aximo-submit-btn2"
              disabled={isSubmitting}
              style={{
                opacity: isSubmitting ? 0.7 : 1,
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
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

      {/* Debug info */}
      <div style={{ 
        marginTop: '20px', 
        padding: '10px', 
        backgroundColor: '#f8f9fa', 
        borderRadius: '5px',
        fontSize: '12px',
        color: '#666'
      }}>
        <strong>调试信息:</strong><br/>
        表单状态: {isSubmitting ? '提交中' : '就绪'}<br/>
        表单数据: {JSON.stringify(formData, null, 2)}
      </div>
    </div>
  );
};

export default ContactFormSupabase;