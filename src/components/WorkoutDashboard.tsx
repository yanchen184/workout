import React, { useMemo, useState } from "react";
import { Card, Row, Col, Tag, Space, Alert, Button, Modal, Slider, message } from "antd";
import { WarningOutlined, SettingOutlined } from "@ant-design/icons";
import { useList } from "@refinedev/core";
import dayjs from "dayjs";
import { WorkoutRecord, MuscleGroup } from "../types";
import { getMuscleGroupConfig } from "../config/muscleGroups";
import { auth } from "../config/firebase";
import { useSettings } from "../hooks/useSettings";
import { SettingKey } from "../types/settings";
import { getEffectiveCompletionStatus } from "../utils/dateUtils";

const WorkoutDashboard: React.FC = () => {
  const currentUser = auth.currentUser;
  const { getSetting, updateSetting } = useSettings();
  const [isSettingsModalVisible, setIsSettingsModalVisible] = useState(false);
  const [restDayWarning, setRestDayWarning] = useState(getSetting(SettingKey.REST_DAY_WARNING));

  // Fetch workout records for statistics
  const { data: workoutData, isLoading } = useList<WorkoutRecord>({
    resource: "workouts",
    filters: [
      {
        field: "userId",
        operator: "eq",
        value: currentUser?.uid,
      },
    ],
    pagination: {
      pageSize: 365, // Get a year's worth of data for statistics
    },
  });

  // Calculate muscle group last workout dates and warnings
  const muscleGroupStats = useMemo(() => {
    if (!workoutData?.data) {
      return {
        muscleGroups: [],
        restWarnings: [],
      };
    }

    const workouts = workoutData.data;
    const now = dayjs();
    const restDays = getSetting(SettingKey.REST_DAY_WARNING);

    // Calculate last workout date for each muscle group
    const muscleGroupLastWorkout = new Map<MuscleGroup, dayjs.Dayjs>();
    const restWarnings: Array<{muscleGroup: MuscleGroup, daysSinceLastWorkout: number}> = [];

    // Find last workout date for each muscle group
    workouts.forEach(workout => {
      if (getEffectiveCompletionStatus(workout) && !workout.isRestDay) {
        workout.muscleGroups.forEach(muscleGroup => {
          const workoutDate = dayjs(workout.date);
          const lastWorkout = muscleGroupLastWorkout.get(muscleGroup);
          if (!lastWorkout || workoutDate.isAfter(lastWorkout)) {
            muscleGroupLastWorkout.set(muscleGroup, workoutDate);
          }
        });
      }
    });

    // Create muscle group data with color coding
    const muscleGroups = Object.values(MuscleGroup).map(muscleGroup => {
      const config = getMuscleGroupConfig(muscleGroup);
      const lastWorkout = muscleGroupLastWorkout.get(muscleGroup);
      
      let daysSince: number;
      let status: 'never' | 'fresh' | 'okay' | 'warning' | 'urgent';
      let displayText: string;
      let bgColor: string;
      let textColor: string;
      
      if (!lastWorkout) {
        // Never worked out
        daysSince = 999;
        status = 'never';
        displayText = '從未練習';
        bgColor = '#f5f5f5';
        textColor = '#999';
      } else {
        daysSince = now.diff(lastWorkout, 'day');
        displayText = daysSince === 0 ? '今天' :
                     daysSince === 1 ? '昨天' :
                     `${daysSince} 天前`;
        
        if (daysSince === 0) {
          // Trained today
          status = 'fresh';
          bgColor = '#f6ffed';
          textColor = '#52c41a';
        } else if (daysSince <= 1) {
          // 1 day ago - very fresh
          status = 'fresh';
          bgColor = '#f6ffed';
          textColor = '#73d13d';
        } else if (daysSince <= restDays) {
          // Within rest period - okay
          status = 'okay';
          bgColor = '#fff7e6';
          textColor = '#fa8c16';
        } else if (daysSince <= restDays + 2) {
          // Just over rest period - warning
          status = 'warning';
          bgColor = '#fff2e8';
          textColor = '#fa541c';
        } else {
          // Way overdue - urgent
          status = 'urgent';
          bgColor = '#fff1f0';
          textColor = '#ff4d4f';
        }
      }

      // Add to warnings if needed
      if (daysSince >= restDays) {
        restWarnings.push({
          muscleGroup,
          daysSinceLastWorkout: daysSince
        });
      }

      return {
        muscleGroup,
        config,
        lastWorkout,
        daysSince,
        status,
        displayText,
        bgColor,
        textColor,
      };
    });

    // Sort by urgency (most urgent first)
    muscleGroups.sort((a, b) => {
      if (a.status === 'never' && b.status !== 'never') return -1;
      if (a.status !== 'never' && b.status === 'never') return 1;
      if (a.status === 'never' && b.status === 'never') return 0;
      return b.daysSince - a.daysSince;
    });

    return {
      muscleGroups,
      restWarnings,
    };
  }, [workoutData, getSetting(SettingKey.REST_DAY_WARNING)]);

  // Handle settings update
  const handleUpdateRestDayWarning = async () => {
    await updateSetting(SettingKey.REST_DAY_WARNING, restDayWarning);
    setIsSettingsModalVisible(false);
    message.success(`休息天數警告已設定為 ${restDayWarning} 天`);
  };

  return (
    <div style={{ padding: "16px 0" }}>
      {/* Rest Day Warnings */}
      {muscleGroupStats.restWarnings.length > 0 && (
        <Alert
          message="⚠️ 休息警告"
          description={
            <div>
              <p style={{ marginBottom: "8px" }}>以下部位已經超過 {getSetting(SettingKey.REST_DAY_WARNING)} 天沒有訓練：</p>
              <Space wrap>
                {muscleGroupStats.restWarnings.map(({ muscleGroup, daysSinceLastWorkout }) => {
                  const config = getMuscleGroupConfig(muscleGroup);
                  return (
                    <Tag 
                      key={muscleGroup} 
                      color="warning"
                      style={{ 
                        padding: "4px 8px",
                        fontSize: "12px"
                      }}
                    >
                      {config.icon} {config.label}: {daysSinceLastWorkout === 999 ? '從未練習' : `${daysSinceLastWorkout} 天`}
                    </Tag>
                  );
                })}
              </Space>
            </div>
          }
          type="warning"
          showIcon
          style={{ marginBottom: "16px" }}
          action={
            <Button 
              size="small" 
              onClick={() => setIsSettingsModalVisible(true)}
              icon={<SettingOutlined />}
            >
              設定
            </Button>
          }
        />
      )}

      {/* Muscle Groups Status */}
      <Card 
        title={
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span>💪 肌肉群訓練狀態</span>
            <Button 
              size="small" 
              type="text"
              onClick={() => setIsSettingsModalVisible(true)}
              icon={<SettingOutlined />}
            >
              警告設定
            </Button>
          </div>
        }
        loading={isLoading}
        style={{ margin: "16px 0" }}
      >
        <Row gutter={[16, 16]}>
          {muscleGroupStats.muscleGroups.map((item) => (
            <Col xs={24} sm={12} md={8} lg={6} key={item.muscleGroup}>
              <Card
                size="small"
                style={{
                  backgroundColor: item.bgColor,
                  border: `2px solid ${item.textColor}20`,
                  borderRadius: "12px",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                }}
                bodyStyle={{
                  padding: "16px",
                  textAlign: "center"
                }}
                hoverable
              >
                <div style={{ 
                  fontSize: "36px", 
                  marginBottom: "8px",
                  filter: item.status === 'never' ? "grayscale(70%)" : "none"
                }}>
                  {item.config.icon}
                </div>
                
                <div style={{ 
                  fontSize: "16px", 
                  fontWeight: "bold",
                  color: item.textColor,
                  marginBottom: "4px"
                }}>
                  {item.config.label}
                </div>
                
                <div style={{
                  fontSize: "14px",
                  color: item.textColor,
                  fontWeight: "bold",
                  marginBottom: "4px"
                }}>
                  {item.displayText}
                </div>
                
                {item.lastWorkout && (
                  <div style={{
                    fontSize: "11px",
                    color: "#999",
                  }}>
                    {item.lastWorkout.format("MM/DD")}
                  </div>
                )}
                
                {/* Status indicator */}
                <div style={{
                  position: "absolute",
                  top: "8px",
                  right: "8px",
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  backgroundColor: item.textColor,
                  opacity: 0.8
                }} />
              </Card>
            </Col>
          ))}
        </Row>
        
        {/* Legend */}
        <div style={{ 
          marginTop: "20px", 
          padding: "16px", 
          backgroundColor: "#fafafa", 
          borderRadius: "8px",
          fontSize: "12px"
        }}>
          <div style={{ fontWeight: "bold", marginBottom: "8px" }}>🎨 顏色說明：</div>
          <Space wrap>
            <Tag color="success">綠色：最近 1 天</Tag>
            <Tag color="warning">橙色：{getSetting(SettingKey.REST_DAY_WARNING)} 天內</Tag>
            <Tag color="volcano">深橙：剛過期</Tag>
            <Tag color="error">紅色：急需訓練</Tag>
            <Tag color="default">灰色：從未練習</Tag>
          </Space>
        </div>
      </Card>

      {/* Settings Modal */}
      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <SettingOutlined />
            休息天數警告設定
          </div>
        }
        open={isSettingsModalVisible}
        onCancel={() => setIsSettingsModalVisible(false)}
        onOk={handleUpdateRestDayWarning}
        okText="確定"
        cancelText="取消"
      >
        <div style={{ padding: "20px 0" }}>
          <div style={{ marginBottom: "20px" }}>
            <h4>多少天沒練習就提醒？</h4>
            <p style={{ color: "#666", fontSize: "14px" }}>
              當某個肌肉群超過設定天數沒有訓練時，會顯示警告提醒並改變顏色。
            </p>
          </div>
          
          <div style={{ marginBottom: "20px" }}>
            <Slider
              min={1}
              max={14}
              value={restDayWarning}
              onChange={setRestDayWarning}
              marks={{
                1: '1天',
                3: '3天',
                7: '1週',
                14: '2週'
              }}
              style={{ marginBottom: "10px" }}
            />
            <div style={{ textAlign: "center", fontSize: "16px", fontWeight: "bold" }}>
              {restDayWarning} 天
            </div>
          </div>

          <div style={{ 
            padding: "12px", 
            backgroundColor: "#f0f8ff", 
            borderRadius: "6px",
            border: "1px solid #d6e4ff"
          }}>
            <div style={{ fontSize: "14px", color: "#1890ff" }}>
              💡 建議設定：
            </div>
            <ul style={{ margin: "8px 0 0 16px", fontSize: "12px", color: "#666" }}>
              <li>初學者：2-3天（肌肉恢復較快）</li>
              <li>中級者：3-4天（適中的恢復時間）</li>
              <li>進階者：5-7天（需要更多恢復時間）</li>
            </ul>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default WorkoutDashboard;
