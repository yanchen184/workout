// System setting interfaces
export interface SystemSetting {
  id?: string;
  userId: string;
  key: string;
  value: any;
  createdAt: Date;
  updatedAt: Date;
}

// Setting keys enum
export enum SettingKey {
  REST_DAY_WARNING = 'restDayWarning', // 多少天沒練提醒
  NOTIFICATION_ENABLED = 'notificationEnabled',
  THEME_MODE = 'themeMode',
}

// Default settings
export const DEFAULT_SETTINGS = {
  [SettingKey.REST_DAY_WARNING]: 3, // 預設3天沒練就提醒
  [SettingKey.NOTIFICATION_ENABLED]: true,
  [SettingKey.THEME_MODE]: 'light',
};
