/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        // Direct font names — loaded via <link> in layout.tsx
        display: ['Syne', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono:    ['IBM Plex Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      colors: {
        accent: '#FFE500',
        ink:    '#0A0A0A',
        paper:  '#FAFAF8',
      },
      boxShadow: {
        brutal:    '4px 4px 0px #0A0A0A',
        'brutal-lg': '6px 6px 0px #0A0A0A',
        'brutal-sm': '2px 2px 0px #0A0A0A',
      },
    },
  },
  plugins: [],
}
