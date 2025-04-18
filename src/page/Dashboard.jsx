import React, { useState, useEffect, useMemo } from "react";
import {
  Layout,
  Table,
  Input,
  Button,
  Space,
  Tag,
  Typography,
  Avatar,
  Dropdown,
  Menu,
  Card,
  Statistic,
  Row,
  Col,
  message,
  Modal,
} from "antd";
import {
  SearchOutlined,
  UserOutlined,
  LogoutOutlined,
  EditOutlined,
  DeleteOutlined,
  MoreOutlined,
  TeamOutlined,
  UserAddOutlined,
  UserDeleteOutlined,
  FilterOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import {
  getUserListPagination,
  getMyInfo,
  deleteUser,
  updateUser,
} from "../services/userService";
import UserForm from "../components/UserForm";
import debounce from "lodash/debounce";
import { logoutUser } from "../services/authService";
// Import history for navigation if using react-router
// import { useHistory } from "react-router-dom";

const { Header, Content } = Layout;
const { Title } = Typography;
const { confirm } = Modal;

const Dashboard = () => {
  // const history = useHistory(); // Uncomment if using react-router

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [filteredInfo, setFilteredInfo] = useState({});
  const [sortedInfo, setSortedInfo] = useState({});
  const [userInfo, setUserInfo] = useState({});
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    locked: 0,
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    total: 0,
  });
  const [userFormVisible, setUserFormVisible] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  // Add flag to prevent multiple redirects if auth fails
  const [isAuthError, setIsAuthError] = useState(false);

  // Handle authentication errors
  const handleAuthError = (error) => {
    // Only handle auth errors once to prevent loops
    if (isAuthError) return;

    if (error.response?.status === 403 || error.response?.status === 401) {
      setIsAuthError(true);
      message.error("Phiên đăng nhập hết hạn hoặc không có quyền truy cập");

      // Store current location to redirect back after login
      localStorage.setItem("redirectUrl", window.location.pathname);

      // Instead of refreshing the page, redirect to login
      // history.push("/login"); // Use this if using react-router

      // If not using react-router, redirect after a short delay
      // This prevents continuous refreshes
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    }
  };

  // Show form for adding a new user
  const showAddUserForm = () => {
    setSelectedUserId(null);
    setUserFormVisible(true);
  };

  // Show form for editing an existing user
  const showEditUserForm = (userId) => {
    setSelectedUserId(userId);
    setUserFormVisible(true);
  };

  // Close the user form
  const handleFormClose = () => {
    setUserFormVisible(false);
    setSelectedUserId(null);
  };

  // Handle form submission success
  const handleFormSuccess = () => {
    fetchUsers();
  };

  // Fetch current user info
  const fetchUserInfo = async () => {
    try {
      const resp = await getMyInfo();
      if (resp && resp.result) {
        setUserInfo(resp.result || {});
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
      console.error("Status:", error.response?.status);
      console.error("Response data:", error.response?.data);

      if (error.response?.status === 403 || error.response?.status === 401) {
        handleAuthError(error);
      } else {
        message.error("Không thể tải thông tin người dùng");
      }
    }
  };

  // Fetch paginated users and update stats with better error handling
  const fetchUsers = async () => {
    if (isAuthError) return; // Prevent API calls if auth has failed

    setLoading(true);
    try {
      const params = {
        page: pagination.current,
        limit: pagination.pageSize,
        search: searchText || undefined,
        searchBy: searchedColumn || undefined,
      };

      const resp = await getUserListPagination(params);

      if (!resp || !resp.result) {
        throw new Error("Invalid response format");
      }

      const users = resp.result?.content || [];
      const totalUsers = resp.result?.totalElements || 0;

      // Calculate stats based on fetched users
      const activeUsers = users.filter(
        (user) => !user.isDelete && user.active
      ).length;
      const inactiveUsers = users.filter(
        (user) => !user.isDelete && !user.active
      ).length;
      const lockedUsers = users.filter((user) => user.isDelete).length;

      // Update stats
      setStats({
        total: totalUsers,
        active: activeUsers,
        inactive: inactiveUsers,
        locked: lockedUsers,
      });

      const formattedData = users.map((user) => ({
        key: user.userId,
        id: user.userId,
        name: user.fullName || "Không có tên",
        email: user.email || "",
        role:
          user.roleNames ||
          (user.roles && user.roles.length > 0
            ? user.roles.join(", ")
            : "User"),
        status: user.isDelete
          ? "Đã khóa"
          : user.active === false
          ? "Không hoạt động"
          : "Hoạt động",
        lastLogin: user.lastLogin || "Chưa đăng nhập",
        avatar:
          user.avatar ||
          `https://randomuser.me/api/portraits/${
            Math.random() > 0.5 ? "men" : "women"
          }/${Math.floor(Math.random() * 100)}.jpg`,
      }));

      setData(formattedData);
      setPagination((prev) => ({
        ...prev,
        total: totalUsers,
      }));
    } catch (error) {
      console.error("Error fetching users:", error);
      console.error("Status:", error.response?.status);
      console.error("Response data:", error.response?.data);

      if (error.response?.status === 403 || error.response?.status === 401) {
        handleAuthError(error);
      } else {
        message.error("Không thể tải danh sách người dùng");
      }
    } finally {
      setLoading(false);
    }
  };
  const logout = async () => {
    try {
      const token = localStorage.getItem("token");
  
      const response = await logoutUser(token);
  
      if (response) {
        // Xóa dữ liệu local
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        
        // Chuyển hướng về trang login
        window.location.href = "/login";
      }
    } catch (error) {
      console.error("Error logging out:", error);
      console.error("Status:", error?.response?.status);
      console.error("Response data:", error?.response?.data);
    }
  };
  

  const handleDeleteUser = async (userId) => {
    if (isAuthError) return; // Prevent operations if auth has failed

    confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc chắn muốn xóa người dùng này?",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: async () => {
        setActionLoading(true);
        try {
          await deleteUser(userId);
          message.success("Xóa người dùng thành công");
          fetchUsers();
        } catch (error) {
          console.error("Error deleting user:", error);
          console.error("Status:", error.response?.status);

          if (
            error.response?.status === 403 ||
            error.response?.status === 401
          ) {
            handleAuthError(error);
          } else {
            message.error(
              error.response?.data?.message || "Không thể xóa người dùng"
            );
          }
        } finally {
          setActionLoading(false);
        }
      },
    });
  };

  const handleToggleUserStatus = async (userId, currentStatus) => {
    if (isAuthError) return;

    const isActive = currentStatus !== "Hoạt động";
    confirm({
      title: `Xác nhận ${isActive ? "mở khóa" : "khóa"}`,
      content: `Bạn có chắc chắn muốn ${
        isActive ? "mở khóa" : "khóa"
      } người dùng này?`,
      okText: isActive ? "Mở khóa" : "Khóa",
      okType: isActive ? "primary" : "danger",
      cancelText: "Hủy",
      onOk: async () => {
        setActionLoading(true);
        try {
          await updateUser(userId, { active: isActive });
          message.success(
            isActive ? "Đã mở khóa người dùng" : "Đã khóa người dùng"
          );
          fetchUsers();
        } catch (error) {
          console.error("Error updating user status:", error);
          console.error("Status:", error.response?.status);

          if (
            error.response?.status === 403 ||
            error.response?.status === 401
          ) {
            handleAuthError(error);
          } else {
            message.error(
              error.response?.data?.message ||
                "Không thể cập nhật trạng thái người dùng"
            );
          }
        } finally {
          setActionLoading(false);
        }
      },
    });
  };

  useEffect(() => {
    fetchUserInfo();
    setIsAuthError(false);
  }, []);
  useEffect(() => {
    if (!isAuthError) {
      // Only fetch if no auth errors
      fetchUsers();
    }
  }, [pagination.current, pagination.pageSize, searchText, searchedColumn]);

  const debouncedSearch = debounce((selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  }, 500);

  // Reset search
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
    setSearchedColumn("");
  };

  // Handle table changes (pagination, filters, sorting)
  const handleTableChange = (newPagination, filters, sorter) => {
    setPagination(newPagination);
    setFilteredInfo(filters);
    setSortedInfo(sorter);
  };

  // Clear filters
  const clearFilters = () => {
    setFilteredInfo({});
    setSearchText("");
    setSearchedColumn("");
  };

  // Clear all filters and sorting
  const clearAll = () => {
    setFilteredInfo({});
    setSortedInfo({});
    setSearchText("");
    setSearchedColumn("");
  };

  // Handle logout
  const handleLogout = () => {
    // Implement your logout logic here
    // For example:
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  // Search column props
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div className="p-2" style={{ minWidth: 200 }}>
        <Input
          placeholder={`Tìm kiếm ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => debouncedSearch(selectedKeys, confirm, dataIndex)}
          className="mb-2 block w-full"
        />
        <Space>
          <Button
            onClick={() => handleReset(clearFilters)}
            size="small"
            aria-label="Đặt lại bộ lọc"
          >
            Đặt lại
          </Button>
          <Button
            type="primary"
            onClick={() => debouncedSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            aria-label="Tìm kiếm"
          >
            Tìm
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        ?.toString()
        .toLowerCase()
        .includes(value.toLowerCase()) || false,
  });

  // Table columns
  const columns = useMemo(
    () => [
      {
        title: "Người dùng",
        dataIndex: "name",
        key: "name",
        ...getColumnSearchProps("name"),
        sorter: (a, b) => a.name.localeCompare(b.name),
        sortOrder: sortedInfo.columnKey === "name" && sortedInfo.order,
        render: (_, record) => (
          <div className="flex items-center">
            <Avatar src={record.avatar} className="mr-2" size="large" />
            <div>
              <div className="font-medium">{record.name}</div>
              <div className="text-gray-500 text-xs">{record.email}</div>
            </div>
          </div>
        ),
      },
      {
        title: "Vai trò",
        dataIndex: "role",
        key: "role",
        filters: [
          { text: "Admin", value: "Admin" },
          { text: "User", value: "User" },
          { text: "Editor", value: "Editor" },
        ],
        filteredValue: filteredInfo.role || null,
        onFilter: (value, record) => record.role.includes(value),
        render: (role) => {
          let color = "blue";
          if (role.includes("Admin")) color = "red";
          else if (role.includes("Editor")) color = "green";
          return <Tag color={color}>{role.toUpperCase()}</Tag>;
        },
      },
      {
        title: "Trạng thái",
        dataIndex: "status",
        key: "status",
        filters: [
          { text: "Hoạt động", value: "Hoạt động" },
          { text: "Không hoạt động", value: "Không hoạt động" },
          { text: "Đã khóa", value: "Đã khóa" },
        ],
        filteredValue: filteredInfo.status || null,
        onFilter: (value, record) => record.status.includes(value),
        render: (status) => {
          let color = "green";
          if (status === "Không hoạt động") color = "volcano";
          else if (status === "Đã khóa") color = "red";
          return <Tag color={color}>{status}</Tag>;
        },
      },
      {
        title: "Đăng nhập gần nhất",
        dataIndex: "lastLogin",
        key: "lastLogin",
        sorter: (a, b) =>
          new Date(a.lastLogin || 0).getTime() -
          new Date(b.lastLogin || 0).getTime(),
        sortOrder: sortedInfo.columnKey === "lastLogin" && sortedInfo.order,
      },
      {
        title: "Hành động",
        key: "action",
        render: (_, record) => (
          <Dropdown
            overlay={
              <Menu>
                <Menu.Item
                  key="edit"
                  icon={<EditOutlined />}
                  onClick={() => showEditUserForm(record.id)}
                >
                  Chỉnh sửa
                </Menu.Item>
                <Menu.Item
                  key="delete"
                  icon={<DeleteOutlined />}
                  onClick={() => handleDeleteUser(record.id)}
                >
                  Xóa
                </Menu.Item>
                <Menu.Item
                  key="toggleStatus"
                  icon={
                    record.status === "Đã khóa" ||
                    record.status === "Không hoạt động" ? (
                      <UserOutlined />
                    ) : (
                      <UserDeleteOutlined />
                    )
                  }
                  onClick={() =>
                    handleToggleUserStatus(record.id, record.status)
                  }
                >
                  {record.status === "Đã khóa" ||
                  record.status === "Không hoạt động"
                    ? "Mở khóa"
                    : "Khóa"}
                </Menu.Item>
              </Menu>
            }
            trigger={["click"]}
            disabled={actionLoading}
          >
            <Button
              type="text"
              icon={<MoreOutlined />}
              aria-label="Thêm hành động"
              disabled={actionLoading}
            />
          </Dropdown>
        ),
      },
    ],
    [sortedInfo, filteredInfo, actionLoading]
  );

  // User menu
  const userMenu = (
    <Menu>
      <Menu.Item key="profile" icon={<UserOutlined />}>
        Hồ sơ
      </Menu.Item>
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={logout}>
        Đăng xuất
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout className="min-h-screen">
      <Header className="flex items-center justify-between bg-white px-6 shadow-sm">
        <div className="flex items-center">
          <div className="text-xl font-bold text-blue-600 mr-8">
            AdminDashboard
          </div>
        </div>
        <div className="flex items-center">
          <Dropdown
            overlay={userMenu}
            placement="bottomRight"
            trigger={["click"]}
          >
            <div className="flex items-center cursor-pointer">
              <Avatar
                src={userInfo.avatar}
                icon={<UserOutlined />}
                className="mr-2"
                aria-label="Ảnh đại diện người dùng"
              />
              <span className="hidden md:inline">
                {userInfo.fullName || "User"}
              </span>
            </div>
          </Dropdown>
        </div>
      </Header>

      <Content className="p-6 bg-gray-50">
        <Title level={3} className="mb-6">
          Quản lý người dùng
        </Title>

        {/* Dashboard stats */}
        <Row gutter={[16, 16]} className="mb-6">
          <Col xs={24} sm={12} md={8} lg={6}>
            <Card>
              <Statistic
                title="Tổng số người dùng"
                value={stats.total}
                prefix={<TeamOutlined />}
                valueStyle={{ color: "#3f8600" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Card>
              <Statistic
                title="Đang hoạt động"
                value={stats.active}
                valueStyle={{ color: "#52c41a" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Card>
              <Statistic
                title="Không hoạt động"
                value={stats.inactive}
                valueStyle={{ color: "#faad14" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Card>
              <Statistic
                title="Đã khóa"
                value={stats.locked}
                valueStyle={{ color: "#cf1322" }}
              />
            </Card>
          </Col>
        </Row>

        {/* User table */}
        <Card className="shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
            <div>
              <Button
                type="primary"
                icon={<UserAddOutlined />}
                className="mr-2"
                onClick={showAddUserForm}
                aria-label="Thêm người dùng mới"
                disabled={isAuthError}
              >
                Thêm người dùng
              </Button>
              <Button
                icon={<ReloadOutlined />}
                onClick={() => {
                  if (!isAuthError) {
                    fetchUsers();
                  }
                }}
                aria-label="Làm mới danh sách"
                disabled={isAuthError}
              >
                Làm mới
              </Button>
            </div>
            <div>
              <Button
                icon={<FilterOutlined />}
                onClick={clearFilters}
                className="mr-2"
                aria-label="Xóa bộ lọc"
                disabled={isAuthError}
              >
                Xóa bộ lọc
              </Button>
              <Button
                onClick={clearAll}
                aria-label="Xóa bộ lọc và sắp xếp"
                disabled={isAuthError}
              >
                Xóa bộ lọc và sắp xếp
              </Button>
            </div>
          </div>

          <Table
            columns={columns}
            dataSource={data}
            loading={loading}
            onChange={handleTableChange}
            pagination={{
              ...pagination,
              position: ["bottomRight"],
              showSizeChanger: true,
              showTotal: (total) => `Tổng ${total} người dùng`,
              pageSizeOptions: ["5", "10", "20", "50"],
            }}
            scroll={{ x: 1000 }}
            rowClassName="hover:bg-gray-50"
            aria-label="Bảng danh sách người dùng"
          />
        </Card>
      </Content>

      {/* User Form Modal */}
      <UserForm
        visible={userFormVisible}
        userId={selectedUserId}
        onClose={handleFormClose}
        onSuccess={handleFormSuccess}
      />
    </Layout>
  );
};

export default Dashboard;
