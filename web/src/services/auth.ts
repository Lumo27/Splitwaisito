import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type User,
} from 'firebase/auth'
import { auth, MODO_SEEDS } from './firebase'
import { upsertUsuarioPerfil } from './firestore'
import {
  seedCerrarSesion,
  seedIniciarSesion,
  seedSuscribirSesion,
} from './seedBackend'

const googleProvider = new GoogleAuthProvider()

export type UsuarioAuth = Pick<User, 'uid' | 'displayName' | 'email' | 'photoURL'>

export async function signInWithGoogle(): Promise<{ user: UsuarioAuth }> {
  if (MODO_SEEDS) {
    return { user: seedIniciarSesion() }
  }

  if (!auth) {
    throw new Error('Firebase no configurado aún.')
  }

  const result = await signInWithPopup(auth, googleProvider)
  const usuario = result.user

  await upsertUsuarioPerfil({
    id: usuario.uid,
    nombre: usuario.displayName || 'Usuario Google',
    email: usuario.email || 'google@usuario.com',
    alias: usuario.displayName || 'google-user',
    fotoUrl: usuario.photoURL || null,
  })

  return result
}

export function subscribeToAuthChanges(
  onUser: (usuario: UsuarioAuth | null) => void,
) {
  if (MODO_SEEDS) {
    return seedSuscribirSesion(onUser)
  }

  if (!auth) {
    onUser(null)
    return () => undefined
  }

  return onAuthStateChanged(auth, onUser)
}

export function signOutUser() {
  if (MODO_SEEDS) {
    seedCerrarSesion()
    return Promise.resolve()
  }

  if (!auth) {
    return Promise.resolve()
  }

  return signOut(auth)
}
