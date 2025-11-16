import { useState, useCallback } from 'react';

/**
 * 非同步狀態管理 Hook
 * 統一管理載入狀態、數據和錯誤
 *
 * @example
 * const { data, loading, error, execute } = useAsyncState<UserData>();
 *
 * const loadUser = async () => {
 *   await execute(async () => {
 *     const response = await api.getUser();
 *     return response.data;
 *   });
 * };
 */
export function useAsyncState<T = any>(initialData?: T) {
  const [data, setData] = useState<T | undefined>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (asyncFunction: () => Promise<T>) => {
    try {
      setLoading(true);
      setError(null);
      const result = await asyncFunction();
      setData(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '發生未知錯誤';
      setError(errorMessage);
      console.error('useAsyncState error:', err);
      throw err; // 重新拋出錯誤，讓調用者可以處理
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setData(initialData);
    setLoading(false);
    setError(null);
  }, [initialData]);

  return {
    data,
    loading,
    error,
    setData,
    execute,
    reset,
  };
}

/**
 * 通用的錯誤處理 Hook
 * 提供統一的錯誤處理和顯示邏輯
 */
export function useErrorHandler() {
  const [error, setError] = useState<Error | null>(null);

  const handleError = useCallback((err: unknown, context?: string) => {
    const error = err instanceof Error ? err : new Error(String(err));

    // 在開發環境中輸出詳細錯誤
    if (process.env.NODE_ENV === 'development') {
      console.error(`Error${context ? ` in ${context}` : ''}:`, error);
    }

    setError(error);

    // 這裡可以添加錯誤追蹤服務
    // trackError(error, context);

    return error;
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    error,
    handleError,
    clearError,
  };
}

/**
 * 用於 Firebase 操作的錯誤處理 Hook
 * 提供 Firebase 特定的錯誤訊息轉換
 */
export function useFirebaseError() {
  const getFirebaseErrorMessage = useCallback((error: any): string => {
    const errorCode = error?.code || '';

    // Firebase 錯誤碼對照表
    const errorMessages: Record<string, string> = {
      'auth/user-not-found': '找不到該用戶',
      'auth/wrong-password': '密碼錯誤',
      'auth/email-already-in-use': '該電子郵件已被使用',
      'auth/weak-password': '密碼強度不足',
      'auth/invalid-email': '無效的電子郵件地址',
      'auth/network-request-failed': '網路連線失敗',
      'permission-denied': '權限不足',
      'unavailable': '服務暫時無法使用',
      'not-found': '找不到資源',
    };

    return errorMessages[errorCode] || error?.message || '操作失敗，請稍後再試';
  }, []);

  return { getFirebaseErrorMessage };
}
