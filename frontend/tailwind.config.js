/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#f0f3f9',
          100: '#d9e0ed',
          200: '#b3c1db',
          300: '#8da2c9',
          400: '#6783b7',
          500: '#4164a5',
          600: '#345084',
          700: '#273c63',
          800: '#1a2842',
          900: '#0d1421',
          950: '#060a12',
        },
        gold: {
          50: '#fdf9ef',
          100: '#faf0d4',
          200: '#f5e1a9',
          300: '#f0d27e',
          400: '#ebc353',
          500: '#e6b428',
          600: '#b8901f',
          700: '#8a6c17',
          800: '#5c480f',
          900: '#2e2408',
        },
      },
      fontFamily: {
        serif: ['Merriweather', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}