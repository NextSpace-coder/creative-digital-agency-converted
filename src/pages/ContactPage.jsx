import React from 'react';
import ContactFormWithSupabase from '@/components/forms/ContactFormWithSupabase';
import SimpleAuth from '@/components/forms/SimpleAuth';
import AuthWrapper from '@/components/forms/AuthWrapper';

const ContactPage = () => {
  return (
    <AuthWrapper>
      <div className="aximo-breadcrumb">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <h1 className="post__title">联系我们</h1>
              <nav className="breadcrumbs">
                <ul>
                  <li><a href="/">首页</a></li>
                  <li>联系我们</li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>

      <div className="aximo-content-section">
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              <ContactFormWithSupabase />
            </div>
            <div className="col-lg-4">
              <SimpleAuth />
              
              <div className="aximo-contact-info" style={{ marginTop: '40px' }}>
                <h3>联系信息</h3>
                <ul>
                  <li>
                    <a href="mailto:info@example.com">
                      <i className="icon-envelope"></i>
                      info@example.com
                    </a>
                  </li>
                  <li>
                    <a href="tel:+1234567890">
                      <i className="icon-phone"></i>
                      +86 123 4567 8900
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      <i className="icon-map-marker"></i>
                      北京市朝阳区示例街道123号
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthWrapper>
  );
};

export default ContactPage;