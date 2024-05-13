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
        primary:   'var(--primary)',
        secondary: 'var(--secondary)',
        tertiary:  'var(--tertiary)',
        accent:    'hsl(var(--accent) / <alpha-value>)',

        crust:     'hsl(var(--crust) / <alpha-value>)',
        mantle:    'hsl(var(--mantle) / <alpha-value>)',
        base:      'hsl(var(--base) / <alpha-value>)',

        surface0:  'hsl(var(--surface0) / <alpha-value>)',
        surface1:  'hsl(var(--surface1) / <alpha-value>)',
        surface2:  'hsl(var(--surface2) / <alpha-value>)',

        overlay0:  'hsl(var(--overlay0) / <alpha-value>)',
        overlay1:  'hsl(var(--overlay1) / <alpha-value>)',
        overlay2:  'hsl(var(--overlay2) / <alpha-value>)',

        subtext0:  'hsl(var(--subtext0) / <alpha-value>)',
        subtext1:  'hsl(var(--subtext1) / <alpha-value>)',
        text:      'hsl(var(--text) / <alpha-value>)',
        textAlt:   'hsl(var(--textAlt) / <alpha-value>)',

        border0:   'hsl(var(--border0) / <alpha-value>)',
        border1:   'hsl(var(--border1) / <alpha-value>)',

        success:   'hsl(var(--success) / <alpha-value>)',
        failure:   'hsl(var(--failure) / <alpha-value>)',
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
