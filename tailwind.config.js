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
        brand: {
          50: '#F5F3FF',
          100: '#EDE9FE',
          200: '#DDD6FE',
          300: '#C4B5FD',
          400: '#A78BFA',
          500: '#8B5CF6',
          600: '#7C3AED',
          700: '#6D28D9',
          800: '#5B21B6',
          900: '#4C1D95',
          DEFAULT: '#7C3AED',
        },
        surface: {
          base: '#0A0A0C',
          card: '#121216',
          hover: '#1A1A20',
          border: '#24242D',
        },
        dynamic: {
          vibrant: 'var(--dynamic-vibrant, #7C3AED)',
          muted: 'var(--dynamic-muted, #4C1D95)',
          background: 'var(--dynamic-background, #0A0A0C)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
