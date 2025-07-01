import React, { useState } from "react";
import { Calendar, Badge, Card, Tag, Tooltip } from "antd";
import { useList } from "@refinedev/core";
import dayjs, { Dayjs } from "dayjs";
import { WorkoutRecord, MuscleGroup } from "../types";
import { getMuscleGroupConfig } from "../config/muscleGroups";
import { auth } from "../config/firebase";
import { getEffectiveCompletionStatus } from "../utils/dateUtils";

interface WorkoutCalendarProps {
  onDateSelect?: (date: string, existingWorkout?: WorkoutRecord) => void;
}

const WorkoutCalendar: React.FC<WorkoutCalendarProps> = ({ onDateSelect }) => {
  const [currentMonth, setCurrentMonth] = useState<Dayjs>(dayjs());
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const currentUser = auth.currentUser;

  // Fetch workout records for current user - expand date range to cover multiple months
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
      pageSize: 500, // Get more records to cover multiple months
    },
  });

  // Convert workout data to a map for quick lookup
  const workoutMap = React.useMemo(() => {
    const map = new Map<string, WorkoutRecord>();
    workoutData?.data?.forEach((workout) => {
      map.set(workout.date, workout);
    });
    return map;
  }, [workoutData]);

  // Handle date cell click
  const handleDateClick = (date: Dayjs) => {
    setSelectedDate(date);
    
    const dateString = date.format("YYYY-MM-DD");
    const existingWorkout = workoutMap.get(dateString);
    
    // Trigger callback for date selection
    onDateSelect?.(dateString, existingWorkout);
  };

  // Render cell content for each date
  const dateCellRender = (date: Dayjs) => {
    const dateString = date.format("YYYY-MM-DD");
    const workout = workoutMap.get(dateString);

    return (
      <div 
        style={{ 
          fontSize: "12px",
          height: "100%",
          cursor: "pointer",
          position: "relative"
        }}
        onClick={() => handleDateClick(date)}
      >
        {workout && (
          <>
            {workout.muscleGroups.map((muscleGroup) => {
              const config = getMuscleGroupConfig(muscleGroup);
              return (
                <Tooltip key={muscleGroup} title={config.label}>
                  <Tag
                    color={config.color}
                    style={{
                      fontSize: "10px",
                      padding: "1px 4px",
                      margin: "1px",
                      borderRadius: "2px",
                    }}
                  >
                    {config.icon}
                  </Tag>
                </Tooltip>
              );
            })}
            {getEffectiveCompletionStatus(workout) && (
              <Badge
                status="success"
                style={{
                  position: "absolute",
                  top: "2px",
                  right: "2px",
                }}
              />
            )}
          </>
        )}
      </div>
    );
  };

  return (
    <Card 
      title="健身日曆" 
      loading={isLoading}
      style={{ margin: "16px 0" }}
    >
      <Calendar
        dateCellRender={dateCellRender}
        value={currentMonth}
        mode="month"
        fullscreen={true}
        // 移除 onSelect，改用自定義的點擊處理
        headerRender={({ value, onChange }) => {
          const year = value.year();
          const month = value.month();
          
          // 中文月份名稱
          const monthNames = [
            '1月', '2月', '3月', '4月', '5月', '6月',
            '7月', '8月', '9月', '10月', '11月', '12月'
          ];
          
          const monthOptions = monthNames.map((monthName, index) => (
            <option key={index} value={index}>
              {monthName}
            </option>
          ));
          
          const yearOptions = [];
          for (let i = year - 10; i < year + 10; i += 1) {
            yearOptions.push(
              <option key={i} value={i}>
                {i}年
              </option>
            );
          }
          
          return (
            <div style={{ padding: '10px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '16px', fontWeight: 'bold' }}>
                💪 健身日曆
              </div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <select
                  value={year}
                  onChange={e => {
                    const newYear = parseInt(e.target.value, 10);
                    const newDate = value.clone().year(newYear);
                    setCurrentMonth(newDate);
                    // 阻止事件冒泡
                    e.stopPropagation();
                  }}
                  onClick={e => e.stopPropagation()}
                  style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    border: '1px solid #d9d9d9',
                    fontSize: '14px',
                    minWidth: '70px'
                  }}
                >
                  {yearOptions}
                </select>
                <select
                  value={month}
                  onChange={e => {
                    const newMonth = parseInt(e.target.value, 10);
                    const newDate = value.clone().month(newMonth);
                    setCurrentMonth(newDate);
                    // 阻止事件冒泡
                    e.stopPropagation();
                  }}
                  onClick={e => e.stopPropagation()}
                  style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    border: '1px solid #d9d9d9',
                    fontSize: '14px',
                    minWidth: '60px'
                  }}
                >
                  {monthOptions}
                </select>
              </div>
            </div>
          );
        }}
      />
      
      {/* Display selected date info */}
      {selectedDate && (
        <div style={{ marginTop: "16px", padding: "12px", backgroundColor: "#f5f5f5", borderRadius: "6px" }}>
          <h4>選中日期: {selectedDate.format("YYYY年MM月DD日")}</h4>
          {(() => {
            const dateString = selectedDate.format("YYYY-MM-DD");
            const workout = workoutMap.get(dateString);
            
            if (workout) {
              return (
                <div>
                  <p style={{ color: "#1890ff", fontWeight: "bold" }}>
                    📝 此日期已有訓練計劃 - 點擊「新增訓練」可以修改
                  </p>
                  <p>計劃訓練部位:</p>
                  <div>
                    {workout.muscleGroups.map((muscleGroup) => {
                      const config = getMuscleGroupConfig(muscleGroup);
                      return (
                        <Tag key={muscleGroup} color={config.color}>
                          {config.icon} {config.label}
                        </Tag>
                      );
                    })}
                  </div>
                  {workout.notes && (
                    <p style={{ marginTop: "8px" }}>
                      <strong>備註:</strong> {workout.notes}
                    </p>
                  )}
                  <p style={{ marginTop: "8px" }}>
                    <strong>狀態:</strong>{" "}
                    <Badge
                      status={getEffectiveCompletionStatus(workout) ? "success" : "processing"}
                      text={getEffectiveCompletionStatus(workout) ? 
                        (workout.isRestDay ? "已休息" : "已訓練") : 
                        (workout.isRestDay ? "計劃休息" : "計劃中")
                      }
                    />
                  </p>
                </div>
              );
            } else {
              return (
                <div>
                  <p style={{ color: "#52c41a", fontWeight: "bold" }}>
                    ✨ 此日期無訓練計劃 - 點擊「新增訓練」可以建立新計劃
                  </p>
                </div>
              );
            }
          })()}
        </div>
      )}
    </Card>
  );
};

export default WorkoutCalendar;
