# 🔧 Workout Calendar 重構指南

> 基於 react-frontend-engineer、project-manager 和 frontend-ui-designer 三方專業分析

## 📊 專案健康度總評

| 評估項目 | 評分 | 狀態 |
|---------|------|------|
| React 代碼品質 | 7.2/10 | 🟡 需改進 |
| 專案結構 | 8.0/10 | 🟢 良好 |
| UI/UX 設計 | 7.5/10 | 🟡 需改進 |
| 性能優化 | 5.0/10 | 🔴 急需改進 |
| 錯誤處理 | 4.0/10 | 🔴 急需改進 |
| 測試覆蓋 | 1.0/10 | 🔴 幾乎沒有 |

---

## 🚨 已完成的緊急修復

### 1. ✅ 建立 ErrorBoundary 組件
**位置**: `src/components/ErrorBoundary.tsx`

**用途**: 捕獲 React 組件樹中的錯誤，防止整個應用崩潰

**使用方式**:
```tsx
// 在 App.tsx 中包裹主要組件
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <YourApp />
    </ErrorBoundary>
  );
}
```

### 2. ✅ 建立通用錯誤處理 Hooks
**位置**: `src/hooks/useAsyncState.ts`

**包含三個 Hook**:
- `useAsyncState` - 統一管理非同步操作的載入、數據、錯誤狀態
- `useErrorHandler` - 通用錯誤處理
- `useFirebaseError` - Firebase 特定錯誤訊息轉換

**使用範例**:
```tsx
import { useAsyncState, useFirebaseError } from '../hooks/useAsyncState';

function MyComponent() {
  const { data, loading, error, execute } = useAsyncState();
  const { getFirebaseErrorMessage } = useFirebaseError();

  const loadData = async () => {
    try {
      await execute(async () => {
        const result = await fetchFromFirebase();
        return result;
      });
    } catch (err: any) {
      message.error(getFirebaseErrorMessage(err));
    }
  };

  return (
    <div>
      {loading && <Spin />}
      {error && <Alert type="error" message={error} />}
      {data && <DisplayData data={data} />}
    </div>
  );
}
```

### 3. ✅ 建立設計系統
**位置**: `src/theme/index.ts`

**功能**: 統一管理顏色、間距、圓角、陰影等設計規範

**使用範例**:
```tsx
import { theme, getMuscleGroupStyle } from '../theme';

// 使用顏色
<div style={{ color: theme.colors.primary }}>Primary Text</div>

// 使用間距
<div style={{ padding: theme.spacing.lg, margin: theme.spacing.md }}>
  Content
</div>

// 使用肌肉群樣式
<Card style={getMuscleGroupStyle('chest')}>
  胸肌訓練
</Card>

// 使用陰影和圓角
<div style={{
  boxShadow: theme.shadows.card,
  borderRadius: theme.borderRadius.lg
}}>
  Card Content
</div>
```

### 4. ✅ 清理 debug 組件
已刪除 `src/components/debug/` 資料夾及所有測試組件

---

## 🔥 待修復的關鍵問題

### 問題 1: WorkoutDashboard useEffect 依賴問題

**位置**: `src/components/WorkoutDashboard.tsx:276`

**問題**:
```tsx
// ❌ 錯誤：getSetting() 作為依賴可能導致無限循環
}, [workoutData, getSetting(SettingKey.REST_DAY_WARNING)]);
```

**修復方案**:
```tsx
// ✅ 方案 1: 使用 useCallback 包裹 getSetting
const getRestDayWarningSetting = useCallback(() => {
  return getSetting(SettingKey.REST_DAY_WARNING);
}, [getSetting]);

}, [workoutData, getRestDayWarningSetting]);

// ✅ 方案 2: 提取值到 state
const restDayWarning = useMemo(() =>
  getSetting(SettingKey.REST_DAY_WARNING),
  [getSetting]
);

}, [workoutData, restDayWarning]);
```

---

### 問題 2: 缺少 React.memo 導致不必要的重渲染

**影響組件**: 所有子組件

**修復示例**:
```tsx
// ❌ 當前代碼
export const MuscleGroupCard: React.FC<Props> = ({ muscleGroup, config, onClick }) => {
  return <Card>...</Card>;
};

// ✅ 修復後
export const MuscleGroupCard = React.memo<Props>(({ muscleGroup, config, onClick }) => {
  return <Card>...</Card>;
}, (prevProps, nextProps) => {
  // 只在這些 props 改變時才重新渲染
  return prevProps.muscleGroup === nextProps.muscleGroup &&
         prevProps.config.color === nextProps.config.color;
});
```

