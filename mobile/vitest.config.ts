import { defineConfig } from 'vitest/config'

// Tests de lógica en TypeScript puro (deudas, fechas, config de Firebase).
// No hay tests de componentes RN para este alcance.
export default defineConfig({
  resolve: { alias: { '@': new URL('./src', import.meta.url).pathname } },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
})
