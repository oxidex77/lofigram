// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Kawaii pastel color palette
        pink: {
          100: '#fcf1f7',
          200: '#fad8e8',
          300: '#f7b8d5',
          400: '#f591bc',
          500: '#ec4899',
          600: '#db2777',
          700: '#be185d',
          800: '#9d174d',
          900: '#831843',
        },
        purple: {
          100: '#f5f3ff',
          200: '#ede9fe',
          300: '#ddd6fe',
          400: '#c4b5fd',
          500: '#a78bfa',
          600: '#8b5cf6',
          700: '#7c3aed',
          800: '#6d28d9',
          900: '#5b21b6',
        },
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse': 'pulse 3s ease-in-out infinite',
        'spin-slow': 'spin 20s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulse: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.8' },
          '50%': { transform: 'scale(1.05)', opacity: '1' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        'kawaii': '0 4px 20px -2px rgba(219, 39, 119, 0.15)',
      },
      fontSize: {
        'xxs': '0.625rem',
      },
    },
  },
  plugins: [],
}