import { Redirect } from 'expo-router'

import { useAppStore } from '@/store/useAppStore'
import { useTerminosAcceptance } from '@/features/auth/AuthBootstrap'

// Con sesión va a las tabs; sin sesión, al login. Las tabs todavía no están
// protegidas: el login real llega con la pantalla de login (Paso 8).
export default function Index() {
  const usuarioActual = useAppStore((state) => state.usuarioActual)
  const { estado } = useTerminosAcceptance()

  if (!usuarioActual) return <Redirect href="/login" />
  return (
    <Redirect href={estado === 'aceptado' ? '/grupos' : '/terminos'} />
  )
}
