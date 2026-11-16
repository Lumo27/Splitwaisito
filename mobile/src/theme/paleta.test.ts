import { describe, expect, it } from 'vitest'
import {
  FACTORES_TAMANO_TEXTO,
  obtenerPaleta,
  obtenerVariablesTema,
  temaOscuroPreferido,
} from './paleta'

describe('preferencias visuales', () => {
  it('resuelve el tema automático según el sistema', () => {
    expect(temaOscuroPreferido('system', true)).toBe(true)
    expect(temaOscuroPreferido('system', false)).toBe(false)
    expect(temaOscuroPreferido('dark', false)).toBe(true)
    expect(temaOscuroPreferido('light', true)).toBe(false)
  })

  it('conserva el acento y adapta los tokens al modo oscuro', () => {
    const oscuro = obtenerPaleta(true)
    const variables = obtenerVariablesTema(oscuro)

    expect(oscuro.background).not.toBe(obtenerPaleta(false).background)
    expect(variables['--color-primary']).toBe('63 167 114')
    expect(variables['--color-primary-dark']).toBe('142 216 176')
  })

  it('aumenta el contraste de textos y bordes', () => {
    const normal = obtenerPaleta(false)
    const contraste = obtenerPaleta(false, true)

    expect(contraste.text).toBe('#0B1724')
    expect(contraste.textMuted).toBe('#334155')
    expect(contraste.outline).toBe('#475569')
    expect(contraste.subtle).toBe('#E2E8F0')
    expect(contraste.surface).toBe(normal.surface)
  })

  it('ofrece cinco niveles tipográficos con un nivel normal sin escala', () => {
    expect(Object.keys(FACTORES_TAMANO_TEXTO)).toHaveLength(5)
    expect(FACTORES_TAMANO_TEXTO.normal).toBe(1)
    expect(FACTORES_TAMANO_TEXTO.veryLarge).toBeGreaterThan(1)
  })
})
