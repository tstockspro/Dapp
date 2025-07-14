/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        // 深蓝色主题色系
        primary: {
          50: '#e6f1ff',
          100: '#bae0ff',
          200: '#91caff',
          300: '#69b1ff',
          400: '#4096ff',
          500: '#1677ff', // 主色
          600: '#0958d9',
          700: '#003eb3',
          800: '#002c8c',
          900: '#001d66',
          950: '#0D1B2A', // 最深蓝
        },
        secondary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#00D4FF', // 科技蓝
          600: '#0099CC',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        background: {
          DEFAULT: '#0D1B2A',
          secondary: '#1B263B',
          tertiary: '#415A77',
        },
        surface: {
          DEFAULT: 'rgba(27, 38, 59, 0.8)',
          glass: 'rgba(65, 90, 119, 0.2)',
          elevated: 'rgba(65, 90, 119, 0.4)',
        },
        border: 'rgba(0, 212, 255, 0.2)',
        input: 'rgba(65, 90, 119, 0.3)',
        ring: '#00D4FF',
        foreground: '#ffffff',
        muted: {
          DEFAULT: 'rgba(65, 90, 119, 0.3)',
          foreground: 'rgba(255, 255, 255, 0.7)',
        },
        accent: {
          DEFAULT: '#00D4FF',
          foreground: '#0D1B2A',
        },
        destructive: {
          DEFAULT: '#ef4444',
          foreground: '#ffffff',
        },
        success: {
          DEFAULT: '#22c55e',
          foreground: '#ffffff',
        },
      },
      borderRadius: {
        lg: '12px',
        md: '8px',
        sm: '6px',
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        'glow': '0 0 20px rgba(0, 212, 255, 0.3)',
        'inner-glow': 'inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        'pressed': 'inset 0 2px 4px rgba(0, 0, 0, 0.3)',
        '3d': '0 4px 8px rgba(0, 0, 0, 0.3), 0 2px 4px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
        'button-gradient': 'linear-gradient(135deg, rgba(0, 212, 255, 0.8), rgba(0, 153, 204, 0.8))',
        'card-gradient': 'linear-gradient(135deg, rgba(65, 90, 119, 0.4), rgba(27, 38, 59, 0.6))',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(0, 212, 255, 0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(0, 212, 255, 0.8)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}