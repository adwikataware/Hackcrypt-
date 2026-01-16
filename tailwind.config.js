/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
      colors: {
        dark: '#0a0a0a',
        'dark-secondary': '#1a1a1a',
        'dark-tertiary': '#2a2a2a',
        'gray-accent': '#404040',
        'text-primary': '#ffffff',
        'text-secondary': '#b0b0b0',
      },
    },
  },
  plugins: [],
}
