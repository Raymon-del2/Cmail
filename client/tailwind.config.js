/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Dark theme colors
        'dark-bg': '#1a1a1a',
        'dark-card': '#2d2d2d',
        'dark-border': '#3f3f3f',
        'dark-text': '#e8eaed',
        'dark-text-secondary': '#9aa0a6',
        
        // Purple theme
        'cmail-purple': '#8b5cf6',
        'cmail-purple-light': '#a78bfa',
        'cmail-purple-dark': '#7c3aed',
        
        // Original colors (kept for compatibility)
        'cmail-blue': '#8ab4f8',
        'cmail-red': '#f28b82',
        'cmail-yellow': '#fdd663',
        'cmail-green': '#81c995',
      },
    },
  },
  plugins: [],
}
