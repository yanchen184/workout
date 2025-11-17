# 組件庫實作指南

## 📦 完整組件實作

### 1. Form Components

#### Input Component
```tsx
// src/components/ui/Input.tsx
import React, { forwardRef } from 'react';
import { clsx } from 'clsx';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
  suffix?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, icon, suffix, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 dark:text-gray-400">{icon}</span>
            </div>
          )}
          <input
            ref={ref}
            className={clsx(
              'block w-full rounded-lg border-gray-300 dark:border-dark-600',
              'bg-white dark:bg-dark-800',
              'text-gray-900 dark:text-gray-100',
              'focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
              'placeholder-gray-400 dark:placeholder-gray-500',
              'transition-all duration-200',
              icon && 'pl-10',
              suffix && 'pr-10',
              error && 'border-danger-500 focus:ring-danger-500 focus:border-danger-500',
              className
            )}
            {...props}
          />
          {suffix && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              {suffix}
            </div>
          )}
        </div>
        {error && (
          <p className="mt-1 text-sm text-danger-600 dark:text-danger-400">{error}</p>
        )}
        {helperText && !error && (
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
```

#### Select Component
```tsx
// src/components/ui/Select.tsx
import React, { Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { ChevronUpDownIcon, CheckIcon } from '@heroicons/react/20/solid';
import { clsx } from 'clsx';

interface Option {
  value: string | number;
  label: string;
  icon?: React.ReactNode;
}

interface SelectProps {
  value: string | number;
  onChange: (value: string | number) => void;
  options: Option[];
  label?: string;
  error?: string;
  placeholder?: string;
}

export const Select: React.FC<SelectProps> = ({
  value,
  onChange,
  options,
  label,
  error,
  placeholder = '請選擇',
}) => {
  const selected = options.find(opt => opt.value === value);

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
        </label>
      )}
      <Listbox value={value} onChange={onChange}>
        <div className="relative">
          <Listbox.Button
            className={clsx(
              'relative w-full cursor-pointer rounded-lg bg-white dark:bg-dark-800',
              'border border-gray-300 dark:border-dark-600',
              'py-2 pl-3 pr-10 text-left',
              'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
              'transition-all duration-200',
              error && 'border-danger-500'
            )}
          >
            <span className="flex items-center">
              {selected?.icon && <span className="mr-2">{selected.icon}</span>}
              <span className={clsx('block truncate', !selected && 'text-gray-400')}>
                {selected?.label || placeholder}
              </span>
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options
              className={clsx(
                'absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg',
                'bg-white dark:bg-dark-800 py-1 shadow-lg ring-1 ring-black ring-opacity-5',
                'focus:outline-none'
              )}
            >
              {options.map((option) => (
                <Listbox.Option
                  key={option.value}
                  className={({ active }) =>
                    clsx(
                      'relative cursor-pointer select-none py-2 pl-10 pr-4',
                      active ? 'bg-primary-100 dark:bg-primary-900 text-primary-900 dark:text-primary-100' : 'text-gray-900 dark:text-gray-100'
                    )
                  }
                  value={option.value}
                >
                  {({ selected }) => (
                    <>
                      <span className="flex items-center">
                        {option.icon && <span className="mr-2">{option.icon}</span>}
                        <span className={clsx('block truncate', selected && 'font-medium')}>
                          {option.label}
                        </span>
                      </span>
                      {selected && (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary-600 dark:text-primary-400">
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      )}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
      {error && (
        <p className="mt-1 text-sm text-danger-600 dark:text-danger-400">{error}</p>
      )}
    </div>
  );
};
```

### 2. Modal Component

```tsx
// src/components/ui/Modal.tsx
import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { clsx } from 'clsx';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showCloseButton?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
}) => {
  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-7xl',
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30 dark:bg-black/50 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel
                className={clsx(
                  'relative transform overflow-hidden rounded-xl',
                  'bg-white dark:bg-dark-800',
                  'text-left shadow-xl transition-all',
                  'w-full',
                  sizes[size]
                )}
              >
                {(title || showCloseButton) && (
                  <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-dark-700">
                    {title && (
                      <Dialog.Title as="h3" className="text-xl font-semibold text-gray-900 dark:text-white">
                        {title}
                      </Dialog.Title>
                    )}
                    {showCloseButton && (
                      <button
                        type="button"
                        className="ml-auto rounded-lg p-1.5 text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
                        onClick={onClose}
                      >
                        <XMarkIcon className="h-6 w-6" />
                      </button>
                    )}
                  </div>
                )}
                <div className="p-6">
                  {children}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};
```

### 3. Calendar Component

