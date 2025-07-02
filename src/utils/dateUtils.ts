import dayjs from "dayjs";

// Helper function to convert Firebase Timestamp to readable date
export const formatFirebaseDate = (timestamp: any): string => {
  if (!timestamp) return '未知';
  
  try {
    // Handle Firebase Timestamp object
    if (timestamp && typeof timestamp === 'object' && timestamp.seconds) {
      return dayjs(timestamp.seconds * 1000).format("YYYY-MM-DD HH:mm:ss");
    }
    
    // Handle JavaScript Date object
    if (timestamp instanceof Date) {
      return dayjs(timestamp).format("YYYY-MM-DD HH:mm:ss");
    }
    
    // Handle timestamp string or number
    if (typeof timestamp === 'string' || typeof timestamp === 'number') {
      const date = dayjs(timestamp);
      if (date.isValid()) {
        return date.format("YYYY-MM-DD HH:mm:ss");
      }
    }
    
    return '無效日期';
  } catch (error) {
    console.warn('Date formatting error:', error);
    return '日期錯誤';
  }
};

// Helper function for relative time (e.g., "2 hours ago")
export const formatRelativeTime = (timestamp: any): string => {
  if (!timestamp) return '未知時間';
  
  try {
    let date;
    
    // Handle Firebase Timestamp object
    if (timestamp && typeof timestamp === 'object' && timestamp.seconds) {
      date = dayjs(timestamp.seconds * 1000);
    }
    // Handle JavaScript Date object
    else if (timestamp instanceof Date) {
      date = dayjs(timestamp);
    }
    // Handle timestamp string or number
    else if (typeof timestamp === 'string' || typeof timestamp === 'number') {
      date = dayjs(timestamp);
    }
    
    if (date && date.isValid()) {
      const now = dayjs();
      const diffInMinutes = now.diff(date, 'minute');
      const diffInHours = now.diff(date, 'hour');
      const diffInDays = now.diff(date, 'day');
      
      if (diffInMinutes < 1) {
        return '剛剛';
      } else if (diffInMinutes < 60) {
        return `${diffInMinutes} 分鐘前`;
      } else if (diffInHours < 24) {
        return `${diffInHours} 小時前`;
      } else if (diffInDays < 7) {
        return `${diffInDays} 天前`;
      } else {
        return date.format("MM/DD");
      }
    }
    
    return '無效時間';
  } catch (error) {
    console.warn('Relative time formatting error:', error);
    return '時間錯誤';
  }
};

// Helper function to check if a date is today
export const isToday = (timestamp: any): boolean => {
  try {
    let date;
    
    if (timestamp && typeof timestamp === 'object' && timestamp.seconds) {
      date = dayjs(timestamp.seconds * 1000);
    } else if (timestamp instanceof Date) {
      date = dayjs(timestamp);
    } else {
      date = dayjs(timestamp);
    }
    
    return date.isValid() && date.isSame(dayjs(), 'day');
  } catch (error) {
    return false;
  }
};

// Helper function to check if a date is yesterday
export const isYesterday = (timestamp: any): boolean => {
  try {
    let date;
    
    if (timestamp && typeof timestamp === 'object' && timestamp.seconds) {
      date = dayjs(timestamp.seconds * 1000);
    } else if (timestamp instanceof Date) {
      date = dayjs(timestamp);
    } else {
      date = dayjs(timestamp);
    }
    
    return date.isValid() && date.isSame(dayjs().subtract(1, 'day'), 'day');
  } catch (error) {
    return false;
  }
};

// Helper function to check if a date has passed (and should be marked as completed)
export const isDatePassed = (dateString: string): boolean => {
  try {
    const date = dayjs(dateString);
    const today = dayjs().startOf('day');
    return date.isValid() && date.isBefore(today);
  } catch (error) {
    return false;
  }
};

// Helper function to get the effective completion status
// Past dates are automatically considered completed
export const getEffectiveCompletionStatus = (workout: { date: string; completed: boolean }): boolean => {
  if (isDatePassed(workout.date)) {
    return true; // Past dates are always considered completed
  }
  return workout.completed; // Current/future dates use actual completion status
};

// Helper function to get display text for completion status
export const getCompletionStatusText = (workout: { date: string; completed: boolean; isRestDay?: boolean }): {
  text: string;
  color: string;
  status: 'success' | 'processing' | 'default';
} => {
  const isPast = isDatePassed(workout.date);
  const isToday = dayjs(workout.date).isSame(dayjs(), 'day');
  
  if (isPast) {
    if (workout.isRestDay) {
      return {
        text: '已休息',
        color: '#52c41a',
        status: 'success'
      };
    } else {
      return {
        text: '已訓練',
        color: '#52c41a', 
        status: 'success'
      };
    }
  } else if (isToday) {
    if (workout.completed) {
      return {
        text: workout.isRestDay ? '已休息' : '已完成',
        color: '#52c41a',
        status: 'success'
      };
    } else {
      return {
        text: workout.isRestDay ? '計劃休息' : '進行中',
        color: '#1890ff',
        status: 'processing'
      };
    }
  } else {
    // Future dates
    return {
      text: workout.isRestDay ? '計劃休息' : '計劃中',
      color: '#faad14',
      status: 'default'
    };
  }
};
