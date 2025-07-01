import React from "react";
import { Form, Input, DatePicker, Button, Card, message, Row, Col, Switch } from "antd";
import { useCreate, useUpdate } from "@refinedev/core";
import dayjs from "dayjs";
import { WorkoutRecord, MuscleGroup } from "../types";
import { getMuscleGroupConfig } from "../config/muscleGroups";
import { auth } from "../config/firebase";

interface WorkoutFormProps {
  initialValues?: Partial<WorkoutRecord>;
  mode: "create" | "edit";
  onSuccess?: () => void;
  selectedDate?: string;
  existingWorkout?: WorkoutRecord; // 已存在的訓練記錄
}

// Muscle group display configuration with larger emojis and better visuals
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

const WorkoutForm: React.FC<WorkoutFormProps> = ({
  initialValues,
  mode,
  onSuccess,
  selectedDate,
  existingWorkout,
}) => {
  const [form] = Form.useForm();
  const [selectedMuscleGroups, setSelectedMuscleGroups] = React.useState<MuscleGroup[]>([]);
  const [completed, setCompleted] = React.useState(false);
  const [isRestDay, setIsRestDay] = React.useState(false); // 休息日開關
  const currentUser = auth.currentUser;

  const { mutate: createWorkout, isLoading: createLoading } = useCreate();
  const { mutate: updateWorkout, isLoading: updateLoading } = useUpdate();

  const isLoading = createLoading || updateLoading;

  // Determine if this is an update operation (either edit mode or existing workout)
  const isUpdateMode = mode === "edit" || !!existingWorkout;
  const targetWorkout = initialValues || existingWorkout;

  // Handle muscle group selection
  const handleMuscleGroupClick = (muscleGroup: MuscleGroup) => {
    if (isRestDay) return; // 休息日不能選肌肉群
    
    const newSelection = selectedMuscleGroups.includes(muscleGroup)
      ? selectedMuscleGroups.filter(mg => mg !== muscleGroup)
      : [...selectedMuscleGroups, muscleGroup];
    
    setSelectedMuscleGroups(newSelection);
    form.setFieldValue('muscleGroups', newSelection);
  };

  // Handle rest day toggle
  const handleRestDayToggle = (checked: boolean) => {
    setIsRestDay(checked);
    if (checked) {
      // 休息日清空所有肌肉群選擇
      setSelectedMuscleGroups([]);
      form.setFieldValue('muscleGroups', []);
    }
  };

  // Handle form submission
  const onFinish = async (values: any) => {
    if (!currentUser) {
      message.error("請先登入");
      return;
    }

    // 休息日或選擇肌肉群都可以
    if (!isRestDay && selectedMuscleGroups.length === 0) {
      message.error("請選擇至少一個訓練部位，或開啟休息日模式");
      return;
    }

    const workoutData = {
      ...values,
      userId: currentUser.uid,
      date: values.date.format("YYYY-MM-DD"),
      muscleGroups: isRestDay ? [] : selectedMuscleGroups,
      completed: completed,
      notes: values.notes || "",
      isRestDay: isRestDay,
    };

    if (isUpdateMode && targetWorkout?.id) {
      // 更新現有記錄
      updateWorkout(
        {
          resource: "workouts",
          id: targetWorkout.id,
          values: workoutData,
        },
        {
          onSuccess: () => {
            message.success("訓練計劃更新成功！");
            onSuccess?.();
          },
          onError: (error) => {
            console.error("更新失敗:", error);
            message.error("更新失敗，請重試");
          },
        }
      );
    } else {
      // 創建新記錄
      createWorkout(
        {
          resource: "workouts",
          values: workoutData,
        },
        {
          onSuccess: () => {
            message.success("訓練計劃創建成功！");
            form.resetFields();
            setSelectedMuscleGroups([]);
            setCompleted(false);
            setIsRestDay(false);
            onSuccess?.();
          },
          onError: (error) => {
            console.error("創建失敗:", error);
            message.error("創建失敗，請重試");
          },
        }
      );
    }
  };

  // Set initial form values
  React.useEffect(() => {
    if (targetWorkout) {
      // 編輯模式或已有記錄 - 填充現有數據
      form.setFieldsValue({
        ...targetWorkout,
        date: dayjs(targetWorkout.date),
        notes: targetWorkout.notes || "",
      });
      setSelectedMuscleGroups(targetWorkout.muscleGroups || []);
      setCompleted(targetWorkout.completed || false);
      setIsRestDay((targetWorkout as any).isRestDay || (targetWorkout.muscleGroups?.length === 0));
    } else if (selectedDate) {
      // 新建模式 - 設置選中的日期
      form.setFieldsValue({
        date: dayjs(selectedDate),
        notes: "",
      });
      setSelectedMuscleGroups([]);
      setCompleted(false);
      setIsRestDay(false);
    }
  }, [targetWorkout, selectedDate, form]);

  const getTitle = () => {
    if (isUpdateMode) {
      return existingWorkout ? "修改訓練計劃" : "編輯訓練記錄";
    }
    return "新增訓練計劃";
  };

  return (
    <Card 
      title={getTitle()}
      style={{ margin: "16px 0" }}
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

        {/* 休息日開關 */}
        <Form.Item label="訓練類型">
          <Card
            size="small"
            style={{
              border: isRestDay ? "2px solid #52c41a" : "2px solid #d9d9d9",
              backgroundColor: isRestDay ? "#f6ffed" : "#fafafa",
              borderRadius: "8px"
            }}
            bodyStyle={{ padding: "12px 16px" }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
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
          </Card>
        </Form.Item>

        {!isRestDay && (
          <Form.Item
            name="muscleGroups"
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
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        opacity: isRestDay ? 0.5 : 1,
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
                    </Card>
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
                ? "記錄休息感受、原因等...&#10;例如：&#10;- 昨天練太累，今天休息&#10;- 感覺有點感冒，先休息一天&#10;- 主動休息日，為明天的訓練做準備"
                : "記錄訓練內容、重量、組數、感受等詳細信息...&#10;例如：&#10;- 臥推 60kg × 8 × 3組&#10;- 飛鳥 15kg × 12 × 3組&#10;- 今天狀態不錯，力量有提升"
            }
            rows={6}
            maxLength={1000}
            showCount
            size="large"
          />
        </Form.Item>

        <Form.Item label="完成狀態">
          <Card
            size="small"
            style={{
              cursor: "pointer",
              border: completed ? "2px solid #52c41a" : "2px solid #d9d9d9",
              backgroundColor: completed ? "#f6ffed" : "#fafafa",
              borderRadius: "8px"
            }}
            onClick={() => {
              setCompleted(!completed);
            }}
            bodyStyle={{ padding: "12px 16px" }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
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
          </Card>
        </Form.Item>

        <Form.Item style={{ marginTop: "24px" }}>
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={isLoading}
            size="large"
            block
            style={{
              height: "50px",
              fontSize: "16px",
              fontWeight: "bold",
              borderRadius: "8px"
            }}
          >
            {isUpdateMode 
              ? (isRestDay ? "📝 更新休息計劃" : "📝 更新訓練計劃")
              : (isRestDay ? "🚀 創建休息計劃" : "🚀 創建訓練計劃")
            }
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default WorkoutForm;
