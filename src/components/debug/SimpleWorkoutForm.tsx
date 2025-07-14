import React, { useState, useEffect } from "react";
import { Form, Input, DatePicker, Button, Card, message, Switch, Row, Col } from "antd";
import { useCreate, useUpdate, useOne } from "@refinedev/core";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import dayjs from "dayjs";
import { WorkoutRecord, MuscleGroup } from "../../types";
import { auth } from "../../config/firebase";

interface WorkoutFormProps {
  mode: "create" | "edit";
}

// Define interface for workout data
interface WorkoutData {
  userId: string;
  date: string;
  muscleGroups: MuscleGroup[];
  completed: boolean;
  notes: string;
  isRestDay: boolean;
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

const SimpleWorkoutForm: React.FC<WorkoutFormProps> = ({ mode = "create" }) => {
  console.log('🚀 SimpleWorkoutForm component loaded, mode:', mode);
  
  const [form] = Form.useForm();
  const [selectedMuscleGroups, setSelectedMuscleGroups] = useState<MuscleGroup[]>([]);
  const [completed, setCompleted] = useState(false);
  const [isRestDay, setIsRestDay] = useState(false);
  
  console.log('📊 Component state initialized');

  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const currentUser = auth.currentUser;

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

  const isLoading = createLoading || updateLoading || fetchLoading;
  const existingWorkout = workoutData?.data;
  const selectedDate = searchParams.get('date');

  // Handle muscle group selection
  const handleMuscleGroupToggle = (muscleGroup: MuscleGroup) => {
    if (isRestDay) return;

    setSelectedMuscleGroups(prev => {
      const newSelection = prev.includes(muscleGroup)
        ? prev.filter(mg => mg !== muscleGroup)
        : [...prev, muscleGroup];
      return newSelection;
    });
  };

  // Handle rest day toggle
  const handleRestDayToggle = (checked: boolean) => {
    setIsRestDay(checked);
    if (checked) {
      setSelectedMuscleGroups([]);
    }
  };

  // Handle form submission
  const onFinish = async (values: any) => {
    console.log('=== FORM SUBMISSION START ===');
    console.log('Form values received:', values);
    console.log('Current user:', currentUser);
    console.log('Selected muscle groups:', selectedMuscleGroups);
    console.log('Is rest day:', isRestDay);
    console.log('Is completed:', completed);
    console.log('Is loading:', isLoading);
    console.log('Mode:', mode);
    
    // Prevent double submission
    if (isLoading) {
      console.log('❌ Already submitting, ignoring duplicate submission');
      return;
    }
    
    try {
      console.log('✅ Starting validation checks...');
      
      // Validation checks
      if (!currentUser) {
        console.log('❌ Validation failed: No current user');
        message.error("請先登入");
        return;
      }
      console.log('✅ User validation passed');

      if (!isRestDay && selectedMuscleGroups.length === 0) {
        console.log('❌ Validation failed: No muscle groups selected and not rest day');
        message.error("請選擇至少一個訓練部位或開啟休息日模式");
        return;
      }
      console.log('✅ Muscle groups validation passed');

      console.log('✅ All validations passed, proceeding with submission...');

      // Prepare workout data
      const workoutData: WorkoutData = {
        userId: currentUser.uid,
        date: values.date.format("YYYY-MM-DD"),
        muscleGroups: isRestDay ? [] : selectedMuscleGroups,
        completed: completed,
        notes: values.notes || "",
        isRestDay: isRestDay,
      };

      console.log("📦 Workout data prepared:", workoutData);
      console.log("🚀 Starting API call...");

      if (mode === "edit" && existingWorkout?.id) {
        console.log('📝 Calling UPDATE API for existing workout ID:', existingWorkout.id);
        // Update existing record
        updateWorkout(
          {
            resource: "workouts",
            id: existingWorkout.id,
            values: workoutData,
          },
          {
            onSuccess: (data) => {
              console.log("✅ Update success:", data);
              message.success("訓練計劃更新成功！");
              console.log('🚀 Navigating to calendar...');
              navigate('/calendar');
            },
            onError: (error) => {
              console.error("❌ Update error:", error);
              const errorMessage = error?.message || error?.toString() || 'Unknown error';
              message.error(`更新失敗：${errorMessage}`);
            },
          }
        );
      } else {
        console.log('🎆 Calling CREATE API for new workout');
        // Create new record
        createWorkout(
          {
            resource: "workouts",
            values: workoutData,
          },
          {
            onSuccess: (data) => {
              console.log("✅ Create success:", data);
              message.success("訓練計劃創建成功！");
              
              console.log('🧹 Resetting form state...');
              // Reset form
              form.resetFields();
              setSelectedMuscleGroups([]);
              setCompleted(false);
              setIsRestDay(false);
              
              console.log('🚀 Navigating to calendar...');
              navigate('/calendar');
            },
            onError: (error) => {
              console.error("❌ Create error:", error);
              const errorMessage = error?.message || error?.toString() || 'Unknown error';
              message.error(`創建失敗：${errorMessage}`);
            },
          }
        );
      }
    } catch (error) {
      console.error('❌❌❌ FORM SUBMISSION ERROR ❌❌❌', error);
      console.error('Error type:', typeof error);
      console.error('Error constructor:', error?.constructor?.name);
      const errorMessage = error instanceof Error ? error.message : '未知錯誤';
      console.error('Final error message:', errorMessage);
      message.error(`提交失敗：${errorMessage}，請重試`);
    }
    
    console.log('=== FORM SUBMISSION END ===');
  };

  // Set initial form values
  useEffect(() => {
    if (existingWorkout) {
      // Edit mode - populate existing data
      form.setFieldsValue({
        ...existingWorkout,
        date: dayjs(existingWorkout.date),
        notes: existingWorkout.notes || "",
      });
      // Filter out CARDIO muscle group since we removed cardio functionality
      const filteredMuscleGroups = (existingWorkout.muscleGroups || []).filter(mg => mg !== MuscleGroup.CARDIO);
      setSelectedMuscleGroups(filteredMuscleGroups);
      setCompleted(existingWorkout.completed || false);
      setIsRestDay((existingWorkout as any).isRestDay || false);
    } else if (selectedDate) {
      // New mode with selected date
      form.setFieldsValue({
        date: dayjs(selectedDate),
        notes: "",
      });
      setSelectedMuscleGroups([]);
      setCompleted(false);
      setIsRestDay(false);
    } else {
      // New mode without selected date
      form.setFieldsValue({
        date: dayjs(),
        notes: "",
      });
    }
  }, [existingWorkout, selectedDate, form]);

  const getTitle = () => {
    if (mode === "edit") {
      return "編輯訓練記錄";
    }
    return "新增訓練計劃";
  };
  
  console.log('🎨 About to render SimpleWorkoutForm...');

  return (
    <Card
      title={getTitle()}
      extra={
        <Button 
          onClick={() => navigate('/calendar')}
          type="text"
        >
          返回日曆
        </Button>
      }
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          date: selectedDate ? dayjs(selectedDate) : dayjs(),
          notes: "",
        }}
      >
        <Form.Item
          name="date"
          label="訓練日期"
          rules={[{ required: true, message: "請選擇訓練日期" }]}
        >
          <DatePicker
            style={{ width: "100%" }}
            format="YYYY-MM-DD"
            placeholder="選擇日期"
            size="large"
          />
        </Form.Item>

