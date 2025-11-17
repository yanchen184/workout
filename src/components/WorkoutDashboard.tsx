import React, { useMemo } from "react";
import { useList } from "@refinedev/core";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { WorkoutRecord, MuscleGroup } from "../types";
import { getMuscleGroupConfig } from "../config/muscleGroups";
import { auth } from "../config/firebase";
import { getEffectiveCompletionStatus } from "../utils/dateUtils";
import { Button } from "../design-system/components/Button";
import { Card, CardHeader, CardBody } from "../design-system/components/Card";
import { APP_VERSION } from "../config/version";

// Extend dayjs with relativeTime plugin
dayjs.extend(relativeTime);

// Gradient configurations for muscle groups
const muscleGradients: Record<MuscleGroup, string> = {
  [MuscleGroup.CHEST]: "from-red-400 to-red-600",
  [MuscleGroup.BACK]: "from-green-400 to-green-600",
  [MuscleGroup.LEGS]: "from-orange-400 to-orange-600",
  [MuscleGroup.SHOULDERS]: "from-purple-400 to-purple-600",
  [MuscleGroup.ARMS]: "from-blue-400 to-blue-600",
  [MuscleGroup.ABS]: "from-cyan-400 to-cyan-600",
  [MuscleGroup.CARDIO]: "from-pink-400 to-pink-600",
};

