import React, { useState, useRef, useEffect } from "react";
import { Badge, Card, Tag, Tooltip, Row, Col, Button } from "antd";
import { LeftOutlined, RightOutlined, CalendarOutlined } from "@ant-design/icons";
import { useList } from "@refinedev/core";
import dayjs, { Dayjs } from "dayjs";
import { WorkoutRecord, MuscleGroup } from "../types";
import { getMuscleGroupConfig } from "../config/muscleGroups";
import { auth } from "../config/firebase";
import { getEffectiveCompletionStatus } from "../utils/dateUtils";

interface WeeklyCalendarProps {
  onDateSelect?: (date: string, existingWorkout?: WorkoutRecord) => void;
}

const WeeklyCalendar: React.FC<WeeklyCalendarProps> = ({ onDateSelect }) => {
  const [currentWeek, setCurrentWeek] = useState<Dayjs>(dayjs().startOf('week'));
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [startY, setStartY] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const currentUser = auth.currentUser;

  // Fetch workout records for current user
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
      pageSize: 500,
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

  // Generate week dates (Monday to Sunday)
  const weekDates = React.useMemo(() => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      dates.push(currentWeek.clone().add(i, 'day'));
    }
    return dates;
  }, [currentWeek]);

  // Handle date click
  const handleDateClick = (date: Dayjs) => {
    setSelectedDate(date);
    const dateString = date.format("YYYY-MM-DD");
    const existingWorkout = workoutMap.get(dateString);
    onDateSelect?.(dateString, existingWorkout);
  };

  // Navigation functions
  const goToPreviousWeek = () => {
    setCurrentWeek(prev => prev.subtract(1, 'week'));
  };

  const goToNextWeek = () => {
    setCurrentWeek(prev => prev.add(1, 'week'));
  };

  const goToCurrentWeek = () => {
    setCurrentWeek(dayjs().startOf('week'));
  };

  // Touch/Mouse event handlers for swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setStartY(e.touches[0].clientY);
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    e.preventDefault(); // Prevent scrolling
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    const endY = e.changedTouches[0].clientY;
    const deltaY = startY - endY;
    const threshold = 50; // Minimum swipe distance
    
    if (Math.abs(deltaY) > threshold) {
      if (deltaY > 0) {
        // Swipe up - next week
        goToNextWeek();
      } else {
        // Swipe down - previous week
        goToPreviousWeek();
      }
    }
    
    setIsDragging(false);
  };

  // Mouse events for desktop
  const handleMouseDown = (e: React.MouseEvent) => {
    setStartY(e.clientY);
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const endY = e.clientY;
    const deltaY = startY - endY;
    const threshold = 30;
    
    if (Math.abs(deltaY) > threshold) {
      if (deltaY > 0) {
        goToNextWeek();
      } else {
        goToPreviousWeek();
      }
    }
    
    setIsDragging(false);
  };

  // Render day cell
  const renderDayCell = (date: Dayjs) => {
    const dateString = date.format("YYYY-MM-DD");
    const workout = workoutMap.get(dateString);
    const isToday = date.isSame(dayjs(), 'day');
    const isSelected = selectedDate && date.isSame(selectedDate, 'day');

    return (
      <div
        key={dateString}
        onClick={() => handleDateClick(date)}
        style={{
          padding: "12px",
          border: isSelected ? "2px solid #1890ff" : "1px solid #f0f0f0",
          borderRadius: "8px",
          cursor: "pointer",
          backgroundColor: isToday ? "#e6f7ff" : (isSelected ? "#f0f8ff" : "#fff"),
          minHeight: "120px",
          transition: "all 0.2s ease",
          position: "relative",
        }}
        className="day-cell"
      >
        {/* Date header */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "8px"
        }}>
          <div style={{
            fontSize: "16px",
            fontWeight: isToday ? "bold" : "normal",
            color: isToday ? "#1890ff" : "#333"
          }}>
            {date.format("DD")}
          </div>
          <div style={{ fontSize: "12px", color: "#999" }}>
            {date.format("ddd")}
          </div>
        </div>

        {/* Workout info */}
        {workout && (
          <div>
            {/* Muscle groups */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "2px", marginBottom: "4px" }}>
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
                        borderRadius: "3px",
                      }}
                    >
                      {config.icon}
                    </Tag>
                  </Tooltip>
                );
              })}
            </div>

            {/* Cardio details */}
            {workout.cardioDetails && (
              <div style={{ fontSize: "11px", color: "#666", marginBottom: "4px" }}>
                {workout.cardioDetails.type}
                {workout.cardioDetails.distance && ` ${workout.cardioDetails.distance}km`}
                {workout.cardioDetails.duration && ` ${workout.cardioDetails.duration}min`}
              </div>
            )}

            {/* Completion status */}
            {getEffectiveCompletionStatus(workout) && (
              <Badge
                status="success"
                style={{
                  position: "absolute",
                  top: "4px",
                  right: "4px",
                }}
              />
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <Card 
      title={
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span>📅 週視圖</span>
          <div>
            <Button
              icon={<LeftOutlined />}
              onClick={goToPreviousWeek}
              size="small"
              style={{ marginRight: "8px" }}
            />
            <Button
              icon={<CalendarOutlined />}
              onClick={goToCurrentWeek}
              size="small"
              style={{ marginRight: "8px" }}
            >
              今週
            </Button>
            <Button
              icon={<RightOutlined />}
              onClick={goToNextWeek}
              size="small"
            />
          </div>
        </div>
      }
      loading={isLoading}
      style={{ margin: "16px 0" }}
    >
      <div style={{ marginBottom: "16px", textAlign: "center", color: "#666" }}>
        {currentWeek.format("YYYY年MM月DD日")} - {currentWeek.clone().add(6, 'day').format("MM月DD日")}
      </div>

      <div style={{ marginBottom: "8px", fontSize: "12px", color: "#999", textAlign: "center" }}>
        💡 提示：向上滑動查看下週，向下滑動查看上週
      </div>

      <div
        ref={containerRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{
          userSelect: "none",
          touchAction: "none",
        }}
      >
        <Row gutter={[8, 8]}>
          {weekDates.map((date) => (
            <Col key={date.format("YYYY-MM-DD")} span={24 / 7} style={{ minWidth: "120px" }}>
              {renderDayCell(date)}
            </Col>
          ))}
        </Row>
      </div>

      {/* Selected date info */}
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
                  {workout.muscleGroups.length > 0 && (
                    <div>
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
                    </div>
                  )}
                  {workout.cardioDetails && (
                    <div style={{ marginTop: "8px" }}>
                      <p><strong>有氧運動:</strong> {workout.cardioDetails.type}</p>
                      {workout.cardioDetails.distance && (
                        <p><strong>距離:</strong> {workout.cardioDetails.distance} 公里</p>
                      )}
                      {workout.cardioDetails.duration && (
                        <p><strong>時間:</strong> {workout.cardioDetails.duration} 分鐘</p>
                      )}
                      {workout.cardioDetails.calories && (
                        <p><strong>卡路里:</strong> {workout.cardioDetails.calories} 大卡</p>
                      )}
                    </div>
                  )}
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

export default WeeklyCalendar;
