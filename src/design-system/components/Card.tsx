import React, { forwardRef } from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'
import { cn } from '../utils/cn'

interface CardProps extends HTMLMotionProps<"div"> {
  variant?: 'default' | 'glass' | 'gradient' | 'outline' | 'elevated'
  hoverable?: boolean
  clickable?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      children,
      className,
      variant = 'default',
      hoverable = false,
      clickable = false,
      padding = 'md',
      rounded = 'lg',
      onClick,
      ...props
    },
    ref
  ) => {
    const baseClasses = 'transition-all duration-300 relative'

    const variants = {
      default: 'bg-white dark:bg-dark-800 shadow-md',
      glass: `
        bg-white/70 dark:bg-dark-800/70
        backdrop-blur-md shadow-glass
        border border-white/20 dark:border-dark-600/20
      `,
      gradient: `
        bg-gradient-to-br from-primary-400 to-secondary-500
        text-white shadow-xl
      `,
      outline: `
        bg-transparent border-2 border-gray-200
        dark:border-dark-700
      `,
      elevated: `
        bg-white dark:bg-dark-800
        shadow-xl hover:shadow-2xl
      `
    }

    const paddings = {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
      xl: 'p-10'
    }

    const roundedStyles = {
      none: 'rounded-none',
      sm: 'rounded',
      md: 'rounded-md',
      lg: 'rounded-lg',
      xl: 'rounded-xl'
    }

    const hoverableClasses = hoverable || clickable ? `
      hover:shadow-xl hover:-translate-y-1
      active:translate-y-0 active:shadow-lg
    ` : ''

    const clickableClasses = clickable ? 'cursor-pointer' : ''

    return (
      <motion.div
        ref={ref}
        className={cn(
          baseClasses,
          variants[variant],
          paddings[padding],
          roundedStyles[rounded],
          hoverableClasses,
          clickableClasses,
          className
        )}
        onClick={onClick}
        whileHover={hoverable || clickable ? { y: -4 } : {}}
        whileTap={clickable ? { scale: 0.98 } : {}}
        transition={{ duration: 0.2 }}
        {...props}
      >
        {children}
      </motion.div>
    )
  }
)

Card.displayName = 'Card'

// Card Header 組件
interface CardHeaderProps {
  children: React.ReactNode
  className?: string
  actions?: React.ReactNode
}

export const CardHeader: React.FC<CardHeaderProps> = ({
  children,
  className,
  actions
}) => (
  <div
    className={cn(
      'px-6 py-4 border-b border-gray-200 dark:border-dark-700',
      'flex items-center justify-between',
      className
    )}
  >
    <div className="flex-1">{children}</div>
    {actions && <div className="flex items-center gap-2">{actions}</div>}
  </div>
)

// Card Body 組件
interface CardBodyProps {
  children: React.ReactNode
  className?: string
  noPadding?: boolean
}

export const CardBody: React.FC<CardBodyProps> = ({
  children,
  className,
  noPadding = false
}) => (
  <div className={cn(!noPadding && 'p-6', className)}>
    {children}
  </div>
)

// Card Footer 組件
interface CardFooterProps {
  children: React.ReactNode
  className?: string
  divider?: boolean
}

export const CardFooter: React.FC<CardFooterProps> = ({
  children,
  className,
  divider = true
}) => (
  <div
    className={cn(
      'px-6 py-4',
      divider && 'border-t border-gray-200 dark:border-dark-700',
      className
    )}
  >
    {children}
  </div>
)

// 統計卡片組件
interface StatCardProps {
  title: string
  value: string | number
  description?: string
  icon?: React.ReactNode
  trend?: {
    value: number
    isPositive: boolean
  }
  className?: string
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  description,
  icon,
  trend,
  className
}) => {
  return (
    <Card variant="glass" className={className}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
            {title}
          </p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
            {value}
          </p>
          {description && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {description}
            </p>
          )}
          {trend && (
            <div className="flex items-center mt-2">
              <span
                className={cn(
                  'text-sm font-medium',
                  trend.isPositive
                    ? 'text-success-600 dark:text-success-400'
                    : 'text-danger-600 dark:text-danger-400'
                )}
              >
                {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                vs 上週
              </span>
            </div>
          )}
        </div>
        {icon && (
          <div className="flex-shrink-0 ml-4">
            <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
              {icon}
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}

// 特色卡片組件
interface FeatureCardProps {
  title: string
  description: string
  icon?: React.ReactNode
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger'
  onClick?: () => void
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  icon,
  color = 'primary',
  onClick
}) => {
  const colors = {
    primary: 'from-primary-400 to-primary-600',
    secondary: 'from-secondary-400 to-secondary-600',
    success: 'from-success-400 to-success-600',
    warning: 'from-warning-400 to-warning-600',
    danger: 'from-danger-400 to-danger-600'
  }

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="cursor-pointer"
    >
      <Card variant="elevated" padding="lg">
        <div className="text-center">
          {icon && (
            <div
              className={cn(
                'w-16 h-16 mx-auto mb-4 rounded-full',
                'bg-gradient-to-br flex items-center justify-center',
                'text-white text-2xl',
                colors[color]
              )}
            >
              {icon}
            </div>
          )}
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            {description}
          </p>
        </div>
      </Card>
    </motion.div>
  )
}

// 圖片卡片組件
interface ImageCardProps extends CardProps {
  image: string
  imageAlt?: string
  imageHeight?: string
  title?: string
  description?: string
  footer?: React.ReactNode
}

export const ImageCard: React.FC<ImageCardProps> = ({
  image,
  imageAlt = '',
  imageHeight = 'h-48',
  title,
  description,
  footer,
  children,
  ...cardProps
}) => {
  return (
    <Card padding="none" {...cardProps}>
      <div className={cn('w-full object-cover', imageHeight)}>
        <img
          src={image}
          alt={imageAlt}
          className="w-full h-full object-cover rounded-t-lg"
        />
      </div>
      <CardBody>
        {title && (
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {title}
          </h3>
        )}
        {description && (
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            {description}
          </p>
        )}
        {children as React.ReactNode}
      </CardBody>
      {footer && <CardFooter>{footer}</CardFooter>}
    </Card>
  )
}