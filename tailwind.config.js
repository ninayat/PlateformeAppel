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
      boxShadow: {
        'sm':  '0 1px 3px rgba(26,58,42,.06), 0 1px 2px rgba(26,58,42,.04)',
        'md':  '0 4px 16px rgba(26,58,42,.08), 0 2px 6px rgba(26,58,42,.05)',
        'lg':  '0 12px 40px rgba(26,58,42,.12), 0 4px 12px rgba(26,58,42,.07)',
        'xl':  '0 24px 64px rgba(26,58,42,.16)',
        'card': '0 2px 8px rgba(26,58,42,.06)',
        'card-hover': '0 8px 24px rgba(26,58,42,.1)',
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
        '3xl': '24px',
      },
    },
  },
  plugins: [],
}
