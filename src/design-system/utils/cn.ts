import { clsx, type ClassValue } from 'clsx'

/**
 * 合併 className 的工具函數
 * 使用 clsx 來處理條件式 className
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

/**
 * 延遲執行函數
 */
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

/**
 * 格式化日期
 */
export const formatDate = (date: Date | string, format: 'short' | 'long' | 'time' = 'short') => {
  const d = typeof date === 'string' ? new Date(date) : date

  switch (format) {
    case 'long':
      return d.toLocaleDateString('zh-TW', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
      })
    case 'time':
      return d.toLocaleTimeString('zh-TW', {
        hour: '2-digit',
        minute: '2-digit'
      })
    case 'short':
    default:
      return d.toLocaleDateString('zh-TW', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      })
  }
}

/**
 * 取得相對時間描述
 */
export const getRelativeTime = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 7) {
    return formatDate(d, 'short')
  } else if (days > 0) {
    return `${days} 天前`
  } else if (hours > 0) {
    return `${hours} 小時前`
  } else if (minutes > 0) {
    return `${minutes} 分鐘前`
  } else {
    return '剛剛'
  }
}

/**
 * 防抖函數
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

/**
 * 節流函數
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle = false

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => {
        inThrottle = false
      }, wait)
    }
  }
}