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
        'error-red': '#D10000',
        black: {
          555: '#555555',
          333: '#333333',
          222: '#222222',
          e8: '#e8e8e8',
          f0: '#f0f0f0'
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
    padding: ['responsive', 'first'],
    margin: ['responsive', 'last'],
    borderWidth: ['last']
  },
  plugins: [require('tailwindcss-textshadow')]
}
