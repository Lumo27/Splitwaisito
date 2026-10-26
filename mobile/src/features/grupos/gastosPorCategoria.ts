import type { GastoFirestore } from '@/services/firestore'

export const categoriasGasto = [
  'Alojamiento',
  'Comida',
  'Transporte',
  'Otro',
] as const

export type CategoriaGasto = (typeof categoriasGasto)[number]

export interface ResumenGastoCategoria {
  categoria: CategoriaGasto
  monto: number
  porcentaje: number
}

export function resumirGastosPorCategoria(
  gastos: GastoFirestore[],
): ResumenGastoCategoria[] {
  const montos = categoriasGasto.map((categoria) => ({
    categoria,
    monto: gastos.reduce(
      (total, gasto) =>
        gasto.categoria === categoria ? total + gasto.monto : total,
      0,
    ),
  }))
  const total = montos.reduce((suma, item) => suma + item.monto, 0)

  return montos.map((item) => ({
    ...item,
    porcentaje: total > 0 ? (item.monto / total) * 100 : 0,
  }))
}
