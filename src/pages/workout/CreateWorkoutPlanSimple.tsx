import React, { useState, useEffect } from "react";
import { 
  Form, 
  Input, 
  DatePicker, 
  Button, 
  Card, 
  message, 
  Switch, 
  Row, 
  Col,
  Typography,
  Space
} from "antd";
import { useCreate, useUpdate, useOne } from "@refinedev/core";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import dayjs from "dayjs";
import { WorkoutRecord, MuscleGroup } from "../../types";
import { auth } from "../../config/firebase";

const { Title, Text } = Typography;
const { TextArea } = Input;

interface CreateWorkoutPlanSimpleProps {
  mode?: "create" | "edit";
}

// Muscle group display configuration
const muscleGroupsConfig = [
  {
    key: MuscleGroup.CHEST,
    label: "胸肌",
    emoji: "💪",
    color: "#ff4d4f",
  },
  {
    key: MuscleGroup.SHOULDERS,
    label: "肩膀",
    emoji: "🔥",
    color: "#ff7a45",
  },
  {
    key: MuscleGroup.LEGS,
    label: "腿部",
    emoji: "🦵",
    color: "#ffa940",
  },
  {
    key: MuscleGroup.BACK,
    label: "背部",
    emoji: "💚",
    color: "#bae637",
  },
  {
    key: MuscleGroup.ABS,
    label: "腹肌",
    emoji: "⚡",
    color: "#36cfc9",
  },
  {
    key: MuscleGroup.ARMS,
    label: "手臂",
    emoji: "💪",
    color: "#597ef7",
  },
];

