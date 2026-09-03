export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        chrome: '#1c1c1e', // app shell (toolbar)
        page: '#faf9f6', // paper-like writing surface
        ink: '#2b2b28', // text on page
        muted: '#8a8a86',
      },
      fontFamily: {
        mono: ['"Courier Prime"', 'Courier New', 'monospace'],
      },
    },
  },
  plugins: [],
};
