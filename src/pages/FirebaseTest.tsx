import React, { useEffect, useState } from "react";
import { Card, Button, Input, Form, Alert, Spin } from "antd";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase";

const FirebaseTest: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const testFirebaseConnection = async () => {
    setLoading(true);
    setMessage("");
    setError("");

    try {
      // Test Firebase initialization
      if (!auth) {
        throw new Error("Firebase Auth 未初始化");
      }

      setMessage("Firebase 連線正常！可以開始測試註冊/登入功能。");
    } catch (err: any) {
      setError(`Firebase 連線錯誤: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testRegister = async (values: { email: string; password: string }) => {
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
      setMessage(`註冊成功！用戶 ID: ${userCredential.user.uid}`);
    } catch (err: any) {
      setError(`註冊失敗: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testLogin = async (values: { email: string; password: string }) => {
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const userCredential = await signInWithEmailAndPassword(auth, values.email, values.password);
      setMessage(`登入成功！用戶 ID: ${userCredential.user.uid}`);
    } catch (err: any) {
      setError(`登入失敗: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    testFirebaseConnection();
  }, []);

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <Card title="🔥 Firebase 連線測試">
        {message && <Alert message={message} type="success" style={{ marginBottom: "16px" }} />}
        {error && <Alert message={error} type="error" style={{ marginBottom: "16px" }} />}
        
        <Spin spinning={loading}>
          <div style={{ marginBottom: "24px" }}>
            <Button onClick={testFirebaseConnection} type="primary">
              測試 Firebase 連線
            </Button>
          </div>

          <Form layout="vertical" onFinish={testRegister}>
            <h3>測試註冊</h3>
            <Form.Item name="email" label="電子郵件" rules={[{ required: true, type: "email" }]}>
              <Input placeholder="test@example.com" />
            </Form.Item>
            <Form.Item name="password" label="密碼" rules={[{ required: true, min: 6 }]}>
              <Input.Password placeholder="至少6個字符" />
            </Form.Item>
            <Form.Item>
              <Button htmlType="submit" type="primary">
                測試註冊
              </Button>
            </Form.Item>
          </Form>

          <Form layout="vertical" onFinish={testLogin}>
            <h3>測試登入</h3>
            <Form.Item name="email" label="電子郵件" rules={[{ required: true, type: "email" }]}>
              <Input placeholder="test@example.com" />
            </Form.Item>
            <Form.Item name="password" label="密碼" rules={[{ required: true }]}>
              <Input.Password placeholder="密碼" />
            </Form.Item>
            <Form.Item>
              <Button htmlType="submit" type="primary">
                測試登入
              </Button>
            </Form.Item>
          </Form>
        </Spin>

        <div style={{ marginTop: "24px", padding: "16px", backgroundColor: "#f5f5f5", borderRadius: "6px" }}>
          <h4>如果看到錯誤，請檢查：</h4>
          <ol>
            <li>Firebase Console 中是否已啟用 Email/Password 認證</li>
            <li>API 金鑰是否正確</li>
            <li>專案 ID 是否正確</li>
            <li>網路連線是否正常</li>
          </ol>
        </div>
      </Card>
    </div>
  );
};

export default FirebaseTest;
