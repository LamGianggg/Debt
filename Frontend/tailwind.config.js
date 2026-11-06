/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      colors: {
        stripe: {
          purple: '#635BFF',
          purpleHover: '#5851EA',
          indigo: '#4F46E5',
          indigoHover: '#4338CA',
          dark: '#0A2540',
          slate: '#4F566B',
          border: '#E3E8EE',
          bg: '#F8F9FB',
          sidebar: '#FFFFFF',
          greenBadgeBg: '#DEF7EC',
          greenBadgeText: '#03543F',
          blueBadgeBg: '#E0EAFF',
          blueBadgeText: '#3559E0',
          yellowBadgeBg: '#FEF08A',
          yellowBadgeText: '#854D0E',
          redBadgeBg: '#FEE2E2',
          redBadgeText: '#991B1B'
        }
      }
    },
  },
  plugins: [],
}
