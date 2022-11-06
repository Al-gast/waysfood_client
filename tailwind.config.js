/** @type {import('tailwindcss').Config} */

const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./layouts/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors:{
        // primary:'#C490E4',
        primary:'#FFC700',
        secondary:'#433434',
        body:'#efefef'
      },
      container:{
        center: true,
        padding: '2rem'
      },
      fontFamily:{
        header: ['Abhaya Libre', ...defaultTheme.fontFamily.serif],
        content: ['Poppins', ...defaultTheme.fontFamily.sans]
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('tailwind-scrollbar-hide')
  ],
}
