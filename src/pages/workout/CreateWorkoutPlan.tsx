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

interface CreateWorkoutPlanProps {
  mode?: "create" | "edit";
}

// Muscle group display configuration
const muscleGroupsConfig = [
  {
    key: MuscleGroup.CHEST,
    label: "胸肌",
    emoji: "💪",
    color: "#ff4d4f",
    description: "胸大肌、胸小肌",
  },
  {
    key: MuscleGroup.SHOULDERS,
    label: "肩膀",
    emoji: "🔥",
    color: "#ff7a45",
    description: "三角肌前中後束",
  },
  {
    key: MuscleGroup.LEGS,
    label: "腿部",
    emoji: "🦵",
    color: "#ffa940",
    description: "股四頭肌、腿後肌",
  },
  {
    key: MuscleGroup.BACK,
    label: "背部",
    emoji: "💚",
    color: "#bae637",
    description: "背闊肌、斜方肌",
  },
  {
    key: MuscleGroup.ABS,
    label: "腹肌",
    emoji: "⚡",
    color: "#36cfc9",
    description: "腹直肌、腹斜肌",
  },
  {
    key: MuscleGroup.ARMS,
    label: "手臂",
    emoji: "💪",
    color: "#597ef7",
    description: "肱二頭肌、肱三頭肌",
  },
];

