import { EnlacePendiente } from '@/components/EnlacePendiente'
import { PantallaPendiente } from '@/components/PantallaPendiente'

export function LoginScreen() {
  // Sin autenticación todavía: el enlace entra directo a las tabs.
  return (
    <PantallaPendiente titulo="Iniciar sesión">
      <EnlacePendiente href="/grupos" texto="Entrar (temporal)" />
    </PantallaPendiente>
  )
}
