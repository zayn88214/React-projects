/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      colors: {
        ink: {
          950: '#0a0f1a',
          900: '#0e1524',
          800: '#151d30',
          700: '#1d2740',
        },
        brass: {
          300: '#f0d9a3',
          400: '#e6c273',
          500: '#d8a84e',
          600: '#b8863a',
        },
        parchment: '#f2ede1',
        mist: '#9fb3c8',
      },
      keyframes: {
        drift: {
          '0%': { transform: 'translateX(-10%)' },
          '100%': { transform: 'translateX(110%)' },
        },
        fall: {
          '0%': { transform: 'translateY(-10%)', opacity: '0' },
          '10%': { opacity: '1' },
          '100%': { transform: 'translateY(110vh)', opacity: '0.3' },
        },
        twinkle: {
          '0%, 100%': { opacity: '0.2' },
          '50%': { opacity: '1' },
        },
        flash: {
          '0%, 92%, 100%': { opacity: '0' },
          '93%': { opacity: '0.9' },
          '95%': { opacity: '0.1' },
          '96%': { opacity: '0.8' },
          '98%': { opacity: '0' },
        },
        glow: {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
        },
        risefade: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        drift: 'drift 60s linear infinite',
        'drift-slow': 'drift 90s linear infinite',
        fall: 'fall 1.2s linear infinite',
        twinkle: 'twinkle 3s ease-in-out infinite',
        flash: 'flash 8s ease-in-out infinite',
        glow: 'glow 6s ease-in-out infinite',
        risefade: 'risefade 0.5s ease-out both',
      },
    },
  },
  plugins: [],
}
