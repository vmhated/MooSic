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
        background: '#09090B',
        surface: {
          DEFAULT: '#111116',
          elevated: '#19191F',
          border: '#292930',
        },
        text: {
          primary: '#F5F5F7',
          secondary: '#B8B8C2',
          muted: '#6B6B78',
        },
        brand: {
          DEFAULT: '#8B5CF6',
          purple: '#8B5CF6',
          hover: '#7C3AED',
          light: '#A78BFA',
        },
        dynamic: {
          vibrant: 'var(--dynamic-vibrant, #8B5CF6)',
          muted: 'var(--dynamic-muted, #4C1D95)',
          background: 'var(--dynamic-background, #09090B)',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        brand: ['Manrope', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 24px rgba(139, 92, 246, 0.25)',
        'glow-lg': '0 0 40px rgba(139, 92, 246, 0.35)',
      }
    },
  },
  plugins: [],
}
