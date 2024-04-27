/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  darkMode: ['class'],
  theme: {
    extend: {
      boxShadow: {
        statusCard: '2px 2px 6px #bec8e4',
        syncButton: '4px 4px 9px #bec8e4',
        syncClock: '9px 9px 18px #bec8e4',
      },
      colors: {
        primary: {
          blue: 'var(--primary-blue)',
          disabled: 'var(--primary-disabled)',
          gray: 'var(--primary-gray)',
          orange: 'var(--primary-orange)',
          purple: 'var(--primary-purple)',
        },
        background: 'var(--background)',
        text: 'var(--text)',
      },
      cursor: {
        brand:
          "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg'  width='40' height='48' viewport='0 0 100 100' style='fill:black;font-size:24px;'><text y='50%'>❤️</text></svg>\") 8 0,auto;",
      },
      spacing: {
        header: '70px',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
