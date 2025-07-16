import React from "react";
import { Form, Input, DatePicker, Button, Card, message, Row, Col, Switch, Select, InputNumber, Divider, Modal } from "antd";
import { useCreate, useUpdate, useOne } from "@refinedev/core";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import dayjs from "dayjs";
import { WorkoutRecord, MuscleGroup } from "../types";
import { auth } from "../config/firebase";
import { deleteField } from "firebase/firestore";

interface WorkoutFormProps {
  mode: "create" | "edit";
}

// Define interface for workout data with cardio details
interface WorkoutData {
  userId: string;
  date: string;
  muscleGroups: MuscleGroup[];
  completed: boolean;
  notes: string;
  isRestDay: boolean;
  cardioDetails?: any;
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

// Cardio types configuration
const cardioTypesConfig = [
  { label: "跑步", value: "running", emoji: "🏃", unit: "公里" },
  { label: "籃球", value: "basketball", emoji: "🏀", unit: "分鐘" },
  { label: "壁球", value: "squash", emoji: "🎾", unit: "分鐘" },
  { label: "保齡球", value: "bowling", emoji: "🎳", unit: "局" },
  { label: "游泳", value: "swimming", emoji: "🏊", unit: "圈" },
  { label: "騎車", value: "cycling", emoji: "🚴", unit: "公里" },
  { label: "跳繩", value: "rope", emoji: "🪢", unit: "分鐘" },
  { label: "健走", value: "walking", emoji: "🚶", unit: "公里" },
  { label: "瑜伽", value: "yoga", emoji: "🧘", unit: "分鐘" },
  { label: "其他", value: "other", emoji: "🏃", unit: "分鐘" },
];

const { Option } = Select;

const WorkoutForm: React.FC<WorkoutFormProps> = ({ mode }) => {
  const [form] = Form.useForm();
  const [selectedMuscleGroups, setSelectedMuscleGroups] = React.useState<MuscleGroup[]>([]);
  const [completed, setCompleted] = React.useState(false);
  const [isRestDay, setIsRestDay] = React.useState(false);
  const [hasCardio, setHasCardio] = React.useState(false);
  const [cardioDetails, setCardioDetails] = React.useState({
    type: '',
    duration: null as number | null,
    distance: null as number | null,
    calories: null as number | null,
    notes: ''
  });

  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const currentUser = auth.currentUser;
  
  // Get pre-selected muscle group from URL if any
  const preSelectedMuscle = searchParams.get('muscle') as MuscleGroup;

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

  // Handle muscle group selection with quick save option
  const handleMuscleGroupClick = (muscleGroup: MuscleGroup) => {
    if (isRestDay) return;

    const isCurrentlySelected = selectedMuscleGroups.includes(muscleGroup);
    
    // If this is a new mode (create) and we're selecting a muscle group (not deselecting)
    // and the selected date is today, ask if user wants to quick save
    const selectedFormDate = form.getFieldValue('date');
    const isToday = selectedFormDate && selectedFormDate.format('YYYY-MM-DD') === dayjs().format('YYYY-MM-DD');
    
    if (mode === 'create' && !isCurrentlySelected && isToday) {
      const muscleConfig = muscleGroupsConfig.find(config => config.key === muscleGroup);
      
      Modal.confirm({
        title: '快速保存今日訓練',
        content: (
          <div>
            <p>你選擇了 <strong style={{color: muscleConfig?.color}}>{muscleConfig?.emoji} {muscleConfig?.label}</strong></p>
            <p>是否要直接保存為今天的訓練計劃？</p>
          </div>
        ),
        okText: '是，直接保存',
        cancelText: '否，繼續編輯',
        onOk: async () => {
          // Quick save with selected muscle group
          if (!currentUser) {
            message.error('請先登入');
            return;
          }
          
          const quickSaveData = {
            userId: currentUser.uid,
            date: dayjs().format('YYYY-MM-DD'),
            muscleGroups: [muscleGroup],
            completed: false,
            notes: `快速保存 - ${muscleConfig?.label}訓練`,
            isRestDay: false,
          };
          
          createWorkout(
            {
              resource: 'workouts',
              values: quickSaveData,
            },
            {
              onSuccess: () => {
                message.success(`${muscleConfig?.emoji} ${muscleConfig?.label}訓練計劃已保存！`);
                navigate('/calendar');
              },
              onError: (error) => {
                const errorMessage = error?.message || error?.toString() || 'Unknown error';
                message.error(`保存失敗：${errorMessage}`);
              },
            }
          );
        },
        onCancel: () => {
          // Continue with normal selection behavior
          const newSelection = [...selectedMuscleGroups, muscleGroup];
          setSelectedMuscleGroups(newSelection);
          setTimeout(() => {
            form.setFieldValue('muscleGroups', newSelection);
          }, 0);
        },
      });
    } else {
      // Normal selection behavior
      const newSelection = isCurrentlySelected
        ? selectedMuscleGroups.filter(mg => mg !== muscleGroup)
        : [...selectedMuscleGroups, muscleGroup];

      setSelectedMuscleGroups(newSelection);
      // Use setTimeout to avoid circular reference issues
      setTimeout(() => {
        form.setFieldValue('muscleGroups', newSelection);
      }, 0);
    }
  };

  // Handle rest day toggle
  const handleRestDayToggle = (checked: boolean) => {
    if (checked && hasCardio) {
      message.warning("有有氧運動時不能設為休息日，請先關閉有氧訓練");
      return;
    }

    setIsRestDay(checked);
    if (checked) {
      setSelectedMuscleGroups([]);
      // Use setTimeout to avoid circular reference issues
      setTimeout(() => {
        form.setFieldValue('muscleGroups', []);
      }, 0);
    }
  };

  // Handle cardio toggle
  const handleCardioToggle = (checked: boolean) => {
    setHasCardio(checked);
    if (checked) {
      setIsRestDay(false);
    } else {
      setCardioDetails({
        type: '',
        duration: null,
        distance: null,
        calories: null,
        notes: ''
      });
    }
  };

  // Handle cardio details change
  const handleCardioChange = (field: string, value: any) => {
    setCardioDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Get current cardio type config
  const getCurrentCardioConfig = () => {
    return cardioTypesConfig.find(config => config.value === cardioDetails.type);
  };

  // Clean data for Firebase (remove undefined values and handle deleteField)
  const cleanDataForFirebase = (data: any) => {
    const cleaned: any = {};
    
    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          // Handle arrays
          cleaned[key] = value;
        } else if (typeof value === 'object' && value.constructor === Object) {
          // Recursively clean nested objects
          const cleanedNestedObject = cleanDataForFirebase(value);
          if (Object.keys(cleanedNestedObject).length > 0) {
            cleaned[key] = cleanedNestedObject;
          }
        } else {
          cleaned[key] = value;
        }
      } else if (value && typeof value === 'object' && value.constructor && value.constructor.name === 'FieldValue') {
        // Special case for deleteField and other Firestore special values
        cleaned[key] = value;
      }
    }
    
