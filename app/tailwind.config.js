/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'sol-orange': '#F7931A',
        'competition-purple': '#A020F0',
        'neon-blue': '#00D4FF',
        'electric-pink': '#FF00FF',
        'dark-gray': '#1A1A1A',
        'light-gray': '#F0F0F0',
      },
      fontFamily: {
        'space': ['"Space Grotesk"', 'sans-serif'],
        'inter': ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
