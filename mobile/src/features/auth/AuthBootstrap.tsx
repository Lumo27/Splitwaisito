import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { ActivityIndicator, Text, View } from 'react-native'
import * as SplashScreen from 'expo-splash-screen'
import { subscribeToAuthChanges } from '@/services/auth'
import { isFirebaseAvailable, MODO_SEEDS } from '@/services/firebase'
import { getUsuarioPerfil } from '@/services/firestore'
import {
  consultarAceptacionTerminos,
  registrarAceptacionTerminos,
} from '@/services/aceptacionTerminos'
import { obtenerAmigosAceptados } from '@/services/amistades'
import { inicializarSeeds } from '@/services/seedBackend'
import { useAppStore } from '@/store/useAppStore'
import { colores } from '@/theme/colores'

type EstadoTerminos =
  | 'no-requerido'
  | 'comprobando'
  | 'requerido'
  | 'aceptado'
  | 'error'

interface TerminosContextValue {
  estado: EstadoTerminos
  error: string
  aceptar: () => Promise<void>
  reintentar: () => Promise<void>
}

const TerminosContext = createContext<TerminosContextValue | null>(null)

export function useTerminosAcceptance() {
  const contexto = useContext(TerminosContext)
  if (!contexto) {
    throw new Error('useTerminosAcceptance debe usarse dentro de AuthBootstrap.')
  }
  return contexto
}

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
  const [estadoTerminos, setEstadoTerminos] =
    useState<EstadoTerminos>('no-requerido')
  const [errorTerminos, setErrorTerminos] = useState('')
  const [usuarioIdTerminos, setUsuarioIdTerminos] = useState<string | null>(null)
  const usuarioIdActivo = useRef<string | null>(null)
  const hidratado = useStoreHidratado()
  const reemplazarAmigos = useAppStore((state) => state.reemplazarAmigos)

  async function verificarTerminos(usuarioId: string) {
    setEstadoTerminos('comprobando')
    setErrorTerminos('')
    try {
      const aceptados = await consultarAceptacionTerminos(usuarioId)
      if (usuarioIdActivo.current !== usuarioId) return
      setEstadoTerminos(aceptados ? 'aceptado' : 'requerido')
    } catch (fallo) {
      if (usuarioIdActivo.current !== usuarioId) return
      setErrorTerminos(
        fallo instanceof Error
          ? fallo.message
          : 'No se pudo verificar la aceptación de los términos.',
      )
      setEstadoTerminos('error')
    }
  }

  async function aceptarTerminos() {
    if (!usuarioIdTerminos) {
      throw new Error('Iniciá sesión para aceptar los términos.')
    }
    const usuarioId = usuarioIdTerminos
    await registrarAceptacionTerminos(usuarioId)
    if (usuarioIdActivo.current !== usuarioId) {
      throw new Error('La sesión cambió antes de registrar la aceptación.')
    }
    setEstadoTerminos('aceptado')
    setErrorTerminos('')
  }

  useEffect(() => {
    if (estadoTerminos !== 'aceptado' || !usuarioIdTerminos) return
    let vigente = true
    void obtenerAmigosAceptados(usuarioIdTerminos)
      .then((amigos) => {
        if (vigente && usuarioIdActivo.current === usuarioIdTerminos) {
          reemplazarAmigos(amigos)
        }
      })
      .catch((fallo: unknown) => {
        console.error('No se pudieron cargar las amistades del usuario.', fallo)
      })
    return () => {
      vigente = false
    }
  }, [estadoTerminos, reemplazarAmigos, usuarioIdTerminos])

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
            usuarioIdActivo.current = null
            setUsuarioIdTerminos(null)
            setEstadoTerminos('no-requerido')
            setErrorTerminos('')
            store.cerrarSesion()
            setAuthReady(true)
          }
          return
        }
        if (vigente) {
          usuarioIdActivo.current = usuario.uid
          setUsuarioIdTerminos(usuario.uid)
          setEstadoTerminos('comprobando')
          setErrorTerminos('')
        }
        const [
          perfilResultado,
          aceptacionResultado,
        ] = await Promise.allSettled([
          getUsuarioPerfil(usuario.uid),
          consultarAceptacionTerminos(usuario.uid),
        ])
        if (!vigente || version !== versionSesion) return
        const perfil =
          perfilResultado.status === 'fulfilled' ? perfilResultado.value : null
        const nombre =
          perfil?.nombre ||
          usuario.displayName ||
          usuario.email?.split('@')[0] ||
          'Usuario'
        store.iniciarSesion(
          nombre,
          usuario.email || '',
          perfil?.alias?.trim() ?? '',
          usuario.uid,
          perfil?.fotoUrl ?? usuario.photoURL,
          perfil?.descripcion,
        )
        store.reemplazarAmigos(perfil?.amigos ?? [])
        if (aceptacionResultado.status === 'fulfilled') {
          setEstadoTerminos(
            aceptacionResultado.value ? 'aceptado' : 'requerido',
          )
        } else {
          setErrorTerminos(
            aceptacionResultado.reason instanceof Error
              ? aceptacionResultado.reason.message
              : 'No se pudo verificar la aceptación de los términos.',
          )
          setEstadoTerminos('error')
        }
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
        <View
          accessible
          accessibilityLabel="Logotipo de Junti"
          className="h-[100px] w-[100px] items-center justify-center rounded-3xl bg-primary"
        >
          <Text className="text-5xl font-black text-white">J</Text>
        </View>
        <View className="items-center gap-1">
          <Text className="text-2xl font-bold text-text">Junti</Text>
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
  return (
    <TerminosContext.Provider
      value={{
        estado: estadoTerminos,
        error: errorTerminos,
        aceptar: aceptarTerminos,
        reintentar: async () => {
          if (usuarioIdTerminos) await verificarTerminos(usuarioIdTerminos)
        },
      }}
    >
      {children}
    </TerminosContext.Provider>
  )
}
