import React from 'react';
import SubmissionDashboard from '@/components/SubmissionDashboard';
import AuthWrapper from '@/components/forms/AuthWrapper';

const DashboardPage = () => {
  return (
    <AuthWrapper>
      <div className="aximo-breadcrumb">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <h1 className="post__title">数据管理面板</h1>
              <nav className="breadcrumbs">
                <ul>
                  <li><a href="/">首页</a></li>
                  <li>数据管理</li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>

      <SubmissionDashboard />
    </AuthWrapper>
  );
};

export default DashboardPage;