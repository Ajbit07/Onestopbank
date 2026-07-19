/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      // Original blue/indigo theme, expressed as semantic tokens
      colors: {
        ink: '#1f2937',
        pine: {
          DEFAULT: '#2563eb', // blue-600 — primary actions & links
          deep: '#4f46e5', // indigo-600 — sidebar & dark surfaces
          soft: '#dbeafe', // blue-100 — tinted chips
        },
        clay: '#dc2626', // red-600 — errors / outgoing
        gold: '#d97706', // amber-600 — small accents
        paper: '#edf2f9', // original app background
        linen: '#ffffff',
        hairline: '#e5e7eb', // gray-200 borders
        slateblue: '#6366f1',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
