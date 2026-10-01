import { getFunctions, httpsCallable } from 'firebase/functions'
import { app } from './firebase'

export interface DeudaRemota {
  de: string
  a: string
  monto: number
}

interface ResultadoDeudas {
  balances: Record<string, number>
  deudas: DeudaRemota[]
}

export async function obtenerDeudasDelGrupo(grupoId: string) {
  if (!app) return null

  const functions = getFunctions(app, 'southamerica-east1')
  const callable = httpsCallable<{ grupoId: string }, ResultadoDeudas>(
    functions,
    'simplificarDeudasGrupo',
  )
  const resultado = await callable({ grupoId })

  return resultado.data
}
