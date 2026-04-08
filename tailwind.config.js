/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'green-dark': '#1a3a2a',
        'green-mid': '#2d6a4f',
        'green-light': '#52b788',
        'green-pale': '#d8f3dc',
        'accent': '#f4a261',
        'accent-dark': '#e76f51',
        'cream': '#faf8f2',
      },
      fontFamily: {
        syne: ['Syne', 'sans-serif'],
        dm: ['DM Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
