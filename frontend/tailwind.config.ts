import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#5B21B6',
        secondary: '#0EA5E9',
        accent: '#F97316'
      }
    }
  },
  plugins: []
} satisfies Config;
