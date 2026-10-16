import defaultTheme from 'tailwindcss/defaultTheme'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#F0FDFA',
          600: '#0F766E',
        },
        accent: {
          500: '#F59E0B',
        },
        neutral: {
          100: '#F3F4F6',
          600: '#4B5563',
          900: '#111827',
        },
        danger: {
          600: '#DC2626',
        },
        success: {
          600: '#16A34A',
        },
      },
      fontFamily: {
        sans: ['Cairo', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
}
