/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#007AFF',
        'primary-dark': '#0051B3',
        'primary-light': '#47A1FF',
        background: {
          DEFAULT: '#FFFFFF',
          secondary: '#F2F2F2',
        },
        text: {
          DEFAULT: '#000000',
          secondary: '#333333',
          tertiary: '#666666',
        },
        border: {
          DEFAULT: '#CFCFCF',
          light: '#E5E5E5',
        }
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          'Inter',
          'Segoe UI',
          'Roboto',
          'sans-serif'
        ],
      },
      borderRadius: {
        DEFAULT: '0.5rem',
        'lg': '0.75rem',
        'sm': '0.25rem',
      },
      spacing: {
        'layout': '2rem',
        'section': '1.5rem',
        'element': '1rem',
      },
      boxShadow: {
        DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        'hover': '0 2px 4px 0 rgba(0, 0, 0, 0.1)',
      },
      fontSize: {
        'body': ['1rem', '1.5rem'],
        'body-lg': ['1.125rem', '1.75rem'],
        'heading': ['1.5rem', '2rem'],
        'heading-lg': ['2rem', '2.5rem'],
      },
    },
  },
  plugins: [],
}