const CreateWorkoutPlanSimple: React.FC<CreateWorkoutPlanSimpleProps> = ({ mode = "create" }) => {
  console.log('🎨 CreateWorkoutPlanSimple rendering, mode:', mode);
  
  const [form] = Form.useForm();
  const [selectedMuscleGroups, setSelectedMuscleGroups] = useState<MuscleGroup[]>([]);
  const [completed, setCompleted] = useState(false);
  const [isRestDay, setIsRestDay] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const currentUser = auth.currentUser;

  // API hooks
  const { mutate: createWorkout, isLoading: createLoading } = useCreate();
  const { mutate: updateWorkout, isLoading: updateLoading } = useUpdate();
  
  const isLoading = createLoading || updateLoading;
  const selectedDate = searchParams.get('date');

  console.log('🔍 Component state:', {
    currentUser: !!currentUser,
    selectedMuscleGroups,
    isRestDay,
    completed,
    isLoading,
    selectedDate
  });

  // Handle muscle group selection
  const handleMuscleGroupClick = (muscleGroup: MuscleGroup) => {
    console.log('🎯 Muscle group clicked:', muscleGroup);
    if (isRestDay) return;

    const newSelection = selectedMuscleGroups.includes(muscleGroup)
      ? selectedMuscleGroups.filter(mg => mg !== muscleGroup)
      : [...selectedMuscleGroups, muscleGroup];

    console.log('🎯 New muscle groups selection:', newSelection);
    setSelectedMuscleGroups(newSelection);
  };

  // Handle rest day toggle
  const handleRestDayToggle = (checked: boolean) => {
    console.log('😴 Rest day toggled:', checked);
    setIsRestDay(checked);
    if (checked) {
      setSelectedMuscleGroups([]);
    }
  };

  // Simple submit handler
  const handleSubmit = async () => {
    console.log('🚀 Simple submit handler called');
    
    try {
      // Basic validation
      if (!currentUser) {
        message.error("請先登入");
        console.log('❌ No user logged in');
        return;
      }

      // Get form values
      const values = await form.validateFields();
      console.log('📋 Form values:', values);

      if (!isRestDay && selectedMuscleGroups.length === 0) {
        message.error("請選擇至少一個肌肉群或開啟休息日模式");
        console.log('❌ No muscle groups selected and not rest day');
        return;
      }

      // Prepare workout data
      const workoutData = {
        userId: currentUser.uid,
        date: values.date.format("YYYY-MM-DD"),
        muscleGroups: isRestDay ? [] : selectedMuscleGroups,
        completed: completed,
        notes: values.notes || "",
        isRestDay: isRestDay,
      };

      console.log('📦 Workout data to submit:', workoutData);

      // Create workout
      createWorkout(
        {
          resource: "workouts",
          values: workoutData,
        },
        {
          onSuccess: (data) => {
            console.log('✅ Create success:', data);
            message.success("訓練計劃創建成功！");
            
            // Reset form
            form.resetFields();
            setSelectedMuscleGroups([]);
            setCompleted(false);
            setIsRestDay(false);
            
            // Navigate back
            setTimeout(() => {
              navigate('/calendar');
            }, 1000);
          },
          onError: (error) => {
            console.error('❌ Create error:', error);
            message.error(`創建失敗：${error?.message || '未知錯誤'}`);
          },
        }
      );
    } catch (error) {
      console.error('❌❌❌ Submit error:', error);
      message.error("提交失敗，請重試");
    }
  };

  // Initialize form values
  useEffect(() => {
    if (selectedDate) {
      form.setFieldsValue({
        date: dayjs(selectedDate),
        notes: "",
      });
    } else {
      form.setFieldsValue({
        date: dayjs(),
        notes: "",
      });
    }
  }, [selectedDate, form]);

  return (
    <div style={{ padding: "0 4px" }}>
      <Card
        title="🚀 創建訓練計劃（簡化版）"
        extra={
          <Button onClick={() => navigate('/calendar')} type="text">
            返回日曆
          </Button>
        }
      >
        <Form form={form} layout="vertical">
          {/* Date Picker */}
          <Form.Item
            name="date"
            label="訓練日期"
            rules={[{ required: true, message: "請選擇訓練日期" }]}
          >
            <DatePicker
              style={{ width: "100%" }}
              format="YYYY-MM-DD"
              placeholder="選擇訓練日期"
            />
          </Form.Item>

          {/* Rest Day Toggle */}
          <Form.Item label="訓練類型">
            <div style={{
              padding: "12px",
              border: "1px solid #d9d9d9",
              borderRadius: "6px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <span>{isRestDay ? "😴 休息日" : "💪 訓練日"}</span>
              <Switch
                checked={isRestDay}
                onChange={handleRestDayToggle}
                checkedChildren="休息"
                unCheckedChildren="訓練"
              />
            </div>
          </Form.Item>

          {/* Muscle Groups */}
          {!isRestDay && (
            <Form.Item label={`肌肉群選擇 (已選: ${selectedMuscleGroups.length})`}>
              <Row gutter={[8, 8]}>
                {muscleGroupsConfig.map((muscle) => {
                  const isSelected = selectedMuscleGroups.includes(muscle.key);
                  return (
                    <Col xs={8} sm={6} md={4} key={muscle.key}>
                      <div
                        style={{
                          padding: "8px",
                          textAlign: "center",
                          cursor: "pointer",
                          border: isSelected ? `2px solid ${muscle.color}` : "1px solid #d9d9d9",
                          borderRadius: "6px",
                          backgroundColor: isSelected ? `${muscle.color}20` : "#fff"
                        }}
                        onClick={() => handleMuscleGroupClick(muscle.key)}
                      >
                        <div style={{ fontSize: "24px" }}>{muscle.emoji}</div>
                        <div style={{ fontSize: "12px" }}>{muscle.label}</div>
                      </div>
                    </Col>
                  );
                })}
              </Row>
            </Form.Item>
          )}

          {/* Notes */}
          <Form.Item name="notes" label="備註">
            <TextArea rows={4} placeholder="記錄訓練內容..." />
          </Form.Item>

          {/* Completion Status */}
          <Form.Item label="完成狀態">
            <div style={{
              padding: "12px",
              border: "1px solid #d9d9d9",
              borderRadius: "6px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              cursor: "pointer"
            }}
            onClick={() => setCompleted(!completed)}>
              <span>{completed ? "✅ 已完成" : "⏳ 計劃中"}</span>
              <Switch checked={completed} />
            </div>
          </Form.Item>

          {/* Submit Buttons */}
          <Form.Item>
            <Space direction="vertical" style={{ width: "100%" }}>
              {/* Debug button */}
              <Button 
                onClick={() => {
                  console.log('🔍 Debug info:');
                  console.log('- Current user:', !!currentUser);
                  console.log('- Muscle groups:', selectedMuscleGroups);
                  console.log('- Rest day:', isRestDay);
                  console.log('- Completed:', completed);
                  console.log('- Loading:', isLoading);
                  message.info(`狀態檢查: 用戶=${!!currentUser}, 肌肉群=${selectedMuscleGroups.length}, 休息=${isRestDay}`);
                }}
                block
              >
                🔍 檢查狀態
              </Button>

              {/* Simple test button */}
              <Button 
                onClick={() => {
                  console.log('🧪 Simple test button clicked');
                  message.success('按鈕可以點擊！');
                }}
                block
              >
                🧪 測試按鈕
              </Button>

              {/* Main submit button */}
              <Button
                type="primary"
                size="large"
                block
                loading={isLoading}
                disabled={isLoading}
                onClick={handleSubmit}
                style={{
                  height: "48px",
                  fontSize: "16px"
                }}
              >
                {isLoading ? "🔄 創建中..." : "🚀 創建訓練計劃"}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default CreateWorkoutPlanSimple;
