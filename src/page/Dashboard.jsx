import React, { useState, useEffect, useCallback } from 'react';
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
} from 'antd';
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
} from '@ant-design/icons';
import {
  getUserListPagination,
  getMyInfo,
  deleteUser,
  updateUser,
  getUserList,
} from '../services/userService';

const { Header, Content } = Layout;
const { Title } = Typography;

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
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

  // Fetch current user info
  const fetchUserInfo = useCallback(async () => {
    try {
      const resp = await getMyInfo();
      setUserInfo(resp.result || {});
    } catch (error) {
      console.error('Error fetching user info:', error);
      message.error('Không thể tải thông tin người dùng');
    }
  }, []);

  // Fetch user list with pagination
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.current,
        limit: pagination.pageSize,
      };

      const resp = await getUserListPagination(params);
      
      // Handle the updated response structure with content array
      const users = resp.result?.content || [];
      const totalUsers = resp.result?.totalElements || users.length;

      const formattedData = users.map((user) => ({
        key: user.userId,
        id: user.userId,
        name: user.fullName || 'Không có tên',
        email: user.email || '',
        role: user.roleNames || (user.roles && user.roles.length > 0 ? user.roles.join(', ') : 'User'),
        status: user.isDelete
          ? 'Đã khóa'
          : user.active === false
          ? 'Không hoạt động'
          : 'Hoạt động',
        lastLogin: user.lastLogin || 'Chưa đăng nhập',
        avatar:
          user.avatar ||
          `https://randomuser.me/api/portraits/${
            Math.random() > 0.5 ? 'men' : 'women'
          }/${Math.floor(Math.random() * 100)}.jpg`,
      }));

      setData(formattedData);
      setPagination((prev) => ({
        ...prev,
        total: totalUsers,
      }));
    } catch (error) {
      console.error('Error fetching users:', error);
      message.error('Không thể tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch all users for statistics
  const fetchAllUsers = useCallback(async () => {
    try {
      const resp = await getUserList();
      
      // Handle potentially different structure for this API call as well
      const allUsers = resp.result?.content || resp.result || [];

      const activeUsers = allUsers.filter(
        (user) => user.active && !user.isDelete
      ).length;
      const inactiveUsers = allUsers.filter(
        (user) => user.active === false && !user.isDelete
      ).length;
      const lockedUsers = allUsers.filter((user) => user.isDelete).length;

      const statsData = {
        total: allUsers.length,
        active: activeUsers,
        inactive: inactiveUsers,
        locked: lockedUsers,
      };

      setStats(statsData);
      return statsData;
    } catch (error) {
      console.error('Error fetching all users:', error);
      message.error('Không thể tải thống kê người dùng');
      return stats;
    }
  }, [stats]);

  // Handle user deletion
  const handleDeleteUser = useCallback(
    async (userId) => {
      try {
        await deleteUser(userId);
        message.success('Xóa người dùng thành công');
        fetchUsers();
        fetchAllUsers(); // Update stats after deletion
      } catch (error) {
        console.error('Error deleting user:', error);
        message.error('Không thể xóa người dùng');
      }
    },
    [fetchUsers, fetchAllUsers]
  );

  // Handle user lock/unlock
  const handleToggleUserStatus = useCallback(
    async (userId, currentStatus) => {
      try {
        const isActive = currentStatus !== 'Hoạt động';
        await updateUser(userId, { active: isActive });
        message.success(isActive ? 'Đã mở khóa người dùng' : 'Đã khóa người dùng');
        fetchUsers();
        fetchAllUsers(); // Update stats after status change
      } catch (error) {
        console.error('Error updating user status:', error);
        message.error('Không thể cập nhật trạng thái người dùng');
      }
    },
    [fetchUsers, fetchAllUsers]
  );

  // Load initial data
  useEffect(() => {
    fetchUserInfo();
    fetchAllUsers();
    fetchUsers();
  }, []);

  // Update user list when pagination changes
  useEffect(() => {
    fetchUsers();
  }, []);

  // Search and filter handlers
  const handleSearch = useCallback((selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  }, []);

  const handleReset = useCallback((clearFilters) => {
    clearFilters();
    setSearchText('');
  }, []);

  const handleTableChange = useCallback((newPagination, filters, sorter) => {
    setPagination(newPagination);
    setFilteredInfo(filters);
    setSortedInfo(sorter);
  }, []);

  const clearFilters = useCallback(() => {
    setFilteredInfo({});
  }, []);

  const clearAll = useCallback(() => {
    setFilteredInfo({});
    setSortedInfo({});
  }, []);

  // Search column props
  const getColumnSearchProps = useCallback(
    (dataIndex) => ({
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div className="p-2" style={{ minWidth: 200 }}>
          <Input
            placeholder={`Tìm kiếm ${dataIndex}`}
            value={selectedKeys[0]}
            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
            className="mb-2 block w-full"
          />
          <Space>
            <Button onClick={() => handleReset(clearFilters)} size="small">
              Đặt lại
            </Button>
            <Button
              type="primary"
              onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
              icon={<SearchOutlined />}
              size="small"
            >
              Tìm
            </Button>
          </Space>
        </div>
      ),
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
      ),
      onFilter: (value, record) =>
        record[dataIndex]
          ?.toString()
          .toLowerCase()
          .includes(value.toLowerCase()) || false,
    }),
    [handleSearch, handleReset]
  );

  // Table columns
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: 'Người dùng',
      dataIndex: 'name',
      key: 'name',
      ...getColumnSearchProps('name'),
      sorter: (a, b) => a.name.localeCompare(b.name),
      sortOrder: sortedInfo.columnKey === 'name' && sortedInfo.order,
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
      title: 'Vai trò',
      dataIndex: 'role',
      key: 'role',
      filters: [
        { text: 'Admin', value: 'Admin' },
        { text: 'User', value: 'User' },
        { text: 'Editor', value: 'Editor' },
      ],
      filteredValue: filteredInfo.role || null,
      onFilter: (value, record) => record.role.includes(value),
      render: (role) => {
        let color = 'blue';
        if (role.includes('Admin')) color = 'red';
        else if (role.includes('Editor')) color = 'green';
        return <Tag color={color}>{role.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: 'Hoạt động', value: 'Hoạt động' },
        { text: 'Không hoạt động', value: 'Không hoạt động' },
        { text: 'Đã khóa', value: 'Đã khóa' },
      ],
      filteredValue: filteredInfo.status || null,
      onFilter: (value, record) => record.status.includes(value),
      render: (status) => {
        let color = 'green';
        if (status === 'Không hoạt động') color = 'volcano';
        else if (status === 'Đã khóa') color = 'red';
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: 'Đăng nhập gần nhất',
      dataIndex: 'lastLogin',
      key: 'lastLogin',
      sorter: (a, b) =>
        new Date(a.lastLogin || 0).getTime() - new Date(b.lastLogin || 0).getTime(),
      sortOrder: sortedInfo.columnKey === 'lastLogin' && sortedInfo.order,
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Dropdown
          overlay={
            <Menu>
              <Menu.Item key="1" icon={<EditOutlined />}>
                Chỉnh sửa
              </Menu.Item>
              <Menu.Item
                key="2"
                icon={<DeleteOutlined />}
                onClick={() => handleDeleteUser(record.id)}
              >
                Xóa
              </Menu.Item>
              {record.status === 'Đã khóa' || record.status === 'Không hoạt động' ? (
                <Menu.Item
                  key="3"
                  icon={<UserOutlined />}
                  onClick={() => handleToggleUserStatus(record.id, record.status)}
                >
                  Mở khóa
                </Menu.Item>
              ) : (
                <Menu.Item
                  key="3"
                  icon={<UserDeleteOutlined />}
                  onClick={() => handleToggleUserStatus(record.id, record.status)}
                >
                  Khóa
                </Menu.Item>
              )}
            </Menu>
          }
        >
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ];

  // User menu
  const userMenu = (
    <Menu>
      <Menu.Item key="profile" icon={<UserOutlined />}>
        Hồ sơ
      </Menu.Item>
      <Menu.Item key="logout" icon={<LogoutOutlined />}>
        Đăng xuất
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout className="min-h-screen">
      <Header className="flex items-center justify-between bg-white px-6 shadow-sm">
        <div className="flex items-center">
          <div className="text-xl font-bold text-blue-600 mr-8">AdminDashboard</div>
        </div>
        <div className="flex items-center">
          <Dropdown overlay={userMenu} placement="bottomRight">
            <div className="flex items-center cursor-pointer">
              <Avatar
                src={userInfo.avatar}
                icon={<UserOutlined />}
                className="mr-2"
              />
              <span className="hidden md:inline">{userInfo.fullName || 'User'}</span>
            </div>
          </Dropdown>
        </div>
      </Header>

      <Content className="p-6 bg-gray-50">
        <Title level={3} className="mb-6">
          Quản lý người dùng
        </Title>

        {/* Dashboard stats */}
        <Row gutter={16} className="mb-6">
          <Col xs={24} sm={12} md={8} lg={6}>
            <Card>
              <Statistic
                title="Tổng số người dùng"
                value={stats.total}
                prefix={<TeamOutlined />}
                valueStyle={{ color: '#3f8600' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Card>
              <Statistic
                title="Đang hoạt động"
                value={stats.active}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Card>
              <Statistic
                title="Không hoạt động"
                value={stats.inactive}
                valueStyle={{ color: '#faad14' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Card>
              <Statistic
                title="Đã khóa"
                value={stats.locked}
                valueStyle={{ color: '#cf1322' }}
              />
            </Card>
          </Col>
        </Row>

        {/* User table */}
        <Card className="shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <div>
              <Button type="primary" icon={<UserAddOutlined />} className="mr-2">
                Thêm người dùng
              </Button>
              <Button icon={<ReloadOutlined />} onClick={fetchUsers}>
                Làm mới
              </Button>
            </div>
            <div>
              <Button icon={<FilterOutlined />} onClick={clearFilters} className="mr-2">
                Xóa bộ lọc
              </Button>
              <Button onClick={clearAll}>Xóa bộ lọc và sắp xếp</Button>
            </div>
          </div>

          <Table
            columns={columns}
            dataSource={data}
            loading={loading}
            onChange={handleTableChange}
            pagination={{
              ...pagination,
              position: ['bottomRight'],
              showSizeChanger: true,
              showTotal: (total) => `Tổng ${total} người dùng`,
              pageSizeOptions: ['5', '10', '20', '50'],
            }}
            scroll={{ x: 1000 }}
            rowClassName="hover:bg-gray-50"
          />
        </Card>
      </Content>
    </Layout>
  );
};

export default Dashboard;