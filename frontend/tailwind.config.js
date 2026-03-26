/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans:    ['DM Sans', 'sans-serif'],
        display: ['Syne', 'sans-serif'],
        mono:    ['DM Mono', 'monospace'],
      },
      colors: {
        brand: {
          50:  '#f0fdf9',
          100: '#ccfbef',
          200: '#99f6e0',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
      },
      boxShadow: {
        card:       '0 1px 3px rgba(0,0,0,.06), 0 4px 24px rgba(0,0,0,.04)',
        'card-hover':'0 4px 6px rgba(0,0,0,.08), 0 8px 32px rgba(0,0,0,.06)',
      },
      keyframes: {
        fadeIn:  { from: { opacity: 0 },                                     to: { opacity: 1 } },
        slideUp: { from: { opacity: 0, transform: 'translateY(14px)' },      to: { opacity: 1, transform: 'translateY(0)' } },
      },
      animation: {
        'fade-in':  'fadeIn .2s ease both',
        'slide-up': 'slideUp .28s ease both',
      },
    },
  },
  plugins: [],
}
