import { useEffect, useRef, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { TabsLayout } from './components/TabsLayout'
import { LoginScreen } from './features/auth/LoginScreen'
import { GruposScreen } from './features/grupos/GruposScreen'
import { SaldarDeudaScreen } from './features/grupos/SaldarDeudaScreen'
import { ActividadScreen } from './features/actividad/ActividadScreen'
import { PerfilScreen } from './features/perfil/PerfilScreen'
import { ConfiguracionScreen } from './features/configuracion/ConfiguracionScreen'
import { subscribeToAuthChanges } from './services/auth'
import { isFirebaseAvailable } from './services/firebase'
import { getUsuarioPerfil, guardarAmigosDelUsuario } from './services/firestore'
import { useAppStore } from './store/useAppStore'
import { CargarGastoScreen } from './features/gastos/CargarGastoScreen'
import { TerminosScreen } from './features/terminos/TerminosScreen'
import {
  TerminosContext,
  type EstadoTerminos,
  useTerminosAcceptance,
} from './features/terminos/TerminosContext'
import {
  consultarAceptacionTerminos,
  registrarAceptacionTerminos,
} from './services/aceptacionTerminos'

function AuthBootstrap({ children }: { children: React.ReactNode }) {
  const [authReady, setAuthReady] = useState(!isFirebaseAvailable())
  const [estadoTerminos, setEstadoTerminos] =
    useState<EstadoTerminos>('sin-sesion')
  const [errorTerminos, setErrorTerminos] = useState('')
  const [usuarioIdTerminos, setUsuarioIdTerminos] = useState<string | null>(null)
  const usuarioIdActivo = useRef<string | null>(null)
  const usuarioActual = useAppStore((state) => state.usuarioActual)
  const { iniciarSesion, cerrarSesion, reemplazarAmigos } = useAppStore()

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
    if (!isFirebaseAvailable()) return

    let vigente = true
    let versionSesion = 0
    const cancelar = subscribeToAuthChanges((firebaseUser) => {
      const version = ++versionSesion
      void (async () => {
        if (!firebaseUser) {
          if (!vigente) return
          usuarioIdActivo.current = null
          setUsuarioIdTerminos(null)
          setEstadoTerminos('sin-sesion')
          setErrorTerminos('')
          cerrarSesion()
          setAuthReady(true)
          return
        }

        usuarioIdActivo.current = firebaseUser.uid
        setUsuarioIdTerminos(firebaseUser.uid)
        setEstadoTerminos('comprobando')
        setErrorTerminos('')

        const [perfilResultado, aceptacionResultado] =
          await Promise.allSettled([
            getUsuarioPerfil(firebaseUser.uid),
            consultarAceptacionTerminos(firebaseUser.uid),
          ])
        if (!vigente || version !== versionSesion) return

        const perfil =
          perfilResultado.status === 'fulfilled' ? perfilResultado.value : null
        iniciarSesion(
          firebaseUser.displayName || 'Usuario Google',
          firebaseUser.email || 'google@usuario.com',
          perfil?.alias || firebaseUser.displayName || 'google-user',
          firebaseUser.uid,
          perfil?.fotoUrl ?? firebaseUser.photoURL,
          perfil?.descripcion,
        )

        const amigosLocales = useAppStore.getState().amigos
        const amigosGuardados = perfil?.amigos ?? amigosLocales
        reemplazarAmigos(amigosGuardados)

        if (!perfil?.amigos && amigosLocales.length > 0) {
          void guardarAmigosDelUsuario(firebaseUser.uid, amigosLocales)
        }

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
    })

    return () => {
      vigente = false
      versionSesion += 1
      cancelar()
    }
  }, [cerrarSesion, iniciarSesion, reemplazarAmigos])

  useEffect(() => {
    if (isFirebaseAvailable()) return

    const usuarioId = usuarioActual?.id ?? null
    usuarioIdActivo.current = usuarioId
    if (!usuarioId) return

    let vigente = true
    void consultarAceptacionTerminos(usuarioId)
      .then((aceptados) => {
        if (vigente && usuarioIdActivo.current === usuarioId) {
          setUsuarioIdTerminos(usuarioId)
          setErrorTerminos('')
          setEstadoTerminos(aceptados ? 'aceptado' : 'requerido')
        }
      })
      .catch((fallo: unknown) => {
        if (!vigente || usuarioIdActivo.current !== usuarioId) return
        setErrorTerminos(
          fallo instanceof Error
            ? fallo.message
            : 'No se pudo verificar la aceptación de los términos.',
        )
        setEstadoTerminos('error')
      })

    return () => {
      vigente = false
    }
  }, [usuarioActual?.id])

  const estadoTerminosActual: EstadoTerminos = usuarioActual
    ? usuarioIdTerminos === usuarioActual.id
      ? estadoTerminos
      : 'comprobando'
    : 'sin-sesion'
  const errorTerminosActual =
    usuarioActual?.id === usuarioIdTerminos ? errorTerminos : ''

  if (!authReady) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4 text-sm text-text-muted">
        Restaurando tu sesión...
      </div>
    )
  }

  return (
    <TerminosContext.Provider
      value={{
        estado: estadoTerminosActual,
        error: errorTerminosActual,
        aceptar: aceptarTerminos,
        reintentar: async () => {
          if (usuarioIdTerminos === usuarioActual?.id && usuarioIdTerminos) {
            await verificarTerminos(usuarioIdTerminos)
          }
        },
      }}
    >
      {children}
    </TerminosContext.Provider>
  )
}

function ProtectedLayout() {
  const usuarioActual = useAppStore((state) => state.usuarioActual)
  const { estado } = useTerminosAcceptance()

  if (!usuarioActual) return <Navigate to="/login" replace />
  if (estado !== 'aceptado') {
    return <Navigate to="/terminos" replace />
  }

  return <TabsLayout />
}

function TermsRoute() {
  const usuarioActual = useAppStore((state) => state.usuarioActual)
  const { estado } = useTerminosAcceptance()

  if (!usuarioActual) return <Navigate to="/login" replace />
  if (estado === 'aceptado') return <Navigate to="/grupos" replace />
  return <TerminosScreen />
}

function RootRedirect() {
  const usuarioActual = useAppStore((state) => state.usuarioActual)
  const { estado } = useTerminosAcceptance()

  if (!usuarioActual) return <Navigate to="/login" replace />
  return <Navigate to={estado === 'aceptado' ? '/grupos' : '/terminos'} replace />
}

export default function App() {
  return (
    <AuthBootstrap>
      <Routes>
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/" element={<RootRedirect />} />
        <Route path="/terminos" element={<TermsRoute />} />

        <Route element={<ProtectedLayout />}>
          <Route path="/grupos" element={<GruposScreen />} />
          <Route path="/grupos/:id/cargar" element={<CargarGastoScreen />} />
          <Route path="/gastos/nuevo" element={<CargarGastoScreen />} />
          <Route path="/saldar/:grupoId/:index" element={<SaldarDeudaScreen />} />
          <Route path="/actividad" element={<ActividadScreen />} />
          <Route path="/perfil" element={<PerfilScreen />} />
          <Route path="/configuracion" element={<ConfiguracionScreen />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AuthBootstrap>
  )
}
