import { describe, expect, it } from 'vitest'
import { formatearMoneda, LISTA_MONEDAS, MONEDAS } from './moneda'

describe('moneda', () => {
  it('contiene las monedas fijadas en el proyecto (ARS, USD y BRL)', () => {
    expect(LISTA_MONEDAS).toHaveLength(3)
    expect(LISTA_MONEDAS.map((m) => m.codigo)).toEqual(['ARS', 'USD', 'BRL'])
    expect(MONEDAS.ARS.simbolo).toBe('$')
    expect(MONEDAS.USD.simbolo).toBe('US$')
    expect(MONEDAS.BRL.simbolo).toBe('R$')
  })

  it('formatea montos en pesos argentinos por defecto', () => {
    expect(formatearMoneda(1500)).toBe('$1.500')
  })

  it('usa punto como separador de miles', () => {
    expect(formatearMoneda(154000)).toBe('$154.000')
    expect(formatearMoneda(1000000)).toBe('$1.000.000')
  })

  it('formatea montos en dólares (USD)', () => {
    expect(formatearMoneda(250.5, 'USD')).toBe('US$250,5')
  })

  it('formatea montos en reales (BRL)', () => {
    expect(formatearMoneda(320.75, 'BRL')).toBe('R$320,75')
  })

  it('omite decimales cuando son cero', () => {
    expect(formatearMoneda(100, 'USD')).toBe('US$100')
    expect(formatearMoneda(1000, 'ARS')).toBe('$1.000')
  })

  it('formatea montos negativos con signo', () => {
    expect(formatearMoneda(-50.5, 'USD')).toBe('US$-50,5')
  })

  it('redondea a dos decimales', () => {
    // 1/3 de 100 = 33.333... → 33,33
    expect(formatearMoneda(100 / 3, 'ARS')).toBe('$33,33')
  })
})
