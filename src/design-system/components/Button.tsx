import React, { forwardRef } from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'
import { cn } from '../utils/cn'

export interface ButtonProps extends Omit<HTMLMotionProps<"button">, 'size'> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'ghost' | 'outline'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  loading?: boolean
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  fullWidth?: boolean
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      loading = false,
      icon,
      iconPosition = 'left',
      fullWidth = false,
      rounded = 'md',
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    // 基礎樣式
    const baseClasses = `
      inline-flex items-center justify-center
      font-medium transition-all duration-200
      focus:outline-none focus:ring-2 focus:ring-offset-2
      disabled:opacity-50 disabled:cursor-not-allowed
      relative overflow-hidden
    `

    // 變體樣式
    const variants = {
      primary: `
        bg-primary-600 text-white
        hover:bg-primary-700 active:bg-primary-800
        focus:ring-primary-500
        dark:bg-primary-500 dark:hover:bg-primary-600
      `,
      secondary: `
        bg-secondary-600 text-white
        hover:bg-secondary-700 active:bg-secondary-800
        focus:ring-secondary-500
      `,
      success: `
        bg-success-600 text-white
        hover:bg-success-700 active:bg-success-800
        focus:ring-success-500
      `,
      danger: `
        bg-danger-600 text-white
        hover:bg-danger-700 active:bg-danger-800
        focus:ring-danger-500
      `,
      warning: `
        bg-warning-600 text-white
        hover:bg-warning-700 active:bg-warning-800
        focus:ring-warning-500
      `,
      ghost: `
        bg-transparent text-gray-700
        hover:bg-gray-100 active:bg-gray-200
        focus:ring-gray-500
        dark:text-gray-300 dark:hover:bg-dark-700 dark:active:bg-dark-600
      `,
      outline: `
        bg-transparent border-2 border-gray-300
        text-gray-700 hover:bg-gray-50
        active:bg-gray-100 focus:ring-gray-500
        dark:border-dark-600 dark:text-gray-300
        dark:hover:bg-dark-800 dark:active:bg-dark-700
      `
    }

    // 尺寸樣式
    const sizes = {
      xs: 'px-2 py-1 text-xs gap-1',
      sm: 'px-3 py-1.5 text-sm gap-1.5',
      md: 'px-4 py-2 text-sm gap-2',
      lg: 'px-6 py-3 text-base gap-2',
      xl: 'px-8 py-4 text-lg gap-3'
    }

    // 圓角樣式
    const roundedStyles = {
      none: 'rounded-none',
      sm: 'rounded',
      md: 'rounded-md',
      lg: 'rounded-lg',
      full: 'rounded-full'
    }

    // 載入動畫組件
    const LoadingSpinner = () => (
      <svg
        className="animate-spin h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    )

    return (
      <motion.button
        ref={ref}
        className={cn(
          baseClasses,
          variants[variant],
          sizes[size],
          roundedStyles[rounded],
          fullWidth && 'w-full',
          className
        )}
        disabled={disabled || loading}
        whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
        whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
        transition={{ duration: 0.1 }}
        {...props}
      >
        {/* 波紋效果 */}
        <motion.span
          className="absolute inset-0 bg-white opacity-0"
          initial={false}
          animate={{ opacity: 0 }}
          whileTap={{ opacity: 0.2 }}
          transition={{ duration: 0.3 }}
        />

        {/* 內容 */}
        <span className="relative flex items-center justify-center">
          {loading ? (
            <LoadingSpinner />
          ) : (
            <>
              {icon && iconPosition === 'left' && (
                <span className="flex-shrink-0">{icon}</span>
              )}
              {children && <span>{children as React.ReactNode}</span>}
              {icon && iconPosition === 'right' && (
                <span className="flex-shrink-0">{icon}</span>
              )}
            </>
          )}
        </span>
      </motion.button>
    )
  }
)

Button.displayName = 'Button'

// 按鈕組組件
interface ButtonGroupProps {
  children: React.ReactNode
  className?: string
  orientation?: 'horizontal' | 'vertical'
}

export const ButtonGroup: React.FC<ButtonGroupProps> = ({
  children,
  className,
  orientation = 'horizontal'
}) => {
  return (
    <div
      className={cn(
        'flex',
        orientation === 'vertical' ? 'flex-col' : 'flex-row',
        className
      )}
    >
      {React.Children.map(children, (child, index) => {
        if (!React.isValidElement(child)) return child

        const isFirst = index === 0
        const isLast = index === React.Children.count(children) - 1

        return React.cloneElement(child as React.ReactElement<any>, {
          className: cn(
            (child as React.ReactElement<any>).props.className,
            orientation === 'horizontal' ? (
              isFirst ? 'rounded-r-none' :
              isLast ? 'rounded-l-none' :
              'rounded-none'
            ) : (
              isFirst ? 'rounded-b-none' :
              isLast ? 'rounded-t-none' :
              'rounded-none'
            ),
            !isFirst && (orientation === 'horizontal' ? '-ml-px' : '-mt-px')
          )
        })
      })}
    </div>
  )
}

// 浮動操作按鈕
interface FABProps extends ButtonProps {
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
}

export const FAB: React.FC<FABProps> = ({
  position = 'bottom-right',
  className,
  ...props
}) => {
  const positions = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'top-right': 'top-6 right-6',
    'top-left': 'top-6 left-6'
  }

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      className={cn('fixed z-50', positions[position], className)}
    >
      <Button
        rounded="full"
        size="lg"
        className="shadow-xl hover:shadow-2xl"
        {...props}
      />
    </motion.div>
  )
}