import React, { useState } from 'react';
import { useSubmissions } from '@/hooks/useSubmissions';
import { SubmissionStatus, FormTypes } from '@/integrations/supabase/types';

const SubmissionDashboard = () => {
  const { data, loading, error, user, updateSubmissionStatus, deleteSubmission } = useSubmissions();
  const [selectedType, setSelectedType] = useState('all');

  if (!user) {
    return (
      <div className="aximo-section-padding">
        <div className="container">
          <div className="text-center">
            <h3>提交记录管理</h3>
            <p>请先登录查看您的提交记录</p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="aximo-section-padding">
        <div className="container">
          <div className="text-center">
            <div className="aximo-loading-dots">
              <div className="aximo-loading-dots--dot"></div>
              <div className="aximo-loading-dots--dot"></div>
              <div className="aximo-loading-dots--dot"></div>
            </div>
            <p>加载提交记录中...</p>
          </div>
        </div>
      </div>
    );
  }

  const filteredData = selectedType === 'all' 
    ? data 
    : data.filter(item => item.form_type === selectedType);

  const getStatusColor = (status) => {
    switch (status) {
      case SubmissionStatus.PENDING: return '#ffc107';
      case SubmissionStatus.PROCESSED: return '#17a2b8';
      case SubmissionStatus.APPROVED: return '#28a745';
      case SubmissionStatus.REJECTED: return '#dc3545';
      default: return '#6c757d';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case SubmissionStatus.PENDING: return '待处理';
      case SubmissionStatus.PROCESSED: return '已处理';
      case SubmissionStatus.APPROVED: return '已批准';
      case SubmissionStatus.REJECTED: return '已拒绝';
      default: return status;
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    await updateSubmissionStatus(id, newStatus);
  };

  const handleDelete = async (id) => {
    if (window.confirm('确定要删除这条记录吗？')) {
      await deleteSubmission(id);
    }
  };

  return (
    <div className="aximo-section-padding">
      <div className="container">
        <div className="aximo-section-title center">
          <h2>我的提交记录</h2>
          <p>管理和查看您的所有表单提交记录</p>
        </div>

        {error && (
          <div className="alert alert-danger" style={{
            padding: '15px',
            backgroundColor: '#f8d7da',
            border: '1px solid #f5c6cb',
            borderRadius: '5px',
            color: '#721c24',
            marginBottom: '30px'
          }}>
            错误: {error}
          </div>
        )}

        <div className="row mb-4">
          <div className="col-12">
            <div style={{ marginBottom: '30px' }}>
              <label style={{ marginRight: '10px', fontWeight: 'bold' }}>筛选类型:</label>
              <select 
                value={selectedType} 
                onChange={(e) => setSelectedType(e.target.value)}
                style={{
                  padding: '8px 12px',
                  borderRadius: '5px',
                  border: '1px solid #ddd'
                }}
              >
                <option value="all">全部</option>
                <option value={FormTypes.CONTACT}>联系表单</option>
                <option value={FormTypes.FEEDBACK}>反馈表单</option>
                <option value={FormTypes.REGISTRATION}>注册表单</option>
                <option value={FormTypes.GENERAL}>通用表单</option>
              </select>
            </div>
          </div>
        </div>

        {filteredData.length === 0 ? (
          <div className="text-center">
            <p>暂无提交记录</p>
          </div>
        ) : (
          <div className="row">
            {filteredData.map((submission) => (
              <div key={submission.id} className="col-lg-6 col-md-6 mb-4">
                <div className="aximo-iconbox-wrap" style={{ padding: '25px' }}>
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <h4 style={{ fontSize: '18px', marginBottom: '5px' }}>
                      {submission.form_type.charAt(0).toUpperCase() + submission.form_type.slice(1)} 表单
                    </h4>
                    <span 
                      style={{
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        color: 'white',
                        backgroundColor: getStatusColor(submission.status)
                      }}
                    >
                      {getStatusText(submission.status)}
                    </span>
                  </div>

                  <div className="submission-data" style={{ marginBottom: '15px' }}>
                    <strong>提交数据:</strong>
                    <div style={{ 
                      backgroundColor: '#f8f9fa', 
                      padding: '10px', 
                      borderRadius: '5px',
                      marginTop: '5px',
                      fontSize: '14px'
                    }}>
                      {Object.entries(submission.data).map(([key, value]) => (
                        <div key={key} style={{ marginBottom: '5px' }}>
                          <strong>{key}:</strong> {String(value)}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="submission-meta" style={{ fontSize: '14px', color: '#666', marginBottom: '15px' }}>
                    <div><strong>创建时间:</strong> {new Date(submission.created_at).toLocaleString('zh-CN')}</div>
                    <div><strong>更新时间:</strong> {new Date(submission.updated_at).toLocaleString('zh-CN')}</div>
                  </div>

                  <div className="submission-actions">
                    <select 
                      value={submission.status}
                      onChange={(e) => handleStatusUpdate(submission.id, e.target.value)}
                      style={{
                        padding: '5px 8px',
                        marginRight: '10px',
                        borderRadius: '3px',
                        border: '1px solid #ddd',
                        fontSize: '14px'
                      }}
                    >
                      <option value={SubmissionStatus.PENDING}>待处理</option>
                      <option value={SubmissionStatus.PROCESSED}>已处理</option>
                      <option value={SubmissionStatus.APPROVED}>已批准</option>
                      <option value={SubmissionStatus.REJECTED}>已拒绝</option>
                    </select>
                    
                    <button 
                      onClick={() => handleDelete(submission.id)}
                      style={{
                        padding: '5px 10px',
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '3px',
                        fontSize: '14px',
                        cursor: 'pointer'
                      }}
                    >
                      删除
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-4">
          <p style={{ color: '#666', fontSize: '14px' }}>
            总共 {data.length} 条记录，当前显示 {filteredData.length} 条
          </p>
        </div>
      </div>
    </div>
  );
};

export default SubmissionDashboard;