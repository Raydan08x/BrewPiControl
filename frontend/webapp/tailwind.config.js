/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brewery: {
          50: '#fef7ee',
          100: '#fdecd3',
          200: '#fbd5a5',
          300: '#f7b76d',
          400: '#f29032',
          500: '#ed7114',
          600: '#de570a',
          700: '#b8420b',
          800: '#933510',
          900: '#782e11',
        },
        copper: {
          50: '#fdf8f6',
          100: '#f2e8e5',
          200: '#eaddd7',
          300: '#e0cec7',
          400: '#d2bab0',
          500: '#bfa094',
          600: '#a18072',
          700: '#977669',
          800: '#846358',
          900: '#43302b',
        }
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 3s linear infinite',
      }
    },
  },
  plugins: [],
};