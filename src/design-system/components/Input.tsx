import React, { forwardRef, useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '../utils/cn'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  fullWidth?: boolean
  variant?: 'default' | 'filled' | 'outline'
  inputSize?: 'sm' | 'md' | 'lg'
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      icon,
      iconPosition = 'left',
      fullWidth = false,
      variant = 'default',
      inputSize = 'md',
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const [focused, setFocused] = useState(false)

    const baseClasses = `
      w-full transition-all duration-200
      placeholder-gray-400 dark:placeholder-gray-500
      disabled:bg-gray-50 dark:disabled:bg-dark-900
      disabled:text-gray-500 dark:disabled:text-gray-400
      disabled:cursor-not-allowed
    `

    const variants = {
      default: `
        border border-gray-300 dark:border-dark-600
        bg-white dark:bg-dark-800
        focus:border-primary-500 focus:ring-1 focus:ring-primary-500
        dark:focus:border-primary-400
      `,
      filled: `
        border-0 border-b-2 border-gray-300 dark:border-dark-600
        bg-gray-100 dark:bg-dark-700
        focus:bg-white dark:focus:bg-dark-800
        focus:border-primary-500
        rounded-t-md rounded-b-none
      `,
      outline: `
        border-2 border-gray-300 dark:border-dark-600
        bg-transparent
        focus:border-primary-500
      `
    }

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-5 py-3 text-lg'
    }

    const hasError = !!error

    return (
      <div className={cn('relative', fullWidth ? 'w-full' : 'inline-block', className)}>
        {label && (
          <motion.label
            initial={false}
            animate={{
              color: focused ? 'rgb(14, 165, 233)' : 'rgb(107, 114, 128)'
            }}
            className="block text-sm font-medium mb-1 dark:text-gray-300"
          >
            {label}
          </motion.label>
        )}

        <div className="relative">
          {icon && iconPosition === 'left' && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              {icon}
            </div>
          )}

          <input
            ref={ref}
            className={cn(
              baseClasses,
              variants[variant],
              sizes[inputSize],
              'rounded-md',
              icon && iconPosition === 'left' && 'pl-10',
              icon && iconPosition === 'right' && 'pr-10',
              hasError && 'border-danger-500 focus:border-danger-500 focus:ring-danger-500',
              className
            )}
            disabled={disabled}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            aria-invalid={hasError}
            aria-describedby={error ? `${props.id}-error` : helperText ? `${props.id}-helper` : undefined}
            {...props}
          />

          {icon && iconPosition === 'right' && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              {icon}
            </div>
          )}
        </div>

        {(error || helperText) && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              'text-sm mt-1',
              error ? 'text-danger-600 dark:text-danger-400' : 'text-gray-500 dark:text-gray-400'
            )}
            id={error ? `${props.id}-error` : `${props.id}-helper`}
          >
            {error || helperText}
          </motion.p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

// Textarea 組件
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helperText?: string
  fullWidth?: boolean
  variant?: 'default' | 'filled' | 'outline'
  inputSize?: 'sm' | 'md' | 'lg'
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      helperText,
      fullWidth = false,
      variant = 'default',
      inputSize = 'md',
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const [focused, setFocused] = useState(false)

    const baseClasses = `
      w-full transition-all duration-200
      placeholder-gray-400 dark:placeholder-gray-500
      disabled:bg-gray-50 dark:disabled:bg-dark-900
      disabled:text-gray-500 dark:disabled:text-gray-400
      disabled:cursor-not-allowed
      resize-y min-h-[100px]
    `

    const variants = {
      default: `
        border border-gray-300 dark:border-dark-600
        bg-white dark:bg-dark-800
        focus:border-primary-500 focus:ring-1 focus:ring-primary-500
        dark:focus:border-primary-400
      `,
      filled: `
        border-0 border-b-2 border-gray-300 dark:border-dark-600
        bg-gray-100 dark:bg-dark-700
        focus:bg-white dark:focus:bg-dark-800
        focus:border-primary-500
        rounded-t-md rounded-b-none
      `,
      outline: `
        border-2 border-gray-300 dark:border-dark-600
        bg-transparent
        focus:border-primary-500
      `
    }

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-5 py-3 text-lg'
    }

    const hasError = !!error

    return (
      <div className={cn('relative', fullWidth ? 'w-full' : 'inline-block', className)}>
        {label && (
          <motion.label
            initial={false}
            animate={{
              color: focused ? 'rgb(14, 165, 233)' : 'rgb(107, 114, 128)'
            }}
            className="block text-sm font-medium mb-1 dark:text-gray-300"
          >
            {label}
          </motion.label>
        )}

        <textarea
          ref={ref}
          className={cn(
            baseClasses,
            variants[variant],
            sizes[inputSize],
            'rounded-md',
            hasError && 'border-danger-500 focus:border-danger-500 focus:ring-danger-500'
          )}
          disabled={disabled}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          aria-invalid={hasError}
          aria-describedby={error ? `${props.id}-error` : helperText ? `${props.id}-helper` : undefined}
          {...props}
        />

        {(error || helperText) && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              'text-sm mt-1',
              error ? 'text-danger-600 dark:text-danger-400' : 'text-gray-500 dark:text-gray-400'
            )}
            id={error ? `${props.id}-error` : `${props.id}-helper`}
          >
            {error || helperText}
          </motion.p>
        )}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'

