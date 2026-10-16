import { useEffect, useState, type ReactNode } from 'react'
import { ActivityIndicator, Image, Text, View } from 'react-native'
import * as SplashScreen from 'expo-splash-screen'
import { subscribeToAuthChanges } from '@/services/auth'
import { isFirebaseAvailable, MODO_SEEDS } from '@/services/firebase'
import { getUsuarioPerfil } from '@/services/firestore'
import { obtenerAmigosAceptados } from '@/services/amistades'
import { inicializarSeeds } from '@/services/seedBackend'
import { useAppStore } from '@/store/useAppStore'
import { colores } from '@/theme/colores'

function useStoreHidratado() {
  const [hidratado, setHidratado] = useState(useAppStore.persist.hasHydrated())
  useEffect(() => {
    const terminar = () => setHidratado(true)
    const cancelar = useAppStore.persist.onFinishHydration(terminar)
    if (useAppStore.persist.hasHydrated()) terminar()
    return cancelar
  }, [])
  return hidratado
}
export function AuthBootstrap({ children }: { children: ReactNode }) {
  const [authReady, setAuthReady] = useState(false)
  const hidratado = useStoreHidratado()
  useEffect(() => {
    if (!hidratado) return
    let vigente = true
    let versionSesion = 0
    let cancelar: (() => void) | undefined
    const aplicarSesion: Parameters<typeof subscribeToAuthChanges>[0] = (
      usuario,
    ) => {
      const version = ++versionSesion
      void (async () => {
        const store = useAppStore.getState()
        if (!usuario) {
          if (vigente) {
            store.cerrarSesion()
            setAuthReady(true)
          }
          return
        }
        const [perfilResultado, amigosResultado] = await Promise.allSettled([
          getUsuarioPerfil(usuario.uid),
          obtenerAmigosAceptados(usuario.uid),
        ])
        if (!vigente || version !== versionSesion) return
        const perfil =
          perfilResultado.status === 'fulfilled' ? perfilResultado.value : null
        const amigos =
          amigosResultado.status === 'fulfilled'
            ? amigosResultado.value
            : (perfil?.amigos ?? [])
        const nombre =
          perfil?.nombre ||
          usuario.displayName ||
          usuario.email?.split('@')[0] ||
          'Usuario'
        store.iniciarSesion(
          nombre,
          usuario.email || '',
          perfil?.alias || nombre,
          usuario.uid,
          perfil?.fotoUrl ?? usuario.photoURL,
          perfil?.descripcion,
        )
        store.reemplazarAmigos(amigos)
        setAuthReady(true)
      })()
    }
    void (async () => {
      if (MODO_SEEDS) await inicializarSeeds()
      if (!vigente) return
      if (!isFirebaseAvailable()) aplicarSesion(null)
      else cancelar = subscribeToAuthChanges(aplicarSesion)
    })().catch(() => {
      if (vigente) {
        useAppStore.getState().cerrarSesion()
        setAuthReady(true)
      }
    })
    return () => {
      vigente = false
      versionSesion += 1
      cancelar?.()
    }
  }, [hidratado])

  useEffect(() => {
    if (authReady && hidratado) {
      void SplashScreen.hideAsync().catch(() => {})
    }
  }, [authReady, hidratado])

  if (!authReady || !hidratado)
    return (
      <View className="flex-1 items-center justify-center gap-4 bg-white p-6">
        <Image
          source={require('../../../assets/images/icon.png')}
          style={{ width: 100, height: 100, borderRadius: 24 }}
          accessibilityLabel="Logotipo de Splitwaisito"
        />
        <View className="items-center gap-1">
          <Text className="text-2xl font-bold text-text">Splitwaisito</Text>
          <Text className="text-center text-sm text-text-muted">
            Compartí los planes, organizá los gastos.
          </Text>
        </View>
        <View className="mt-4 flex-row items-center gap-2">
          <ActivityIndicator color={colores.primary} size="small" />
          <Text className="text-xs text-text-muted">
            Restaurando tu sesión...
          </Text>
        </View>
      </View>
    )
  return children
}
