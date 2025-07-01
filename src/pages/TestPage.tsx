import React from "react";
import { Button, Card, Typography } from "antd";

const { Title, Text } = Typography;

const TestPage: React.FC = () => {
  return (
    <div style={{ padding: "20px" }}>
      <Card>
        <Title level={2}>🎉 健身日曆測試頁面</Title>
        <Text>如果你能看到這個頁面，說明基本配置是正確的！</Text>
        <br />
        <br />
        <Button type="primary" size="large">
          測試按鈕
        </Button>
        <div style={{ marginTop: "20px" }}>
          <Text type="secondary">版本: v1.0.0</Text>
        </div>
      </Card>
    </div>
  );
};

export default TestPage;
