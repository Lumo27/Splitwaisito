import { describe, expect, it } from 'vitest'
import { formatearMoneda, LISTA_MONEDAS, MONEDAS } from './moneda'

describe('moneda', () => {
  it('contiene exactamente las 3 monedas fijadas en el proyecto (ARS, USD, BRL)', () => {
    expect(LISTA_MONEDAS).toHaveLength(3)
    expect(LISTA_MONEDAS.map((m) => m.codigo)).toEqual(['ARS', 'USD', 'BRL'])
    expect(MONEDAS.ARS.simbolo).toBe('$')
    expect(MONEDAS.USD.simbolo).toBe('US$')
    expect(MONEDAS.BRL.simbolo).toBe('R$')
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

  it('formatea montos en reales brasileños (BRL)', () => {
    const formateado = formatearMoneda(80, 'BRL')
    expect(formateado).toContain('R$')
    expect(formateado).toContain('80')
  })
})