    return cleaned;
  };

  // Handle form submission
  const onFinish = async (values: any) => {
    console.log('Form submission started with values:', values); // Debug log
    
    try {
      // Validation checks
      if (!currentUser) {
        message.error("請先登入");
        return;
      }

      if (!isRestDay && selectedMuscleGroups.length === 0 && !hasCardio) {
        message.error("請選擇至少一個訓練部位、有氧訓練，或開啟休息日模式");
        return;
      }

      if (hasCardio && !cardioDetails.type) {
        message.error("請選擇有氧訓練類型");
        return;
      }

      console.log('Validation passed, proceeding with submission...'); // Debug log

      // Prepare base workout data
      const baseWorkoutData: WorkoutData = {
        userId: currentUser.uid,
        date: values.date.format("YYYY-MM-DD"),
        muscleGroups: (() => {
          if (isRestDay) {
            return [];
          } else {
            const groups = [...selectedMuscleGroups];
            if (hasCardio) {
              groups.push(MuscleGroup.CARDIO);
            }
            return groups;
          }
        })(),
        completed: completed,
        notes: values.notes || "",
        isRestDay: isRestDay,
      };

      // Handle cardio details
      let workoutData: WorkoutData = { ...baseWorkoutData };

      if (hasCardio && cardioDetails.type) {
        const cardioData: any = {
          type: cardioDetails.type
        };

        // Only add numeric fields if they have valid values
        if (typeof cardioDetails.duration === 'number' && cardioDetails.duration > 0) {
          cardioData.duration = cardioDetails.duration;
        }
        if (typeof cardioDetails.distance === 'number' && cardioDetails.distance > 0) {
          cardioData.distance = cardioDetails.distance;
        }
        if (typeof cardioDetails.calories === 'number' && cardioDetails.calories > 0) {
          cardioData.calories = cardioDetails.calories;
        }
        if (cardioDetails.notes && cardioDetails.notes.trim().length > 0) {
          cardioData.notes = cardioDetails.notes.trim();
        }

        workoutData.cardioDetails = cardioData;
      } else if (mode === "edit" && existingWorkout?.id) {
        // For edit mode, explicitly delete cardioDetails if no cardio
        workoutData.cardioDetails = deleteField() as any;
      }

      // Clean the data
      const cleanedData = cleanDataForFirebase(workoutData);

      console.log("Submitting workout data:", cleanedData); // Debug log

      if (mode === "edit" && existingWorkout?.id) {
        // Update existing record
        updateWorkout(
          {
            resource: "workouts",
            id: existingWorkout.id,
            values: cleanedData,
          },
          {
            onSuccess: (data) => {
              console.log("Update success:", data); // Debug log
              message.success("訓練計劃更新成功！");
              // Navigate to calendar
              setTimeout(() => {
                navigate('/calendar');
              }, 500);
            },
            onError: (error) => {
              console.error("Update error:", error); // Debug log
              const errorMessage = error?.message || error?.toString() || 'Unknown error';
              message.error(`更新失敗：${errorMessage}`);
            },
          }
        );
      } else {
        // Create new record
        createWorkout(
          {
            resource: "workouts",
            values: cleanedData,
          },
          {
            onSuccess: (data) => {
              console.log("Create success:", data); // Debug log
              message.success("訓練計劃創建成功！");
              
              // Reset form
              form.resetFields();
              setSelectedMuscleGroups([]);
              setCompleted(false);
              setIsRestDay(false);
              setHasCardio(false);
              setCardioDetails({
                type: '',
                duration: null,
                distance: null,
                calories: null,
                notes: ''
              });
              
              // Navigate to calendar
              setTimeout(() => {
                navigate('/calendar');
              }, 500);
            },
            onError: (error) => {
              console.error("Create error:", error); // Debug log
              const errorMessage = error?.message || error?.toString() || 'Unknown error';
              message.error(`創建失敗：${errorMessage}`);
            },
          }
        );
      }
    } catch (error) {
      console.error("Form submission error:", error); // Debug log
      const errorMessage = error instanceof Error ? error.message : '未知錯誤';
      message.error(`提交失敗：${errorMessage}，請重試`);
    }
  };

  // Set initial form values
  React.useEffect(() => {
    if (existingWorkout) {
      // Edit mode - populate existing data
      form.setFieldsValue({
        ...existingWorkout,
        date: dayjs(existingWorkout.date),
        notes: existingWorkout.notes || "",
      });
      const filteredMuscleGroups = (existingWorkout.muscleGroups || []).filter(mg => mg !== MuscleGroup.CARDIO);
      setSelectedMuscleGroups(filteredMuscleGroups);
      setCompleted(existingWorkout.completed || false);
      setIsRestDay((existingWorkout as any).isRestDay || false);

      // Set cardio training status
      const hasCardioInGroups = (existingWorkout.muscleGroups || []).includes(MuscleGroup.CARDIO);
      const hasCardioDetails = !!(existingWorkout as any).cardioDetails;
      const shouldHaveCardio = hasCardioInGroups || hasCardioDetails;

      setHasCardio(shouldHaveCardio);
      if (shouldHaveCardio && (existingWorkout as any).cardioDetails) {
        const existingCardio = (existingWorkout as any).cardioDetails;
        setCardioDetails({
          type: existingCardio.type || '',
          duration: existingCardio.duration || null,
          distance: existingCardio.distance || null,
          calories: existingCardio.calories || null,
          notes: existingCardio.notes || ''
        });
      }
    } else {
      // New mode - check for URL parameters
      const preSelectedMuscle = searchParams.get('muscle') as MuscleGroup;
      const initialMuscleGroups = preSelectedMuscle && Object.values(MuscleGroup).includes(preSelectedMuscle) 
        ? [preSelectedMuscle] 
        : [];
      
      if (selectedDate) {
        // New mode with selected date
        form.setFieldsValue({
          date: dayjs(selectedDate),
          notes: "",
          muscleGroups: initialMuscleGroups,
        });
      } else {
        // New mode without selected date
        form.setFieldsValue({
          date: dayjs(),
          notes: "",
          muscleGroups: initialMuscleGroups,
        });
      }
      
      setSelectedMuscleGroups(initialMuscleGroups);
      setCompleted(false);
      setIsRestDay(false);
      setHasCardio(false);
    }
  }, [existingWorkout, selectedDate, searchParams, form]);

  const getTitle = () => {
    if (mode === "edit") {
      return "編輯訓練記錄";
    }
    return "新增訓練計劃";
  };

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
          <Card
          size="small"
          style={{
          border: isRestDay ? "2px solid #52c41a" : "2px solid #d9d9d9",
          backgroundColor: isRestDay ? "#f6ffed" : "#fafafa",
          borderRadius: "8px"
          }}
          styles={{ body: { padding: "12px 16px" } }}
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
                      styles={{
                        body: {
                          padding: "16px 8px",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          height: "100%"
                        }
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

        {/* Cardio training section - only show when not rest day */}
        {!isRestDay && (
          <Form.Item label="有氧訓練">
            <Card
              size="small"
              style={{
                border: hasCardio ? "2px solid #ff7a45" : "2px solid #d9d9d9",
                backgroundColor: hasCardio ? "#fff7e6" : "#fafafa",
                borderRadius: "8px"
              }}
              styles={{ body: { padding: "12px 16px" } }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: hasCardio ? "16px" : "0" }}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <div style={{
                    fontSize: "20px",
                    marginRight: "12px"
                  }}>
                    {hasCardio ? "🏃" : "🚶"}
                  </div>
                  <div>
                    <div style={{
                      fontWeight: "bold",
                      color: hasCardio ? "#ff7a45" : "#666"
                    }}>
                      {hasCardio ? "有氧訓練" : "無有氧訓練"}
                    </div>
                    <div style={{ fontSize: "12px", color: "#999" }}>
                      {hasCardio ? "記錄你的有氧運動" : "點擊開啟有氧訓練"}
                    </div>
                  </div>
                </div>
                <Switch
                  checked={hasCardio}
                  onChange={handleCardioToggle}
                  checkedChildren="有氧"
                  unCheckedChildren="無"
                />
              </div>

              {hasCardio && (
                <div style={{ paddingTop: "16px", borderTop: "1px solid #f0f0f0" }}>
                  {/* Exercise type selection */}
                  <Row gutter={[16, 16]}>
                    <Col span={24}>
                      <div style={{ marginBottom: "8px", fontWeight: "bold" }}>運動類型</div>
                      <Select
                        placeholder="選擇有氧運動類型"
                        value={cardioDetails.type}
                        onChange={(value) => handleCardioChange('type', value)}
                        style={{ width: '100%' }}
                        size="large"
                      >
                        {cardioTypesConfig.map(type => (
                          <Option key={type.value} value={type.value}>
                            <span style={{ marginRight: '8px' }}>{type.emoji}</span>
                            {type.label}
                          </Option>
                        ))}
                      </Select>
                    </Col>
                  </Row>

                  {cardioDetails.type && (
                    <>
                      <Divider style={{ margin: '16px 0' }} />
                      <Row gutter={[16, 16]}>
                        {/* Time/Distance */}
                        <Col xs={24} sm={12}>
                          <div style={{ marginBottom: "8px", fontWeight: "bold" }}>
                            {getCurrentCardioConfig()?.unit === '公里' || getCurrentCardioConfig()?.unit === '圈' ?
                              `距離 (${getCurrentCardioConfig()?.unit})` :
                              `時間 (${getCurrentCardioConfig()?.unit})`
                            }
                          </div>
                          <InputNumber
                            placeholder={getCurrentCardioConfig()?.unit === '公里' || getCurrentCardioConfig()?.unit === '圈' ? '輸入距離' : '輸入時間'}
                            value={getCurrentCardioConfig()?.unit === '公里' || getCurrentCardioConfig()?.unit === '圈' ? cardioDetails.distance : cardioDetails.duration}
                            onChange={(value) => {
                              if (getCurrentCardioConfig()?.unit === '公里' || getCurrentCardioConfig()?.unit === '圈') {
                                handleCardioChange('distance', value);
                              } else {
                                handleCardioChange('duration', value);
                              }
                            }}
                            style={{ width: '100%' }}
                            min={0}
                            step={getCurrentCardioConfig()?.unit === '公里' ? 0.1 : 1}
                            addonAfter={getCurrentCardioConfig()?.unit}
                            size="large"
                          />
                        </Col>

                        {/* Calories */}
                        <Col xs={24} sm={12}>
                          <div style={{ marginBottom: "8px", fontWeight: "bold" }}>消耗熱量 (卡路里)</div>
                          <InputNumber
                            placeholder="選填"
                            value={cardioDetails.calories}
                            onChange={(value) => handleCardioChange('calories', value)}
                            style={{ width: '100%' }}
                            min={0}
                            addonAfter="kcal"
                            size="large"
                          />
                        </Col>
                      </Row>

                      {/* Cardio notes */}
                      <div style={{ marginTop: "16px" }}>
                        <div style={{ marginBottom: "8px", fontWeight: "bold" }}>有氧運動備註</div>
                        <Input.TextArea
                          placeholder={`記錄${getCurrentCardioConfig()?.label}的詳細情況...\n例如：\n- 速度、強度\n- 身體感受\n- 場地、天氣\n- 搭檔或對手`}
                          value={cardioDetails.notes}
                          onChange={(e) => handleCardioChange('notes', e.target.value)}
                          rows={3}
                          maxLength={500}
                          showCount
                        />
                      </div>
                    </>
                  )}
                </div>
              )}
            </Card>
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
            styles={{ body: { padding: "12px 16px" } }}
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
            disabled={isLoading || fetchLoading}
            size="large"
            block
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

export default WorkoutForm;