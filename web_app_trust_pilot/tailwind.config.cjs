/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        tp: {
          cream: '#F2EDD1',
          peach: '#F9CB99',
          green: '#689B8A',
          deep: '#280A3E',
        },
      },
    },
  },
  plugins: [],
}
