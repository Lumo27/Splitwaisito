import { describe, expect, it } from 'vitest'
import { validarGasto } from './validarGasto'
describe('validarGasto', () => {
  it('acepta decimales con coma y pagador fuera del reparto', () => {
    expect(validarGasto('Cena', '120,50', 'a', ['b'], ['a', 'b'])).toBe('')
  })
  it('rechaza ceros, negativos, infinito y separadores ambiguos', () => {
    for (const monto of ['0', '-1', 'Infinity', '1.000,50', '12abc', '1.123'])
      expect(validarGasto('Cena', monto, 'a', ['a'], ['a'])).not.toBe('')
  })
  it('rechaza descripción vacía o selección ajena al grupo', () => {
    expect(validarGasto(' ', '10', 'a', ['a'], ['a'])).not.toBe('')
    expect(validarGasto('Cena', '10', 'a', ['b'], ['a'])).not.toBe('')
  })
  it('rechaza un reparto vacío y un pagador desconocido', () => {
    expect(validarGasto('Cena', '10', 'a', [], ['a'])).not.toBe('')
    expect(validarGasto('Cena', '10', 'x', ['a'], ['a'])).not.toBe('')
  })
})
