/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./views/**/*.{html,js,ejs}'],
  theme: {
    extend: {
      
    },
    fontFamily: {
      'inter' : ['Inter', 'sans-serif'],
    },
    fontSize: {
      text_xs: ['12px', '18px'],
      text_sm: ['14px', '20px'],
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
    colors: {
      'text-base': '#101828',
      'text-darker': '#344054',
      'white': '#FFFFFF',
      'asphalt' : '#475467',
      'primary-900': '#42307D',
      'primary-700': '#6941C6',
      'primary-600': '#7F56D9',
      'primary-100': '#F2F4F7',
      'gray-50': '#F9FAFB',
      'gray-100': '#F2F4F7',
      'gray-200': '#EAECF0',
      'gray-300': '#D0D5DD',
      'gray-500': '#667085',
      'gray-700': '#344054',
      'success-900': '#054F31',
      'success-800': '#05603A',
      'success-700': '#027A48',
      'success-600': '#039855',
      'success-500': '#12B76A',
      'success-400': '#32D583',
      'success-300': '#6CE9A6',
      'success-200': '#A6F4C5',
      'success-100': '#D1FADF',
      'success-50': '#ECFDF3',
      'success-25': '#F6FEF9',
      
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
  variants: {
    extends: {
      display: ['group-focus']
    },
  },
}
