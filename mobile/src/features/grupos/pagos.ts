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
