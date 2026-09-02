/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        mono: ['"Courier Prime"', 'Courier New', 'monospace'], // screenplay-standard font
      },
    },
  },
  plugins: [],
};
