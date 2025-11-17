# Tailwind CSS 安裝步驟

## 1. 安裝依賴
```bash
npm install -D tailwindcss postcss autoprefixer
npm install -D @tailwindcss/forms @tailwindcss/typography
npx tailwindcss init -p
```

## 2. 配置 tailwind.config.js
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
        dark: {
          bg: '#1a1a1a',
          card: '#2d2d2d',
          border: '#404040',
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in',
        'slide-up': 'slideUp 0.3s ease-out',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}
```

## 3. 更新 src/index.css
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply transition-colors duration-200;
  }
}

@layer components {
  .btn-primary {
    @apply px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors;
  }

  .card {
    @apply bg-white dark:bg-dark-card rounded-lg shadow-md p-6 border border-gray-200 dark:border-dark-border;
  }
}
```