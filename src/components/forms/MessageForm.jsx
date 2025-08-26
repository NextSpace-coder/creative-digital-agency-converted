import React, { useState, useEffect } from 'react';
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
  const [supabaseStatus, setSupabaseStatus] = useState('检查中...');

  // 检查Supabase连接状态
  useEffect(() => {
    const checkSupabaseConnection = async () => {
      try {
        console.log('检查Supabase连接...');
        console.log('Supabase client:', supabase);
        
        if (!supabase || !supabase.supabaseUrl || supabase.supabaseUrl === 'NOT_CONFIGURED') {
          setSupabaseStatus('Supabase未配置');
          return;
        }
        
        // 测试连接
        const { data, error } = await supabase
          .from('bf3599cd-07a7-4490-a47d-631b6fa295f8_submissions')
          .select('count', { count: 'exact', head: true });
        
        console.log('连接测试结果:', { data, error });
        
        if (error) {
          console.error('Supabase连接错误:', error);
          setSupabaseStatus(`连接失败: ${error.message}`);
        } else {
          console.log('Supabase连接成功');
          setSupabaseStatus('连接正常');
        }
      } catch (err) {
        console.error('Supabase连接异常:', err);
        setSupabaseStatus(`连接异常: ${err.message}`);
      }
    };
    
    checkSupabaseConnection();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(`输入变化: ${name} = ${value}`);
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    console.log('🚀 handleSubmit 被调用!');
    console.log('事件对象:', e);
    console.log('事件类型:', e.type);
    
    e.preventDefault();
    e.stopPropagation();
    
    console.log('=== 表单提交开始 ===');
    console.log('Current Page:', window.location.pathname);
    console.log('Submit Form Data =', formData);
    
    // 基础验证
    if (!formData.name.trim() || !formData.email.trim()) {
      const errorMsg = '请填写姓名和邮箱';
      setSubmitError(errorMsg);
      alert(errorMsg);
      console.log('验证失败:', errorMsg);
      return;
    }

    setIsSubmitting(true);
    setSubmitSuccess(false);
    setSubmitError('');

    try {
      console.log('=== 开始Supabase操作 ===');
      
      // 检查Supabase是否可用
      if (!supabase || supabase.supabaseUrl === 'NOT_CONFIGURED') {
        throw new Error('Supabase未正确配置，请检查环境变量');
      }
      
      // 生成匿名用户ID
      const anonymousUserId = 'anonymous-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
      console.log('生成的匿名用户ID:', anonymousUserId);
      
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

      console.log('准备提交的数据:', JSON.stringify(submissionData, null, 2));

      // 执行插入操作
      console.log('执行插入操作...');
      const { data, error } = await supabase
        .from('bf3599cd-07a7-4490-a47d-631b6fa295f8_submissions')
        .insert(submissionData)
        .select()
        .single();

      console.log('=== Supabase插入结果 ===');
      console.log('返回数据:', data);
      console.log('错误信息:', error);

      if (error) {
        console.error('Supabase插入错误:', error);
        throw new Error(`数据库错误: ${error.message}`);
      }

      console.log('=== 提交成功! ===', data);
      
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
      console.error('=== 提交失败 ===');
      console.error('错误对象:', err);
      
      const errorMessage = err.message || '提交失败，请稍后重试';
      setSubmitError(errorMessage);
      alert(`提交失败: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
      console.log('=== 表单提交结束 ===');
    }
  };

  // 按钮点击处理器
  const handleButtonClick = (e) => {
    console.log('🔘 按钮被点击!');
    console.log('点击事件:', e);
    
    e.preventDefault();
    e.stopPropagation();
    
    // 直接调用提交函数
    handleSubmit(e);
  };

  // 测试函数
  const testFunction = () => {
    console.log('🧪 测试函数被调用');
    alert('测试函数工作正常！');
  };

  return (
    <div className="aximo-form-wrap2">
      <h3>发送消息</h3>
      <p>请填写下面的表格，我们会尽快回复您。</p>
      
      {/* Supabase状态显示 */}
      <div style={{
        padding: '10px',
        marginBottom: '15px',
        backgroundColor: supabaseStatus.includes('正常') ? '#d4edda' : '#fff3cd',
        border: `1px solid ${supabaseStatus.includes('正常') ? '#c3e6cb' : '#ffeaa7'}`,
        borderRadius: '5px',
        fontSize: '14px'
      }}>
        <strong>Supabase状态:</strong> {supabaseStatus}
        <button 
          type="button" 
          onClick={testFunction}
          style={{
            marginLeft: '10px',
            padding: '5px 10px',
            fontSize: '12px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '3px',
            cursor: 'pointer'
          }}
        >
          测试按钮
        </button>
      </div>
      
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
                placeholder="您的消息"
                disabled={isSubmitting}
                rows="5"
              ></textarea>
            </div>
          </div>
          <div className="col-lg-12">
            {/* 主提交按钮 */}
            <button 
              type="submit"
              onClick={handleButtonClick}
              disabled={isSubmitting}
              style={{
                opacity: isSubmitting ? 0.7 : 1,
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                minWidth: '150px',
                padding: '12px 24px',
                backgroundColor: isSubmitting ? '#ccc' : '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                marginRight: '10px'
              }}
            >
              <span>
                {isSubmitting ? '提交中...' : '发送消息'}
              </span>
            </button>
            
            {/* 备用测试按钮 */}
            <button 
              type="button"
              onClick={() => {
                console.log('🔥 直接调用提交函数');
                handleSubmit({ preventDefault: () => {}, stopPropagation: () => {}, type: 'manual' });
              }}
              disabled={isSubmitting}
              style={{
                padding: '12px 24px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              直接提交
            </button>
          </div>
        </div>
      </form>

      {/* 详细调试信息 */}
      <div style={{ 
        marginTop: '20px', 
        padding: '15px', 
        backgroundColor: '#f8f9fa', 
        borderRadius: '5px',
        fontSize: '12px',
        color: '#666',
        fontFamily: 'monospace',
        border: '1px solid #dee2e6'
      }}>
        <strong>详细调试信息:</strong><br/>
        提交状态: {isSubmitting ? '提交中' : '就绪'}<br/>
        成功状态: {submitSuccess ? '是' : '否'}<br/>
        错误信息: {submitError || '无'}<br/>
        Supabase状态: {supabaseStatus}<br/>
        <br/>
        <strong>表单数据:</strong><br/>
        姓名: {formData.name || '(空)'}<br/>
        邮箱: {formData.email || '(空)'}<br/>
        电话: {formData.phone || '(空)'}<br/>
        主题: {formData.subject || '(空)'}<br/>
        消息: {formData.message || '(空)'}<br/>
        <br/>
        <strong>Supabase配置:</strong><br/>
        URL: {supabase?.supabaseUrl || '未配置'}<br/>
        Key: {supabase?.supabaseKey ? '已配置' : '未配置'}<br/>
        表名: bf3599cd-07a7-4490-a47d-631b6fa295f8_submissions
      </div>
    </div>
  );
};

export default MessageForm;