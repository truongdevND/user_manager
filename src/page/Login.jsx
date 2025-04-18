import React, { useEffect } from "react";
import { Form, Input, Button, Typography, Checkbox } from "antd";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { login } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { useMessage } from "../MessageContext.jsx";

function Login() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { showMessage } = useMessage();

  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      form.setFieldsValue({ email: savedEmail, remember: true });
    }
  }, [form]);

  const onFinish = async (values) => {
    try {
      const response = await login(values);

      if (response.result) {
        const userData = {
          userId: response.result.userId,
          email: response.result.email,
        };

        localStorage.setItem("userData", JSON.stringify(userData));
        localStorage.setItem("token", response.result.token);

        if (values.remember) {
          localStorage.setItem("rememberedEmail", values.email);
        } else {
          localStorage.removeItem("rememberedEmail");
        }

        showMessage("success", "Đăng nhập thành công!", 2);
      
          navigate("/");
     
      } else {
        showMessage("error", "Cấu trúc phản hồi không hợp lệ!", 3);
        console.error("Invalid response structure:", response);
      }
    } catch (error) {
      showMessage("error", "Đăng nhập thất bại!", 3);
      console.error("Login error:", error);
    }
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
          form={form}
          name="normal_login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="email"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập email!",
                type: "email",
              },
            ]}
          >
            <Input
              prefix={<MailOutlined className="text-gray-400" />}
              placeholder="Email"
              className="rounded-lg"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
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
            <a
              className="text-blue-500 hover:text-blue-600 font-medium"
              onClick={() => (window.location.href = "/register")}
            >
              Đăng ký ngay
            </a>
          </div>
        </Form>

      </div>
    </div>
  );
}

export default Login;