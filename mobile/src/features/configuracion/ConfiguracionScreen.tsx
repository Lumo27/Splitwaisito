import { router } from 'expo-router'

import { BotonPendiente } from '@/components/BotonPendiente'
import { PantallaPendiente } from '@/components/PantallaPendiente'
import { signOutUser } from '@/services/auth'
import { MODO_SEEDS } from '@/services/firebase'
import { restablecerSeeds } from '@/services/seedBackend'
import { useAppStore } from '@/store/useAppStore'

export function ConfiguracionScreen() {
  const { cerrarSesion, reemplazarAmigos, reemplazarGastos } = useAppStore()

  async function handleLogout() {
    try {
      await signOutUser()
    } catch {
      // La sesión local también debe cerrarse si Firebase no responde.
    }
    cerrarSesion()
    router.replace('/login')
  }

  // En web se recarga la página; en la app se vacía el store y se vuelve a
  // Gastos, que vuelve a pedir los datos.
  function handleRestablecerSeeds() {
    restablecerSeeds()
    void useAppStore.persist.clearStorage()
    reemplazarAmigos([])
    reemplazarGastos([])
    router.replace('/grupos')
  }

  return (
    <PantallaPendiente titulo="Configuración">
      <BotonPendiente texto="Cerrar sesión" onPress={handleLogout} />
      {MODO_SEEDS && (
        <BotonPendiente texto="Restablecer datos de ejemplo" onPress={handleRestablecerSeeds} />
      )}
    </PantallaPendiente>
  )
}
