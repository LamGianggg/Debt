/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Mona Sans VF"', '"Mona Sans Variable"', '"Mona Sans"', 'Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        'soft-xs': '0 1px 2px rgba(0, 0, 0, 0.03)',
        'soft-sm': '0 2px 8px rgba(0, 0, 0, 0.04)',
        'soft-md': '0 8px 24px rgba(15, 23, 42, 0.06)',
        'soft-lg': '0 16px 40px rgba(15, 23, 42, 0.08)',
        'soft-hover': '0 12px 28px -4px rgba(79, 70, 229, 0.12)',
      },
      colors: {
        upflow: {
          canvas: '#F8FAFC',
          card: '#FFFFFF',
          primary: '#4F46E5',
          primaryHover: '#4338CA',
          navy: '#0F172A',
          charcoal: '#1E293B',
          muted: '#64748B',
          lightMuted: '#94A3B8',
          border: '#F1F5F9',
          borderSubtle: '#E2E8F0',
          coral: '#FF6B4A',
          amber: '#F59E0B',
          emerald: '#10B981',
          mintBg: '#ECFDF5',
          honeyBg: '#FEF3C7',
          roseBg: '#FEE2E2',
          irisBg: '#EEF2FF',
          skyBg: '#F0F9FF'
        }
      }
    },
  },
  plugins: [],
}
