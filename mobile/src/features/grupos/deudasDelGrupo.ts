import type { GastoFirestore } from '@/services/firestore'
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
) {
  const balances = Object.fromEntries(
    participantes.map((persona) => [persona.id, 0]),
  )
  gastos.forEach((gasto, index) => {
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
  return simplificarDeudas(balances)
}
