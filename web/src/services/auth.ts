import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type User,
} from 'firebase/auth'
import { auth } from './firebase'
import { upsertUsuarioPerfil } from './firestore'

const googleProvider = new GoogleAuthProvider()

export async function signInWithGoogle() {
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
  onUser: (usuario: User | null) => void,
) {
  if (!auth) {
    onUser(null)
    return () => undefined
  }

  return onAuthStateChanged(auth, onUser)
}

export function signOutUser() {
  if (!auth) {
    return Promise.resolve()
  }

  return signOut(auth)
}