---

### 問題 3: 缺少 useCallback 優化事件處理器

**位置**: 所有組件的事件處理函數

**修復示例**:
```tsx
// ❌ 當前代碼 - 每次渲染都創建新函數
const handleClick = (muscleGroup: MuscleGroup) => {
  setSelectedMuscleGroups(prev =>
    prev.includes(muscleGroup)
      ? prev.filter(g => g !== muscleGroup)
      : [...prev, muscleGroup]
  );
};

// ✅ 修復後
const handleClick = useCallback((muscleGroup: MuscleGroup) => {
  setSelectedMuscleGroups(prev =>
    prev.includes(muscleGroup)
      ? prev.filter(g => g !== muscleGroup)
      : [...prev, muscleGroup]
  );
}, []); // 沒有外部依賴
```

---

### 問題 4: 內聯樣式和對象導致重渲染

**位置**: 多個組件中的內聯 style

**修復示例**:
```tsx
// ❌ 當前代碼 - 每次渲染創建新對象
<Card style={{
  backgroundColor: item.bgColor,
  border: `2px solid ${item.textColor}20`,
}}>
  Content
</Card>

// ✅ 修復方案 1: 使用 useMemo
const cardStyle = useMemo(() => ({
  backgroundColor: item.bgColor,
  border: `2px solid ${item.textColor}20`,
}), [item.bgColor, item.textColor]);

<Card style={cardStyle}>
  Content
</Card>

// ✅ 修復方案 2: 使用設計系統
import { getMuscleGroupStyle } from '../theme';

<Card style={getMuscleGroupStyle(muscleGroup)}>
  Content
</Card>
```

---

### 問題 5: Firebase 操作缺少錯誤處理

**位置**: 所有 Firebase 操作

**修復示例**:
```tsx
// ❌ 當前代碼
const saveWorkout = () => {
  createWorkout({
    resource: "workouts",
    values: workoutData,
  });
};

// ✅ 修復後
const saveWorkout = async () => {
  try {
    await createWorkout({
      resource: "workouts",
      values: workoutData,
    }, {
      onSuccess: () => {
        message.success('保存成功！');
        navigate('/calendar');
      },
      onError: (error) => {
        const errorMsg = getFirebaseErrorMessage(error);
        message.error(`保存失敗：${errorMsg}`);
        console.error('Save error:', error);
      }
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    message.error('發生未預期的錯誤');
  }
};
```

---

## 📦 組件拆分計劃

### WorkoutForm.tsx (889 行) → 拆分為：

1. **WorkoutForm.tsx** (主組件, ~200行)
   - 表單邏輯和狀態管理

2. **MuscleGroupSelector.tsx** (~150行)
   - 肌肉群選擇 UI

3. **WorkoutFormFields.tsx** (~150行)
   - 表單欄位集合

4. **useWorkoutForm.ts** (~150行)
   - 表單邏輯 Hook

5. **workoutFormUtils.ts** (~100行)
   - 工具函數

### WorkoutDashboard.tsx (715 行) → 拆分為：

1. **WorkoutDashboard.tsx** (主組件, ~200行)

2. **MuscleGroupGrid.tsx** (~150行)
   - 肌肉群網格顯示

3. **CardioActivityList.tsx** (~100行)
   - 有氧活動列表

4. **RestDayList.tsx** (~100行)
   - 休息日列表

5. **useWorkoutStatistics.ts** (~150行)
   - 統計數據 Hook

---

## 🎨 UI/UX 改進清單

### 立即改進項目：

1. **統一肌肉群配色**
   - ✅ 已創建 `theme/index.ts`
   - ⏳ 需要在所有組件中應用

2. **提取共用組件**
   ```tsx
   // 需要創建的組件：
   src/components/common/
   ├── StatusCard.tsx          // 狀態卡片
   ├── MuscleGroupSelector.tsx // 肌肉群選擇器
   ├── LoadingSpinner.tsx      // 載入動畫
   ├── EmptyState.tsx          // 空狀態
   └── ErrorDisplay.tsx        // 錯誤顯示
   ```

