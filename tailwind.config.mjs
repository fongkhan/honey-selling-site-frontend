/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        honey: {
          50: '#fffaeb',
          100: '#fff1c6',
          200: '#ffe188',
          300: '#ffc94a',
          400: '#ffb01c',
          500: '#f08c00',
          600: '#d46a00',
          700: '#b04d00',
          800: '#8a3a00',
          900: '#5e2700',
        },
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        body: ['"Inter"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
