/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#E8F8EE',
          100: '#D4F6E2',
          200: '#A7ECC4',
          300: '#6EE09F',
          400: '#32CD7A',
          500: '#00C853', // Primary vibrant green
          600: '#00A844',
          700: '#008536',
          800: '#00662A',
          900: '#00471D',
          dark: '#0A0A0A', // Deep obsidian black
          darker: '#000000', // True pitch black
          surface: '#121212', // Sleek card surface
          card: '#181818',
        },
        accent: {
          gold: '#FFB800',
          orange: '#FF6B00',
          blue: '#2563EB',
          purple: '#7C3AED',
          rose: '#F43F5E',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'Plus Jakarta Sans', 'sans-serif'],
      },
      boxShadow: {
        'chowdeck': '0 20px 40px -15px rgba(0, 200, 83, 0.18)',
        'chowdeck-dark': '0 25px 50px -12px rgba(10, 37, 64, 0.25)',
        'glow': '0 0 30px rgba(0, 200, 83, 0.35)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.08)',
      },
      borderRadius: {
        '3xl': '1.5rem',
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      animation: {
        'float': 'float 4s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 2.5s ease-in-out infinite',
        'gradient': 'gradient 8s ease infinite',
        'slide-up': 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}
