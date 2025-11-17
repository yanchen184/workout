/**
 * Framer Motion 動畫配置
 */

// 頁面過渡動畫
export const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3, ease: 'easeInOut' }
}

// 錯差動畫容器
export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
}

// 淡入向上動畫
export const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: 'easeOut' }
}

// 縮放進入動畫
export const scaleIn = {
  initial: { scale: 0.8, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  transition: { type: 'spring', stiffness: 300, damping: 20 }
}

// 滑入動畫
export const slideIn = (direction: 'left' | 'right' | 'up' | 'down') => {
  const directionOffset = {
    left: { x: -100 },
    right: { x: 100 },
    up: { y: -100 },
    down: { y: 100 }
  }

  return {
    initial: { ...directionOffset[direction], opacity: 0 },
    animate: { x: 0, y: 0, opacity: 1 },
    transition: { type: 'spring', stiffness: 100, damping: 15 }
  }
}

// 旋轉進入動畫
export const rotateIn = {
  initial: { rotate: -180, opacity: 0 },
  animate: { rotate: 0, opacity: 1 },
  transition: { type: 'spring', stiffness: 200, damping: 20 }
}

// 彈跳動畫
export const bounce = {
  initial: { y: 0 },
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 0.6,
      repeat: Infinity,
      repeatDelay: 0.5,
      ease: 'easeInOut'
    }
  }
}

// 脈動動畫
export const pulse = {
  initial: { scale: 1 },
  animate: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: 'easeInOut'
    }
  }
}

// 搖晃動畫
export const shake = {
  animate: {
    x: [-2, 2, -2, 2, 0],
    transition: {
      duration: 0.4,
      ease: 'easeInOut'
    }
  }
}

// 列表項動畫
export const listItem = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
  transition: { duration: 0.3 }
}

// 模態框動畫
export const modalOverlay = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.2 }
}

export const modalContent = {
  initial: { scale: 0.9, opacity: 0, y: 20 },
  animate: { scale: 1, opacity: 1, y: 0 },
  exit: { scale: 0.9, opacity: 0, y: 20 },
  transition: { type: 'spring', stiffness: 300, damping: 25 }
}

// 浮動動畫
export const float = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: 'easeInOut'
    }
  }
}

// 發光動畫
export const glow = {
  animate: {
    boxShadow: [
      '0 0 20px rgba(14, 165, 233, 0.3)',
      '0 0 30px rgba(14, 165, 233, 0.5)',
      '0 0 20px rgba(14, 165, 233, 0.3)'
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut'
    }
  }
}

// 卡片懸浮效果
export const cardHover = {
  whileHover: {
    scale: 1.03,
    y: -5,
    transition: { duration: 0.3, ease: 'easeOut' }
  },
  whileTap: {
    scale: 0.98,
    transition: { duration: 0.1 }
  }
}

// 按鈕效果
export const buttonTap = {
  whileTap: {
    scale: 0.95,
    transition: { duration: 0.1 }
  }
}

// 標籤切換動畫
export const tabSwitch = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.2, ease: 'easeInOut' }
}