```tsx
// src/components/WorkoutCalendar.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dayjs from 'dayjs';
import { clsx } from 'clsx';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface WorkoutData {
  date: string;
  muscleGroups: string[];
  completed: boolean;
}

interface CalendarProps {
  workouts: WorkoutData[];
  onDateClick?: (date: string) => void;
}

export const Calendar: React.FC<CalendarProps> = ({ workouts, onDateClick }) => {
  const [currentMonth, setCurrentMonth] = useState(dayjs());

  const workoutMap = new Map(workouts.map(w => [w.date, w]));

  const startOfMonth = currentMonth.startOf('month');
  const endOfMonth = currentMonth.endOf('month');
  const startDate = startOfMonth.startOf('week');
  const endDate = endOfMonth.endOf('week');

  const days = [];
  let currentDate = startDate;

  while (currentDate.isBefore(endDate) || currentDate.isSame(endDate)) {
    days.push(currentDate);
    currentDate = currentDate.add(1, 'day');
  }

  const muscleGroupColors = {
    chest: 'bg-red-500',
    back: 'bg-blue-500',
    legs: 'bg-green-500',
    shoulders: 'bg-purple-500',
    arms: 'bg-orange-500',
    core: 'bg-pink-500',
    cardio: 'bg-yellow-500',
  };

  return (
    <div className="bg-white dark:bg-dark-800 rounded-xl shadow-lg p-6">
      {/* Calendar Header */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => setCurrentMonth(currentMonth.subtract(1, 'month'))}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
        >
          <ChevronLeftIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        </button>

        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          {currentMonth.format('YYYY年 MMMM')}
        </h2>

        <button
          onClick={() => setCurrentMonth(currentMonth.add(1, 'month'))}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
        >
          <ChevronRightIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        </button>
      </div>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['日', '一', '二', '三', '四', '五', '六'].map((day) => (
          <div key={day} className="text-center text-sm font-medium text-gray-600 dark:text-gray-400 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Days */}
      <div className="grid grid-cols-7 gap-1">
        <AnimatePresence mode="popLayout">
          {days.map((day, index) => {
            const dateStr = day.format('YYYY-MM-DD');
            const workout = workoutMap.get(dateStr);
            const isCurrentMonth = day.month() === currentMonth.month();
            const isToday = day.isSame(dayjs(), 'day');

            return (
              <motion.div
                key={dateStr}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2, delay: index * 0.01 }}
                className={clsx(
                  'aspect-square p-2 rounded-lg cursor-pointer transition-all duration-200',
                  'hover:bg-gray-100 dark:hover:bg-dark-700',
                  isCurrentMonth ? 'bg-white dark:bg-dark-800' : 'bg-gray-50 dark:bg-dark-900',
                  isToday && 'ring-2 ring-primary-500',
                  workout?.completed && 'bg-success-50 dark:bg-success-900/20'
                )}
                onClick={() => onDateClick?.(dateStr)}
              >
                <div className="h-full flex flex-col">
                  <div className={clsx(
                    'text-sm font-medium mb-1',
                    isCurrentMonth ? 'text-gray-900 dark:text-gray-100' : 'text-gray-400 dark:text-gray-600',
                    isToday && 'text-primary-600 dark:text-primary-400'
                  )}>
                    {day.date()}
                  </div>

                  {workout && (
                    <div className="flex flex-wrap gap-0.5">
                      {workout.muscleGroups.slice(0, 3).map((group, i) => (
                        <div
                          key={i}
                          className={clsx(
                            'w-2 h-2 rounded-full',
                            muscleGroupColors[group as keyof typeof muscleGroupColors] || 'bg-gray-400'
                          )}
                        />
                      ))}
                      {workout.muscleGroups.length > 3 && (
                        <span className="text-xxs text-gray-500">+{workout.muscleGroups.length - 3}</span>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-dark-700">
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-success-500 rounded-full" />
            <span className="text-xs text-gray-600 dark:text-gray-400">已完成</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-warning-500 rounded-full" />
            <span className="text-xs text-gray-600 dark:text-gray-400">計劃中</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 ring-2 ring-primary-500 rounded-full" />
            <span className="text-xs text-gray-600 dark:text-gray-400">今天</span>
          </div>
        </div>
      </div>
    </div>
  );
};
```

### 4. Workout Form Component

