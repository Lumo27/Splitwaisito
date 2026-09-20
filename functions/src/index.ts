import { initializeApp } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { HttpsError, onCall } from 'firebase-functions/v2/https'

initializeApp()

const db = getFirestore()

type BalanceMap = Record<string, number>

type DeudaSimplificada = {
  de: string
  a: string
  monto: number
}

function simplificarDeudas(balances: BalanceMap): DeudaSimplificada[] {
  const deudores = new Map<string, number>()
  const acreedores = new Map<string, number>()

  for (const [id, saldo] of Object.entries(balances)) {
    if (!Number.isFinite(saldo) || Math.abs(saldo) < 0.01) continue

    if (saldo < 0) {
      deudores.set(id, Math.abs(saldo))
    } else {
      acreedores.set(id, saldo)
    }
  }

  const ordenarDesc = (entries: [string, number][]) =>
    [...entries].sort(([, a], [, b]) => b - a)
  const resultado: DeudaSimplificada[] = []

  while (deudores.size > 0 && acreedores.size > 0) {
    const [deudorId, deuda] = ordenarDesc([...deudores.entries()])[0]
    const [acreedorId, credito] = ordenarDesc([...acreedores.entries()])[0]
    const monto = Math.min(deuda, credito)

    resultado.push({
      de: deudorId,
      a: acreedorId,
      monto: Number(monto.toFixed(2)),
    })

    const nuevaDeuda = deuda - monto
    const nuevoCredito = credito - monto

    deudores.delete(deudorId)
    acreedores.delete(acreedorId)

    if (nuevaDeuda >= 0.01) deudores.set(deudorId, nuevaDeuda)
    if (nuevoCredito >= 0.01) acreedores.set(acreedorId, nuevoCredito)
  }

  return resultado
}

export const simplificarDeudasGrupo = onCall(
  { region: 'southamerica-east1' },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'Debes iniciar sesión.')
    }

    const grupoId = request.data?.grupoId
    if (typeof grupoId !== 'string' || grupoId.trim() === '') {
      throw new HttpsError('invalid-argument', 'Falta el grupoId.')
    }

    const grupoSnap = await db.collection('grupos').doc(grupoId).get()
    if (!grupoSnap.exists) {
      throw new HttpsError('not-found', 'El grupo no existe.')
    }

    const grupo = grupoSnap.data()
    const miembros = Array.isArray(grupo?.miembros)
      ? grupo.miembros.filter((id): id is string => typeof id === 'string')
      : []

    if (!miembros.includes(request.auth.uid)) {
      throw new HttpsError('permission-denied', 'No perteneces a este grupo.')
    }
    if (miembros.length === 0) {
      return { balances: {}, deudas: [] }
    }

    const gastosSnap = await db
      .collection('grupos')
      .doc(grupoId)
      .collection('gastos')
      .get()

    const balances: BalanceMap = Object.fromEntries(
      miembros.map((miembroId) => [miembroId, 0]),
    )

    for (const gastoSnap of gastosSnap.docs) {
      const gasto = gastoSnap.data()
      const monto = Number(gasto.monto)
      const pagadoPorId = gasto.pagadoPorId

      if (!Number.isFinite(monto) || monto <= 0) continue
      if (typeof pagadoPorId !== 'string' || !miembros.includes(pagadoPorId)) {
        continue
      }

      const cuota = monto / miembros.length
      balances[pagadoPorId] += monto - cuota

      for (const miembroId of miembros) {
        if (miembroId !== pagadoPorId) balances[miembroId] -= cuota
      }
    }

    return {
      balances,
      deudas: simplificarDeudas(balances),
    }
  },
)
