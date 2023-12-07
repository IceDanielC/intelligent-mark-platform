/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  // disable tailwindcss preflight which conflicts with antd styles
  corePlugins: {
    preflight: false
  },
  theme: {
    extend: {
      screens: {
        '3xl': '1960px'
      },
      spacing: {
        128: '32rem',
        144: '36rem'
      }
    }
  },
  plugins: []
}
