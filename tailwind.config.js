/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4F46E5',
          dark: '#3730A3',
        },
        gold: '#FDB927',
        silver: '#C0C0C0',
        platinum: '#E5E4E2',
      }
    },
  },
  plugins: [],
}