```tsx
// src/components/WorkoutForm.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Input } from './ui/Input';
import { Select } from './ui/Select';
import { Button } from './ui/Button';
import { Card, CardHeader, CardBody, CardFooter } from './ui/Card';
import { Switch } from '@headlessui/react';
import { clsx } from 'clsx';

interface WorkoutFormData {
  date: string;
  muscleGroups: string[];
  duration: number;
  notes: string;
  completed: boolean;
  isRestDay: boolean;
  cardioDetails?: {
    type: string;
    distance?: number;
    duration?: number;
    calories?: number;
  };
}

interface WorkoutFormProps {
  initialData?: Partial<WorkoutFormData>;
  onSubmit: (data: WorkoutFormData) => void;
  onCancel: () => void;
}

export const WorkoutForm: React.FC<WorkoutFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState<WorkoutFormData>({
    date: initialData?.date || new Date().toISOString().split('T')[0],
    muscleGroups: initialData?.muscleGroups || [],
    duration: initialData?.duration || 60,
    notes: initialData?.notes || '',
    completed: initialData?.completed || false,
    isRestDay: initialData?.isRestDay || false,
    cardioDetails: initialData?.cardioDetails,
  });

  const muscleGroups = [
    { id: 'chest', name: '胸部', icon: '💪', description: '胸大肌、胸小肌' },
    { id: 'back', name: '背部', icon: '🦾', description: '背闊肌、斜方肌、豎脊肌' },
    { id: 'legs', name: '腿部', icon: '🦵', description: '股四頭肌、腿後肌、臀大肌' },
    { id: 'shoulders', name: '肩膀', icon: '🤸', description: '三角肌前中後束' },
    { id: 'arms', name: '手臂', icon: '💪', description: '二頭肌、三頭肌、前臂' },
    { id: 'core', name: '核心', icon: '🧘', description: '腹肌、腹外斜肌、下背' },
    { id: 'cardio', name: '有氧', icon: '🏃', description: '跑步、游泳、單車等' },
  ];

  const cardioTypes = [
    { value: 'running', label: '跑步', icon: '🏃' },
    { value: 'swimming', label: '游泳', icon: '🏊' },
    { value: 'cycling', label: '騎車', icon: '🚴' },
    { value: 'basketball', label: '籃球', icon: '🏀' },
    { value: 'yoga', label: '瑜伽', icon: '🧘' },
    { value: 'other', label: '其他', icon: '🏃' },
  ];

  const toggleMuscleGroup = (groupId: string) => {
    setFormData(prev => ({
      ...prev,
      muscleGroups: prev.muscleGroups.includes(groupId)
        ? prev.muscleGroups.filter(g => g !== groupId)
        : [...prev.muscleGroups, groupId]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {initialData ? '編輯訓練計劃' : '新增訓練計劃'}
          </h2>
        </CardHeader>

        <CardBody className="space-y-6">
          {/* Date Input */}
          <Input
            type="date"
            label="訓練日期"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
          />

          {/* Rest Day Toggle */}
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-700 rounded-lg">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">休息日</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                今天是休息日，不進行重量訓練
              </p>
            </div>
            <Switch
              checked={formData.isRestDay}
              onChange={(checked) => setFormData({ ...formData, isRestDay: checked })}
              className={clsx(
                'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                formData.isRestDay ? 'bg-primary-600' : 'bg-gray-200 dark:bg-dark-600'
              )}
            >
              <span className={clsx(
                'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                formData.isRestDay ? 'translate-x-6' : 'translate-x-1'
              )} />
            </Switch>
          </div>

          {/* Muscle Groups Selection */}
          {!formData.isRestDay && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                選擇訓練部位
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {muscleGroups.map((group) => (
                  <motion.div
                    key={group.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <button
                      type="button"
                      onClick={() => toggleMuscleGroup(group.id)}
                      className={clsx(
                        'w-full p-3 rounded-lg border-2 transition-all duration-200',
                        formData.muscleGroups.includes(group.id)
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-dark-600 hover:border-gray-300 dark:hover:border-dark-500'
                      )}
                    >
                      <div className="text-2xl mb-1">{group.icon}</div>
                      <p className="font-medium text-sm text-gray-900 dark:text-white">
                        {group.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {group.description}
                      </p>
                      {formData.muscleGroups.includes(group.id) && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute top-2 right-2 w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center"
                        >
                          <span className="text-white text-xs">✓</span>
                        </motion.div>
                      )}
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Cardio Details */}
          {(formData.isRestDay || formData.muscleGroups.includes('cardio')) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg"
            >
              <h3 className="font-medium text-gray-900 dark:text-white">有氧運動詳情</h3>

              <Select
                label="運動類型"
                options={cardioTypes}
                value={formData.cardioDetails?.type || ''}
                onChange={(value) => setFormData({
                  ...formData,
                  cardioDetails: { ...formData.cardioDetails, type: value as string }
                })}
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Input
                  type="number"
                  label="距離（公里）"
                  value={formData.cardioDetails?.distance || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    cardioDetails: {
                      ...formData.cardioDetails,
                      distance: parseFloat(e.target.value)
                    }
                  })}
                  min="0"
                  step="0.1"
                />

                <Input
                  type="number"
                  label="時間（分鐘）"
                  value={formData.cardioDetails?.duration || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    cardioDetails: {
                      ...formData.cardioDetails,
                      duration: parseInt(e.target.value)
                    }
                  })}
                  min="0"
                />

                <Input
                  type="number"
                  label="消耗熱量"
                  value={formData.cardioDetails?.calories || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    cardioDetails: {
                      ...formData.cardioDetails,
                      calories: parseInt(e.target.value)
                    }
                  })}
                  min="0"
                />
              </div>
            </motion.div>
          )}

          {/* Duration */}
          {!formData.isRestDay && (
            <Input
              type="number"
              label="訓練時長（分鐘）"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
              min="0"
              required
            />
          )}

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              訓練筆記
            </label>
            <textarea
              className={clsx(
                'block w-full rounded-lg border-gray-300 dark:border-dark-600',
                'bg-white dark:bg-dark-800',
                'text-gray-900 dark:text-gray-100',
                'focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
                'placeholder-gray-400 dark:placeholder-gray-500',
                'transition-all duration-200'
              )}
              rows={4}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="記錄今天的訓練感受、進步或需要改進的地方..."
            />
          </div>

          {/* Completed Status */}
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-700 rounded-lg">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">訓練狀態</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {formData.completed ? '已完成訓練' : '計劃中'}
              </p>
            </div>
            <Switch
              checked={formData.completed}
              onChange={(checked) => setFormData({ ...formData, completed: checked })}
              className={clsx(
                'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                formData.completed ? 'bg-success-600' : 'bg-gray-200 dark:bg-dark-600'
              )}
            >
              <span className={clsx(
                'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                formData.completed ? 'translate-x-6' : 'translate-x-1'
              )} />
            </Switch>
          </div>
        </CardBody>

        <CardFooter>
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={onCancel}
            >
              取消
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={!formData.isRestDay && formData.muscleGroups.length === 0}
            >
              {initialData ? '更新' : '新增'}訓練計劃
            </Button>
          </div>
        </CardFooter>
      </Card>
    </form>
  );
};
```

