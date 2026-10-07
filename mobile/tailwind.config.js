/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      // Paleta móvil compartida con src/theme/colores.ts.
      colors: {
        primary: {
          light: '#DDF8EC',
          DEFAULT: '#087F63',
          dark: '#065F4B',
        },
        secondary: {
          light: '#E0F2FE',
          DEFAULT: '#0284C7',
          dark: '#0369A1',
        },
        background: '#F3F7F6',
        surface: '#FFFFFF',
        text: {
          DEFAULT: '#142D2A',
          muted: '#586D69',
        },
        danger: '#EF4444',
        success: '#22C55E',
        warning: '#F59E0B',
      },
    },
  },
  plugins: [],
}
