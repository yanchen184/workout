import React, { useState } from "react";
import { Layout, Menu, Button, Typography, Space } from "antd";
import { 
  CalendarOutlined, 
  PlusOutlined, 
  UnorderedListOutlined, 
  DashboardOutlined,
  LogoutOutlined,
  UserOutlined
} from "@ant-design/icons";
import { useLogout, useGetIdentity } from "@refinedev/core";
import { WorkoutRecord } from "../types";
import WorkoutCalendar from "../components/WorkoutCalendar";
import WorkoutForm from "../components/WorkoutForm";
import WorkoutList from "../components/WorkoutList";
import WorkoutDashboard from "../components/WorkoutDashboard";

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

type MenuKey = 'dashboard' | 'calendar' | 'add' | 'list';

const WorkoutPage: React.FC = () => {
  const [selectedMenuKey, setSelectedMenuKey] = useState<MenuKey>('dashboard');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedWorkout, setSelectedWorkout] = useState<WorkoutRecord | null>(null);
  const [siderCollapsed, setSiderCollapsed] = useState(false);

  const { mutate: logout } = useLogout();
  const { data: identity } = useGetIdentity();

  // Handle menu selection
  const handleMenuSelect = ({ key }: { key: string }) => {
    setSelectedMenuKey(key as MenuKey);
  };

  // Handle date selection from calendar
  const handleDateSelect = (date: string, existingWorkout?: WorkoutRecord) => {
    setSelectedDate(date);
    setSelectedWorkout(existingWorkout || null);
    // Auto switch to add/edit form when date is selected
    setSelectedMenuKey('add');
  };

  // Handle logout
  const handleLogout = () => {
    logout();
  };

  // Render content based on selected menu
  const renderContent = () => {
    switch (selectedMenuKey) {
      case 'dashboard':
        return <WorkoutDashboard />;
      case 'calendar':
        return <WorkoutCalendar onDateSelect={handleDateSelect} />;
      case 'add':
        return (
          <WorkoutForm 
            mode={selectedWorkout ? "edit" : "create"}
            selectedDate={selectedDate}
            existingWorkout={selectedWorkout}
            onSuccess={() => {
              setSelectedDate('');
              setSelectedWorkout(null);
              setSelectedMenuKey('calendar');
            }}
          />
        );
      case 'list':
        return <WorkoutList />;
      default:
        return <WorkoutDashboard />;
    }
  };

  // Get page title based on selected menu
  const getPageTitle = () => {
    switch (selectedMenuKey) {
      case 'dashboard':
        return '數據儀表板';
      case 'calendar':
        return '健身日曆';
      case 'add':
        return '新增訓練';
      case 'list':
        return '訓練記錄';
      default:
        return '健身日曆';
    }
  };

  const menuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: '數據儀表板',
    },
    {
      key: 'calendar',
      icon: <CalendarOutlined />,
      label: '健身日曆',
    },
    {
      key: 'add',
      icon: <PlusOutlined />,
      label: '新增訓練',
    },
    {
      key: 'list',
      icon: <UnorderedListOutlined />,
      label: '訓練記錄',
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
        collapsible 
        collapsed={siderCollapsed} 
        onCollapse={setSiderCollapsed}
        theme="light"
        width={250}
      >
        <div style={{ 
          padding: '16px', 
          textAlign: 'center',
          borderBottom: '1px solid #f0f0f0'
        }}>
          <Title level={4} style={{ margin: 0 }}>
            💪 健身日曆
          </Title>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            v1.0.0
          </Text>
        </div>
        
        <Menu
          mode="inline"
          selectedKeys={[selectedMenuKey]}
          items={menuItems}
          onSelect={handleMenuSelect}
          style={{ borderRight: 0, marginTop: '8px' }}
        />
      </Sider>

      <Layout>
        <Header style={{ 
          padding: '0 16px', 
          background: '#fff', 
          borderBottom: '1px solid #f0f0f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Title level={3} style={{ margin: 0 }}>
            {getPageTitle()}
          </Title>
          
          <Space>
            <Space align="center">
              <UserOutlined />
              <Text>{identity?.name || 'User'}</Text>
            </Space>
            <Button 
              type="text" 
              icon={<LogoutOutlined />} 
              onClick={handleLogout}
            >
              登出
            </Button>
          </Space>
        </Header>

        <Content style={{ 
          margin: '0', 
          padding: '16px',
          background: '#f5f5f5',
          overflow: 'auto'
        }}>
          <div style={{
            background: '#fff',
            borderRadius: '8px',
            minHeight: 'calc(100vh - 112px)',
          }}>
            {renderContent()}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default WorkoutPage;
