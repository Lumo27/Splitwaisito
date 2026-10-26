import { describe, expect, it } from 'vitest'
import { resumirGastosPorCategoria } from './gastosPorCategoria'

const gasto = {
  descripcion: 'Gasto de prueba',
  pagadoPorId: 'persona',
  pagadoPorNombre: 'Persona',
  fecha: '2026-10-26',
} as const

describe('resumirGastosPorCategoria', () => {
  it('suma gastos reales y calcula la proporción de cada categoría', () => {
    const resumen = resumirGastosPorCategoria([
      { ...gasto, monto: 300, categoria: 'Alojamiento' },
      { ...gasto, monto: 100, categoria: 'Comida' },
      { ...gasto, monto: 100, categoria: 'Comida' },
      { ...gasto, monto: 500, categoria: 'Transporte' },
    ])

    expect(resumen).toEqual([
      { categoria: 'Alojamiento', monto: 300, porcentaje: 30 },
      { categoria: 'Comida', monto: 200, porcentaje: 20 },
      { categoria: 'Transporte', monto: 500, porcentaje: 50 },
      { categoria: 'Otro', monto: 0, porcentaje: 0 },
    ])
  })

  it('muestra categorías sin gastos con proporción cero', () => {
    expect(resumirGastosPorCategoria([])).toEqual([
      { categoria: 'Alojamiento', monto: 0, porcentaje: 0 },
      { categoria: 'Comida', monto: 0, porcentaje: 0 },
      { categoria: 'Transporte', monto: 0, porcentaje: 0 },
      { categoria: 'Otro', monto: 0, porcentaje: 0 },
    ])
  })
})
