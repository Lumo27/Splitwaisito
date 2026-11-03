import { useEffect, useState } from 'react'
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

function AuthBootstrap({ children }: { children: React.ReactNode }) {
  const [authReady, setAuthReady] = useState(!isFirebaseAvailable())
  const { iniciarSesion, cerrarSesion, reemplazarAmigos } = useAppStore()

  useEffect(() => {
    if (!isFirebaseAvailable()) return

    return subscribeToAuthChanges((firebaseUser) => {
      if (firebaseUser) {
        iniciarSesion(
          firebaseUser.displayName || 'Usuario Google',
          firebaseUser.email || 'google@usuario.com',
          firebaseUser.displayName || 'google-user',
          firebaseUser.uid,
          firebaseUser.photoURL,
        )

        void getUsuarioPerfil(firebaseUser.uid).then((perfil) => {
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
        }).catch(() => undefined)
      } else {
        cerrarSesion()
      }

      setAuthReady(true)
    })
  }, [cerrarSesion, iniciarSesion, reemplazarAmigos])

  if (!authReady) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4 text-sm text-text-muted">
        Restaurando tu sesión...
      </div>
    )
  }

  return children
}

function ProtectedLayout() {
  const usuarioActual = useAppStore((state) => state.usuarioActual)

  if (!usuarioActual) {
    return <Navigate to="/login" replace />
  }

  return <TabsLayout />
}

function RootRedirect() {
  const usuarioActual = useAppStore((state) => state.usuarioActual)

  return <Navigate to={usuarioActual ? '/grupos' : '/login'} replace />
}

export default function App() {
  return (
    <AuthBootstrap>
      <Routes>
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/" element={<RootRedirect />} />

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
