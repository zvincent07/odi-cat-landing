/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Outfit"', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'sans-serif'],
        hand: ['"Caveat"', 'cursive'],
        serif: ['"Playfair Display"', 'serif'],
        cinzel: ['"Cinzel"', 'serif'],
      },
      colors: {
        smoke: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
        odi: {
          amber: '#f59e0b',
          honey: '#fbbf24',
          slate: '#475569',
          fur: '#525a65',
        }
      },
      animation: {
        'bounce-slow': 'bounce 3s infinite',
        'pulse-subtle': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        }
      }
    },
  },
  plugins: [],
}
