module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#4f46e5',
        accent: '#06b6d4',
      },
      keyframes: {
        float: { '0%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-6px)' }, '100%': { transform: 'translateY(0)' } }
      },
      animation: {
        float: 'float 3s ease-in-out infinite'
      }
    },
  },
  plugins: [],
};
