import React, { useState } from 'react';
import { Form, Input, Button, Typography, Checkbox, Divider, Row, Col, message } from 'antd';
import { 
  LockOutlined, 
  UserOutlined, 
 
  MailOutlined,
  IdcardOutlined,
  SafetyOutlined
} from '@ant-design/icons';

function Register() {
  const [form] = Form.useForm();
  const [verificationSent, setVerificationSent] = useState(false);
  const [verificationLoading, setVerificationLoading] = useState(false);
  
  const sendVerificationCode = () => {
    const email = form.getFieldValue('email');
    
    if (!email) {
      message.error('Vui lòng nhập email trước khi yêu cầu mã xác thực!');
      return;
    }
    
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      message.error('Email không hợp lệ!');
      return;
    }
    
    setVerificationLoading(true);
    
    setTimeout(() => {
      setVerificationSent(true);
      setVerificationLoading(false);
      message.success(`Mã xác thực đã được gửi đến ${email}`);
    }, 1500);
  };

  const onFinish = (values) => {
    console.log('Received values of form: ', values);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-50 to-indigo-100 py-8">
      <div className="bg-white rounded-xl shadow-lg p-8 w-[400px] border border-gray-100">
        <div className="text-center mb-6">
          <Typography.Title level={2} className="mb-2 text-gray-800">
            Đăng ký
          </Typography.Title>
          <Typography.Text className="text-gray-500">
            Tạo tài khoản mới để bắt đầu
          </Typography.Text>
        </div>
        
        <Form
          form={form}
          name="register_form"
          onFinish={onFinish}
          layout="vertical"
          scrollToFirstError
          size="large"
        >
          <Form.Item
            name="fullName"
            rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
          >
            <Input
              prefix={<IdcardOutlined className="text-gray-400" />}
              placeholder="Họ và tên"
              className="rounded-lg"
            />
          </Form.Item>
          <div className='w-full flex gap-3'>
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Vui lòng nhập email!' },
              { type: 'email', message: 'Email không hợp lệ!' }
            ]}
          >
            <Input
              prefix={<MailOutlined className="text-gray-400" />}
              placeholder="Email"
              className="rounded-lg"
            />
          </Form.Item>
          
          <Form.Item>
            <Row gutter={8}>
              <Col span={24}>
                <Button 
                  onClick={sendVerificationCode} 
                  loading={verificationLoading}
                  className="w-full rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300"
                >
                  {verificationSent ? 'Gửi lại' : 'Gửi '}
                </Button>
              </Col>
            </Row>
          </Form.Item>
          </div>
        
          
          <Form.Item
            name="verificationCode"
            rules={[
              { required: true, message: 'Vui lòng nhập mã xác thực!' },
              { len: 6, message: 'Mã xác thực phải có 6 ký tự!' }
            ]}
          >
            <Input
              prefix={<SafetyOutlined className="text-gray-400" />}
              placeholder="Mã xác thực (6 ký tự)"
              className="rounded-lg"
              maxLength={6}
            />
          </Form.Item>
          
          <Form.Item
            name="username"
            rules={[
              { required: true, message: 'Vui lòng nhập tên đăng nhập!' },
              { min: 6, message: 'Tên đăng nhập phải có ít nhất 6 ký tự!' }
            ]}
          >
            <Input
              prefix={<UserOutlined className="text-gray-400" />}
              placeholder="Tên đăng nhập"
              className="rounded-lg"
            />
          </Form.Item>
          
          <Form.Item
            name="password"
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu!' },
              { min: 8, message: 'Mật khẩu phải có ít nhất 8 ký tự!' }
            ]}
            hasFeedback
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="Mật khẩu"
              className="rounded-lg"
            />
          </Form.Item>
          
          <Form.Item
            name="confirm"
            dependencies={['password']}
            hasFeedback
            rules={[
              { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="Xác nhận mật khẩu"
              className="rounded-lg"
            />
          </Form.Item>
          
       
          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              className="w-full h-10 rounded-lg bg-blue-500 hover:bg-blue-600 border-none"
            >
              Đăng ký
            </Button>
          </Form.Item>
      
          
          <div className="text-center mt-6">
            <span className="text-gray-500">Đã có tài khoản? </span>
            <a className="text-blue-500 hover:text-blue-600 font-medium" onClick={() => window.location.href = '/login'}>
              Đăng nhập
            </a>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default Register;