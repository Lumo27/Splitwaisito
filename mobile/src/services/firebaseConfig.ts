// Separado de firebase.ts para poder testearlo con Vitest sin cargar React Native.
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
