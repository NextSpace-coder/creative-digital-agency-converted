import React, { useState } from 'react';

const MessageFormSimple = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');

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
    console.log('Submit Form Data =', formData);
    
    // 验证必填字段
    if (!formData.name.trim() || !formData.email.trim()) {
      alert('请填写姓名和邮箱');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('提交中...');

    try {
      // 模拟API调用
      console.log('开始API调用...');
      
      const response = await fetch('https://httpbin.org/post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          timestamp: new Date().toISOString(),
          page: window.location.pathname
        })
      });

      console.log('API响应状态:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('API响应数据:', result);
      
      setSubmitStatus('提交成功！');
      alert('表单提交成功！');
      
      // 重置表单
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });

    } catch (error) {
      console.error('提交错误:', error);
      setSubmitStatus(`提交失败: ${error.message}`);
      alert(`提交失败: ${error.message}`);
    } finally {
      setIsSubmitting(false);
      // 3秒后清除状态消息
      setTimeout(() => setSubmitStatus(''), 3000);
    }
  };

  return (
    <div className="aximo-form-wrap2">
      <h3>联系表单</h3>
      <p>请填写下面的信息，我们会尽快回复您。</p>
      
      {submitStatus && (
        <div style={{
          padding: '10px',
          marginBottom: '15px',
          backgroundColor: submitStatus.includes('成功') ? '#d4edda' : '#f8d7da',
          border: `1px solid ${submitStatus.includes('成功') ? '#c3e6cb' : '#f5c6cb'}`,
          borderRadius: '5px',
          color: submitStatus.includes('成功') ? '#155724' : '#721c24'
        }}>
          {submitStatus}
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
              className="aximo-default-btn"
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

      {/* 实时调试信息 */}
      <div style={{ 
        marginTop: '20px', 
        padding: '10px', 
        backgroundColor: '#f8f9fa', 
        borderRadius: '5px',
        fontSize: '12px',
        color: '#666',
        fontFamily: 'monospace'
      }}>
        <strong>实时状态:</strong><br/>
        提交状态: {isSubmitting ? '提交中' : '就绪'}<br/>
        状态消息: {submitStatus || '无'}<br/>
        姓名: {formData.name || '(空)'}<br/>
        邮箱: {formData.email || '(空)'}
      </div>
    </div>
  );
};

export default MessageFormSimple;