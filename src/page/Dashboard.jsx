import React, { useState } from 'react';
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
  Breadcrumb, 
  Card, 
  Statistic,
  Row,
  Col
} from 'antd';
import { 
  SearchOutlined, 
  UserOutlined, 
  SettingOutlined, 
  BellOutlined, 
  LogoutOutlined,
  EditOutlined,
  DeleteOutlined,
  MoreOutlined,
  TeamOutlined,
  UserAddOutlined,
  UserDeleteOutlined,
  FilterOutlined,
  ReloadOutlined
} from '@ant-design/icons';

const { Header, Content, Sider } = Layout;
const { Title } = Typography;

function Dashboard() {
  // Mock data
  const [data, setData] = useState([
    {
      key: '1',
      id: '001',
      name: 'Nguyễn Văn A',
      email: 'nguyenvana@example.com',
      role: 'Admin',
      status: 'Hoạt động',
      lastLogin: '2025-04-16 08:30',
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
    },
    {
      key: '2',
      id: '002',
      name: 'Trần Thị B',
      email: 'tranthib@example.com',
      role: 'User',
      status: 'Hoạt động',
      lastLogin: '2025-04-15 14:20',
      avatar: 'https://randomuser.me/api/portraits/women/2.jpg'
    },
    {
      key: '3',
      id: '003',
      name: 'Lê Văn C',
      email: 'levanc@example.com',
      role: 'Editor',
      status: 'Không hoạt động',
      lastLogin: '2025-04-10 09:15',
      avatar: 'https://randomuser.me/api/portraits/men/3.jpg'
    },
    {
      key: '4',
      id: '004',
      name: 'Phạm Thị D',
      email: 'phamthid@example.com',
      role: 'User',
      status: 'Đã khóa',
      lastLogin: '2025-04-05 16:45',
      avatar: 'https://randomuser.me/api/portraits/women/4.jpg'
    },
    {
      key: '5',
      id: '005',
      name: 'Hoàng Văn E',
      email: 'hoangvane@example.com',
      role: 'User',
      status: 'Hoạt động',
      lastLogin: '2025-04-16 10:30',
      avatar: 'https://randomuser.me/api/portraits/men/5.jpg'
    },
  ]);

  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const [filteredInfo, setFilteredInfo] = useState({});
  const [sortedInfo, setSortedInfo] = useState({});

  // Xử lý tìm kiếm
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };

  // Xử lý lọc và sắp xếp
  const handleTableChange = (pagination, filters, sorter) => {
    setFilteredInfo(filters);
    setSortedInfo(sorter);
  };

  const clearFilters = () => {
    setFilteredInfo({});
  };

  const clearAll = () => {
    setFilteredInfo({});
    setSortedInfo({});
  };

  // Tạo bộ lọc tìm kiếm
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div className="p-2" style={{ minWidth: 200 }}>
        <Input
          placeholder={`Tìm kiếm ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          className="mb-2 block w-full"
        />
        <Space className="flex justify-end">
          <Button
            onClick={() => handleReset(clearFilters)}
            size="small"
            className="text-gray-500"
          >
            Đặt lại
          </Button>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            className="bg-blue-500"
          >
            Tìm
          </Button>
        </Space>
      </div>
    ),
    filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
        : '',
  });

  // Định nghĩa các cột
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
      render: (text, record) => (
        <div className="flex items-center">
          <Avatar src={record.avatar} className="mr-2" size="large" />
          <div>
            <div className="font-medium">{text}</div>
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
        if (role === 'Admin') {
          color = 'red';
        } else if (role === 'Editor') {
          color = 'green';
        }
        return (
          <Tag color={color}>{role.toUpperCase()}</Tag>
        );
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
        if (status === 'Không hoạt động') {
          color = 'volcano';
        } else if (status === 'Đã khóa') {
          color = 'red';
        }
        return (
          <Tag color={color}>{status}</Tag>
        );
      },
    },
    {
      title: 'Đăng nhập gần nhất',
      dataIndex: 'lastLogin',
      key: 'lastLogin',
      sorter: (a, b) => new Date(a.lastLogin) - new Date(b.lastLogin),
      sortOrder: sortedInfo.columnKey === 'lastLogin' && sortedInfo.order,
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Dropdown overlay={
          <Menu>
            <Menu.Item key="1" icon={<EditOutlined />}>Chỉnh sửa</Menu.Item>
            <Menu.Item key="2" icon={<DeleteOutlined />}>Xóa</Menu.Item>
            {record.status === 'Đã khóa' ? (
              <Menu.Item key="3" icon={<UserOutlined />}>Mở khóa</Menu.Item>
            ) : (
              <Menu.Item key="3" icon={<UserDeleteOutlined />}>Khóa</Menu.Item>
            )}
          </Menu>
        }>
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ];

  // Header menu
  const userMenu = (
    <Menu>
      <Menu.Item key="profile" icon={<UserOutlined />}>Hồ sơ</Menu.Item>
      <Menu.Item key="settings" icon={<SettingOutlined />}>Cài đặt</Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" icon={<LogoutOutlined />}>Đăng xuất</Menu.Item>
    </Menu>
  );

  return (
    <Layout className="min-h-screen">
      <Header className="flex items-center justify-between bg-white px-6 shadow-sm">
        <div className="flex items-center">
          <div className="text-xl font-bold text-blue-600 mr-8">AdminDashboard</div>
          <Breadcrumb>
            <Breadcrumb.Item>Trang chủ</Breadcrumb.Item>
            <Breadcrumb.Item>Quản lý người dùng</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <div className="flex items-center">
          <Button type="text" icon={<BellOutlined />} className="mr-2" />
          <Dropdown overlay={userMenu} placement="bottomRight">
            <div className="flex items-center cursor-pointer">
              <Avatar icon={<UserOutlined />} className="mr-2" />
              <span className="hidden md:inline">Admin</span>
            </div>
          </Dropdown>
        </div>
      </Header>
      
      <Content className="p-6 bg-gray-50">
        <Title level={3} className="mb-6">Quản lý người dùng</Title>

        {/* Dashboard stats */}
        <Row gutter={16} className="mb-6">
          <Col xs={24} sm={12} md={8} lg={6}>
            <Card>
              <Statistic
                title="Tổng số người dùng"
                value={data.length}
                prefix={<TeamOutlined />}
                valueStyle={{ color: '#3f8600' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Card>
              <Statistic
                title="Đang hoạt động"
                value={data.filter(user => user.status === 'Hoạt động').length}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Card>
              <Statistic
                title="Không hoạt động"
                value={data.filter(user => user.status === 'Không hoạt động').length}
                valueStyle={{ color: '#faad14' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Card>
              <Statistic
                title="Đã khóa"
                value={data.filter(user => user.status === 'Đã khóa').length}
                valueStyle={{ color: '#cf1322' }}
              />
            </Card>
          </Col>
        </Row>
        
        {/* User table */}
        <Card className="shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <div>
              <Button 
                type="primary" 
                icon={<UserAddOutlined />}
                className="mr-2 bg-blue-500 hover:bg-blue-600"
              >
                Thêm người dùng
              </Button>
              <Button icon={<ReloadOutlined />}>Làm mới</Button>
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
            onChange={handleTableChange}
            pagination={{
              position: ['bottomRight'],
              showSizeChanger: true,
              showTotal: (total) => `Tổng ${total} người dùng`,
              pageSizeOptions: ['5', '10', '20', '50'],
              defaultPageSize: 5,
            }}
            className="overflow-x-auto"
            rowClassName="hover:bg-gray-50"
          />
        </Card>
      </Content>
    </Layout>
  );
}

export default Dashboard;