import type { GastoFirestore } from '@/services/firestore'
import {
  calcularBalances,
  simplificarDeudas,
  type Participante,
} from './deudas'

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
    if (
      !reparto.some((persona) => persona.id === gasto.pagadoPorId) &&
      reparto.length
    ) {
      importe[gasto.pagadoPorId] = gasto.monto
    }
    Object.entries(importe).forEach(([id, saldo]) => {
      balances[id] = (balances[id] ?? 0) + saldo
    })
  })
  return simplificarDeudas(balances)
}
