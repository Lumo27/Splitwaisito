import { doc, getDocFromServer, serverTimestamp, setDoc } from 'firebase/firestore'
import { auth, db, MODO_SEEDS } from './firebase'
import {
  tieneAceptacionRegistrada,
  TERMINOS_VERSION,
} from '../features/terminos/terminos'

function referenciaAceptacion(usuarioId: string) {
  if (!db) throw new Error('Firebase no está configurado.')
  return doc(db, 'aceptacionesTerminos', usuarioId)
}

function claveAceptacionDemo(usuarioId: string) {
  return `splitwaisito-aceptacion-terminos-${usuarioId}`
}

export async function consultarAceptacionTerminos(
  usuarioId: string,
): Promise<boolean> {
  if (MODO_SEEDS) {
    const guardada = window.localStorage.getItem(claveAceptacionDemo(usuarioId))
    if (!guardada) return false
    return tieneAceptacionRegistrada(JSON.parse(guardada))
  }

  if (!auth || !db) {
    const guardada = window.localStorage.getItem(claveAceptacionDemo(usuarioId))
    if (!guardada) return false
    return tieneAceptacionRegistrada(JSON.parse(guardada))
  }

  if (!auth?.currentUser || auth.currentUser.uid !== usuarioId) {
    throw new Error('No hay una sesión autenticada para consultar los términos.')
  }

  const snapshot = await getDocFromServer(referenciaAceptacion(usuarioId))
  if (!snapshot.exists()) return false
  return tieneAceptacionRegistrada(snapshot.data())
}

export async function registrarAceptacionTerminos(
  usuarioId: string,
): Promise<void> {
  if (MODO_SEEDS) {
    window.localStorage.setItem(
      claveAceptacionDemo(usuarioId),
      JSON.stringify({ version: TERMINOS_VERSION, estado: 'aceptado' }),
    )
    return
  }

  if (!auth || !db) {
    window.localStorage.setItem(
      claveAceptacionDemo(usuarioId),
      JSON.stringify({ version: TERMINOS_VERSION, estado: 'aceptado' }),
    )
    return
  }

  if (!auth?.currentUser || auth.currentUser.uid !== usuarioId) {
    throw new Error('Iniciá sesión para registrar la aceptación de los términos.')
  }

  await setDoc(referenciaAceptacion(usuarioId), {
    usuarioId,
    version: TERMINOS_VERSION,
    estado: 'aceptado',
    acceptedAt: serverTimestamp(),
  })
}
