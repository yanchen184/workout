import React from "react";
import { useList, useCreate, useUpdate } from "@refinedev/core";
import { SystemSetting, SettingKey, DEFAULT_SETTINGS } from "../types/settings";
import { auth } from "../config/firebase";

// Custom hook for managing system settings
export const useSettings = () => {
  const currentUser = auth.currentUser;

  // Fetch user settings
  const { data: settingsData, isLoading, refetch } = useList<SystemSetting>({
    resource: "settings",
    filters: currentUser ? [
      {
        field: "userId",
        operator: "eq",
        value: currentUser.uid,
      },
    ] : [],
    pagination: {
      pageSize: 100,
    },
  });

  const { mutate: createSetting } = useCreate();
  const { mutate: updateSetting } = useUpdate();

  // Convert array to key-value map
  const settings = React.useMemo(() => {
    if (!settingsData?.data) return DEFAULT_SETTINGS;
    
    const settingsMap: Record<string, any> = { ...DEFAULT_SETTINGS };
    
    settingsData.data.forEach((setting) => {
      settingsMap[setting.key] = setting.value;
    });
    
    return settingsMap;
  }, [settingsData]);

  // Get specific setting value
  const getSetting = (key: SettingKey) => {
    return settings[key] ?? DEFAULT_SETTINGS[key];
  };

  // Update or create setting
  const updateSettingValue = async (key: SettingKey, value: any) => {
    if (!currentUser) return;

    const existingSetting = settingsData?.data?.find(s => s.key === key);

    if (existingSetting) {
      // Update existing setting
      updateSetting({
        resource: "settings",
        id: existingSetting.id!,
        values: {
          value,
        },
      });
    } else {
      // Create new setting
      createSetting({
        resource: "settings",
        values: {
          userId: currentUser.uid,
          key,
          value,
        },
      });
    }
  };

  return {
    settings,
    getSetting,
    updateSetting: updateSettingValue,
    isLoading,
    refetch,
  };
};
