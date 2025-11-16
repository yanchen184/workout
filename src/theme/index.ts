/**
 * 設計系統 - 統一管理應用程式的設計標準
 * 包含顏色、間距、圓角、陰影等設計規範
 */

/**
 * 顏色系統
 */
export const colors = {
  // 主要顏色
  primary: '#1890ff',
  success: '#52c41a',
  warning: '#faad14',
  error: '#ff4d4f',
  info: '#1890ff',

  // 狀態顏色
  completed: '#52c41a',
  planned: '#faad14',
  rest: '#8c8c8c',

  // 肌肉群顏色
  muscleGroups: {
    chest: '#ff4d4f',      // 胸肌 - 紅色
    shoulders: '#ff7a45',  // 肩膀 - 橙紅色
    legs: '#ffa940',       // 腿部 - 橙色
    back: '#bae637',       // 背部 - 黃綠色
    abs: '#36cfc9',        // 腹肌 - 青色
    arms: '#597ef7',       // 手臂 - 藍色
  },

  // 背景顏色
  backgrounds: {
    completed: '#f6ffed',
    completedHover: 'rgba(82, 196, 26, 0.05)',
    planned: '#fff7e6',
    plannedHover: 'rgba(250, 173, 20, 0.05)',
    rest: '#f5f5f5',
    default: '#ffffff',
  },

  // 邊框顏色
  borders: {
    light: '#f0f0f0',
    default: '#d9d9d9',
    dark: '#bfbfbf',
  },

  // 文字顏色
  text: {
    primary: 'rgba(0, 0, 0, 0.85)',
    secondary: 'rgba(0, 0, 0, 0.65)',
    disabled: 'rgba(0, 0, 0, 0.25)',
    light: '#666666',
  },
};

/**
 * 間距系統 (使用 8px 網格系統)
 */
export const spacing = {
  xs: 4,   // 0.25rem
  sm: 8,   // 0.5rem
  md: 12,  // 0.75rem
  lg: 16,  // 1rem
  xl: 24,  // 1.5rem
  xxl: 32, // 2rem
  xxxl: 48, // 3rem
};

/**
 * 圓角系統
 */
export const borderRadius = {
  xs: 2,
  sm: 4,
  md: 6,
  lg: 8,
  xl: 12,
  round: 999, // 完全圓角
};

/**
 * 陰影系統
 */
export const shadows = {
  sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
  md: '0 2px 8px rgba(0, 0, 0, 0.1)',
  lg: '0 4px 12px rgba(0, 0, 0, 0.1)',
  xl: '0 6px 20px rgba(0, 0, 0, 0.15)',
  xxl: '0 8px 24px rgba(0, 0, 0, 0.15)',
  card: '0 2px 8px rgba(0, 0, 0, 0.1)',
  cardHover: '0 4px 12px rgba(0, 0, 0, 0.15)',
};

/**
 * 字體大小系統
 */
export const fontSize = {
  xs: 10,
  sm: 12,
  base: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

/**
 * 字重系統
 */
export const fontWeight = {
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
};

/**
 * 層級系統 (z-index)
 */
export const zIndex = {
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
};

/**
 * 過渡動畫
 */
export const transitions = {
  fast: '0.15s ease',
  normal: '0.3s ease',
  slow: '0.5s ease',
  all: 'all 0.3s ease',
  transform: 'transform 0.3s ease',
  opacity: 'opacity 0.3s ease',
};

/**
 * 預定義的卡片樣式
 */
export const cardStyles = {
  success: {
    backgroundColor: colors.backgrounds.completed,
    borderColor: colors.success,
    borderWidth: 2,
    borderStyle: 'solid',
    borderRadius: borderRadius.lg,
  },
  warning: {
    backgroundColor: colors.backgrounds.planned,
    borderColor: colors.warning,
    borderWidth: 2,
    borderStyle: 'solid',
    borderRadius: borderRadius.lg,
  },
  default: {
    backgroundColor: colors.backgrounds.default,
    borderColor: colors.borders.light,
    borderWidth: 1,
    borderStyle: 'solid',
    borderRadius: borderRadius.lg,
  },
};

/**
 * 響應式斷點
 */
export const breakpoints = {
  xs: 480,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1600,
};

/**
 * 工具函數：獲取肌肉群樣式
 */
export const getMuscleGroupStyle = (muscleGroup: string) => {
  const color = colors.muscleGroups[muscleGroup as keyof typeof colors.muscleGroups] || colors.primary;
  return {
    backgroundColor: `${color}10`, // 10% 透明度
    borderColor: `${color}40`,     // 40% 透明度
    borderWidth: 2,
    borderStyle: 'solid',
    borderRadius: borderRadius.lg,
    color: color,
  };
};

/**
 * 工具函數：獲取狀態卡片樣式
 */
export const getStatusCardStyle = (status: 'completed' | 'planned' | 'rest') => {
  const styleMap = {
    completed: {
      backgroundColor: colors.backgrounds.completed,
      borderColor: colors.completed,
      borderLeftWidth: 4,
      borderLeftStyle: 'solid',
    },
    planned: {
      backgroundColor: colors.backgrounds.planned,
      borderColor: colors.planned,
      borderLeftWidth: 4,
      borderLeftStyle: 'solid',
    },
    rest: {
      backgroundColor: colors.backgrounds.rest,
      borderColor: colors.rest,
      borderLeftWidth: 4,
      borderLeftStyle: 'solid',
    },
  };

  return {
    ...styleMap[status],
    borderRadius: borderRadius.md,
    padding: spacing.md,
    transition: transitions.all,
  };
};

/**
 * 導出完整的主題對象
 */
export const theme = {
  colors,
  spacing,
  borderRadius,
  shadows,
  fontSize,
  fontWeight,
  zIndex,
  transitions,
  cardStyles,
  breakpoints,
};

export default theme;
