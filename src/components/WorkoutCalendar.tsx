import React, { useState, useRef, useEffect } from "react";
import { Calendar, Badge, Card, Tag, Tooltip, Button, Space } from "antd";
import { useList } from "@refinedev/core";
import { useNavigate, useSearchParams } from "react-router-dom";
import dayjs, { Dayjs } from "dayjs";
import { WorkoutRecord } from "../types";
import { getMuscleGroupConfig } from "../config/muscleGroups";
import { auth } from "../config/firebase";
import { getEffectiveCompletionStatus } from "../utils/dateUtils";
import { ArrowUpOutlined, ArrowDownOutlined, LeftOutlined, RightOutlined } from "@ant-design/icons";

const WorkoutCalendar: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState<Dayjs>(dayjs());
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [isScrollingUp, setIsScrollingUp] = useState(false);
  const [showPreviousWeek, setShowPreviousWeek] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);
  const currentUser = auth.currentUser;
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Handle URL parameters for date selection
  useEffect(() => {
    const dateParam = searchParams.get('date');
    if (dateParam) {
      const date = dayjs(dateParam);
      if (date.isValid()) {
        setSelectedDate(date);
        setCurrentMonth(date);
      }
    }
  }, [searchParams]);

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

  // Handle scroll event to show/hide previous week
  useEffect(() => {
    const handleScroll = (event: WheelEvent) => {
      if (!calendarRef.current) return;
      
      // Check if scrolling up
      if (event.deltaY < 0) {
        setIsScrollingUp(true);
        setShowPreviousWeek(true);
        
        // Hide after 3 seconds if not interacting
        const timer = setTimeout(() => {
          setIsScrollingUp(false);
          setShowPreviousWeek(false);
        }, 3000);
        
        return () => clearTimeout(timer);
      }
    };

    const calendarElement = calendarRef.current;
    if (calendarElement) {
      calendarElement.addEventListener('wheel', handleScroll, { passive: true });
      return () => {
        calendarElement.removeEventListener('wheel', handleScroll);
      };
    }
  }, []);

  // Get previous week data
  const getPreviousWeekData = () => {
    const today = dayjs();
    const previousWeek = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = today.subtract(i + 7, 'day');
      const dateString = date.format('YYYY-MM-DD');
      const workout = workoutMap.get(dateString);
      
      previousWeek.push({
        date,
        dateString,
        workout,
        isToday: date.isSame(today, 'day')
      });
    }
    
    return previousWeek;
  };

  // Handle week navigation
  const handlePreviousWeek = () => {
    const newMonth = currentMonth.subtract(1, 'week');
    setCurrentMonth(newMonth);
  };

  const handleNextWeek = () => {
    const newMonth = currentMonth.add(1, 'week');
    setCurrentMonth(newMonth);
  };

  // Handle date cell click
  const handleDateClick = (date: Dayjs) => {
    setSelectedDate(date);
    
    const dateString = date.format("YYYY-MM-DD");
    const existingWorkout = workoutMap.get(dateString);
    
    // Navigate to add/edit page with date parameter
    if (existingWorkout) {
      navigate(`/edit/${existingWorkout.id}?date=${dateString}`);
    } else {
      navigate(`/add?date=${dateString}`);
    }
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
          position: "relative",
          padding: "4px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center"
        }}
        onClick={() => handleDateClick(date)}
      >
        {workout && (
          <>
            <div style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "2px",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "40px"
            }}>
              {workout.muscleGroups.map((muscleGroup) => {
                const config = getMuscleGroupConfig(muscleGroup);
                return (
                  <Tooltip key={muscleGroup} title={config.label}>
                    <div
                      style={{
                        fontSize: "20px", // 放大圖片
                        margin: "1px",
                        filter: getEffectiveCompletionStatus(workout) ? "none" : "grayscale(0.5) opacity(0.7)",
                        transform: getEffectiveCompletionStatus(workout) ? "scale(1)" : "scale(0.9)",
                        transition: "all 0.2s ease"
                      }}
                    >
                      {config.icon}
                    </div>
                  </Tooltip>
                );
              })}
            </div>
            {/* 移除綠色點點，改用邊框或背景色來表示完成狀態 */}
            {getEffectiveCompletionStatus(workout) && (
              <div style={{
                position: "absolute",
                top: "0",
                left: "0",
                right: "0",
                bottom: "0",
                border: "2px solid #52c41a",
                borderRadius: "6px",
                pointerEvents: "none",
                opacity: 0.6
              }} />
            )}
          </>
        )}
      </div>
    );
  };

  return (
    <div ref={calendarRef} style={{ position: 'relative' }}>
      {/* Previous Week View - Slide down from top */}
      {showPreviousWeek && (
        <Card
          size="small"
          style={{
            position: 'absolute',
            top: isScrollingUp ? '0' : '-200px',
            left: '0',
            right: '0',
            zIndex: 1000,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '2px solid #1890ff',
            borderRadius: '8px',
            transition: 'all 0.3s ease-in-out',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)'
          }}
          title={
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ color: '#1890ff' }}>📅 上一週訓練記錄</span>
              <Space>
                <Button 
                  size="small" 
                  icon={<LeftOutlined />} 
                  onClick={handlePreviousWeek}
                  type="text"
                >
                  上週
                </Button>
                <Button 
                  size="small" 
                  icon={<RightOutlined />} 
                  onClick={handleNextWeek}
                  type="text"
                >
                  下週
                </Button>
              </Space>
            </div>
          }
          headStyle={{ padding: '8px 16px' }}
          bodyStyle={{ padding: '12px 16px' }}
        >
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto' }}>
            {getPreviousWeekData().map((day) => (
              <div 
                key={day.dateString}
                style={{
                  minWidth: '100px',
                  padding: '8px',
                  border: '1px solid #f0f0f0',
                  borderRadius: '6px',
                  textAlign: 'center',
                  backgroundColor: day.workout ? 
                    (getEffectiveCompletionStatus(day.workout) ? '#f6ffed' : '#fff7e6') : 
                    '#fafafa',
                  cursor: 'pointer'
                }}
                onClick={() => handleDateClick(day.date)}
              >
                <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>
                  {day.date.format('MM/DD')}
                </div>
                <div style={{ fontSize: '11px', color: '#999', marginBottom: '6px' }}>
                  {day.date.format('ddd')}
                </div>
                {day.workout ? (
                  <div>
                    {day.workout.muscleGroups.slice(0, 2).map((muscleGroup) => {
                      const config = getMuscleGroupConfig(muscleGroup);
                      return (
                        <div key={muscleGroup} style={{ fontSize: '16px', margin: '2px 0' }}>
                          {config.icon}
                        </div>
                      );
                    })}
                    {day.workout.muscleGroups.length > 2 && (
                      <div style={{ fontSize: '10px', color: '#666' }}>+{day.workout.muscleGroups.length - 2}</div>
                    )}
                    {(day.workout as any).cardioDetails && (
                      <div style={{ fontSize: '14px', color: '#ff7a45', margin: '2px 0' }}>
                        🏃
                      </div>
                    )}
                  </div>
                ) : (
                  <div style={{ fontSize: '14px', color: '#ccc' }}>-</div>
                )}
              </div>
            ))}
          </div>
          <div style={{ 
            marginTop: '8px', 
            textAlign: 'center', 
            fontSize: '11px', 
            color: '#666' 
          }}>
            向上滾動查看 • 3秒後自動隱藏
          </div>
        </Card>
      )}

      <Card 
        title="健身日曆" 
        loading={isLoading}
        extra={
          <Space>
            <Button 
              type="text" 
              icon={showPreviousWeek ? <ArrowDownOutlined /> : <ArrowUpOutlined />}
              size="small"
              onClick={() => setShowPreviousWeek(!showPreviousWeek)}
            >
              {showPreviousWeek ? '隱藏' : '上一週'}
            </Button>
            <Button 
              type="primary"
              size="small"
              onClick={() => navigate('/add')}
            >
              新增訓練
            </Button>
          </Space>
        }
      >
        <Calendar
          dateCellRender={dateCellRender}
          value={currentMonth}
          mode="month"
          fullscreen={true}
          headerRender={({ value }) => {
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
                      📝 此日期已有訓練計劃 - 點擊日期可以修改
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
                          ((workout as any).isRestDay ? "已休息" : "已訓練") : 
                          ((workout as any).isRestDay ? "計劃休息" : "計劃中")
                        }
                      />
                    </p>
                  </div>
                );
              } else {
                return (
                  <div>
                    <p style={{ color: "#52c41a", fontWeight: "bold" }}>
                      ✨ 此日期無訓練計劃 - 點擊日期可以建立新計劃
                    </p>
                  </div>
                );
              }
            })()}
          </div>
        )}
      </Card>
    </div>
  );
};

export default WorkoutCalendar;