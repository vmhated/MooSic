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
        background: '#07080B',
        base: '#07080B',
        surface: {
          DEFAULT: '#0D0E14',
          base: '#07080B',
          card: '#0D0E14',
          elevated: '#141520',
          highlight: '#1B1C2B',
          border: 'rgba(255, 255, 255, 0.08)',
          'border-subtle': 'rgba(255, 255, 255, 0.06)',
          'border-medium': 'rgba(255, 255, 255, 0.12)',
          'border-highlight': 'rgba(255, 255, 255, 0.22)',
        },
        text: {
          primary: '#FFFFFF',
          secondary: '#E2E2E8',
          muted: '#9E9EB0',
          subtle: '#606072',
        },
        brand: {
          DEFAULT: '#8B5CF6',
          purple: '#8B5CF6',
          hover: '#7C3AED',
          light: '#A78BFA',
          dark: '#6D28D9',
          faint: 'rgba(139, 92, 246, 0.15)',
        },
        dynamic: {
          vibrant: 'var(--dynamic-vibrant, #8B5CF6)',
          muted: 'var(--dynamic-muted, #4C1D95)',
          accent: 'var(--dynamic-accent, #A78BFA)',
          background: 'var(--dynamic-bg, #07080B)',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        brand: ['Manrope', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      boxShadow: {
        sm: '0 2px 8px rgba(0, 0, 0, 0.4)',
        md: '0 8px 24px rgba(0, 0, 0, 0.6)',
        lg: '0 16px 40px rgba(0, 0, 0, 0.8)',
        xl: '0 24px 64px rgba(0, 0, 0, 0.9)',
        glow: '0 0 24px rgba(139, 92, 246, 0.25)',
        'glow-lg': '0 0 44px rgba(139, 92, 246, 0.35)',
        ambient: '0 20px 50px -10px var(--dynamic-vibrant, rgba(139, 92, 246, 0.3))',
        card: '0 12px 32px rgba(0, 0, 0, 0.45)',
      },
      borderRadius: {
        '3xl': '24px',
        '4xl': '32px',
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
        editorial: 'cubic-bezier(0.2, 0, 0, 1)',
      }
    },
  },
  plugins: [],
}
