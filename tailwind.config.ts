import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'primary-indigo': '#6366f1',
        'primary-purple': '#a855f7',
        'dark-bg': '#030014',
        'dark-card': '#0a0a29',
        'dark-border': '#1e1b4b',
      },
      backgroundImage: {
        'primary-gradient': 'linear-gradient(to right, #6366f1, #a855f7)',
        'reversed-gradient': 'linear-gradient(to right, #a855f7, #6366f1)',
        'radial-gradient': 'radial-gradient(circle, rgba(99, 102, 241, 0.3) 0%, rgba(17, 24, 39, 0) 70%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-in-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
        'spin-slow': 'spin 4s linear infinite',
        'typing': 'typing 2s steps(20), blink 1s step-end infinite alternate',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        typing: {
          'from': { width: '0' },
          'to': { width: '100%' },
        },
        blink: {
          '50%': { borderColor: 'transparent' },
        },
      },
      boxShadow: {
        'glow': '0 0 15px rgba(99, 102, 241, 0.5)',
        'glow-strong': '0 0 30px rgba(99, 102, 241, 0.7)',
      },
    },
  },
  plugins: [],
};

export default config; 