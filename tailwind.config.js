/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0fdf9',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6', // primary teal
          600: '#0d9488', // deep teal
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
        sage: {
          50: '#f4f7f4',
          100: '#e5ebe5',
          200: '#cedacd',
          300: '#a7c0a6',
          400: '#7fa37e',
          500: '#5f875e',
          600: '#4a6c49',
          700: '#3c563b',
          800: '#324632',
          900: '#2a3b2a',
        },
        sand: {
          50: '#faf7f2',
          100: '#f4efe4',
          200: '#e8dcbe',
          300: '#dac394',
          400: '#cba86a',
          500: '#b89047',
          600: '#9c7336',
          700: '#7b572c',
          800: '#674729',
          900: '#563c24',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        heading: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.02)',
        'card': '0 10px 25px -5px rgba(15, 23, 42, 0.06), 0 8px 10px -6px rgba(15, 23, 42, 0.04)',
        'elevated': '0 20px 35px -10px rgba(15, 23, 42, 0.1), 0 10px 15px -5px rgba(15, 23, 42, 0.05)',
      },
      borderRadius: {
        '3xl': '1.75rem',
        '4xl': '2.25rem',
      }
    },
  },
  plugins: [],
}
