import React from "react";
import { Form, Input, DatePicker, Button, Card, message } from "antd";
import { useCreate } from "@refinedev/core";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { auth } from "../../config/firebase";

// Simple debug form to test create functionality
const DebugWorkoutForm: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const currentUser = auth.currentUser;
  
  const { mutate: createWorkout, isLoading } = useCreate();

  const onFinish = async (values: any) => {
    console.log('Debug form submission started with values:', values);
    
    try {
      if (!currentUser) {
        message.error("請先登入");
        return;
      }

      const workoutData = {
        userId: currentUser.uid,
        date: values.date.format("YYYY-MM-DD"),
        muscleGroups: [],
        completed: false,
        notes: values.notes || "",
        isRestDay: true,
      };

      console.log('Submitting debug workout data:', workoutData);

      createWorkout(
        {
          resource: "workouts",
          values: workoutData,
        },
        {
          onSuccess: (data) => {
            console.log("Debug create success:", data);
            message.success("測試創建成功！");
            form.resetFields();
            navigate('/calendar');
          },
          onError: (error) => {
            console.error("Debug create error:", error);
            message.error(`測試創建失敗：${error?.message || 'Unknown error'}`);
          },
        }
      );
    } catch (error) {
      console.error("Debug form submission error:", error);
      message.error(`提交失敗：${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <Card title="調試版本 - 簡單創建表單">
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          date: dayjs(),
          notes: "",
        }}
      >
        <Form.Item
          name="date"
          label="日期"
          rules={[{ required: true, message: "請選擇日期" }]}
        >
          <DatePicker
            style={{ width: "100%" }}
            format="YYYY-MM-DD"
            placeholder="選擇日期"
          />
        </Form.Item>

        <Form.Item name="notes" label="備註">
          <Input.TextArea
            placeholder="測試備註..."
            rows={3}
            maxLength={200}
            showCount
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={isLoading}
            disabled={isLoading}
            block
          >
            {isLoading ? "測試創建中..." : "測試創建休息日"}
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default DebugWorkoutForm;
