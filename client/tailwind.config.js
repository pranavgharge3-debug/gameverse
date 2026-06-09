module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'dark-bg': '#0a0e27',
        'dark-card': '#1a1f3a',
        'purple-primary': '#8b5cf6',
        'purple-dark': '#7c3aed',
        'cyan-accent': '#06b6d4',
        'magenta-accent': '#ec4899',
        'neon-purple': '#a855f7',
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
};
