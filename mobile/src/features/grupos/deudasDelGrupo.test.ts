import { describe, expect, it } from 'vitest'
import { deudasDelGrupo, estadoDeudasGrupo } from './deudasDelGrupo'

const personas = ['a', 'b', 'c'].map((id) => ({ id, nombre: id }))
const gasto = {
  monto: 120,
  descripcion: 'Cena',
  categoria: 'Comida' as const,
  pagadoPorId: 'a',
  pagadoPorNombre: 'Ana',
  fecha: '2026-10-06',
}

describe('deudasDelGrupo', () => {
  it('reparte entre todos cuando no hay selección', () => {
    expect(deudasDelGrupo(personas, [gasto])).toEqual([
      { de: 'b', a: 'a', monto: 40 },
      { de: 'c', a: 'a', monto: 40 },
    ])
  })
  it('excluye a quien no participa del gasto', () => {
    expect(
      deudasDelGrupo(personas, [{ ...gasto, participantes: ['a', 'b'] }]),
    ).toEqual([{ de: 'b', a: 'a', monto: 60 }])
  })
  it('acredita el pago completo a quien pagó sin participar', () => {
    expect(
      deudasDelGrupo(personas, [{ ...gasto, participantes: ['b', 'c'] }]),
    ).toEqual([
      { de: 'b', a: 'a', monto: 60 },
      { de: 'c', a: 'a', monto: 60 },
    ])
  })
  it('un pago registrado salda solo la deuda de quien pagó', () => {
    const pago = {
      ...gasto,
      tipo: 'pago' as const,
      monto: 40,
      pagadoPorId: 'b',
      participantes: ['a'],
    }
    expect(deudasDelGrupo(personas, [gasto, pago])).toEqual([
      { de: 'c', a: 'a', monto: 40 },
    ])
  })
  it('no genera deudas para un grupo sin gastos', () => {
    expect(deudasDelGrupo(personas, [])).toEqual([])
  })
  it('ignora un pagador con ID que no pertenece al grupo (dato corrupto)', () => {
    // 'externo' no está en la lista de participantes: no debe aparecer
    // como acreedor ni generar deudas hacia un ID desconocido.
    const gastoExterno = { ...gasto, pagadoPorId: 'externo' }
    const deudas = deudasDelGrupo(personas, [gastoExterno])
    const ids = deudas.flatMap((d) => [d.de, d.a])
    expect(ids).not.toContain('externo')
  })
})

describe('estadoDeudasGrupo', () => {
  it('indica que todavía no hay gastos en un grupo vacío', () => {
    expect(estadoDeudasGrupo([], [])).toBe('sin-gastos')
  })

  it('indica que todo está saldado cuando hubo gastos y no quedan deudas', () => {
    expect(estadoDeudasGrupo([gasto], [])).toBe('saldado')
  })

  it('indica que hay deudas pendientes cuando existen transferencias', () => {
    expect(
      estadoDeudasGrupo([gasto], [{ de: 'b', a: 'a', monto: 120 }]),
    ).toBe('pendiente')
  })
})
