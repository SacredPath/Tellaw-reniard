module.exports = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: { 50: '#fffbeb', 900: '#0b1426' },
      },
      fontFamily: { poppins: ['Poppins', 'sans-serif'] },
    },
  },
  plugins: [],
};