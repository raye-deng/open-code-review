import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f0ff',
          100: '#e0e0ff',
          200: '#c4c4ff',
          300: '#9e9eff',
          400: '#7a5af8',
          500: '#6938ef',
          600: '#5925dc',
          700: '#4a1fb8',
          800: '#3d1a96',
          900: '#34187a',
        },
      },
    },
  },
  plugins: [],
};
export default config;
