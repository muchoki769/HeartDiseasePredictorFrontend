/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./frontend/**/*.{html,js}",
    "./*.html"
  ],
  theme: {
    extend: {
      animation: {
        'pulse-ring': 'pulse 2s infinite',
      },
      keyframes: {
        pulse: {
          '0%': { 
            transform: 'scale(0.95)', 
            boxShadow: '0 0 0 0 rgba(59, 130, 246, 0.7)' 
          },
          '70%': { 
            transform: 'scale(1)', 
            boxShadow: '0 0 0 10px rgba(59, 130, 246, 0)' 
          },
          '100%': { 
            transform: 'scale(0.95)', 
            boxShadow: '0 0 0 0 rgba(59, 130, 246, 0)' 
          },
        }
      }
    },
  },
  plugins: [],
}