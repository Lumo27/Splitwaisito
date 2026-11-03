import { describe, expect, it } from 'vitest'
import { situacionEnGasto } from './pagos'

const base = {
  descripcion: 'Movimiento',
  categoria: 'Otro' as const,
  pagadoPorNombre: 'X',
  fecha: '2026-11-01',
}
const cena = { ...base, id: 'g1', monto: 100, pagadoPorId: 'lucas' }
const pago = (estado: 'aprobado' | 'pendiente' | 'rechazado') => ({
  ...base,
  id: `p-${estado}`,
  tipo: 'pago' as const,
  estado,
  monto: 50,
  pagadoPorId: 'cande',
  participantes: ['lucas'],
})

describe('situacionEnGasto', () => {
  it('distingue a quien pagó el gasto', () => {
    expect(situacionEnGasto('lucas', cena, [cena], [])).toEqual({
      tipo: 'pagador',
    })
  })

  it('muestra el pago aprobado o en revisión de quien debía', () => {
    expect(
      situacionEnGasto('cande', cena, [cena, pago('aprobado')], []).tipo,
    ).toBe('pago-aprobado')
    expect(
      situacionEnGasto(
        'cande',
        cena,
        [cena, pago('pendiente')],
        [{ de: 'cande', a: 'lucas' }],
      ).tipo,
    ).toBe('pago-en-revision')
  })

  it('sin pagos válidos usa las deudas del grupo', () => {
    const deudas = [{ de: 'cande', a: 'lucas' }]
    expect(
      situacionEnGasto('cande', cena, [cena, pago('rechazado')], deudas).tipo,
    ).toBe('debe')
    expect(situacionEnGasto('cande', cena, [cena], []).tipo).toBe('al-dia')
  })
})
