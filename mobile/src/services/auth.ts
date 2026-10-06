import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithCredential,
  signInWithEmailAndPassword,
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

export type UsuarioAuth = Pick<
  User,
  'uid' | 'displayName' | 'email' | 'photoURL'
>

// En web el login abre el popup de Google (signInWithPopup), que no existe en
// React Native. Acá el token de Google lo consigue la pantalla de login con la
// librería nativa de Google, y Firebase inicia sesión con esa credencial.
export async function signInWithGoogleIdToken(
  idToken: string,
): Promise<{ user: UsuarioAuth }> {
  if (!auth) {
    throw new Error('Firebase no configurado aún.')
  }

  const result = await signInWithCredential(
    auth,
    GoogleAuthProvider.credential(idToken),
  )
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

// Modo demo: entra con el usuario de ejemplo, sin Google ni Firebase.
export function signInDemo(): { user: UsuarioAuth } {
  return { user: seedIniciarSesion() }
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

export async function signInWithEmail(email: string, password: string) {
  if (!auth || MODO_SEEDS) throw new Error('Firebase no configurado.')
  return signInWithEmailAndPassword(auth, email.trim(), password)
}
