import { describe, expect, it } from 'vitest'
import { calcularBalances, simplificarDeudas } from './deudas'

describe('calcularBalances', () => {
  it('calcula el saldo neto de cada participante con gastos compartidos', () => {
    const participantes = [
      { id: 'yo', nombre: 'Yo' },
      { id: 'a', nombre: 'Ana' },
      { id: 'b', nombre: 'Ben' },
    ]

    const gastos = [
      { id: 'g1', monto: 300, pagadoPorId: 'yo' },
      { id: 'g2', monto: 150, pagadoPorId: 'a' },
    ]

    expect(calcularBalances(participantes, gastos)).toEqual({
      yo: 150,
      a: 0,
      b: -150,
    })
  })
})

describe('simplificarDeudas', () => {
  it('combina las deudas para dejar la menor cantidad de transferencias', () => {
    const balances = {
      yo: 120,
      a: -30,
      b: -90,
    }

    expect(simplificarDeudas(balances)).toEqual([
      { de: 'b', a: 'yo', monto: 90 },
      { de: 'a', a: 'yo', monto: 30 },
    ])
  })

  it('devuelve una lista vacía cuando nadie debe ni recibe', () => {
    expect(simplificarDeudas({ yo: 0, a: 0 })).toEqual([])
  })

  it('ignora saldos menores a un centavo (residuos de punto flotante)', () => {
    expect(simplificarDeudas({ a: -1e-9, b: 1e-9, c: -50, d: 50 })).toEqual([
      { de: 'c', a: 'd', monto: 50 },
    ])
  })

  it('resuelve varios deudores y acreedores con transferencias mínimas', () => {
    expect(
      simplificarDeudas({
        deudorGrande: -100,
        deudorChico: -50,
        acreedorGrande: 80,
        acreedorChico: 70,
      }),
    ).toEqual([
      { de: 'deudorGrande', a: 'acreedorGrande', monto: 80 },
      { de: 'deudorChico', a: 'acreedorChico', monto: 50 },
      { de: 'deudorGrande', a: 'acreedorChico', monto: 20 },
    ])
  })
})
