import typography from '@tailwindcss/typography';
import type { Config } from 'tailwindcss';
import ariaAttributes from 'tailwindcss-aria-attributes';

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
        body: 'hsl(var(--body) / <alpha-value>)',
        text: 'hsl(var(--text) / <alpha-value>)',

        button: {
          DEFAULT: 'hsl(var(--button) / <alpha-value>)',
          disabled: 'hsl(var(--button-disabled) / <alpha-value>)',
          hover: 'hsl(var(--button-hover) / <alpha-value>)',
        },

        card: {
          DEFAULT: 'hsl(var(--card) / <alpha-value>)',
          background: 'hsl(var(--card-background) / <alpha-value>)',
          foreground: 'hsl(var(--card-foreground) / <alpha-value>)',
        },

        graph: {
          max: 'hsl(var(--graph-max) / <alpha-value>)',
          peer: 'var(--graph-peer)',
          peerMax: 'var(--graph-peer-max)',
          you: 'var(--graph-you)',
        },

        banner: 'hsl(var(--banner) / <alpha-value>)',
        content: 'hsl(var(--content) / <alpha-value>)',
        dropdownBackground: 'hsl(var(--dropdown-background) / <alpha-value>)',

        navbar: {
          DEFAULT: 'hsl(var(--navbar) / <alpha-value>)',
          light: 'hsl(var(--navbar-light) / <alpha-value>)',
          side: {
            DEFAULT: 'hsl(var(--navbar-side) / <alpha-value>)',
            active: 'hsl(var(--navbar-side-active) / <alpha-value>)',
            hover: 'hsl(var(--navbar-side-hover) / <alpha-value>)',
          },
        },

        primary: {
          DEFAULT: 'hsl(var(--primary) / <alpha-value>)',
          light: 'hsl(var(--primary-light) / <alpha-value>)',
        },

        success: 'hsl(var(--success) / <alpha-value>)',
        failure: 'hsl(var(--failure) / <alpha-value>)',
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
  plugins: [ariaAttributes, typography],
} satisfies Config;
