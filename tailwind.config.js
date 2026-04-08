/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './context/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        eco: {
          dark: '#1b5e20',
          DEFAULT: '#2e7d32',
          light: '#4caf50',
          bg: '#f0f4f0',
        },
      },
    },
  },
  plugins: [],
};

