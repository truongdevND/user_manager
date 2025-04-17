import React from 'react';
import { Form, Input, Button, Typography, Checkbox, Divider } from 'antd';
import { LockOutlined, UserOutlined  } from '@ant-design/icons';

function Login() {
  const onFinish = (values) => {
    console.log('Received values of form: ', values);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-50 to-indigo-100">
      <div className="bg-white rounded-xl shadow-lg p-8 w-[400px] border border-gray-100">
        <div className="text-center mb-6">
          <Typography.Title level={2} className="mb-2 text-gray-800">
            Đăng nhập
          </Typography.Title>
          <Typography.Text className="text-gray-500">
            Vui lòng nhập thông tin đăng nhập của bạn
          </Typography.Text>
        </div>
        
        <Form
          name="normal_login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
          >
            <Input
              prefix={<UserOutlined className="text-gray-400" />}
              placeholder="Tên đăng nhập"
              className="rounded-lg"
            />
          </Form.Item>
          
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="Mật khẩu"
              className="rounded-lg"
            />
          </Form.Item>
          
          <div className="flex justify-between items-center mb-4">
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Ghi nhớ đăng nhập</Checkbox>
            </Form.Item>
           
          </div>
          
          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              className="w-full h-10 rounded-lg bg-blue-500 hover:bg-blue-600 border-none"
            >
              Đăng nhập
            </Button>
          </Form.Item>
          
 
          <div className="text-center mt-6">
            <span className="text-gray-500">Chưa có tài khoản? </span>
            <a className="text-blue-500 hover:text-blue-600 font-medium" onClick={
                () => window.location.href = '/register'
            } >
        
              Đăng ký ngay
            </a>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default Login;