const CreateWorkoutPlan: React.FC<CreateWorkoutPlanProps> = ({ mode = "create" }) => {
  const [form] = Form.useForm();
  const [selectedMuscleGroups, setSelectedMuscleGroups] = useState<MuscleGroup[]>([]);
  const [completed, setCompleted] = useState(false);
  const [isRestDay, setIsRestDay] = useState(false);
  const [notesCount, setNotesCount] = useState(0);

  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const currentUser = auth.currentUser;

  // API hooks
  const { mutate: createWorkout, isLoading: createLoading } = useCreate();
  const { mutate: updateWorkout, isLoading: updateLoading } = useUpdate();
  
  // Fetch existing workout for edit mode
  const { data: workoutData, isLoading: fetchLoading } = useOne<WorkoutRecord>({
    resource: "workouts",
    id: id || "",
    queryOptions: {
      enabled: mode === "edit" && !!id,
    },
  });

  // Only include fetchLoading in edit mode
  const isLoading = mode === "edit" 
    ? (createLoading || updateLoading || fetchLoading)
    : (createLoading || updateLoading);
  const existingWorkout = workoutData?.data;
  const selectedDate = searchParams.get('date');

  // Handle muscle group selection
  const handleMuscleGroupClick = (muscleGroup: MuscleGroup) => {
    if (isRestDay) return;

    const newSelection = selectedMuscleGroups.includes(muscleGroup)
      ? selectedMuscleGroups.filter(mg => mg !== muscleGroup)
      : [...selectedMuscleGroups, muscleGroup];

    setSelectedMuscleGroups(newSelection);
  };

  // Handle rest day toggle
  const handleRestDayToggle = (checked: boolean) => {
    setIsRestDay(checked);
    if (checked) {
      setSelectedMuscleGroups([]);
    }
  };

  // Handle notes change
  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotesCount(e.target.value.length);
  };

  // Handle completion status toggle
  const handleCompletionToggle = () => {
    setCompleted(!completed);
  };

  // Handle form submission
  const onFinish = async (values: any) => {
    console.log('🚀 Form submission started');
    console.log('Values:', values);
    console.log('Selected muscle groups:', selectedMuscleGroups);
    console.log('Is rest day:', isRestDay);
    console.log('Current user:', currentUser);
    
    try {
      // Validation checks
      if (!currentUser) {
        message.error("請先登入");
        return;
      }

      if (!isRestDay && selectedMuscleGroups.length === 0) {
        message.error("請選擇至少一個肌肉群或開啟休息日模式");
        return;
      }

      console.log('✅ All validations passed');

      // Prepare workout data
      const workoutData = {
        userId: currentUser.uid,
        date: values.date.format("YYYY-MM-DD"),
        muscleGroups: isRestDay ? [] : selectedMuscleGroups,
        completed: completed,
        notes: values.notes || "",
        isRestDay: isRestDay,
      };

      console.log('📦 Workout data prepared:', workoutData);

      const operationConfig = {
        resource: "workouts",
        values: workoutData,
      };

      if (mode === "edit" && existingWorkout?.id) {
        console.log('📝 Updating existing workout:', existingWorkout.id);
        // Update existing record
        updateWorkout(
          {
            ...operationConfig,
            id: existingWorkout.id,
          },
          {
            onSuccess: () => {
              console.log('✅ Update success');
              message.success("訓練計劃更新成功！");
              navigate('/calendar');
            },
            onError: (error) => {
              console.error("❌ Update error:", error);
              message.error(`更新失敗：${error?.message || '未知錯誤'}`);
            },
          }
        );
      } else {
        console.log('🎆 Creating new workout');
        // Create new record
        createWorkout(
          operationConfig,
          {
            onSuccess: () => {
              console.log('✅ Create success');
              message.success("訓練計劃創建成功！");
              
              // Reset form
              form.resetFields();
              setSelectedMuscleGroups([]);
              setCompleted(false);
              setIsRestDay(false);
              setNotesCount(0);
              
              navigate('/calendar');
            },
            onError: (error) => {
              console.error("❌ Create error:", error);
              message.error(`創建失敗：${error?.message || '未知錯誤'}`);
            },
          }
        );
      }
    } catch (error) {
      console.error("❌❌❌ Form submission error:", error);
      message.error("提交失敗，請重試");
    }
  };

  // Set initial form values
  useEffect(() => {
    if (existingWorkout) {
      // Edit mode - populate existing data
      form.setFieldsValue({
        date: dayjs(existingWorkout.date),
        notes: existingWorkout.notes || "",
      });
      
      // Filter out CARDIO muscle group
      const filteredMuscleGroups = (existingWorkout.muscleGroups || []).filter(mg => mg !== MuscleGroup.CARDIO);
      setSelectedMuscleGroups(filteredMuscleGroups);
      setCompleted(existingWorkout.completed || false);
      setIsRestDay((existingWorkout as any).isRestDay || false);
      setNotesCount((existingWorkout.notes || "").length);
    } else if (selectedDate) {
      // New mode with selected date from calendar
      form.setFieldsValue({
        date: dayjs(selectedDate),
        notes: "",
      });
    } else {
      // New mode with today's date
      form.setFieldsValue({
        date: dayjs(),
        notes: "",
      });
    }
  }, [existingWorkout, selectedDate, form]);

  return (
    <div style={{ padding: "0 4px" }}>
      <Card
        title={
          <Space>
            <span style={{ fontSize: "20px" }}>
              {mode === "edit" ? "📝" : "🚀"}
            </span>
            {mode === "edit" ? "編輯訓練計劃" : "創建新的訓練計劃"}
          </Space>
        }
        extra={
          <Button 
            onClick={() => navigate('/calendar')}
            type="text"
          >
            返回日曆
          </Button>
        }
        style={{ 
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
        }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          size="large"
        >
          {/* 1. Basic Information - Training Date Picker */}
          <Form.Item
            name="date"
            label={
              <div style={{ fontSize: "16px", fontWeight: "bold" }}>
                📅 訓練日期 <span style={{ color: "#ff4d4f" }}>*</span>
              </div>
            }
            rules={[{ required: true, message: "請選擇訓練日期" }]}
          >
            <DatePicker
              style={{ width: "100%" }}
              format="YYYY-MM-DD"
              placeholder="選擇訓練日期"
              showToday
            />
          </Form.Item>

          {/* 2. Training Type Selection - Rest Day vs Training Day */}
          <Form.Item 
            label={
              <div style={{ fontSize: "16px", fontWeight: "bold" }}>
                🎯 訓練類型
              </div>
            }
          >
            <Card
              size="small"
              style={{
                border: isRestDay ? "2px solid #52c41a" : "2px solid #1890ff",
                backgroundColor: isRestDay ? "#f6ffed" : "#e6f7ff",
                borderRadius: "8px",
                cursor: "pointer"
              }}
              onClick={() => handleRestDayToggle(!isRestDay)}
              hoverable
            >
              <div style={{ 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "space-between" 
              }}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <div style={{ fontSize: "24px", marginRight: "12px" }}>
                    {isRestDay ? "😴" : "💪"}
                  </div>
                  <div>
                    <div style={{
                      fontWeight: "bold",
                      color: isRestDay ? "#52c41a" : "#1890ff",
                      fontSize: "16px"
                    }}>
                      {isRestDay ? "休息日" : "訓練日"}
                    </div>
                    <div style={{ fontSize: "12px", color: "#666" }}>
                      {isRestDay ? "今天好好休息，為下次訓練做準備" : "選擇要訓練的肌肉群"}
                    </div>
                  </div>
                </div>
                <Switch
                  checked={isRestDay}
                  onChange={handleRestDayToggle}
                  checkedChildren="休息"
                  unCheckedChildren="訓練"
                />
              </div>
            </Card>
          </Form.Item>

          {/* 3. Muscle Group Selection - Only show when not rest day */}
          {!isRestDay && (
            <Form.Item
              label={
                <div style={{ fontSize: "16px", fontWeight: "bold" }}>
                  🎯 肌肉群選擇 
                  <span style={{ color: "#ff4d4f" }}> *</span>
                  {selectedMuscleGroups.length > 0 && (
                    <span style={{ 
                      color: "#52c41a", 
                      fontSize: "14px",
                      fontWeight: "normal",
                      marginLeft: "8px"
                    }}>
                      （已選擇 {selectedMuscleGroups.length} 個肌肉群）
                    </span>
                  )}
                </div>
              }
            >
              <Row gutter={[12, 12]}>
                {muscleGroupsConfig.map((muscle) => {
                  const isSelected = selectedMuscleGroups.includes(muscle.key);
                  return (
                    <Col xs={12} sm={8} md={6} key={muscle.key}>
                      <Card
                        hoverable
                        size="small"
                        style={{
                          textAlign: "center",
                          cursor: "pointer",
                          border: isSelected
                            ? `3px solid ${muscle.color}`
                            : "2px solid #f0f0f0",
                          backgroundColor: isSelected
                            ? `${muscle.color}15`
                            : "#ffffff",
                          borderRadius: "12px",
                          transition: "all 0.3s ease",
                          minHeight: "120px",
                          position: "relative",
                          transform: isSelected ? "scale(1.02)" : "scale(1)",
                        }}
                        onClick={() => handleMuscleGroupClick(muscle.key)}
                        bodyStyle={{
                          padding: "16px 8px",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          height: "100%"
                        }}
                      >
                        <div style={{
                          fontSize: "36px",
                          marginBottom: "8px",
                          filter: isSelected ? "none" : "grayscale(30%)"
                        }}>
                          {muscle.emoji}
                        </div>
                        <div style={{
                          fontSize: "16px",
                          fontWeight: "bold",
                          color: isSelected ? muscle.color : "#333",
                          marginBottom: "4px"
                        }}>
                          {muscle.label}
                        </div>
                        <div style={{
                          fontSize: "12px",
                          color: "#666",
                          lineHeight: "1.2"
                        }}>
                          {muscle.description}
                        </div>
                        
                        {/* Selection indicator */}
                        {isSelected && (
                          <div style={{
                            position: "absolute",
                            top: "8px",
                            right: "8px",
                            backgroundColor: muscle.color,
                            color: "white",
                            borderRadius: "50%",
                            width: "24px",
                            height: "24px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "12px",
                            fontWeight: "bold",
                            boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
                          }}>
                            ✓
                          </div>
                        )}
                      </Card>
                    </Col>
                  );
                })}
              </Row>
            </Form.Item>
          )}

          {/* 4. Training Notes */}
          <Form.Item
            name="notes"
            label={
              <div style={{ fontSize: "16px", fontWeight: "bold" }}>
                📝 訓練備註
                <span style={{ 
                  fontSize: "14px", 
                  fontWeight: "normal", 
                  color: "#666",
                  marginLeft: "8px"
                }}>
                  ({notesCount}/1000 字)
                </span>
              </div>
            }
          >
            <TextArea
              placeholder={
                isRestDay
                  ? "記錄休息原因或感受...\n\n例如：\n• 昨天練得太累，今天主動休息\n• 感覺有點感冒，先休息一天\n• 計劃性休息日，為明天的重訓做準備\n• 身體感覺不錯，就是想放鬆一下"
                  : "記錄具體訓練內容（重量、組數、感受等）...\n\n例如：\n• 臥推：60kg × 8 × 3組\n• 飛鳥：15kg × 12 × 3組\n• 今天狀態不錯，力量有明顯提升\n• 左肩有點緊，下次注意熱身"
              }
              rows={6}
              maxLength={1000}
              onChange={handleNotesChange}
              style={{ fontSize: "14px", lineHeight: "1.6" }}
            />
          </Form.Item>

          {/* 5. Completion Status */}
          <Form.Item 
            label={
              <div style={{ fontSize: "16px", fontWeight: "bold" }}>
                ⭐ 完成狀態
              </div>
            }
          >
            <Card
              size="small"
              style={{
                cursor: "pointer",
                border: completed ? "2px solid #52c41a" : "2px solid #d9d9d9",
                backgroundColor: completed ? "#f6ffed" : "#fafafa",
                borderRadius: "8px",
                transition: "all 0.3s ease"
              }}
              onClick={handleCompletionToggle}
              hoverable
            >
              <div style={{ 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "space-between" 
              }}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <div style={{ fontSize: "24px", marginRight: "12px" }}>
                    {completed ? "✅" : "⏳"}
                  </div>
                  <div>
                    <div style={{
                      fontWeight: "bold",
                      color: completed ? "#52c41a" : "#666",
                      fontSize: "16px"
                    }}>
                      {completed 
                        ? (isRestDay ? "已休息" : "已完成訓練") 
                        : (isRestDay ? "計劃休息" : "計劃中")
                      }
                    </div>
                    <div style={{ fontSize: "12px", color: "#666" }}>
                      {completed ? "太棒了！繼續保持" : "點擊切換為已完成"}
                    </div>
                  </div>
                </div>
                <div style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "50%",
                  backgroundColor: completed ? "#52c41a" : "#d9d9d9",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontSize: "14px",
                  fontWeight: "bold",
                  transition: "all 0.3s ease"
                }}>
                  {completed ? "✓" : ""}
                </div>
              </div>
            </Card>
          </Form.Item>

          {/* Form Submit Button */}
          <Form.Item style={{ marginTop: "32px" }}>
            <Button
              type="primary"
              loading={isLoading}
              size="large"
              block
              onClick={() => {
                console.log('🚀 Main button clicked!');
                
                // Very basic validation
                if (!currentUser) {
                  message.error('請先登入');
                  return;
                }
                
                if (!isRestDay && selectedMuscleGroups.length === 0) {
                  message.warning('請選擇至少一個肌肉群或開啟休息日模式');
                  return;
                }
                
                // Get form values and call onFinish
                form.validateFields()
                  .then(values => {
                    console.log('✅ Form validated, calling onFinish');
                    onFinish(values);
                  })
                  .catch(error => {
                    console.error('❌ Form validation failed:', error);
                    message.error('表單驗證失敗');
                  });
              }}
              style={{
                height: "56px",
                fontSize: "18px",
                fontWeight: "bold",
                borderRadius: "12px",
                background: mode === "edit" 
                  ? "linear-gradient(135deg, #1890ff 0%, #096dd9 100%)"
                  : "linear-gradient(135deg, #52c41a 0%, #389e0d 100%)",
                border: "none"
              }}
            >
              {isLoading ? (
                <Space>
                  <span>🔄</span>
                  loading...
                </Space>
              ) : (
                <Space>
                  <span>{mode === "edit" ? "📝" : "🚀"}</span>
                  {mode === "edit" ? "更新" : "創建"}
                </Space>
              )}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default CreateWorkoutPlan;