import type { EstadoPago, GastoFirestore } from '@/services/firestore'

// Helpers de los movimientos de tipo pago. Sin dependencias de Firebase para
// poder usarlos en el cálculo de deudas y en los tests.

export const esPago = (gasto: Pick<GastoFirestore, 'tipo'>) =>
  gasto.tipo === 'pago'

/** Sin estado (pagos registrados antes de la verificación) cuenta como aprobado. */
export const estadoDelPago = (pago: Pick<GastoFirestore, 'estado'>) =>
  pago.estado ?? 'aprobado'

/** Un pago salda la deuda recién cuando está aprobado. */
export const pagoAprobado = (gasto: Pick<GastoFirestore, 'tipo' | 'estado'>) =>
  esPago(gasto) && estadoDelPago(gasto) === 'aprobado'

/** Quién recibe el dinero de un pago: es su único participante. */
export const receptorDelPago = (gasto: Pick<GastoFirestore, 'participantes'>) =>
  gasto.participantes?.[0]

export const ETIQUETAS_ESTADO_PAGO: Record<
  EstadoPago,
  { texto: string; fondo: string; color: string }
> = {
  pendiente: {
    texto: 'Pendiente de aprobación',
    fondo: '#FFF8E1',
    color: '#7A5600',
  },
  aprobado: { texto: 'Aprobado', fondo: '#E8F8ED', color: '#13622B' },
  rechazado: { texto: 'Rechazado', fondo: '#FFEBEB', color: '#9E1B1B' },
}

export type SituacionEnGasto =
  | { tipo: 'pagador' }
  | { tipo: 'pago-aprobado'; pago: GastoFirestore }
  | { tipo: 'pago-en-revision'; pago: GastoFirestore }
  | { tipo: 'debe' }
  | { tipo: 'al-dia' }

/**
 * Situación de una persona frente a quien pagó un gasto: si ya le transfirió
 * (y el pago está aprobado o en revisión), si todavía le debe o si está al
 * día. Los pagos se buscan del más reciente al más viejo.
 */
export function situacionEnGasto(
  personaId: string,
  gasto: Pick<GastoFirestore, 'pagadoPorId'>,
  movimientos: GastoFirestore[],
  deudas: { de: string; a: string }[],
): SituacionEnGasto {
  const acreedor = gasto.pagadoPorId
  if (personaId === acreedor) return { tipo: 'pagador' }
  const pagos = movimientos
    .filter(
      (movimiento) =>
        esPago(movimiento) &&
        movimiento.pagadoPorId === personaId &&
        receptorDelPago(movimiento) === acreedor,
    )
    .sort((a, b) => b.fecha.localeCompare(a.fecha))
  const aprobado = pagos.find(pagoAprobado)
  if (aprobado) return { tipo: 'pago-aprobado', pago: aprobado }
  const enRevision = pagos.find((pago) => pago.estado === 'pendiente')
  if (enRevision) return { tipo: 'pago-en-revision', pago: enRevision }
  return deudas.some((deuda) => deuda.de === personaId && deuda.a === acreedor)
    ? { tipo: 'debe' }
    : { tipo: 'al-dia' }
}
