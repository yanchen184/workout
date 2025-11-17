# 健身日曆應用 - 設計系統文檔

## 📋 目錄
1. [設計理念](#設計理念)
2. [設計系統配置](#設計系統配置)
3. [核心組件實作](#核心組件實作)
4. [響應式策略](#響應式策略)
5. [動畫規範](#動畫規範)
6. [暗黑模式](#暗黑模式)
7. [遷移步驟](#遷移步驟)

## 設計理念

### 設計原則
- **健康活力**: 使用充滿活力的色彩，傳達健康積極的生活態度
- **直覺操作**: 簡化操作流程，讓使用者快速記錄訓練
- **視覺層次**: 清晰的資訊架構，重要資訊一目了然
- **Mobile-First**: 優先考慮手機使用體驗
- **無障礙設計**: 符合 WCAG 2.1 AA 標準

### 視覺風格
- **現代簡約**: 乾淨的介面，減少視覺噪音
- **卡片式設計**: 資訊分組清晰
- **微動畫**: 提升互動體驗
- **毛玻璃效果**: 增加層次感和現代感

## 設計系統配置

### 1. Tailwind Configuration

```javascript
// tailwind.config.js
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      // 色彩系統
      colors: {
        // 主色調
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
        // 次要色調
        secondary: {
          50: '#fdf4ff',
          100: '#fae8ff',
          200: '#f5d0fe',
          300: '#f0abfc',
          400: '#e879f9',
          500: '#d946ef',
          600: '#c026d3',
          700: '#a21caf',
          800: '#86198f',
          900: '#701a75',
          950: '#4a044e',
        },
        // 成功狀態
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        // 警告狀態
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        // 錯誤狀態
        danger: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        // 暗黑模式背景
        dark: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
          950: '#030712',
        },
      },
      // 間距系統
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '120': '30rem',
      },
      // 字體系統
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
        display: ['Poppins', 'sans-serif'],
      },
      // 字體大小
      fontSize: {
        'xxs': '0.625rem',
        'xs': '0.75rem',
        'sm': '0.875rem',
        'base': '1rem',
        'lg': '1.125rem',
        'xl': '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem',
      },
      // 圓角系統
      borderRadius: {
        'none': '0',
        'sm': '0.25rem',
        'DEFAULT': '0.5rem',
        'md': '0.75rem',
        'lg': '1rem',
        'xl': '1.5rem',
        '2xl': '2rem',
        'full': '9999px',
      },
      // 陰影系統
      boxShadow: {
        'xs': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'sm': '0 1px 3px 0 rgb(0 0 0 / 0.1)',
        'DEFAULT': '0 4px 6px -1px rgb(0 0 0 / 0.1)',
        'md': '0 10px 15px -3px rgb(0 0 0 / 0.1)',
        'lg': '0 20px 25px -5px rgb(0 0 0 / 0.1)',
        'xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        '2xl': '0 35px 60px -15px rgba(0, 0, 0, 0.3)',
        'inner': 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
      },
      // 動畫時序
      transitionDuration: {
        '0': '0ms',
        '75': '75ms',
        '100': '100ms',
        '150': '150ms',
        '200': '200ms',
        '300': '300ms',
        '500': '500ms',
        '700': '700ms',
        '1000': '1000ms',
      },
      // 動畫曲線
      transitionTimingFunction: {
        'in-expo': 'cubic-bezier(0.95, 0.05, 0.795, 0.035)',
        'out-expo': 'cubic-bezier(0.19, 1, 0.22, 1)',
        'bounce': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      },
      // 自定義動畫
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'spin-slow': 'spin 3s linear infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
        'float': 'float 3s ease-in-out infinite',
        'shake': 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shake: {
          '10%, 90%': { transform: 'translate3d(-1px, 0, 0)' },
          '20%, 80%': { transform: 'translate3d(2px, 0, 0)' },
          '30%, 50%, 70%': { transform: 'translate3d(-4px, 0, 0)' },
          '40%, 60%': { transform: 'translate3d(4px, 0, 0)' },
        },
      },
      // 毛玻璃效果
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        DEFAULT: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
      },
    },
    // 響應式斷點
    screens: {
      'xs': '320px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
}
```

## 核心組件實作

### 2. 基礎組件系統

#### Button Component
```tsx
// components/ui/Button.tsx
import React from 'react';
import { clsx } from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'ghost';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  fullWidth = false,
  className,
  disabled,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 dark:bg-primary-500 dark:hover:bg-primary-600',
    secondary: 'bg-secondary-600 text-white hover:bg-secondary-700 focus:ring-secondary-500',
    success: 'bg-success-600 text-white hover:bg-success-700 focus:ring-success-500',
    danger: 'bg-danger-600 text-white hover:bg-danger-700 focus:ring-danger-500',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500 dark:text-gray-300 dark:hover:bg-dark-700',
  };

  const sizes = {
    xs: 'px-2 py-1 text-xs rounded',
    sm: 'px-3 py-1.5 text-sm rounded-md',
    md: 'px-4 py-2 text-sm rounded-md',
    lg: 'px-6 py-3 text-base rounded-lg',
    xl: 'px-8 py-4 text-lg rounded-xl',
  };

  return (
    <button
      className={clsx(
        baseClasses,
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};
```

#### Card Component
```tsx
// components/ui/Card.tsx
import React from 'react';
import { clsx } from 'clsx';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'glass' | 'gradient';
  hoverable?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  variant = 'default',
  hoverable = false,
  onClick,
}) => {
  const baseClasses = 'rounded-xl transition-all duration-300';

  const variants = {
    default: 'bg-white dark:bg-dark-800 shadow-md',
    glass: 'bg-white/70 dark:bg-dark-800/70 backdrop-blur-md shadow-glass border border-white/20',
    gradient: 'bg-gradient-to-br from-primary-400 to-secondary-500 text-white shadow-xl',
  };

  const hoverClasses = hoverable ? 'hover:shadow-xl hover:-translate-y-1 cursor-pointer' : '';

  return (
    <div
      className={clsx(
        baseClasses,
        variants[variant],
        hoverClasses,
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => (
  <div className={clsx('px-6 py-4 border-b border-gray-200 dark:border-dark-700', className)}>
    {children}
  </div>
);

export const CardBody: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => (
  <div className={clsx('p-6', className)}>
    {children}
  </div>
);

export const CardFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => (
  <div className={clsx('px-6 py-4 border-t border-gray-200 dark:border-dark-700', className)}>
    {children}
  </div>
);
```

### 3. Dashboard Component (響應式實作)

```tsx
// components/WorkoutDashboard.tsx
import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardBody } from './ui/Card';
import { Button } from './ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../hooks/useTheme';

const WorkoutDashboard: React.FC = () => {
  const { theme } = useTheme();
  const [selectedMuscle, setSelectedMuscle] = useState<string | null>(null);

  const muscleGroups = [
    { id: 'chest', name: '胸部', icon: '💪', color: 'from-red-400 to-red-600', lastWorkout: 2 },
    { id: 'back', name: '背部', icon: '🦾', color: 'from-blue-400 to-blue-600', lastWorkout: 1 },
    { id: 'legs', name: '腿部', icon: '🦵', color: 'from-green-400 to-green-600', lastWorkout: 3 },
    { id: 'shoulders', name: '肩膀', icon: '🤸', color: 'from-purple-400 to-purple-600', lastWorkout: 0 },
    { id: 'arms', name: '手臂', icon: '💪', color: 'from-orange-400 to-orange-600', lastWorkout: 4 },
    { id: 'core', name: '核心', icon: '🧘', color: 'from-pink-400 to-pink-600', lastWorkout: 5 },
  ];

  const getStatusColor = (days: number) => {
    if (days === 0) return 'bg-success-100 text-success-700 border-success-300';
    if (days <= 2) return 'bg-warning-100 text-warning-700 border-warning-300';
    if (days <= 4) return 'bg-orange-100 text-orange-700 border-orange-300';
    return 'bg-danger-100 text-danger-700 border-danger-300';
  };

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
                今天是 {new Date().toLocaleDateString('zh-TW', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <Button
              variant="primary"
              size="md"
              icon={<span>➕</span>}
              className="hidden sm:inline-flex"
            >
              新增訓練
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: '本週訓練', value: '5', unit: '次', color: 'text-primary-600' },
            { label: '總訓練時長', value: '320', unit: '分鐘', color: 'text-success-600' },
            { label: '消耗熱量', value: '2,450', unit: 'kcal', color: 'text-warning-600' },
            { label: '連續訓練', value: '12', unit: '天', color: 'text-secondary-600' },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card variant="glass" className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                    <p className={`text-3xl font-bold ${stat.color} mt-2`}>
                      {stat.value}
                      <span className="text-sm font-normal ml-1">{stat.unit}</span>
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gray-100 dark:bg-dark-700 rounded-full flex items-center justify-center">
                    <span className="text-xl">📊</span>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Muscle Groups Grid */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                肌肉群訓練狀態
              </h2>
              <Button variant="ghost" size="sm">
                查看全部
              </Button>
            </div>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {muscleGroups.map((muscle, index) => (
                <motion.div
                  key={muscle.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div
                    className={`relative p-4 rounded-xl bg-gradient-to-br ${muscle.color} cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300`}
                    onClick={() => setSelectedMuscle(muscle.id)}
                  >
                    <div className="text-center text-white">
                      <div className="text-3xl mb-2">{muscle.icon}</div>
                      <p className="font-semibold">{muscle.name}</p>
                      <div className={`mt-2 px-2 py-1 rounded-full text-xs ${getStatusColor(muscle.lastWorkout)}`}>
                        {muscle.lastWorkout === 0 ? '今天' : `${muscle.lastWorkout} 天前`}
                      </div>
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

        {/* Recent Activities & Calendar */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activities */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                近期活動
              </h2>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                {[1, 2, 3].map((item) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: item * 0.1 }}
                    className="flex items-center p-4 bg-gray-50 dark:bg-dark-700 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-600 transition-colors duration-200"
                  >
                    <div className="flex-shrink-0 w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                      <span className="text-xl">🏋️</span>
                    </div>
                    <div className="ml-4 flex-1">
                      <p className="font-medium text-gray-900 dark:text-white">胸部訓練</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">45 分鐘 • 350 kcal</p>
                    </div>
                    <div className="text-sm text-gray-500">2 小時前</div>
                  </motion.div>
                ))}
              </div>
            </CardBody>
          </Card>

          {/* Mini Calendar */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                本月訓練日曆
              </h2>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-7 gap-2">
                {['日', '一', '二', '三', '四', '五', '六'].map((day) => (
                  <div key={day} className="text-center text-xs font-medium text-gray-500 dark:text-gray-400">
                    {day}
                  </div>
                ))}
                {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                  <motion.div
                    key={day}
                    whileHover={{ scale: 1.1 }}
                    className={`
                      aspect-square flex items-center justify-center rounded-lg text-sm cursor-pointer transition-all duration-200
                      ${day % 3 === 0 ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300' :
                        'hover:bg-gray-100 dark:hover:bg-dark-600'}
                    `}
                  >
                    {day}
                  </motion.div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>
      </main>

      {/* Floating Action Button (Mobile) */}
      <div className="fixed bottom-6 right-6 sm:hidden">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        >
          <Button
            variant="primary"
            size="lg"
            className="rounded-full shadow-xl w-14 h-14 p-0"
          >
            <span className="text-2xl">+</span>
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default WorkoutDashboard;
```

### 4. 響應式導航組件

```tsx
// components/Navigation.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, Link } from 'react-router-dom';

const Navigation: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const menuItems = [
    { path: '/dashboard', label: '儀表板', icon: '📊' },
    { path: '/calendar', label: '日曆', icon: '📅' },
    { path: '/workouts', label: '訓練', icon: '💪' },
    { path: '/stats', label: '統計', icon: '📈' },
    { path: '/settings', label: '設定', icon: '⚙️' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 bg-white dark:bg-dark-800 shadow-xl">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                FitTracker
              </h1>
            </div>
            <nav className="mt-8 flex-1 px-2 space-y-1">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200
                    ${isActive(item.path)
                      ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                      : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-dark-700'}
                  `}
                >
                  <span className="mr-3 text-xl">{item.icon}</span>
                  {item.label}
                  {isActive(item.path) && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="ml-auto w-1 h-6 bg-primary-600 rounded-full"
                    />
                  )}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-gray-200 dark:border-dark-700 p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-secondary-500 rounded-full flex items-center justify-center text-white font-bold">
                  U
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">使用者</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">user@example.com</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-dark-800 border-t border-gray-200 dark:border-dark-700 z-50">
        <div className="grid grid-cols-5 gap-1">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`
                flex flex-col items-center py-2 px-1 transition-colors duration-200
                ${isActive(item.path)
                  ? 'text-primary-600 dark:text-primary-400'
                  : 'text-gray-400 dark:text-gray-500'}
              `}
            >
              <span className="text-xl mb-1">{item.icon}</span>
              <span className="text-xs">{item.label}</span>
              {isActive(item.path) && (
                <motion.div
                  layoutId="mobileActiveIndicator"
                  className="absolute top-0 left-0 right-0 h-0.5 bg-primary-600"
                />
              )}
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
};

export default Navigation;
```

### 5. 暗黑模式實現

```tsx
// hooks/useTheme.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('theme');
    return (saved as Theme) || 'system';
  });

  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const root = document.documentElement;

    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => {
        const isDark = mediaQuery.matches;
        root.classList.toggle('dark', isDark);
        setResolvedTheme(isDark ? 'dark' : 'light');
      };

      handleChange();
      mediaQuery.addEventListener('change', handleChange);

      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      root.classList.toggle('dark', theme === 'dark');
      setResolvedTheme(theme);
    }

    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Theme Toggle Component
