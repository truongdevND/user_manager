import React, { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  Switch,
  Upload,
  Button,
  message,
  Spin,
  Divider,
  Space,
  Avatar,
  DatePicker
} from "antd";
import { PlusOutlined, UploadOutlined, UserOutlined } from "@ant-design/icons";
import { createUser, updateUser, getUserById } from "../services/userService";
import moment from "moment";

const { Option } = Select;

const UserForm = ({ visible, userId, onClose, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [isUpdateMode, setIsUpdateMode] = useState(false);

  // Load user data when editing
  useEffect(() => {
    if (visible && userId) {
      setIsUpdateMode(true);
      fetchUserData(userId);
    } else {
      setIsUpdateMode(false);
      form.resetFields();
      setImageUrl("");
    }
  }, [visible, userId, form]);

  const fetchUserData = async (id) => {
    setLoading(true);
    try {
      const response = await getUserById(id);
      const userData = response.result || {};
      
      form.setFieldsValue({
        fullName: userData.fullName || "",
        email: userData.email || "",
        password: "", // Don't populate password for security
        dob: userData.dob ? moment(userData.dob) : null,
        phone: userData.phone || "",
        roleNames: userData.roleNames || [],
        active: userData.active !== false, // Default to true if not specified
      });
      
      setImageUrl(userData.avatar || "");
    } catch (error) {
      console.error("Error fetching user data:", error);
      message.error("Không thể tải thông tin người dùng");
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      
      // Prepare data for API
      const userData = {
        ...values,
        avatar: imageUrl || undefined,
        dob: values.dob ? values.dob.format('YYYY-MM-DD') : null,
        roleNames: Array.isArray(values.roleNames) ? values.roleNames : [values.roleNames]
      };
      
      if (isUpdateMode) {
        // If updating, don't send password if it's empty
        if (!userData.password) {
          delete userData.password;
        }
        
        await updateUser(userId, userData);
        message.success("Cập nhật người dùng thành công");
      } else {
        await createUser(userData);
        message.success("Thêm người dùng thành công");
      }
      
      // Close modal and refresh list
      onSuccess?.();
      onClose?.();
    } catch (error) {
      if (error.errorFields) {
        return; // Form validation error, handled by antd
      }
      console.error("Error saving user:", error);
      message.error(error.response?.data?.message || "Không thể lưu thông tin người dùng");
    } finally {
      setLoading(false);
    }
  };

  // Handle image upload
  const handleImageChange = (info) => {
    if (info.file.status === 'uploading') {
      return;
    }
    
    if (info.file.status === 'done') {
      // Note: In a real application, you would get the URL from your server's response
      // For this example, we're simulating a successful upload
      const url = info.file.response?.url || `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? "men" : "women"}/${Math.floor(Math.random() * 100)}.jpg`;
      setImageUrl(url);
      message.success("Tải ảnh lên thành công");
    } else if (info.file.status === 'error') {
      message.error("Tải ảnh lên thất bại");
    }
  };

  // Upload button
  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Tải lên</div>
    </div>
  );

  // Custom validation rules
  const validatePassword = (_, value) => {
    if (isUpdateMode && !value) {
      return Promise.resolve(); // Password is optional when updating
    }
    
    if (value && value.length < 6) {
      return Promise.reject(new Error("Mật khẩu phải có ít nhất 6 ký tự"));
    }
    
    return Promise.resolve();
  };

  // Phone number validation
  const validatePhone = (_, value) => {
    if (!value) {
      return Promise.resolve();
    }
    
    const phoneRegex = /^[0-9+\-\s()]{8,15}$/;
    if (!phoneRegex.test(value)) {
      return Promise.reject(new Error("Số điện thoại không hợp lệ"));
    }
    
    return Promise.resolve();
  };

  // Modal title
  const modalTitle = isUpdateMode ? "Cập nhật người dùng" : "Thêm người dùng mới";

  return (
    <Modal
      title={modalTitle}
      open={visible}
      onCancel={onClose}
      width={600}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Hủy
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={handleSubmit}
        >
          {isUpdateMode ? "Cập nhật" : "Thêm"}
        </Button>,
      ]}
    >
      <Spin spinning={loading}>
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            active: true,
            roleNames: ["User"],
          }}
        >
          {/* Avatar upload */}
          <div className="flex justify-center mb-6">
            <Upload
              name="avatar"
              listType="picture-card"
              showUploadList={false}
              action="/api/upload" // Replace with your upload endpoint
              onChange={handleImageChange}
              className="avatar-uploader"
            >
              {imageUrl ? (
                <Avatar
                  src={imageUrl}
                  alt="avatar"
                  size={100}
                  className="rounded-full"
                />
              ) : (
                <div>
                  <Avatar size={100} icon={<UserOutlined />} />
                  <div className="mt-2 text-xs text-center">Tải ảnh lên</div>
                </div>
              )}
            </Upload>
          </div>

          <Divider />

          {/* User information */}
          <Form.Item
            name="fullName"
            label="Họ và tên"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập họ và tên",
              },
            ]}
          >
            <Input placeholder="Nhập họ và tên người dùng" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập email",
              },
              {
                type: "email",
                message: "Email không hợp lệ",
              },
            ]}
          >
            <Input placeholder="Nhập địa chỉ email" />
          </Form.Item>

          <Form.Item
            name="password"
            label={isUpdateMode ? "Mật khẩu (bỏ trống nếu không thay đổi)" : "Mật khẩu"}
            rules={[
              {
                required: !isUpdateMode,
                message: "Vui lòng nhập mật khẩu",
              },
              {
                validator: validatePassword,
              },
            ]}
          >
            <Input.Password placeholder="Nhập mật khẩu" />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Số điện thoại"
            rules={[
              {
                validator: validatePhone,
              },
            ]}
          >
            <Input placeholder="Nhập số điện thoại" />
          </Form.Item>

          <Form.Item
            name="dob"
            label="Ngày sinh"
          >
            <DatePicker
              placeholder="Chọn ngày sinh"
              format="DD/MM/YYYY"
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item
            name="roleNames"
            label="Vai trò"
            rules={[
              {
                required: true,
                message: "Vui lòng chọn vai trò",
              },
            ]}
          >
            <Select 
              placeholder="Chọn vai trò"
              mode="multiple"
            >
              <Option value="Admin">Admin</Option>
              <Option value="User">User</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="active"
            label="Trạng thái"
            valuePropName="checked"
          >
            <Switch
              checkedChildren="Hoạt động"
              unCheckedChildren="Không hoạt động"
            />
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
};

export default UserForm;