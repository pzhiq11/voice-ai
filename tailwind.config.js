/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eef9ff',
          100: '#d9f0ff',
          200: '#bae4ff',
          300: '#8ad3ff',
          400: '#52b8ff',
          500: '#2b96ff',
          600: '#1378ff',
          700: '#105fee',
          800: '#154bd1',
          900: '#1742a3',
          950: '#122a67',
        },
        secondary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#b9e6fe',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
        dark: {
          50: '#f6f6f7',
          100: '#e0e4e9',
          200: '#c0c8d3',
          300: '#99a3b6',
          400: '#768197',
          500: '#5b667c',
          600: '#485267',
          700: '#3b4354',
          800: '#333948',
          900: '#232530',
          950: '#16171e',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Lexend', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 3s infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
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
      },
      boxShadow: {
        'glow': '0 0 15px rgba(59, 130, 246, 0.5)',
        'glow-strong': '0 0 25px rgba(59, 130, 246, 0.7)',
      },
    },
  },
  plugins: [],
} 