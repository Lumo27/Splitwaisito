import { router } from 'expo-router'

import { BotonPendiente } from '@/components/BotonPendiente'
import { EnlacePendiente } from '@/components/EnlacePendiente'
import { PantallaPendiente } from '@/components/PantallaPendiente'
import { signInDemo } from '@/services/auth'
import { MODO_SEEDS } from '@/services/firebase'

export function LoginScreen() {
  function entrarDemo() {
    signInDemo()
    router.replace('/grupos')
  }

  return (
    <PantallaPendiente titulo="Iniciar sesión">
      {MODO_SEEDS ? (
        <BotonPendiente texto="Entrar con datos de ejemplo" onPress={entrarDemo} />
      ) : (
        // Sin login con Google todavía: el enlace entra directo a las tabs.
        <EnlacePendiente href="/grupos" texto="Entrar (temporal)" />
      )}
    </PantallaPendiente>
  )
}
