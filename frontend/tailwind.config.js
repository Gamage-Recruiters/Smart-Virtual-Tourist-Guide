/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-blue': '#1A73E8',
        'brand-dark': '#122E63',
        'brand-light': '#D7EEFD',
        'brand-gradient-start': '#FFFFFF',
        'brand-gradient-end': '#A0DBFF',
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        mulish: ['Mulish', 'Segoe UI', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
