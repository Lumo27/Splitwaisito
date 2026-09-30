import AsyncStorage from '@react-native-async-storage/async-storage'
import { initializeApp } from 'firebase/app'
import { getAuth, getReactNativePersistence, initializeAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { Platform } from 'react-native'

import { hasFirebaseConfig, type FirebaseConfig } from './firebaseConfig'

// Expo solo inyecta las variables EXPO_PUBLIC_* si se leen de forma literal
// (process.env.EXPO_PUBLIC_X), por eso no se puede recorrer process.env.
const firebaseConfig: FirebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
}

export const MODO_SEEDS = process.env.EXPO_PUBLIC_MODO_SEEDS === 'true'

const isConfigured = !MODO_SEEDS && hasFirebaseConfig(firebaseConfig)

export const app = isConfigured ? initializeApp(firebaseConfig as Required<FirebaseConfig>) : null

// firebase 12.x: en React Native, getAuth() guarda la sesión solo en memoria y
// se pierde al cerrar la app. initializeAuth con getReactNativePersistence la
// guarda en AsyncStorage. Metro ya resuelve el build "react-native" de
// @firebase/auth, que exporta getReactNativePersistence; para que TypeScript vea
// esos mismos tipos, tsconfig.json apunta @firebase/auth a dist/rn/index.rn.d.ts.
// En web (expo start --web) se usa el build de navegador, que no tiene
// getReactNativePersistence pero ya persiste la sesión con getAuth().
export const auth = !app
  ? null
  : Platform.OS === 'web'
    ? getAuth(app)
    : initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage) })
export const db = app ? getFirestore(app) : null
export const storage = app ? getStorage(app) : null

export function isFirebaseAvailable() {
  return MODO_SEEDS || Boolean(app && auth && db && storage)
}
