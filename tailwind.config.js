/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./public/**/*.{html,js}'],
  theme: {
    extend: {
      fontFamily: {
        'inter' : ['Inter', 'sans-serif'],
      }
    },
    fontSize: {
      text_md: ['16px', '24px'],
      text_lg: ['18px', '28px'],
      text_xl: ['20px', '30px'],
      display_xs: ['24px', '32px'],
      display_sm: ['30px', '38px'],
      display_md: ['36px', '44px'],
      display_lg: ['48px', '60px'],
      display_xl: ['60px', '72px'],
    },
    fontWeight: {
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },
  plugins: [],
}
