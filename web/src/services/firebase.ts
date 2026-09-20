import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

export type FirebaseConfig = {
  apiKey?: string
  authDomain?: string
  projectId?: string
  storageBucket?: string
  messagingSenderId?: string
  appId?: string
}

export function hasFirebaseConfig(config: FirebaseConfig) {
  const values = Object.values(config).filter((value) => value !== undefined)

  if (values.length === 0) {
    return false
  }

  return values.length === 6 && Object.values(config).every(Boolean)
}

const firebaseConfig: FirebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

const isConfigured = hasFirebaseConfig(firebaseConfig)

export const app = isConfigured ? initializeApp(firebaseConfig as Required<FirebaseConfig>) : null
export const auth = app ? getAuth(app) : null
export const db = app ? getFirestore(app) : null
export const storage = app ? getStorage(app) : null

export function isFirebaseAvailable() {
  return Boolean(app && auth && db && storage)
}
