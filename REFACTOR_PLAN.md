# WorkoutForm 組件重構計劃

## 現況分析
- **檔案大小**: 889 行（嚴重超標）
- **問題**:
  1. 單一組件承擔過多職責
  2. 業務邏輯與 UI 混雜
  3. 難以測試和維護
  4. 不利於響應式適配

## 重構策略：組件拆分

### 1. 拆分為獨立組件

```
WorkoutForm/
├── index.tsx                    # 主組件 (~100行)
├── WorkoutForm.types.ts         # 類型定義
├── WorkoutForm.hooks.ts         # 自定義 Hooks
├── WorkoutForm.styles.ts        # 樣式定義
├── components/
│   ├── MuscleGroupSelector/     # 肌群選擇器 (~150行)
│   │   ├── index.tsx
│   │   ├── MuscleGroupCard.tsx
│   │   └── styles.ts
│   ├── CardioForm/             # 有氧運動表單 (~120行)
│   │   ├── index.tsx
│   │   ├── CardioTypeSelect.tsx
│   │   └── CardioMetrics.tsx
│   ├── ExerciseList/           # 運動項目列表 (~200行)
│   │   ├── index.tsx
│   │   ├── ExerciseItem.tsx
│   │   └── AddExerciseModal.tsx
│   ├── WorkoutNotes/           # 筆記區塊 (~80行)
│   │   └── index.tsx
│   └── FormActions/            # 表單操作按鈕 (~50行)
│       └── index.tsx
└── utils/
    ├── validation.ts           # 表單驗證
    └── dataTransform.ts        # 資料轉換
```

### 2. 主組件範例

```typescript
// src/components/WorkoutForm/index.tsx
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { MuscleGroupSelector } from './components/MuscleGroupSelector';
import { CardioForm } from './components/CardioForm';
import { ExerciseList } from './components/ExerciseList';
import { WorkoutNotes } from './components/WorkoutNotes';
import { FormActions } from './components/FormActions';
import { useWorkoutForm } from './WorkoutForm.hooks';
import type { WorkoutFormData } from './WorkoutForm.types';

export const WorkoutForm: React.FC<{ mode: 'create' | 'edit' }> = ({ mode }) => {
  const {
    form,
    isLoading,
    handleSubmit,
    handleCancel
  } = useWorkoutForm(mode);

  const [activeTab, setActiveTab] = useState<'workout' | 'cardio'>('workout');

  return (
    <div className="max-w-4xl mx-auto p-4">
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* 標籤切換 */}
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          <button
            type="button"
            onClick={() => setActiveTab('workout')}
            className={`flex-1 py-2 px-4 rounded-md transition-all ${
              activeTab === 'workout'
                ? 'bg-white shadow-sm'
                : 'hover:bg-gray-50'
            }`}
          >
            重量訓練
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('cardio')}
            className={`flex-1 py-2 px-4 rounded-md transition-all ${
              activeTab === 'cardio'
                ? 'bg-white shadow-sm'
                : 'hover:bg-gray-50'
            }`}
          >
            有氧運動
          </button>
        </div>

        {/* 內容區 */}
        {activeTab === 'workout' ? (
          <>
            <MuscleGroupSelector
              value={form.watch('muscleGroups')}
              onChange={(groups) => form.setValue('muscleGroups', groups)}
            />
            <ExerciseList
              exercises={form.watch('exercises')}
              onChange={(exercises) => form.setValue('exercises', exercises)}
            />
          </>
        ) : (
          <CardioForm
            value={form.watch('cardio')}
            onChange={(cardio) => form.setValue('cardio', cardio)}
          />
        )}

        {/* 共用區塊 */}
        <WorkoutNotes
          value={form.watch('notes')}
          onChange={(notes) => form.setValue('notes', notes)}
        />

        <FormActions
          mode={mode}
          isLoading={isLoading}
          onCancel={handleCancel}
        />
      </form>
    </div>
  );
};
```

### 3. 子組件範例：MuscleGroupSelector

```typescript
// src/components/WorkoutForm/components/MuscleGroupSelector/index.tsx
import { MuscleGroup } from '@/types';
import { MuscleGroupCard } from './MuscleGroupCard';

interface Props {
  value: MuscleGroup[];
  onChange: (groups: MuscleGroup[]) => void;
}

const muscleGroups = [
  { id: MuscleGroup.CHEST, label: '胸肌', icon: '💪', color: 'bg-red-100' },
  { id: MuscleGroup.BACK, label: '背部', icon: '🔥', color: 'bg-blue-100' },
  { id: MuscleGroup.LEGS, label: '腿部', icon: '🦵', color: 'bg-green-100' },
  { id: MuscleGroup.SHOULDERS, label: '肩膀', icon: '⚡', color: 'bg-yellow-100' },
  { id: MuscleGroup.ARMS, label: '手臂', icon: '💯', color: 'bg-purple-100' },
  { id: MuscleGroup.ABS, label: '核心', icon: '🎯', color: 'bg-pink-100' },
];

export const MuscleGroupSelector: React.FC<Props> = ({ value, onChange }) => {
  const toggleGroup = (group: MuscleGroup) => {
    if (value.includes(group)) {
      onChange(value.filter(g => g !== group));
    } else {
      onChange([...value, group]);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">選擇訓練肌群</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {muscleGroups.map(group => (
          <MuscleGroupCard
            key={group.id}
            {...group}
            selected={value.includes(group.id)}
            onClick={() => toggleGroup(group.id)}
          />
        ))}
      </div>
    </div>
  );
};
```

## 遷移步驟

### Step 1: 建立新結構 (1小時)
```bash
# 建立目錄結構
mkdir -p src/components/WorkoutForm/components
mkdir -p src/components/WorkoutForm/utils

# 建立基礎檔案
touch src/components/WorkoutForm/WorkoutForm.types.ts
touch src/components/WorkoutForm/WorkoutForm.hooks.ts
```

### Step 2: 抽取類型定義 (30分鐘)
- 將所有 interface 和 type 移至 WorkoutForm.types.ts

### Step 3: 抽取業務邏輯 (1小時)
- 將 API 呼叫和資料處理移至 WorkoutForm.hooks.ts

### Step 4: 拆分子組件 (4小時)
- 依序建立各子組件
- 確保 props 傳遞正確
- 移除 Ant Design 依賴

### Step 5: 整合測試 (1.5小時)
- 確保功能正常
- 檢查響應式表現
- 驗證表單提交

## 預期成果

### 程式碼品質提升
- **單一職責**: 每個組件專注一項功能
- **可測試性**: 獨立組件易於單元測試
- **可維護性**: 清晰的結構易於理解和修改

### 性能優化
- **Bundle Size**: 移除 Ant Design 後減少約 200KB
- **渲染效能**: React.memo 優化子組件渲染
- **載入速度**: 按需載入子組件

### 開發體驗
- **Hot Reload**: 修改子組件不影響整體
- **除錯簡單**: 問題定位更精確
- **協作友好**: 多人可同時開發不同組件