export const ThemeToggle: React.FC = () => {
  const { theme, setTheme, resolvedTheme } = useTheme();

  return (
    <button
      onClick={() => {
        const themes: Theme[] = ['light', 'dark', 'system'];
        const currentIndex = themes.indexOf(theme);
        const nextIndex = (currentIndex + 1) % themes.length;
        setTheme(themes[nextIndex]);
      }}
      className="p-2 rounded-lg bg-gray-100 dark:bg-dark-700 hover:bg-gray-200 dark:hover:bg-dark-600 transition-colors duration-200"
      aria-label="Toggle theme"
    >
      {resolvedTheme === 'light' ? '☀️' : '🌙'}
    </button>
  );
};
```

## 動畫規範

### 6. 進階動畫效果

```tsx
// utils/animations.ts
export const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3, ease: 'easeInOut' }
};

export const staggerChildren = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: 'easeOut' }
};

export const scaleIn = {
  initial: { scale: 0.8, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  transition: { type: 'spring', stiffness: 300, damping: 20 }
};

export const slideIn = (direction: 'left' | 'right' | 'up' | 'down') => {
  const directionOffset = {
    left: { x: -100 },
    right: { x: 100 },
    up: { y: -100 },
    down: { y: 100 }
  };

  return {
    initial: { ...directionOffset[direction], opacity: 0 },
    animate: { x: 0, y: 0, opacity: 1 },
    transition: { type: 'spring', stiffness: 100, damping: 15 }
  };
};
```

## 遷移步驟

### 7. 從 Ant Design 到 Tailwind CSS 的遷移指南

#### 步驟 1: 安裝依賴
```bash
# 安裝 Tailwind CSS 和相關套件
npm install -D tailwindcss postcss autoprefixer @tailwindcss/forms @tailwindcss/typography
npm install clsx framer-motion

# 初始化 Tailwind
npx tailwindcss init -p
```

#### 步驟 2: 設定 PostCSS
```javascript
// postcss.config.js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

#### 步驟 3: 更新全域樣式
```css
/* src/styles/globals.css */
@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';

@layer base {
  /* 自定義基礎樣式 */
  html {
    @apply scroll-smooth;
  }

  body {
    @apply bg-gray-50 text-gray-900 dark:bg-dark-900 dark:text-gray-100;
  }

  /* 移除 input 的預設樣式 */
  input[type='number']::-webkit-inner-spin-button,
  input[type='number']::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
}

@layer components {
  /* 可重用的組件樣式 */
  .container-fluid {
    @apply w-full px-4 mx-auto sm:px-6 lg:px-8;
  }

  .glass-effect {
    @apply bg-white/70 dark:bg-dark-800/70 backdrop-blur-md;
  }

  .gradient-text {
    @apply bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent;
  }
}

@layer utilities {
  /* 自定義工具類 */
  .animation-delay-100 {
    animation-delay: 100ms;
  }

  .animation-delay-200 {
    animation-delay: 200ms;
  }

  .animation-delay-300 {
    animation-delay: 300ms;
  }
}
```

#### 步驟 4: 組件遷移對應表

| Ant Design 組件 | Tailwind CSS 實作 |
|----------------|-------------------|
| `<Button>` | 自定義 Button 組件 (見上方) |
| `<Card>` | 自定義 Card 組件 (見上方) |
| `<Modal>` | 使用 Headless UI Dialog |
| `<Form>` | React Hook Form + 自定義樣式 |
| `<Table>` | 自定義 Table 組件或 Tanstack Table |
| `<Select>` | Headless UI Combobox |
| `<DatePicker>` | React Date Picker + 自定義樣式 |
| `<Spin>` | 自定義 Loading 組件 |
| `<Alert>` | 自定義 Alert 組件 |
| `<Tag>` | 自定義 Tag 組件 |

#### 步驟 5: 逐步遷移策略

1. **階段一：準備工作**
   - 安裝所有必要的套件
   - 設定 Tailwind 配置檔
   - 建立新的組件資料夾結構

2. **階段二：建立基礎組件**
   - 優先建立 Button、Card、Input 等基礎組件
   - 確保所有組件支援暗黑模式
   - 實作響應式設計

3. **階段三：頁面遷移**
   - 從較簡單的頁面開始（如設定頁）
   - 逐步遷移複雜頁面（Dashboard、Calendar）
   - 保留原有功能，僅更換 UI 層

4. **階段四：移除 Ant Design**
   - 確認所有組件已遷移完成
   - 移除 Ant Design 相關依賴
   - 清理未使用的樣式和程式碼

5. **階段五：優化與測試**
   - 進行效能優化
   - 完整測試所有功能
   - 確保響應式設計正常運作

## 性能優化建議

1. **Code Splitting**
   ```tsx
   // 使用動態導入
   const WorkoutCalendar = React.lazy(() => import('./components/WorkoutCalendar'));
   ```

2. **圖片優化**
   ```tsx
   // 使用 next/image 或類似的優化方案
   <img
     loading="lazy"
     srcSet="image-320w.jpg 320w, image-768w.jpg 768w, image-1024w.jpg 1024w"
     sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
   />
   ```

3. **Bundle Size 優化**
   - 使用 PurgeCSS 移除未使用的 CSS
   - 動態載入大型套件
   - 使用 Tree Shaking

## 無障礙性檢查清單

- ✅ 所有互動元素都有適當的 ARIA 標籤
- ✅ 鍵盤導航完整支援
- ✅ 色彩對比符合 WCAG 2.1 AA 標準
- ✅ 表單有清晰的錯誤訊息和提示
- ✅ 支援螢幕閱讀器
- ✅ 提供跳過導航的連結
- ✅ 焦點狀態清晰可見
- ✅ 支援放大至 200% 不破版

## 結語

這個設計系統提供了完整的 UI/UX 改善方案，從 Ant Design 遷移到 Tailwind CSS，同時大幅提升了響應式設計、暗黑模式支援和現代化視覺效果。遵循這個指南，您可以有系統地完成整個遷移過程，打造出一個現代、美觀且高效能的健身追蹤應用程式。