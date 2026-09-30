import { EnlacePendiente } from '@/components/EnlacePendiente'
import { PantallaPendiente } from '@/components/PantallaPendiente'

export function GruposScreen() {
  return (
    <PantallaPendiente titulo="Gastos">
      <EnlacePendiente href="/grupos/demo" texto="Ver un grupo de ejemplo" />
      <EnlacePendiente href="/grupos/nuevo" texto="Crear grupo" />
    </PantallaPendiente>
  )
}
