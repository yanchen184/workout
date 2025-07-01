// Workout muscle groups enum
export enum MuscleGroup {
  CHEST = 'chest',
  SHOULDERS = 'shoulders',
  LEGS = 'legs',
  BACK = 'back',
  ABS = 'abs',
  ARMS = 'arms',
  CARDIO = 'cardio' // 新增有氧訓練
}

// Workout record interface
export interface WorkoutRecord {
  id?: string;
  userId: string;
  date: string; // YYYY-MM-DD format
  muscleGroups: MuscleGroup[];
  notes?: string;
  completed: boolean;
  isRestDay?: boolean; // 是否為休息日
  cardioDetails?: { // 新增有氧訓練詳細資料
    type: string; // 運動類型：跑步、籃球、壁球、保齡球等
    duration?: number; // 時間（分鐘）
    distance?: number; // 距離（公里）
    calories?: number; // 卡路里
    notes?: string; // 有氧訓練備註
  };
  createdAt: Date;
  updatedAt: Date;
}

// User interface
export interface User {
  id: string;
  email: string;
  displayName?: string;
  createdAt: Date;
}

// Calendar event interface for display
export interface CalendarEvent {
  id: string;
  date: string;
  muscleGroups: MuscleGroup[];
  completed: boolean;
  notes?: string;
  isRestDay?: boolean;
  cardioDetails?: {
    type: string;
    duration?: number;
    distance?: number;
    calories?: number;
    notes?: string;
  };
}

// Muscle group display configuration
export interface MuscleGroupConfig {
  label: string;
  color: string;
  icon: string;
}

// Export settings types
export * from './settings';
