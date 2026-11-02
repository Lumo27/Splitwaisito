import type {
  GastoFirestore,
  TransferenciaFirestore,
} from '@/services/firestore'
import { esPago, pagoAprobado } from './pagos'
import {
  calcularBalances,
  simplificarDeudas,
  type DeudaSimplificada,
  type Participante,
} from './deudas'

export function estadoDeudasGrupo(
  gastos: GastoFirestore[],
  deudas: DeudaSimplificada[],
): 'sin-gastos' | 'saldado' | 'pendiente' {
  if (gastos.length === 0) return 'sin-gastos'
  return deudas.length === 0 ? 'saldado' : 'pendiente'
}

export function deudasDelGrupo(
  participantes: Participante[],
  gastos: GastoFirestore[],
  transferencias: TransferenciaFirestore[] = [],
) {
  const balances = Object.fromEntries(
    participantes.map((persona) => [persona.id, 0]),
  )
  // Los pagos pendientes o rechazados todavía no saldan nada.
  const vigentes = gastos.filter(
    (gasto) => !esPago(gasto) || pagoAprobado(gasto),
  )
  vigentes.forEach((gasto, index) => {
    const reparto = gasto.participantes?.length
      ? participantes.filter((persona) =>
          gasto.participantes?.includes(persona.id),
        )
      : participantes
    const importe = calcularBalances(reparto, [
      { ...gasto, id: gasto.id ?? String(index) },
    ])
    // Si quien pagó no participó del gasto, se le acredita el total completo.
    // Solo se hace si el pagador es un participante conocido del grupo; si el ID
    // viene corrupto desde Firestore (pagador eliminado, etc.), se descarta para
    // no generar acreedores fantasma que la UI no puede nombrar.
    if (
      !reparto.some((persona) => persona.id === gasto.pagadoPorId) &&
      reparto.length > 0 &&
      Object.prototype.hasOwnProperty.call(balances, gasto.pagadoPorId)
    ) {
      importe[gasto.pagadoPorId] = gasto.monto
    }
    Object.entries(importe).forEach(([id, saldo]) => {
      // Solo acumular saldos de participantes conocidos del grupo.
      if (Object.prototype.hasOwnProperty.call(balances, id)) {
        balances[id] = (balances[id] ?? 0) + saldo
      }
    })
  })
  transferencias.forEach((transferencia) => {
    if (transferencia.estado !== 'confirmada') return
    balances[transferencia.deudorId] =
      (balances[transferencia.deudorId] ?? 0) + transferencia.monto
    balances[transferencia.acreedorId] =
      (balances[transferencia.acreedorId] ?? 0) - transferencia.monto
  })
  return simplificarDeudas(balances)
}