const WorkoutDashboard: React.FC = () => {
  const currentUser = auth.currentUser;
  const navigate = useNavigate();

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
      pageSize: 365,
    },
  });

  // Calculate muscle group statistics
  const muscleGroupStats = useMemo(() => {
    if (!workoutData?.data) return [];

    const workouts = workoutData.data;
    const now = dayjs();
    const startOfMonth = now.startOf('month');
    const muscleGroups: MuscleGroup[] = [
      MuscleGroup.CHEST,
      MuscleGroup.BACK,
      MuscleGroup.LEGS,
      MuscleGroup.SHOULDERS,
      MuscleGroup.ARMS,
      MuscleGroup.ABS,
    ];

    return muscleGroups.map((muscle) => {
      const config = getMuscleGroupConfig(muscle);

      // 找最近的訓練日期（包含今天安排的，不論是否完成）
      const allMuscleWorkouts = workouts
        .filter((w) => w.muscleGroups.includes(muscle))
        .sort((a, b) => dayjs(b.date).diff(dayjs(a.date)));

      const lastWorkout = allMuscleWorkouts[0];
      const daysAgo = lastWorkout ? now.diff(dayjs(lastWorkout.date), "day") : 999;

      // 計算本月已完成的訓練次數
      const monthlyWorkouts = workouts.filter((w) =>
        w.muscleGroups.includes(muscle) &&
        getEffectiveCompletionStatus(w) &&
        (dayjs(w.date).isAfter(startOfMonth) || dayjs(w.date).isSame(startOfMonth, 'day'))
      ).length;

      return {
        id: muscle,
        name: config.label,
        icon: config.icon,
        color: config.color,
        gradient: muscleGradients[muscle],
        lastWorkout: daysAgo,
        totalWorkouts: monthlyWorkouts,
      };
    });
  }, [workoutData]);

  // Calculate weekly workouts
  const weeklyWorkouts = useMemo(() => {
    if (!workoutData?.data) return 0;

    const workouts = workoutData.data.filter(w => getEffectiveCompletionStatus(w));
    const now = dayjs();
    const weekAgo = now.subtract(7, "day");

    return workouts.filter((w) => dayjs(w.date).isAfter(weekAgo)).length;
  }, [workoutData]);

  const getStatusColor = (days: number) => {
    if (days === 0) return "bg-success-100 text-success-700 border-success-300 dark:bg-success-900 dark:text-success-300";
    if (days <= 2) return "bg-warning-100 text-warning-700 border-warning-300 dark:bg-warning-900 dark:text-warning-300";
    if (days <= 4) return "bg-orange-100 text-orange-700 border-orange-300 dark:bg-orange-900 dark:text-orange-300";
    return "bg-danger-100 text-danger-700 border-danger-300 dark:bg-danger-900 dark:text-danger-300";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">載入中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 transition-colors duration-300">
      {/* Header Section */}
      <header className="bg-white dark:bg-dark-800 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                健身儀表板
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {new Date().toLocaleDateString("zh-TW", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
                {" · "}
                <span className="text-primary-600 dark:text-primary-400">v{APP_VERSION}</span>
              </p>
            </div>
            <Button
              variant="primary"
              size="md"
              icon={<span>➕</span>}
              className="hidden sm:inline-flex"
              onClick={() => navigate("/create-plan")}
            >
              新增訓練
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Weekly Training Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card
            variant="glass"
            className="p-8 hover:shadow-lg transition-shadow duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  本週訓練
                </p>
                <p className="text-5xl font-bold text-primary-600 dark:text-primary-400 mt-2">
                  {weeklyWorkouts}
                  <span className="text-lg font-normal ml-2 text-gray-500">
                    次
                  </span>
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  過去 7 天內完成的訓練次數
                </p>
              </div>
              <div className="w-20 h-20 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl flex items-center justify-center text-4xl shadow-lg">
                📊
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Muscle Groups Grid */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                肌肉群訓練狀態
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/list")}
              >
                查看全部
              </Button>
            </div>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {muscleGroupStats.map((muscle, index) => (
                <motion.div
                  key={muscle.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div
                    className={`relative p-4 rounded-xl bg-gradient-to-br ${muscle.gradient} cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300`}
                    onClick={() => navigate(`/list?muscle=${muscle.id}`)}
                  >
                    <div className="text-center text-white">
                      <div className="text-3xl mb-2">{muscle.icon}</div>
                      <p className="font-semibold text-sm">{muscle.name}</p>
                      <div
                        className={`mt-2 px-2 py-1 rounded-full text-xs border ${getStatusColor(
                          muscle.lastWorkout
                        )}`}
                      >
                        {muscle.lastWorkout === 0
                          ? "今天"
                          : muscle.lastWorkout > 30
                          ? "超過30天"
                          : `${muscle.lastWorkout} 天前`}
                      </div>
                      <p className="text-xs mt-1 opacity-80">
                        本月 {muscle.totalWorkouts} 次
                      </p>
                    </div>
                    {muscle.lastWorkout === 0 && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-success-500 rounded-full animate-pulse" />
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              快速操作
            </h3>
            <div className="space-y-3">
              <Button
                variant="primary"
                fullWidth
                onClick={() => navigate("/create-plan")}
              >
                🏋️ 新增訓練記錄
              </Button>
              <Button
                variant="outline"
                fullWidth
                onClick={() => navigate("/calendar")}
              >
                📅 查看訓練日曆
              </Button>
              <Button
                variant="outline"
                fullWidth
                onClick={() => navigate("/list")}
              >
                📝 訓練歷史記錄
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              訓練提醒
            </h3>
            <div className="space-y-3">
              {muscleGroupStats
                .filter((m) => m.lastWorkout > 4)
                .slice(0, 3)
                .map((muscle) => (
                  <div
                    key={muscle.id}
                    className="flex items-center justify-between p-3 bg-warning-50 dark:bg-warning-900/20 rounded-lg border border-warning-200 dark:border-warning-800"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{muscle.icon}</span>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {muscle.name}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {muscle.lastWorkout} 天未訓練
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="warning"
                      size="sm"
                      onClick={() => navigate(`/create-plan?muscle=${muscle.id}`)}
                    >
                      訓練
                    </Button>
                  </div>
                ))}
              {muscleGroupStats.filter((m) => m.lastWorkout > 4).length === 0 && (
                <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                  ✨ 太棒了！所有肌肉群都有定期訓練
                </p>
              )}
            </div>
          </Card>
        </div>
      </main>

      {/* Floating Action Button (Mobile) */}
      <div className="lg:hidden fixed bottom-6 right-6 z-50">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
          <Button
            variant="primary"
            rounded="full"
            className="shadow-xl hover:shadow-2xl w-14 h-14 p-0 text-2xl"
            onClick={() => navigate("/create-plan")}
          >
            +
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default WorkoutDashboard;
