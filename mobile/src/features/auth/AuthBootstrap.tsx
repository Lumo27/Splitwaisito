import { useEffect, useState, type ReactNode } from 'react'
import { Text, View } from 'react-native'

import { subscribeToAuthChanges } from '@/services/auth'
import { isFirebaseAvailable, MODO_SEEDS } from '@/services/firebase'
import { getUsuarioPerfil, guardarAmigosDelUsuario } from '@/services/firestore'
import { inicializarSeeds } from '@/services/seedBackend'
import { useAppStore } from '@/store/useAppStore'

// Igual que AuthBootstrap de web/src/App.tsx, con una diferencia: en React
// Native el store se restaura desde AsyncStorage de forma asíncrona, así que
// también se espera a que termine antes de decidir a qué pantalla ir.
function useStoreHidratado() {
  const [hidratado, setHidratado] = useState(useAppStore.persist.hasHydrated())

  useEffect(() => {
    if (hidratado) return
    return useAppStore.persist.onFinishHydration(() => setHidratado(true))
  }, [hidratado])

  return hidratado
}

export function AuthBootstrap({ children }: { children: ReactNode }) {
  const [authReady, setAuthReady] = useState(!isFirebaseAvailable())
  const storeHidratado = useStoreHidratado()
  const { iniciarSesion, cerrarSesion, reemplazarAmigos } = useAppStore()

  useEffect(() => {
    if (!isFirebaseAvailable()) return

    let desuscribir: (() => void) | undefined
    let vigente = true

    const suscribir = () =>
      subscribeToAuthChanges((firebaseUser) => {
        if (firebaseUser) {
          iniciarSesion(
            firebaseUser.displayName || 'Usuario Google',
            firebaseUser.email || 'google@usuario.com',
            firebaseUser.displayName || 'google-user',
            firebaseUser.uid,
            firebaseUser.photoURL,
          )

          void getUsuarioPerfil(firebaseUser.uid)
            .then((perfil) => {
              const amigosLocales = useAppStore.getState().amigos
              const amigosGuardados = perfil?.amigos ?? amigosLocales

              iniciarSesion(
                firebaseUser.displayName || 'Usuario Google',
                firebaseUser.email || 'google@usuario.com',
                perfil?.alias || firebaseUser.displayName || 'google-user',
                firebaseUser.uid,
                perfil?.fotoUrl ?? firebaseUser.photoURL,
                perfil?.descripcion,
              )
              reemplazarAmigos(amigosGuardados)

              if (!perfil?.amigos && amigosLocales.length > 0) {
                void guardarAmigosDelUsuario(firebaseUser.uid, amigosLocales)
              }
            })
            .catch(() => undefined)
        } else {
          cerrarSesion()
        }

        setAuthReady(true)
      })

    // En modo demo, primero se cargan los datos de ejemplo desde AsyncStorage.
    if (MODO_SEEDS) {
      void inicializarSeeds().then(() => {
        if (vigente) desuscribir = suscribir()
      })
    } else {
      desuscribir = suscribir()
    }

    return () => {
      vigente = false
      desuscribir?.()
    }
  }, [cerrarSesion, iniciarSesion, reemplazarAmigos])

  if (!authReady || !storeHidratado) {
    return (
      <View className="flex-1 items-center justify-center bg-background p-4">
        <Text className="text-sm text-text-muted">Restaurando tu sesión...</Text>
      </View>
    )
  }

  return children
}
