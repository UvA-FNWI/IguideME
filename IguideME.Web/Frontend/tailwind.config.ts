import typography from '@tailwindcss/typography';
import type { Config } from 'tailwindcss';

export default {
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
          100: '#5a32ff',
          200: '#764aff',
          300: '#8c61ff',
          400: '#a077ff',
          500: '#b38dff',
          600: '#c4a4ff',

          green: {
            DEFAULT: 'var(--green)',
            background: 'var(--green-background)',
          },
          red: {
            DEFAULT: 'var(--red)',
            background: 'var(--red-background)',
          },
        },

        bodyBackground: 'var(--body-background)',
        borderColor: 'var(--border-color)',
        cardBackground: 'var(--card-background)',
        groupBackground: 'var(--group-background)',
        dropdownBackground: 'var(--dropdown-background)',
        navbarBackground: 'var(--navbar-background)',
        hoverBackground: 'var(--hover-background)',
        dialogBackground: 'var(--dialog-background)',
        logo: 'var(--logo)',
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
  plugins: [typography],
} satisfies Config;
