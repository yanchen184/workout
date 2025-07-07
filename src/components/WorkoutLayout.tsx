import React, { useState, useEffect } from "react";
import { Layout, Menu, Button, Typography, Space } from "antd";
import { 
  CalendarOutlined, 
  PlusOutlined, 
  UnorderedListOutlined, 
  DashboardOutlined,
  LogoutOutlined,
  UserOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined
} from "@ant-design/icons";
import { useLogout, useGetIdentity } from "@refinedev/core";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

const WorkoutLayout: React.FC = () => {
  const [siderCollapsed, setSiderCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const { mutate: logout } = useLogout();
  const { data: identity } = useGetIdentity();
  const navigate = useNavigate();
  const location = useLocation();

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      // Auto collapse on mobile
      if (mobile) {
        setSiderCollapsed(true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Get current page key from location
  const getCurrentKey = () => {
    const path = location.pathname;
    if (path.includes('/dashboard')) return 'dashboard';
    if (path.includes('/calendar')) return 'calendar';
    if (path.includes('/add') || path.includes('/edit')) return 'add';
    if (path.includes('/list')) return 'list';
    return 'dashboard';
  };

  // Handle menu selection
  const handleMenuSelect = ({ key }: { key: string }) => {
    navigate(`/${key}`);
  };

  // Handle logout
  const handleLogout = () => {
    logout();
  };

  // Get page title based on current route
  const getPageTitle = () => {
    const currentKey = getCurrentKey();
    switch (currentKey) {
      case 'dashboard':
        return '數據儀表板';
      case 'calendar':
        return '健身日曆';
      case 'add':
        return location.pathname.includes('/edit') ? '編輯訓練' : '新增訓練';
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
        trigger={null}
        collapsible 
        collapsed={siderCollapsed}
        theme="light"
        width={250}
        collapsedWidth={isMobile ? 0 : 80}
        style={{
          position: isMobile ? 'fixed' : 'relative',
          height: '100vh',
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 1000,
          boxShadow: isMobile && !siderCollapsed ? '2px 0 8px rgba(0,0,0,0.15)' : 'none',
        }}
      >
        <div style={{ 
          padding: siderCollapsed ? '16px 8px' : '16px', 
          textAlign: 'center',
          borderBottom: '1px solid #f0f0f0'
        }}>
          {!siderCollapsed && (
            <>
              <Title level={4} style={{ margin: 0 }}>
                💪 健身日曆
              </Title>
            </>
          )}
          {siderCollapsed && (
            <div style={{ fontSize: '24px' }}>💪</div>
          )}
        </div>
        
        <Menu
          mode="inline"
          selectedKeys={[getCurrentKey()]}
          items={menuItems}
          onSelect={handleMenuSelect}
          style={{ borderRight: 0, marginTop: '8px' }}
        />
      </Sider>

      {/* Mobile overlay */}
      {isMobile && !siderCollapsed && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.45)',
            zIndex: 999,
          }}
          onClick={() => setSiderCollapsed(true)}
        />
      )}

      <Layout style={{ marginLeft: isMobile ? 0 : (siderCollapsed ? 80 : 250) }}>
        <Header style={{ 
          padding: '0 16px', 
          background: '#fff', 
          borderBottom: '1px solid #f0f0f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}>
          <Space>
            {isMobile && (
              <Button
                type="text"
                icon={siderCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setSiderCollapsed(!siderCollapsed)}
                style={{ marginRight: 8 }}
              />
            )}
            <Title level={3} style={{ margin: 0 }}>
              {getPageTitle()}
            </Title>
          </Space>
          
          <Space>
            <Space align="center">
              <UserOutlined />
              <Text>{(identity as any)?.name || 'User'}</Text>
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
          overflow: 'auto',
          minHeight: 'calc(100vh - 64px)',
        }}>
          <div style={{
            background: '#fff',
            borderRadius: '8px',
            minHeight: 'calc(100vh - 96px)',
            padding: '16px',
          }}>
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default WorkoutLayout;