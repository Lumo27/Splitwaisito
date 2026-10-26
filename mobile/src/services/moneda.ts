import type { MonedaGrupo } from './firestore'

export function formatearDinero(monto: number, moneda: MonedaGrupo = 'ARS') {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: moneda,
    currencyDisplay: 'code',
    maximumFractionDigits: 2,
  }).format(monto)
}
