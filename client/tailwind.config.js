/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#0B1020', // Main background
          900: '#0E172C', // Secondary deep
          800: '#111B32', // Cards & surfaces
          700: '#182544', // Surface hover
          600: '#1F2E52', // Borders & dividers
          500: '#2A3C66',
        },
        electric: {
          500: '#3478F6', // Primary accent
          600: '#2563EB',
          400: '#60A5FA',
        },
        cyan: {
          400: '#35D6E8', // Secondary accent
          500: '#06B6D4',
        },
        ice: {
          50: '#FFFFFF',
          100: '#F1F5F9',
          200: '#E6EDF7', // Ice silver text & chips
          300: '#CBD5E1',
          400: '#94A3B8', // Muted text
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['Fira Code', 'JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'glow-electric': '0 0 25px -5px rgba(52, 120, 246, 0.3)',
        'glow-cyan': '0 0 25px -5px rgba(53, 214, 232, 0.3)',
        'card-dark': '0 4px 20px -2px rgba(11, 16, 32, 0.7), 0 2px 6px -1px rgba(0, 0, 0, 0.4)',
      }
    },
  },
  plugins: [],
}
