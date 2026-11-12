import { describe, expect, it, vi } from 'vitest'
import { crearPreferenciasPredeterminadas } from './useAppStore'

vi.mock('@react-native-async-storage/async-storage', () => ({
  default: {
    getItem: async () => null,
    setItem: async () => undefined,
    removeItem: async () => undefined,
  },
}))

vi.mock('@/services/firebase', () => ({ MODO_SEEDS: true }))

describe('preferencias predeterminadas de cuenta', () => {
  it('no hereda opciones del dispositivo al completar preferencias parciales', () => {
    const preferencias = crearPreferenciasPredeterminadas({
      theme: 'dark',
      language: 'pt',
      accessibilityOptions: { largeTouchTargets: true },
    })

    expect(preferencias.theme).toBe('dark')
    expect(preferencias.language).toBe('pt')
    expect(preferencias.fontFamily).toBe('system')
    expect(preferencias.fontSize).toBe('normal')
    expect(preferencias.accessibilityOptions).toEqual({
      respectSystemMotion: true,
      improveReadability: false,
      highlightInteractive: true,
      largeTouchTargets: true,
    })
  })

  it('usa modo claro y español para una cuenta sin preferencias guardadas', () => {
    const preferencias = crearPreferenciasPredeterminadas()

    expect(preferencias.theme).toBe('light')
    expect(preferencias.language).toBe('es')
    expect(preferencias.notificacionesNovedades).toBe(false)
  })
})
