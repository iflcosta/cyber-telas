import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#050a14',
          900: '#0a1929',
          800: '#112240',
          700: '#1a3460',
        },
        cyber: {
          blue: '#0066ff',
          'blue-hover': '#0052cc',
          'blue-light': '#3385ff',
        },
        circuit: {
          green: '#00ff88',
          'green-dark': '#00cc6a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'float-orb': 'float-orb 20s ease-in-out infinite',
        'pulse-ring': 'pulse-ring 2s ease-out infinite',
        'shimmer': 'shimmer 3s infinite',
        'fade-up': 'fade-up 0.6s ease-out forwards',
      },
      keyframes: {
        'float-orb': {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(30px, -30px) scale(1.05)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.95)' },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(0.8)', opacity: '0.8' },
          '100%': { transform: 'scale(2)', opacity: '0' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
