/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      // Misma paleta y mismos nombres de clase que web/tailwind.config.js,
      // para portar las pantallas sin traducir clases.
      colors: {
        primary: {
          light: '#DCF3E6',
          DEFAULT: '#3FA772',
          dark: '#2E7D57',
        },
        secondary: {
          light: '#E0F5FE',
          DEFAULT: '#38BDF8',
          dark: '#0EA5E9',
        },
        background: '#F8FAFC',
        surface: '#FFFFFF',
        text: {
          DEFAULT: '#152238',
          muted: '#64748B',
        },
        danger: '#EF4444',
        success: '#22C55E',
        warning: '#F59E0B',
      },
    },
  },
  plugins: [],
}
