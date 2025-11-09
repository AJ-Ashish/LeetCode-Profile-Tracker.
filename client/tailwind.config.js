/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          DEFAULT: '#0f0f0f',
          card: '#1a1a1a',
          border: '#2a2a2a'
        },
        orange: {
          DEFAULT: '#fb923c',
          light: '#fed7aa',
          dark: '#ea580c'
        }
      }
    },
  },
  plugins: [],
}