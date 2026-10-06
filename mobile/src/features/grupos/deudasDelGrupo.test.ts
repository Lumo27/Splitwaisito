import { describe, expect, it } from 'vitest'
import { deudasDelGrupo } from './deudasDelGrupo'

const personas = ['a', 'b', 'c'].map((id) => ({ id, nombre: id }))
const gasto = { monto: 120, descripcion: 'Cena', categoria: 'Comida' as const, pagadoPorId: 'a', pagadoPorNombre: 'Ana', fecha: '2026-10-06' }

describe('deudasDelGrupo', () => {
  it('reparte entre todos cuando no hay selección', () => {
    expect(deudasDelGrupo(personas, [gasto])).toEqual([{ de: 'b', a: 'a', monto: 40 }, { de: 'c', a: 'a', monto: 40 }])
  })
  it('excluye a quien no participa del gasto', () => {
    expect(deudasDelGrupo(personas, [{ ...gasto, participantes: ['a', 'b'] }])).toEqual([{ de: 'b', a: 'a', monto: 60 }])
  })
  it('acredita el pago completo a quien pagó sin participar', () => {
    expect(deudasDelGrupo(personas, [{ ...gasto, participantes: ['b', 'c'] }])).toEqual([{ de: 'b', a: 'a', monto: 60 }, { de: 'c', a: 'a', monto: 60 }])
  })
  it('no genera deudas para un grupo sin gastos', () => {
    expect(deudasDelGrupo(personas, [])).toEqual([])
  })
})
