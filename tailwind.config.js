/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg': '#0b0b0f',
        'panel': '#111318',
        'panel-2': '#151823',
        'text': '#e5e7eb',
        'muted': '#8b8e98',
        'accent': '#1db954',
        'accent-2': '#22d3ee',
        'card': '#181b26',
        'border': '#252836',
      },
      backgroundImage: {
        'gradient-radial-900-400': 'radial-gradient(900px 400px at 80% -10%, rgba(29,185,84,.12), transparent 60%), radial-gradient(700px 300px at 20% -10%, rgba(34,211,238,.10), transparent 60%)',
      }
    },
  },
  plugins: [],
}
