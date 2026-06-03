/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      colors: {
        glass: {
          50:  'rgba(255,255,255,0.95)',
          100: 'rgba(255,255,255,0.85)',
          200: 'rgba(255,255,255,0.70)',
          300: 'rgba(255,255,255,0.55)',
          400: 'rgba(255,255,255,0.40)',
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
