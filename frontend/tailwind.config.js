
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Domain colors
        fintech:     { DEFAULT: '#3B82F6', light: '#EFF6FF', dark: '#1D4ED8' },
        realestate:  { DEFAULT: '#10B981', light: '#ECFDF5', dark: '#065F46' },
        telecom:     { DEFAULT: '#8B5CF6', light: '#F5F3FF', dark: '#5B21B6' },
        logistics:   { DEFAULT: '#F97316', light: '#FFF7ED', dark: '#C2410C' },
        energy:      { DEFAULT: '#EAB308', light: '#FEFCE8', dark: '#A16207' },
        automobiles: { DEFAULT: '#EF4444', light: '#FEF2F2', dark: '#B91C1C' },
        // UI
        sidebar:  '#0F172A',
        topbar:   '#1E293B',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
      }
    },
  },
  plugins: [],
}