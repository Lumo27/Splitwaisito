import { describe, expect, it } from 'vitest'
import { formatearMoneda, LISTA_MONEDAS, MONEDAS } from './moneda'

describe('moneda', () => {
  it('contiene las monedas fijadas en el proyecto (ARS y USD)', () => {
    expect(LISTA_MONEDAS).toHaveLength(2)
    expect(LISTA_MONEDAS.map((m) => m.codigo)).toEqual(['ARS', 'USD'])
    expect(MONEDAS.ARS.simbolo).toBe('$')
    expect(MONEDAS.USD.simbolo).toBe('US$')
  })

  it('formatea montos en pesos argentinos por defecto', () => {
    const formateado = formatearMoneda(1500)
    expect(formateado).toContain('$')
    expect(formateado).toContain('1.500')
  })

  it('formatea montos en dólares (USD)', () => {
    const formateado = formatearMoneda(250.5, 'USD')
    expect(formateado).toContain('US$')
    expect(formateado).toContain('250,5')
  })
})