        {/* Rest day toggle */}
        <Form.Item label="訓練類型">
          <div style={{
            padding: "12px 16px",
            border: isRestDay ? "2px solid #52c41a" : "2px solid #d9d9d9",
            backgroundColor: isRestDay ? "#f6ffed" : "#fafafa",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{
                fontSize: "20px",
                marginRight: "12px"
              }}>
                {isRestDay ? "😴" : "💪"}
              </div>
              <div>
                <div style={{
                  fontWeight: "bold",
                  color: isRestDay ? "#52c41a" : "#666"
                }}>
                  {isRestDay ? "休息日" : "訓練日"}
                </div>
                <div style={{ fontSize: "12px", color: "#999" }}>
                  {isRestDay ? "今天不練習，好好休息" : "選擇要訓練的部位"}
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
        </Form.Item>

        {!isRestDay && (
          <Form.Item
            label={
              <div style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "12px" }}>
                訓練部位 {selectedMuscleGroups.length > 0 && (
                  <span style={{ color: "#52c41a", fontSize: "14px" }}>
                    （已選擇 {selectedMuscleGroups.length} 個部位）
                  </span>
                )}
              </div>
            }
          >
            <Row gutter={[12, 12]} style={{ marginTop: "8px" }}>
              {muscleGroupsConfig.map((muscle) => {
                const isSelected = selectedMuscleGroups.includes(muscle.key);
                return (
                  <Col xs={12} sm={8} md={6} key={muscle.key}>
                    <div
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
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        padding: "16px 8px",
                        position: "relative",
                        opacity: isRestDay ? 0.5 : 1,
                      }}
                      onClick={() => handleMuscleGroupToggle(muscle.key)}
                    >
                      <div style={{
                        fontSize: "36px",
                        marginBottom: "8px",
                        filter: isSelected ? "none" : "grayscale(60%)"
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
                      {isSelected && (
                        <div style={{
                          position: "absolute",
                          top: "8px",
                          right: "8px",
                          backgroundColor: muscle.color,
                          color: "white",
                          borderRadius: "50%",
                          width: "20px",
                          height: "20px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "12px",
                          fontWeight: "bold"
                        }}>
                          ✓
                        </div>
                      )}
                    </div>
                  </Col>
                );
              })}
            </Row>
          </Form.Item>
        )}

        <Form.Item
          name="notes"
          label="訓練備註"
        >
          <Input.TextArea
            placeholder={
              isRestDay
                ? "記錄休息感受、原因等...\n例如：\n- 昨天練太累，今天休息\n- 感覺有點感冒，先休息一天\n- 主動休息日，為明天的訓練做準備"
                : "記錄訓練內容、重量、組數、感受等詳細信息...\n例如：\n- 臥推 60kg × 8 × 3組\n- 飛鳥 15kg × 12 × 3組\n- 今天狀態不錯，力量有提升"
            }
            rows={6}
            maxLength={1000}
            showCount
            size="large"
          />
        </Form.Item>

        <Form.Item label="完成狀態">
          <div style={{
            cursor: "pointer",
            border: completed ? "2px solid #52c41a" : "2px solid #d9d9d9",
            backgroundColor: completed ? "#f6ffed" : "#fafafa",
            borderRadius: "8px",
            padding: "12px 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}
          onClick={() => setCompleted(!completed)}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{
                fontSize: "20px",
                marginRight: "12px"
              }}>
                {completed ? "✅" : "⏳"}
              </div>
              <div>
                <div style={{
                  fontWeight: "bold",
                  color: completed ? "#52c41a" : "#666"
                }}>
                  {completed ? (isRestDay ? "已休息" : "已完成訓練") : (isRestDay ? "計劃休息" : "計劃中")}
                </div>
                <div style={{ fontSize: "12px", color: "#999" }}>
                  {completed ? "太棒了！繼續保持" : "點擊標記為已完成"}
                </div>
              </div>
            </div>
            <div style={{
              width: "24px",
              height: "24px",
              borderRadius: "50%",
              backgroundColor: completed ? "#52c41a" : "#d9d9d9",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "12px",
              fontWeight: "bold"
            }}>
              {completed ? "✓" : ""}
            </div>
          </div>
        </Form.Item>

        <Form.Item style={{ marginTop: "24px" }}>
          {/* Debug button */}
          <Button
            onClick={() => {
              console.log('💬 DIRECT CLICK TEST - This should always work!');
              alert('按鈕可以點擊！');
            }}
            style={{ marginBottom: '10px' }}
            block
          >
            🔧 測試按鈕點擊
          </Button>
          
          {/* Main submit button - Direct onClick instead of form submit */}
          <Button
            type="primary"
            loading={isLoading}
            size="large"
            block
            onClick={async () => {
              console.log('💆 MAIN BUTTON CLICKED DIRECTLY!');
              
              try {
                // Get form values manually
                const values = await form.validateFields();
                console.log('✅ Form validation passed, calling onFinish...');
                await onFinish(values);
              } catch (error) {
                console.error('❌ Form validation failed:', error);
              }
            }}
            style={{
              height: "50px",
              fontSize: "16px",
              fontWeight: "bold",
              borderRadius: "8px"
            }}
          >
            {isLoading ? (
              mode === "edit" ? "🔄 更新中..." : "🚀 創建中..."
            ) : (
              mode === "edit"
                ? (isRestDay ? "📝 更新休息計劃" : "📝 更新訓練計劃")
                : (isRestDay ? "🚀 創建休息計劃" : "🚀 創建訓練計劃")
            )}
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

console.log('✅ SimpleWorkoutForm component definition completed');

export default SimpleWorkoutForm;
