/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FEFCF8',
          100: '#FBF6EE',
          200: '#F5ECDC',
          300: '#EDE0C8',
        },
        ink: {
          900: '#241F1A',
          800: '#332B23',
          700: '#4A4038',
          500: '#7A6E62',
          300: '#B3A796',
        },
        saffron: {
          50: '#FDF6E3',
          100: '#FBEAC0',
          300: '#F2C868',
          400: '#F0BB4C',
          500: '#E8A93D',
          600: '#CC8F28',
          700: '#A6721E',
        },
        basil: {
          50: '#EEF3ED',
          100: '#D3E1D2',
          300: '#8CAE8C',
          400: '#5B9268',
          500: '#3F6B4A',
          600: '#31543A',
          700: '#26422D',
        },
        brick: {
          100: '#F3D7CE',
          300: '#DE9683',
          400: '#DD6A4E',
          500: '#C1442E',
          600: '#A13623',
        },
        surface: {
          dark: '#121116',
          darkcard: '#1B1A21',
          darkraised: '#232129',
          darkborder: '#322F3A',
        },
      },
      fontFamily: {
        display: ['"Fraunces"', 'ui-serif', 'Georgia', 'serif'],
        body: ['"Inter"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        card: '1.25rem',
        stamp: '0.5rem',
      },
      boxShadow: {
        card: '0 1px 2px rgba(36,31,26,0.06), 0 8px 24px -8px rgba(36,31,26,0.18)',
        'card-dark': '0 1px 2px rgba(0,0,0,0.4), 0 12px 32px -12px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.04)',
        stamp: '0 2px 6px rgba(193,68,46,0.35)',
        glow: '0 0 0 1px rgba(240,187,76,0.15), 0 0 24px -4px rgba(240,187,76,0.35)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'stamp-in': {
          '0%': { transform: 'rotate(-14deg) scale(0.6)', opacity: '0' },
          '60%': { transform: 'rotate(-6deg) scale(1.08)', opacity: '1' },
          '100%': { transform: 'rotate(-8deg) scale(1)', opacity: '1' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.5s ease-out both',
        'stamp-in': 'stamp-in 0.4s cubic-bezier(.2,.8,.3,1.3) both',
      },
    },
  },
  plugins: [],
};