## 🎨 進階樣式工具

### 5. 自定義 Hooks

```tsx
// src/hooks/useResponsive.ts
import { useEffect, useState } from 'react';

const breakpoints = {
  xs: 320,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

export const useResponsive = () => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return {
    ...windowSize,
    isMobile: windowSize.width < breakpoints.sm,
    isTablet: windowSize.width >= breakpoints.sm && windowSize.width < breakpoints.lg,
    isDesktop: windowSize.width >= breakpoints.lg,
    breakpoint: Object.entries(breakpoints)
      .reverse()
      .find(([_, value]) => windowSize.width >= value)?.[0] || 'xs',
  };
};
```

### 6. 載入動畫組件

```tsx
// src/components/ui/Loading.tsx
import React from 'react';
import { motion } from 'framer-motion';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  fullScreen?: boolean;
}

export const Loading: React.FC<LoadingProps> = ({
  size = 'md',
  text = '載入中...',
  fullScreen = false,
}) => {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  const dotSizes = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4',
  };

  const Spinner = () => (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className={`relative ${sizes[size]}`}>
        <motion.div
          className="absolute inset-0"
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
        >
          {[0, 1, 2, 3].map((index) => (
            <motion.div
              key={index}
              className={`absolute ${dotSizes[size]} bg-primary-500 rounded-full`}
              style={{
                top: '50%',
                left: '50%',
                transform: `rotate(${index * 90}deg) translateY(-150%)`,
              }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [1, 0.5, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: index * 0.2,
              }}
            />
          ))}
        </motion.div>
      </div>
      {text && (
        <motion.p
          className="text-sm text-gray-600 dark:text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {text}
        </motion.p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 dark:bg-dark-900/80 backdrop-blur-sm z-50 flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return <Spinner />;
};

// Skeleton Loading Component
export const Skeleton: React.FC<{
  className?: string;
  animate?: boolean;
}> = ({ className = '', animate = true }) => {
  return (
    <div
      className={`
        bg-gray-200 dark:bg-dark-700 rounded
        ${animate ? 'animate-pulse' : ''}
        ${className}
      `}
    />
  );
};
```

## 結語

這個組件庫提供了完整的 UI 組件實作，所有組件都：
- ✅ 支援暗黑模式
- ✅ 完全響應式設計
- ✅ 包含動畫效果
- ✅ 遵循無障礙標準
- ✅ 使用 TypeScript 確保型別安全
- ✅ 可直接複製使用

透過這些組件，您可以快速建立現代化的健身應用介面，同時保持高品質的使用者體驗。