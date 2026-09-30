import { useLocalSearchParams } from 'expo-router'

import { EnlacePendiente } from '@/components/EnlacePendiente'
import { PantallaPendiente } from '@/components/PantallaPendiente'

export function DetalleGrupoScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()

  return (
    <PantallaPendiente titulo={`Detalle del grupo ${id}`}>
      <EnlacePendiente
        href={{ pathname: '/grupos/[id]/cargar-gasto', params: { id } }}
        texto="Cargar gasto"
      />
      <EnlacePendiente
        href={{
          pathname: '/grupos/[id]/saldar',
          params: { id, de: 'deudor', a: 'acreedor' },
        }}
        texto="Saldar deuda"
      />
    </PantallaPendiente>
  )
}
