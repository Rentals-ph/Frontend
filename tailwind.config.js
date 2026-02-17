/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        outfit: ['Outfit', 'Inter', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
        montserrat: ['Montserrat', 'sans-serif'],
      },
      colors: {
        'rental-blue': {
          50: '#e6f2ff',
          100: '#b3d9ff',
          200: '#80bfff',
          300: '#4da6ff',
          400: '#1a8cff',
          500: '#0073e6',
          600: '#005cb3',
          700: '#004580',
          800: '#002e4d',
          900: '#00171a',
        },
        'rental-orange': {
          50: '#fff4e6',
          100: '#ffe0b3',
          200: '#ffcc80',
          300: '#ffb84d',
          400: '#ffa31a',
          500: '#ff8c00',
          600: '#cc7000',
          700: '#995400',
          800: '#663800',
          900: '#331c00',
        },
      },
      keyframes: {
        'partners-scroll': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'heroBackgroundAnimation': {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)' },
        },
      },
      animation: {
        'partners-scroll': 'partners-scroll 18s linear infinite',
        'heroBackgroundAnimation': 'heroBackgroundAnimation 20s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

