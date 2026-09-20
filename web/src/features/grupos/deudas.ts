const CENTAVO = 0.01

export interface Participante {
  id: string
  nombre: string
}

export interface GastoBase {
  id: string
  monto: number
  pagadoPorId: string
}

export interface DeudaSimplificada {
  de: string
  a: string
  monto: number
}

export function calcularBalances(
  participantes: Participante[],
  gastos: GastoBase[],
): Record<string, number> {
  const balances = Object.fromEntries(
    participantes.map((participante) => [participante.id, 0]),
  ) as Record<string, number>

  if (participantes.length === 0) {
    return balances
  }

  const totalParticipantes = participantes.length

  for (const gasto of gastos) {
    const share = gasto.monto / totalParticipantes

    if (Object.prototype.hasOwnProperty.call(balances, gasto.pagadoPorId)) {
      balances[gasto.pagadoPorId] += gasto.monto - share
    }

    for (const participante of participantes) {
      if (participante.id === gasto.pagadoPorId) continue
      balances[participante.id] = (balances[participante.id] ?? 0) - share
    }
  }

  return balances
}

export function simplificarDeudas(
  balances: Record<string, number>,
): DeudaSimplificada[] {
  const deudores = new Map<string, number>()
  const acreedores = new Map<string, number>()

  for (const [id, saldo] of Object.entries(balances)) {
    const valor = Number(saldo)
    if (!Number.isFinite(valor) || Math.abs(valor) < CENTAVO) continue

    if (valor < 0) {
      deudores.set(id, Math.abs(valor))
    } else {
      acreedores.set(id, valor)
    }
  }

  const result: DeudaSimplificada[] = []

  const ordenarDesc = (entries: [string, number][]) =>
    [...entries].sort(([, a], [, b]) => b - a)

  while (deudores.size > 0 && acreedores.size > 0) {
    const [deudorId, deuda] = ordenarDesc([...deudores.entries()])[0]
    const [acreedorId, credito] = ordenarDesc([...acreedores.entries()])[0]

    const monto = Math.min(deuda, credito)
    result.push({
      de: deudorId,
      a: acreedorId,
      monto: Number(monto.toFixed(2)),
    })

    const nuevaDeuda = deuda - monto
    const nuevoCredito = credito - monto

    deudores.delete(deudorId)
    acreedores.delete(acreedorId)

    if (nuevaDeuda >= CENTAVO) deudores.set(deudorId, nuevaDeuda)
    if (nuevoCredito >= CENTAVO) acreedores.set(acreedorId, nuevoCredito)
  }

  return result
}
