import React from "react";
import { Form, Input, Button, Card, Typography, Tabs } from "antd";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { useLogin, useRegister } from "@refinedev/core";

const { Title, Text } = Typography;

interface LoginFormValues {
  email: string;
  password: string;
}

interface RegisterFormValues {
  email: string;
  password: string;
  confirmPassword: string;
}

const LoginPage: React.FC = () => {
  const { mutate: login, isLoading: loginLoading } = useLogin<LoginFormValues>();
  const { mutate: register, isLoading: registerLoading } = useRegister<RegisterFormValues>();

  // Handle login form submission
  const onLoginFinish = (values: LoginFormValues) => {
    login(values);
  };

  // Handle register form submission
  const onRegisterFinish = (values: RegisterFormValues) => {
    if (values.password !== values.confirmPassword) {
      return;
    }

    register({
      email: values.email,
      password: values.password,
      confirmPassword: values.confirmPassword,
    });
  };

  const loginForm = (
    <Form
      name="login"
      onFinish={onLoginFinish}
      layout="vertical"
      size="large"
    >
      <Form.Item
        name="email"
        label="電子郵件"
        rules={[
          { required: true, message: '請輸入電子郵件' },
          { type: 'email', message: '請輸入有效的電子郵件' },
        ]}
      >
        <Input
          prefix={<MailOutlined />}
          placeholder="your@email.com"
        />
      </Form.Item>

      <Form.Item
        name="password"
        label="密碼"
        rules={[
          { required: true, message: '請輸入密碼' },
          { min: 6, message: '密碼至少6個字符' },
        ]}
      >
        <Input.Password
          prefix={<LockOutlined />}
          placeholder="請輸入密碼"
        />
      </Form.Item>

      <Form.Item style={{ marginBottom: 0 }}>
        <Button
          type="primary"
          htmlType="submit"
          loading={loginLoading}
          block
          style={{
            height: '48px',
            fontSize: '16px',
            fontWeight: 'bold',
          }}
        >
          登入
        </Button>
      </Form.Item>
    </Form>
  );

  const registerForm = (
    <Form
      name="register"
      onFinish={onRegisterFinish}
      layout="vertical"
      size="large"
    >
      <Form.Item
        name="email"
        label="電子郵件"
        rules={[
          { required: true, message: '請輸入電子郵件' },
          { type: 'email', message: '請輸入有效的電子郵件' },
        ]}
      >
        <Input
          prefix={<MailOutlined />}
          placeholder="your@email.com"
        />
      </Form.Item>

      <Form.Item
        name="password"
        label="密碼"
        rules={[
          { required: true, message: '請輸入密碼' },
          { min: 6, message: '密碼至少6個字符' },
        ]}
      >
        <Input.Password
          prefix={<LockOutlined />}
          placeholder="請輸入密碼"
        />
      </Form.Item>

      <Form.Item
        name="confirmPassword"
        label="確認密碼"
        rules={[
          { required: true, message: '請確認密碼' },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('兩次輸入的密碼不一致'));
            },
          }),
        ]}
      >
        <Input.Password
          prefix={<LockOutlined />}
          placeholder="請再次輸入密碼"
        />
      </Form.Item>

      <Form.Item style={{ marginBottom: 0 }}>
        <Button
          type="primary"
          htmlType="submit"
          loading={registerLoading}
          block
          style={{
            height: '48px',
            fontSize: '16px',
            fontWeight: 'bold',
          }}
        >
          註冊
        </Button>
      </Form.Item>
    </Form>
  );

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px',
    }}>
      <Card
        style={{
          width: '100%',
          maxWidth: '400px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          borderRadius: '12px',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>💪</div>
          <Title level={2} style={{ margin: 0, color: '#1890ff' }}>
            健身日曆
          </Title>
          <Text type="secondary">
            記錄你的健身之路
          </Text>
          <div style={{ marginTop: '8px' }}>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              v1.0.1
            </Text>
          </div>
        </div>

        <Tabs
          defaultActiveKey="login"
          centered
          items={[
            {
              key: 'login',
              label: '登入',
              children: loginForm,
            },
            {
              key: 'register',
              label: '註冊',
              children: registerForm,
            },
          ]}
        />

        <div style={{
          textAlign: 'center',
          marginTop: '24px',
          padding: '16px',
          backgroundColor: '#f5f5f5',
          borderRadius: '8px',
        }}>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            開始記錄你的健身計劃，追蹤每個部位的訓練頻率，
            <br />
            實現超量回復的最佳時機！
          </Text>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;
