import { useEffect, useState } from 'react'
import { Text } from 'react-native'

import { EnlacePendiente } from '@/components/EnlacePendiente'
import { PantallaPendiente } from '@/components/PantallaPendiente'
import { obtenerGruposDelUsuario, type GrupoFirestore } from '@/services/firestore'
import { useAppStore } from '@/store/useAppStore'

export function GruposScreen() {
  const usuarioActual = useAppStore((state) => state.usuarioActual)
  const [grupos, setGrupos] = useState<GrupoFirestore[]>([])

  // Lista mínima para comprobar que los datos llegan (modo demo o Firebase).
  useEffect(() => {
    if (!usuarioActual) return
    obtenerGruposDelUsuario(usuarioActual.id)
      .then(setGrupos)
      .catch(() => setGrupos([]))
  }, [usuarioActual])

  return (
    <PantallaPendiente titulo="Gastos">
      {usuarioActual && (
        <Text className="text-sm text-text-muted">Sesión de {usuarioActual.nombre}</Text>
      )}
      {grupos.map((grupo) => (
        <EnlacePendiente
          key={grupo.id}
          href={{ pathname: '/grupos/[id]', params: { id: grupo.id } }}
          texto={grupo.nombre}
        />
      ))}
      {grupos.length === 0 && <EnlacePendiente href="/grupos/demo" texto="Ver un grupo de ejemplo" />}
      <EnlacePendiente href="/grupos/nuevo" texto="Crear grupo" />
    </PantallaPendiente>
  )
}
