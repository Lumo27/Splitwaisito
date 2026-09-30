import { Redirect } from 'expo-router'

import { useAppStore } from '@/store/useAppStore'

// Con sesión va a las tabs; sin sesión, al login. Las tabs todavía no están
// protegidas: el login real llega con la pantalla de login (Paso 8).
export default function Index() {
  const usuarioActual = useAppStore((state) => state.usuarioActual)

  return <Redirect href={usuarioActual ? '/grupos' : '/login'} />
}
