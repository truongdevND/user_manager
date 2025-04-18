import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  Typography,
  DatePicker,
  message,
} from "antd";
import {
  LockOutlined,
  UserOutlined,
  MailOutlined,
  IdcardOutlined,
  PhoneOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useMessage } from "../MessageContext.jsx";
import { register, sendEmail } from "../services/authService";

function Register() {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { showMessage } = useMessage();

  const onFinish = async (values) => {
    setSubmitting(true);

    try {
      const payload = {
        email: values.email,
        password: values.password,
        fullName: values.fullName,
        dob: values.dob ? values.dob.format("YYYY-MM-DD") : null,
        phone: values.phone,
        roleNames: ["admin"],
      };
      
      await register(payload);
      
     await sendEmail(values.email);
      
      showMessage(
        "success", 
        "Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản."
      );
      
      navigate("/login");
    
    } catch (error) {
      if (error.message === "Email was register") {
        showMessage("error", "Email đã tồn tại. Vui lòng thử lại sau.");
      } else {
        showMessage("error", "Đã xảy ra lỗi. Vui lòng thử lại sau.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-50 to-indigo-100 py-8">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md border border-gray-100">
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
            rules={[{ required: true, message: "Vui lòng nhập họ và tên!" }]}
          >
            <Input
              prefix={<IdcardOutlined className="text-gray-400" />}
              placeholder="Họ và tên"
              className="rounded-lg"
            />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email!" },
              { type: "email", message: "Email không hợp lệ!" },
            ]}
          >
            <Input
              prefix={<MailOutlined className="text-gray-400" />}
              placeholder="Email"
              className="rounded-lg"
            />
          </Form.Item>

          <Form.Item
            name="phone"
            rules={[
              { required: true, message: "Vui lòng nhập số điện thoại!" },
              {
                pattern: /^[0-9]{10}$/,
                message: "Số điện thoại không hợp lệ!",
              },
            ]}
          >
            <Input
              prefix={<PhoneOutlined className="text-gray-400" />}
              placeholder="Số điện thoại"
              className="rounded-lg"
            />
          </Form.Item>

          <Form.Item
            name="dob"
            rules={[{ required: true, message: "Vui lòng chọn ngày sinh!" }]}
          >
            <DatePicker
              className="w-full rounded-lg"
              placeholder="Ngày sinh"
              format="DD/MM/YYYY"
              suffixIcon={<CalendarOutlined className="text-gray-400" />}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu!" },
              { min: 8, message: "Mật khẩu phải có ít nhất 8 ký tự!" },
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
            dependencies={["password"]}
            hasFeedback
            rules={[
              { required: true, message: "Vui lòng xác nhận mật khẩu!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("Mật khẩu xác nhận không khớp!")
                  );
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
              loading={submitting}
              className="w-full h-10 rounded-lg bg-blue-500 hover:bg-blue-600 border-none"
            >
              Đăng ký
            </Button>
          </Form.Item>

          <div className="text-center mt-6">
            <span className="text-gray-500">Đã có tài khoản? </span>
            <a
              className="text-blue-500 hover:text-blue-600 font-medium"
              onClick={() => navigate("/login")}
            >
              Đăng nhập
            </a>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default Register;