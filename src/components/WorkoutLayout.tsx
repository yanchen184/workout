import React, { useState, useEffect } from "react";
import { Layout, Menu, Button, Typography, Space, Tag } from "antd";
import { 
  CalendarOutlined, 
  PlusOutlined, 
  UnorderedListOutlined, 
  DashboardOutlined,
  LogoutOutlined,
  UserOutlined,
  LeftOutlined,
  RightOutlined
} from "@ant-design/icons";
import { useLogout, useGetIdentity } from "@refinedev/core";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

// Import version from package.json - Updated to v1.0.5
const APP_VERSION = "1.0.5";

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
        width={160}
        collapsedWidth={isMobile ? 0 : 40}
        style={{
          position: isMobile ? 'fixed' : 'relative',
          height: '100vh',
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 1000,
          boxShadow: isMobile && !siderCollapsed ? '2px 0 8px rgba(0,0,0,0.15)' : 'none',
          transition: 'all 0.2s ease',
        }}
      >
        {/* Logo/Title section */}
        <div style={{ 
          padding: siderCollapsed ? '8px' : '12px', 
          textAlign: 'center',
          borderBottom: '1px solid #f0f0f0',
          minHeight: '50px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {!siderCollapsed && (
            <Title level={4} style={{ margin: 0, fontSize: '14px' }}>
              💪 健身日曆
            </Title>
          )}
          {siderCollapsed && (
            <div style={{ fontSize: '14px' }}>💪</div>
          )}
        </div>
        
        {/* Menu */}
        <div style={{ flex: 1 }}>
          <Menu
            mode="inline"
            selectedKeys={[getCurrentKey()]}
            items={menuItems}
            onSelect={handleMenuSelect}
            style={{ 
              borderRight: 0, 
              marginTop: '4px',
              fontSize: siderCollapsed ? '11px' : '13px'
            }}
            inlineIndent={siderCollapsed ? 6 : 12}
          />
        </div>
        
        {/* Collapse button at bottom of sidebar */}
        <div style={{
          padding: '8px',
          borderTop: '1px solid #f0f0f0',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '48px'
        }}>
          <Button
            type="text"
            icon={siderCollapsed ? <RightOutlined /> : <LeftOutlined />}
            onClick={() => setSiderCollapsed(!siderCollapsed)}
            size="small"
            style={{ 
              border: 'none',
              boxShadow: 'none',
              color: '#666',
              fontSize: '12px'
            }}
          />
        </div>
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

      {/* Main content area */}
      <Layout style={{ 
        marginLeft: isMobile ? 0 : (siderCollapsed ? 40 : 160), 
        transition: 'margin-left 0.2s ease' 
      }}>
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
          height: '64px',
        }}>
          <Space>
            {/* Mobile menu button (only shows on mobile) */}
            {isMobile && (
              <Button
                type="text"
                icon={siderCollapsed ? <RightOutlined /> : <LeftOutlined />}
                onClick={() => setSiderCollapsed(!siderCollapsed)}
                style={{ marginRight: 8 }}
                size="small"
              />
            )}
            <Title level={3} style={{ margin: 0, fontSize: '18px' }}>
              {getPageTitle()}
            </Title>
          </Space>
          
          <Space>
            {/* Version tag - Updated to show v1.0.5 */}
            <Tag color="cyan" style={{ fontSize: '11px', margin: 0, fontWeight: 'bold' }}>
              v{APP_VERSION}
            </Tag>
            
            <Space align="center">
              <UserOutlined />
              <Text style={{ 
                maxWidth: '80px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                {((identity as any)?.name || 'User').length > 7 
                  ? `${((identity as any)?.name || 'User').substring(0, 7)}...` 
                  : ((identity as any)?.name || 'User')
                }
              </Text>
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
          padding: '4px',
          background: '#fff',
          overflow: 'auto',
          minHeight: 'calc(100vh - 64px)',
        }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default WorkoutLayout;