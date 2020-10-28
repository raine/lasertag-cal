/* eslint-env node */
const { fontSize } = require('tailwindcss/defaultTheme')

module.exports = {
  purge: ['./src/components/**/*.tsx', './src/pages/**/*.tsx'],
  theme: {
    fontSize: {
      ...fontSize,
      '2xl': ['26px', { letterSpacing: '-0.6px' }]
    },
    extend: {
      spacing: {
        '2px': '2px'
      },
      colors: {
        black: {
          333: '#333333',
          222: '#222222',
          e8: '#e8e8e8'
        },
        venue: {
          blue: '#4299E2',
          red: '#F56565'
        }
      }
    },
    inset: {
      0: 0,
      auto: 'auto',
      '2px': '2px'
    }
  },
  variants: {
    padding: ['first'],
    margin: ['responsive', 'last']
  },
  plugins: [require('tailwindcss-textshadow')]
}
