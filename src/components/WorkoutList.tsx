import React, { useState, useEffect } from "react";
import {
  Table,
  Tag,
  Badge,
  Button,
  Space,
  Modal,
  Card,
  message,
  Popconfirm,
  Typography,
  Divider,
  Alert,
  Spin
} from "antd";
import { EditOutlined, DeleteOutlined, EyeOutlined, CalendarOutlined, ReloadOutlined } from "@ant-design/icons";
import { useList, useDelete } from "@refinedev/core";
import { WorkoutRecord } from "../types";
import { getMuscleGroupConfig } from "../config/muscleGroups";
import { auth } from "../config/firebase";
import WorkoutForm from "./WorkoutForm";
import { formatFirebaseDate } from "../utils/dateUtils";
import { getCompletionStatusText, getEffectiveCompletionStatus } from "../utils/dateUtils";
import dayjs from "dayjs";

const { Text } = Typography;

const WorkoutList: React.FC = () => {
  const [editingRecord, setEditingRecord] = useState<WorkoutRecord | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [viewingRecord, setViewingRecord] = useState<WorkoutRecord | null>(null);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [debugInfo, setDebugInfo] = useState<any>(null);

  const currentUser = auth.currentUser;

  // 簡化查詢，避免索引問題
  const { data: workoutData, isLoading, refetch, error } = useList<WorkoutRecord>({
    resource: "workouts",
    filters: currentUser ? [
      {
        field: "userId",
        operator: "eq",
        value: currentUser.uid,
      },
    ] : [],
    // 暫時移除排序，避免複合索引問題
    sorters: [],
    pagination: {
      pageSize: 100,
    },
  });

  const { mutate: deleteWorkout } = useDelete();

  // 在客戶端排序數據
  const sortedWorkoutData = React.useMemo(() => {
    if (!workoutData?.data) return null;

    const sorted = [...workoutData.data].sort((a, b) => {
      return dayjs(b.date).valueOf() - dayjs(a.date).valueOf();
    });

    return {
      ...workoutData,
      data: sorted
    };
  }, [workoutData]);

  // Debug: Check data and user info
  useEffect(() => {
    setDebugInfo({
      currentUser: currentUser ? {
        uid: currentUser.uid,
        email: currentUser.email
      } : null,
      workoutData: workoutData,
      dataLength: workoutData?.data?.length || 0,
      error: error ? {
        message: error.message,
        name: error.name,
        code: (error as any).code
      } : null,
      isLoading: isLoading
    });
  }, [currentUser, workoutData, error, isLoading]);

  // Handle delete workout
  const handleDelete = (id: string) => {
    deleteWorkout(
      {
        resource: "workouts",
        id,
      },
      {
        onSuccess: () => {
          message.success("訓練記錄刪除成功！");
          refetch();
        },
        onError: (error) => {
          console.error("刪除失敗:", error);
          message.error("刪除失敗，請重試");
        },
      }
    );
  };

  // Handle edit workout
  const handleEdit = (record: WorkoutRecord) => {
    setEditingRecord(record);
    setIsModalVisible(true);
  };

  // Handle view workout details
  const handleView = (record: WorkoutRecord) => {
    setViewingRecord(record);
    setIsViewModalVisible(true);
  };

  // Handle modal close
  const handleModalClose = () => {
    setIsModalVisible(false);
    setEditingRecord(null);
    refetch();
  };

  // Handle view modal close
  const handleViewModalClose = () => {
    setIsViewModalVisible(false);
    setViewingRecord(null);
  };

  // Manual refresh
  const handleRefresh = () => {
    refetch();
    message.info("數據已刷新");
  };

  // Check if user is logged in
  if (!currentUser) {
    return (
      <Card style={{ margin: "16px 0" }}>
        <Alert
          message="請先登入"
          description="需要登入後才能查看訓練記錄"
          type="warning"
          showIcon
        />
      </Card>
    );
  }

  // Show error if any
  if (error) {
    const isIndexError = error.message && error.message.includes('index');

    return (
      <Card style={{ margin: "16px 0" }}>
        <Alert
          message={isIndexError ? "需要創建 Firebase 索引" : "數據載入錯誤"}
          description={
            isIndexError ? (
              <div>
                <p>Firebase 需要為查詢創建索引。請按照以下步驟操作：</p>
                <ol style={{ marginLeft: "20px", marginTop: "8px" }}>
                  <li>點擊下面的連結創建索引</li>
                  <li>登入你的 Google 帳戶</li>
                  <li>點擊「創建索引」按鈕</li>
                  <li>等待索引建立完成（約2-5分鐘）</li>
                  <li>回來點擊「重試」按鈕</li>
                </ol>
                {error.message.includes('https://') && (
                  <div style={{ marginTop: "12px" }}>
                    <a
                      href={error.message.split('https://')[1].split(' ')[0].replace('https://', 'https://')}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontWeight: "bold" }}
                    >
                      🔗 點擊這裡創建 Firebase 索引
                    </a>
                  </div>
                )}
              </div>
            ) : (
              `錯誤信息: ${error.message || '未知錯誤'}`
            )
          }
          type="error"
          showIcon
          action={
            <Button size="small" onClick={handleRefresh}>
              重試
            </Button>
          }
        />

        {/* Debug info */}
        <details style={{ marginTop: "16px" }}>
          <summary style={{ cursor: "pointer", color: "#666" }}>
            詳細錯誤信息（點擊展開）
          </summary>
          <pre style={{ fontSize: "12px", color: "#666", marginTop: "8px", maxHeight: "300px", overflow: "auto" }}>
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        </details>
      </Card>
    );
  }

  // Use sorted data
  const displayData = sortedWorkoutData || workoutData;

  // Table columns configuration
  const columns = [
    {
      title: "訓練日期",
      dataIndex: "date",
      key: "date",
      width: 140,
      render: (date: string) => {
        const dayObj = dayjs(date);
        const isToday = dayObj.isSame(dayjs(), 'day');
        const isYesterday = dayObj.isSame(dayjs().subtract(1, 'day'), 'day');

        return (
          <div style={{ textAlign: "center" }}>
            <div style={{
              fontSize: "16px",
              fontWeight: "bold",
              color: isToday ? "#52c41a" : "#333"
            }}>
              {dayObj.format("MM/DD")}
            </div>
            <div style={{
              fontSize: "12px",
              color: "#999",
              marginTop: "2px"
            }}>
              {isToday ? "今天" : isYesterday ? "昨天" : dayObj.format("dddd")}
            </div>
            <div style={{
              fontSize: "11px",
              color: "#ccc"
            }}>
              {dayObj.format("YYYY")}
            </div>
          </div>
        );
      },
    },
    {
      title: "訓練部位",
      dataIndex: "muscleGroups",
      key: "muscleGroups",
      render: (muscleGroups: string[]) => (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
          {muscleGroups && muscleGroups.map((muscleGroup) => {
            const config = getMuscleGroupConfig(muscleGroup as any);
            return (
              <Tag
                key={muscleGroup}
                color={config.color}
                style={{
                  margin: "2px",
                  padding: "4px 8px",
                  fontSize: "12px",
                  borderRadius: "16px",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px"
                }}
              >
                <span style={{ fontSize: "14px" }}>{config.icon}</span>
                {config.label}
              </Tag>
            );
          })}
        </div>
      ),
    },
    {
      title: "完成狀態",
      dataIndex: "completed",
      key: "completed",
      width: 120,
      align: "center" as const,
      render: (_: boolean, record: WorkoutRecord) => {
        const statusInfo = getCompletionStatusText(record);
        return (
          <div style={{ textAlign: "center" }}>
            <Badge
              status={statusInfo.status}
              style={{ fontSize: "24px" }}
            />
            <div style={{
              fontSize: "12px",
              fontWeight: "bold",
              color: statusInfo.color,
              marginTop: "4px"
            }}>
              {statusInfo.text}
            </div>
          </div>
        );
      },
    },
    {
      title: "訓練備註",
      dataIndex: "notes",
      key: "notes",
      ellipsis: true,
      render: (notes: string) => (
        <div style={{
          maxWidth: "200px",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap"
        }}>
          {notes ? (
            <Text style={{ color: "#333" }}>
              {notes}
            </Text>
          ) : (
            <Text type="secondary" italic>
              無備註
            </Text>
          )}
        </div>
      ),
    },
    {
      title: "操作",
      key: "actions",
      width: 120,
      align: "center" as const,
      render: (_: any, record: WorkoutRecord) => (
        <div style={{ display: "flex", justifyContent: "center", gap: "4px" }}>
          <Button
            type="text"
            icon={<EyeOutlined />}
            size="small"
            onClick={() => handleView(record)}
            style={{ color: "#1890ff" }}
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEdit(record)}
            style={{ color: "#52c41a" }}
          />
          <Popconfirm
            title="確定要刪除這條訓練記錄嗎？"
            description="刪除後無法恢復"
            onConfirm={() => handleDelete(record.id!)}
            okText="確定"
            cancelText="取消"
            okButtonProps={{ danger: true }}
          >
            <Button
              type="text"
              icon={<DeleteOutlined />}
              size="small"
              style={{ color: "#ff4d4f" }}
            />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <>
      <Card
        title={
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <CalendarOutlined style={{ color: "#1890ff" }} />
            <span>訓練記錄</span>
            {displayData?.data && (
              <Badge
                count={displayData.data.length}
                style={{ backgroundColor: '#52c41a' }}
              />
            )}
          </div>
        }
        style={{ margin: "16px 0" }}
        extra={
          <Space>
            <Button
              icon={<ReloadOutlined />}
              onClick={handleRefresh}
              size="small"
            >
              刷新
            </Button>
            <Text type="secondary">
              {displayData?.data ? `共 ${displayData.data.length} 條記錄` : '載入中...'}
            </Text>
          </Space>
        }
      >
        {/* Debug info for development */}
        {process.env.NODE_ENV === 'development' && (
          <details style={{ marginBottom: "16px" }}>
            <summary style={{ cursor: "pointer", color: "#666", fontSize: "12px" }}>
              調試信息（開發模式）
            </summary>
            <pre style={{ fontSize: "10px", color: "#666", marginTop: "8px", maxHeight: "200px", overflow: "auto" }}>
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </details>
        )}

        <Spin spinning={isLoading}>
          <Table
            dataSource={displayData?.data || []}
            columns={columns}
            rowKey="id"
            pagination={{
              total: displayData?.total,
              pageSize: 20,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `顯示 ${range[0]}-${range[1]} 條，共 ${total} 條記錄`,
              pageSizeOptions: ['10', '20', '50'],
            }}
            size="middle"
            scroll={{ x: 800 }}
            rowClassName={(record) => {
              const effectiveCompleted = getEffectiveCompletionStatus(record);
              return effectiveCompleted ? 'workout-row-completed' : 'workout-row-planned';
            }}
            locale={{
              emptyText: (
                <div style={{ padding: "40px", textAlign: "center" }}>
                  <div style={{ fontSize: "48px", marginBottom: "16px" }}>
                    💪
                  </div>
                  <div style={{ fontSize: "16px", color: "#999", marginBottom: "8px" }}>
                    還沒有訓練記錄
                  </div>
                  <div style={{ fontSize: "14px", color: "#ccc", marginBottom: "16px" }}>
                    開始記錄你的健身之旅吧！
                  </div>
                  <div style={{ fontSize: "12px", color: "#aaa" }}>
                    當前用戶: {currentUser.email}
                  </div>
                  <Button
                    type="link"
                    size="small"
                    onClick={handleRefresh}
                    style={{ marginTop: "8px" }}
                  >
                    點擊刷新數據
                  </Button>
                </div>
              )
            }}
          />
        </Spin>
      </Card>

      {/* Edit Modal */}
      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <EditOutlined />
            編輯訓練記錄
          </div>
        }
        open={isModalVisible}
        onCancel={handleModalClose}
        footer={null}
        width={700}
        destroyOnClose
      >
        {editingRecord && (
          <WorkoutForm
            mode="edit"
            initialValues={editingRecord}
            onSuccess={handleModalClose}
          />
        )}
      </Modal>

      {/* View Modal */}
      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <EyeOutlined />
            訓練記錄詳情
          </div>
        }
        open={isViewModalVisible}
        onCancel={handleViewModalClose}
        footer={[
          <Button key="close" onClick={handleViewModalClose}>
            關閉
          </Button>
        ]}
        width={500}
      >
        {viewingRecord && (
          <div>
            <div style={{ marginBottom: "20px", textAlign: "center" }}>
              <div style={{ fontSize: "24px", fontWeight: "bold", color: "#1890ff" }}>
                {dayjs(viewingRecord.date).format("YYYY年MM月DD日")}
              </div>
              <div style={{ fontSize: "14px", color: "#666", marginTop: "4px" }}>
                {dayjs(viewingRecord.date).format("dddd")}
              </div>
            </div>

            <Divider />

            <div style={{ marginBottom: "20px" }}>
              <Text strong style={{ fontSize: "16px", display: "block", marginBottom: "12px" }}>
                🎯 訓練部位：
              </Text>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {viewingRecord.muscleGroups && viewingRecord.muscleGroups.map((muscleGroup) => {
                  const config = getMuscleGroupConfig(muscleGroup);
                  return (
                    <Tag
                      key={muscleGroup}
                      color={config.color}
                      style={{
                        padding: "8px 16px",
                        fontSize: "14px",
                        borderRadius: "20px",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px"
                      }}
                    >
                      <span style={{ fontSize: "16px" }}>{config.icon}</span>
                      {config.label}
                    </Tag>
                  );
                })}
              </div>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <Text strong style={{ fontSize: "16px", display: "block", marginBottom: "12px" }}>
                📊 完成狀態：
              </Text>
              <div style={{
                padding: "12px 16px",
                backgroundColor: getEffectiveCompletionStatus(viewingRecord) ? "#f6ffed" : "#fff7e6",
                borderLeft: `4px solid ${getEffectiveCompletionStatus(viewingRecord) ? "#52c41a" : "#faad14"}`,
                borderRadius: "6px",
                display: "flex",
                alignItems: "center",
                gap: "12px"
              }}>
                <div style={{ fontSize: "24px" }}>
                  {getEffectiveCompletionStatus(viewingRecord) ? "✅" : "⏳"}
                </div>
                <div>
                  <div style={{
                    fontWeight: "bold",
                    color: getEffectiveCompletionStatus(viewingRecord) ? "#52c41a" : "#faad14",
                    fontSize: "16px"
                  }}>
                    {getCompletionStatusText(viewingRecord).text}
                  </div>
                  <div style={{ fontSize: "12px", color: "#666" }}>
                    {getEffectiveCompletionStatus(viewingRecord) ? "太棒了！繼續保持" : "還沒完成這次訓練"}
                  </div>
                </div>
              </div>
            </div>

            {viewingRecord.notes && (
              <div style={{ marginBottom: "20px" }}>
                <Text strong style={{ fontSize: "16px", display: "block", marginBottom: "12px" }}>
                  📝 訓練備註：
                </Text>
                <div style={{
                  padding: "16px",
                  backgroundColor: "#fafafa",
                  borderRadius: "8px",
                  whiteSpace: "pre-wrap",
                  lineHeight: "1.6",
                  border: "1px solid #f0f0f0"
                }}>
                  {viewingRecord.notes}
                </div>
              </div>
            )}

            <Divider />

            <div style={{ fontSize: "12px", color: "#999", textAlign: "center" }}>
              <div>
                記錄ID：{viewingRecord.id}
              </div>
              <div style={{ marginTop: "4px" }}>
                創建時間：{formatFirebaseDate(viewingRecord.createdAt)}
              </div>
              {viewingRecord.updatedAt && (
                <div style={{ marginTop: "4px" }}>
                  更新時間：{formatFirebaseDate(viewingRecord.updatedAt)}
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default WorkoutList;