3. **改善響應式設計**
   - 優化小螢幕體驗
   - 改善觸控交互

4. **可訪問性改進**
   ```tsx
   // 添加 ARIA 標籤
   <button
     aria-label="選擇胸肌訓練"
     aria-pressed={isSelected}
     onClick={handleClick}
   >
     胸肌
   </button>
   ```

---

## 📈 性能優化檢查清單

- [ ] 為所有列表項組件添加 React.memo
- [ ] 為所有事件處理器添加 useCallback
- [ ] 為昂貴計算添加 useMemo
- [ ] 提取所有內聯樣式到常量或 useMemo
- [ ] 實施虛擬滾動（如列表超過 100 項）
- [ ] 添加圖片懶加載
- [ ] Code Splitting (路由級別)

---

## 🧪 測試策略

### 第一階段：單元測試
```bash
# 安裝測試工具
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

### 優先測試的組件：
1. useSettings Hook
2. WorkoutDashboard 統計計算
3. MuscleGroupSelector
4. ErrorBoundary
5. useAsyncState Hook

### 測試範例：
```tsx
// src/hooks/__tests__/useAsyncState.test.ts
import { renderHook, act } from '@testing-library/react';
import { useAsyncState } from '../useAsyncState';

describe('useAsyncState', () => {
  it('should handle async operation successfully', async () => {
    const { result } = renderHook(() => useAsyncState<string>());

    await act(async () => {
      await result.current.execute(async () => 'test data');
    });

    expect(result.current.data).toBe('test data');
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
  });
});
```

---

## 🛠️ 開發工具配置

### 1. 添加 Prettier
```bash
npm install -D prettier
```

**創建 `.prettierrc`**:
```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100
}
```

### 2. 改進 ESLint 配置
```json
// .eslintrc.cjs 添加規則
{
  "rules": {
    "react-hooks/exhaustive-deps": "warn",
    "react/prop-types": "off",
    "@typescript-eslint/no-explicit-any": "warn",
    "max-lines": ["warn", { "max": 500 }]
  }
}
```

### 3. 添加 Husky (Git Hooks)
```bash
npm install -D husky lint-staged
npx husky install
```

---

## 📋 實施優先級

### 🔴 第一周：關鍵修復
- [x] ✅ 建立 ErrorBoundary
- [x] ✅ 建立 useAsyncState hooks
- [x] ✅ 建立設計系統
- [x] ✅ 清理 debug 組件
- [ ] ⏳ 修復 useEffect 依賴問題
- [ ] ⏳ 添加 Firebase 錯誤處理

### 🟡 第二周：性能優化
- [ ] 為關鍵組件添加 React.memo
- [ ] 添加 useCallback 到事件處理器
- [ ] 提取內聯樣式
- [ ] 拆分 WorkoutForm 組件
- [ ] 拆分 WorkoutDashboard 組件

### 🟢 第三周：UI/UX 改進
- [ ] 應用設計系統到所有組件
- [ ] 創建共用組件庫
- [ ] 改善可訪問性
- [ ] 優化響應式設計

### 🔵 第四周：測試和文檔
- [ ] 設置測試環境
- [ ] 編寫單元測試（目標 80% 覆蓋率）
- [ ] 編寫整合測試
- [ ] 更新文檔

---

## 🎯 成功指標

專案改進完成後應達到：

- ✅ React 代碼品質: 7.2/10 → **9.0/10**
- ✅ 性能優化: 5.0/10 → **8.5/10**
- ✅ 錯誤處理: 4.0/10 → **9.0/10**
- ✅ 測試覆蓋: 1.0/10 → **8.0/10** (80% 覆蓋率)
- ✅ 代碼可維護性: 所有檔案 < 500 行
- ✅ 無 ESLint 警告或錯誤

---

## 📞 資源和參考

- [React 性能優化最佳實踐](https://react.dev/reference/react/memo)
- [React Hooks 最佳實踐](https://react.dev/reference/react)
- [Firebase 錯誤處理指南](https://firebase.google.com/docs/reference)
- [Ant Design 最佳實踐](https://ant.design/docs/react/introduce)
- [TypeScript 最佳實踐](https://www.typescriptlang.org/docs/handbook/intro.html)

---

**最後更新**: 2025-07-14
**負責團隊**: react-frontend-engineer, project-manager, frontend-ui-designer
