import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Result, Button, Spin, Card, Typography, Alert } from 'antd';
import { 
  CheckCircleOutlined, 
  CloseCircleOutlined, 
  LoadingOutlined,
  MailOutlined
} from '@ant-design/icons';
import { activeUser } from '../services/authService'; // Adjust the import path as necessary
const { Title, Paragraph, Text } = Typography;

function VerifyEmail() {
  const [verificationStatus, setVerificationStatus] = useState('loading'); // loading, success, error
  const [errorMessage, setErrorMessage] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyToken = async () => {
      const searchParams = new URLSearchParams(location.search);
      const token = searchParams.get('token');

      if (!token) {
        setVerificationStatus('error');
        setErrorMessage('Không tìm thấy mã xác thực trong URL.');
        return;
      }

      try {
        const response = await activeUser( token );
        
        if (response && response.success) {
          setVerificationStatus('success');
        } else {
          setVerificationStatus('error');
          setErrorMessage(response?.message || 'Xác thực tài khoản thất bại.');
        }
      } catch (error) {
        console.error('Lỗi khi xác thực email:', error);
        setVerificationStatus('error');
        setErrorMessage(error?.message || 'Đã xảy ra lỗi khi xác thực tài khoản.');
      }
    };

    // Start verification process
    verifyToken();
  }, [location]);

  // Render different UI based on verification status
  const renderContent = () => {
    switch (verificationStatus) {
      case 'loading':
        return (
          <div className="flex flex-col items-center justify-center py-10">
            <Spin
              indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />}
              className="mb-6"
            />
            <Title level={3} className="text-gray-700">Đang xác thực tài khoản...</Title>
            <Paragraph className="text-gray-500 text-center max-w-md">
              Vui lòng đợi trong khi chúng tôi xác thực tài khoản của bạn.
              Quá trình này sẽ diễn ra trong giây lát.
            </Paragraph>
          </div>
        );

      case 'success':
        return (
          <Result
            icon={<CheckCircleOutlined className="text-green-500" />}
            status="success"
            title="Xác thực tài khoản thành công!"
            subTitle="Tài khoản của bạn đã được kích hoạt và sẵn sàng sử dụng."
            extra={[
              <Button 
                type="primary" 
                size="large" 
                className="bg-blue-500 hover:bg-blue-600"
                onClick={() => navigate('/login')}
                key="login"
              >
                Đăng nhập ngay
              </Button>
            ]}
          />
        );

      case 'error':
        return (
          <Result
            icon={<CloseCircleOutlined className="text-red-500" />}
            status="error"
            title="Xác thực tài khoản thất bại"
            subTitle={errorMessage || "Đã xảy ra lỗi trong quá trình xác thực tài khoản."}
            extra={[
              <Button 
                type="primary" 
                size="large"
                className="bg-blue-500 hover:bg-blue-600"
                onClick={() => navigate('/login')} 
                key="login"
              >
                Về trang đăng nhập
              </Button>,
              
            ]}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card 
        className="w-full max-w-lg shadow-lg rounded-lg overflow-hidden"
      
      >
        <div className="p-4">
          {renderContent()}
          
          {verificationStatus === 'error' && (
            <Alert
              message="Thông tin bổ sung"
              description="Liên kết xác thực có thể đã hết hạn hoặc đã được sử dụng. Vui lòng kiểm tra email của bạn hoặc yêu cầu gửi lại liên kết xác thực mới."
              type="info"
              showIcon
              className="mt-6"
            />
          )}
        </div>
      </Card>
    </div>
  );
}

export default VerifyEmail;