/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        purple: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7c3aed',
          800: '#6b21a8',
          900: '#581c87',
          950: '#1a0b2e',
        },
        glass: {
          bg: 'rgba(29, 11, 46, 0.8)',
          border: 'rgba(109, 68, 184, 0.3)',
          hover: 'rgba(109, 68, 184, 0.2)'
        }
      },
      backdropBlur: {
        xs: '2px',
        '3xl': '64px',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'spin-slow': 'spin 3s linear infinite',
        'particle': 'particle 2s ease-out forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { 
            transform: 'translateY(0px) rotate(0deg)',
            opacity: '0.5'
          },
          '50%': { 
            transform: 'translateY(-20px) rotate(180deg)',
            opacity: '1'
          },
        },
        particle: {
          '0%': {
            opacity: '0',
            transform: 'translateY(0) scale(0)'
          },
          '10%': {
            opacity: '1',
            transform: 'translateY(-10px) scale(1)'
          },
          '90%': {
            opacity: '1',
            transform: 'translateY(-90px) scale(1)'
          },
          '100%': {
            opacity: '0',
            transform: 'translateY(-100px) scale(0)'
          }
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        'glass-purple': '0 8px 32px 0 rgba(147, 51, 234, 0.37)',
        'glow-purple': '0 0 20px rgba(147, 51, 234, 0.5)',
        'glow-green': '0 0 20px rgba(34, 197, 94, 0.5)',
        'glow-red': '0 0 20px rgba(239, 68, 68, 0.5)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
        'purple-gradient': 'linear-gradient(135deg, rgba(147, 51, 234, 0.8), rgba(168, 85, 247, 0.8))',
      },
      screens: {
        'xs': '475px',
        '3xl': '1600px',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      }
    },
  },
  plugins: [],
}