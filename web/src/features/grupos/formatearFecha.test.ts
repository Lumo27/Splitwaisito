import { formatearFecha } from './formatearFecha'

describe('formatearFecha', () => {
  it('formatea una fecha ISO en español', () => {
    expect(formatearFecha('2026-09-15T20:15:00')).toBe('15 sep, 20:15')
  })

  it('deja intacto un texto que no es una fecha ISO', () => {
    expect(formatearFecha('15 sept, 20:15')).toBe('15 sept, 20:15')
  })
})
