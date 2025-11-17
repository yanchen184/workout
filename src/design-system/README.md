# 設計系統架構

## 目錄結構
```
src/design-system/
├── components/           # 基礎 UI 組件
│   ├── Button/
│   ├── Card/
│   ├── Form/
│   ├── Modal/
│   └── Layout/
├── hooks/               # 共用 Hooks
│   ├── useTheme.ts
│   ├── useResponsive.ts
│   └── useAnimation.ts
├── styles/              # 樣式系統
│   ├── tokens.ts        # 設計代幣
│   ├── mixins.ts        # 樣式混入
│   └── animations.ts    # 動畫定義
└── utils/               # 工具函數
    ├── cn.ts            # className 合併
    └── responsive.ts    # 響應式工具
```

## 組件範例: Button

```typescript
// src/design-system/components/Button/Button.tsx
import { forwardRef, ButtonHTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    className,
    variant = 'primary',
    size = 'md',
    loading = false,
    fullWidth = false,
    disabled,
    children,
    ...props
  }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
      primary: 'bg-primary-500 text-white hover:bg-primary-600 focus:ring-primary-500',
      secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
      ghost: 'bg-transparent hover:bg-gray-100 text-gray-700 focus:ring-gray-500',
      danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm rounded-md',
      md: 'px-4 py-2 text-base rounded-lg',
      lg: 'px-6 py-3 text-lg rounded-lg',
    };

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          fullWidth && 'w-full',
          loading && 'cursor-wait',
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
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
```

## 使用範例

```tsx
import { Button } from '@/design-system/components/Button';

function MyComponent() {
  return (
    <>
      <Button variant="primary" size="md">
        儲存運動記錄
      </Button>

      <Button variant="secondary" loading>
        載入中...
      </Button>

      <Button variant="danger" fullWidth>
        刪除記錄
      </Button>
    </>
  );
}
```

## 設計代幣 (Design Tokens)

```typescript
// src/design-system/styles/tokens.ts
export const tokens = {
  colors: {
    primary: {
      50: '#fff7ed',
      500: '#f97316',
      600: '#ea580c',
    },
    gray: {
      50: '#f9fafb',
      900: '#111827',
    },
  },
  spacing: {
    xs: '0.5rem',
    sm: '0.75rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
  },
  animation: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
  },
};
```