// Select 組件
export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  helperText?: string
  options: Array<{ value: string; label: string }>
  placeholder?: string
  fullWidth?: boolean
  variant?: 'default' | 'filled' | 'outline'
  inputSize?: 'sm' | 'md' | 'lg'
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      helperText,
      options,
      placeholder = '請選擇',
      fullWidth = false,
      variant = 'default',
      inputSize = 'md',
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const [focused, setFocused] = useState(false)

    const baseClasses = `
      w-full transition-all duration-200
      appearance-none cursor-pointer
      disabled:bg-gray-50 dark:disabled:bg-dark-900
      disabled:text-gray-500 dark:disabled:text-gray-400
      disabled:cursor-not-allowed
    `

    const variants = {
      default: `
        border border-gray-300 dark:border-dark-600
        bg-white dark:bg-dark-800
        focus:border-primary-500 focus:ring-1 focus:ring-primary-500
        dark:focus:border-primary-400
      `,
      filled: `
        border-0 border-b-2 border-gray-300 dark:border-dark-600
        bg-gray-100 dark:bg-dark-700
        focus:bg-white dark:focus:bg-dark-800
        focus:border-primary-500
        rounded-t-md rounded-b-none
      `,
      outline: `
        border-2 border-gray-300 dark:border-dark-600
        bg-transparent
        focus:border-primary-500
      `
    }

    const sizes = {
      sm: 'px-3 py-1.5 pr-8 text-sm',
      md: 'px-4 py-2 pr-10 text-base',
      lg: 'px-5 py-3 pr-12 text-lg'
    }

    const hasError = !!error

    return (
      <div className={cn('relative', fullWidth ? 'w-full' : 'inline-block', className)}>
        {label && (
          <motion.label
            initial={false}
            animate={{
              color: focused ? 'rgb(14, 165, 233)' : 'rgb(107, 114, 128)'
            }}
            className="block text-sm font-medium mb-1 dark:text-gray-300"
          >
            {label}
          </motion.label>
        )}

        <div className="relative">
          <select
            ref={ref}
            className={cn(
              baseClasses,
              variants[variant],
              sizes[inputSize],
              'rounded-md',
              hasError && 'border-danger-500 focus:border-danger-500 focus:ring-danger-500'
            )}
            disabled={disabled}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            aria-invalid={hasError}
            aria-describedby={error ? `${props.id}-error` : helperText ? `${props.id}-helper` : undefined}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {/* 下拉箭頭 */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {(error || helperText) && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              'text-sm mt-1',
              error ? 'text-danger-600 dark:text-danger-400' : 'text-gray-500 dark:text-gray-400'
            )}
            id={error ? `${props.id}-error` : `${props.id}-helper`}
          >
            {error || helperText}
          </motion.p>
        )}
      </div>
    )
  }
)

Select.displayName = 'Select'

// Checkbox 組件
export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
  error?: string
  indeterminate?: boolean
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, indeterminate, className, ...props }, ref) => {
    React.useEffect(() => {
      if (ref && 'current' in ref && ref.current) {
        ref.current.indeterminate = !!indeterminate
      }
    }, [ref, indeterminate])

    return (
      <div className={cn('flex items-center', className)}>
        <input
          ref={ref}
          type="checkbox"
          className={cn(
            'h-4 w-4 text-primary-600 rounded',
            'border-gray-300 dark:border-dark-600',
            'focus:ring-2 focus:ring-primary-500',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            error && 'border-danger-500'
          )}
          {...props}
        />
        {label && (
          <label
            htmlFor={props.id}
            className={cn(
              'ml-2 text-sm text-gray-700 dark:text-gray-300',
              props.disabled && 'opacity-50 cursor-not-allowed'
            )}
          >
            {label}
          </label>
        )}
      </div>
    )
  }
)

Checkbox.displayName = 'Checkbox'

// Radio 組件
export interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ label, className, ...props }, ref) => {
    return (
      <div className={cn('flex items-center', className)}>
        <input
          ref={ref}
          type="radio"
          className={cn(
            'h-4 w-4 text-primary-600',
            'border-gray-300 dark:border-dark-600',
            'focus:ring-2 focus:ring-primary-500',
            'disabled:opacity-50 disabled:cursor-not-allowed'
          )}
          {...props}
        />
        {label && (
          <label
            htmlFor={props.id}
            className={cn(
              'ml-2 text-sm text-gray-700 dark:text-gray-300',
              props.disabled && 'opacity-50 cursor-not-allowed'
            )}
          >
            {label}
          </label>
        )}
      </div>
    )
  }
)

Radio.displayName = 'Radio'