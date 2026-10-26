import type { GastoFirestore } from '@/services/firestore'
import type { CategoriaGasto } from '@/theme/categorias'

const categoriasGasto: CategoriaGasto[] = [
  'Alojamiento',
  'Comida',
  'Transporte',
  'Otro',
]

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
