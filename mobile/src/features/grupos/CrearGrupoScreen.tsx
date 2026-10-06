import { useRef, useState } from 'react'
import { router } from 'expo-router'
import { Text } from 'react-native'
import {
  Boton,
  Campo,
  Mensaje,
  Opcion,
  Pantalla,
  Tarjeta,
  Titulo,
} from '@/components/Formulario'
import { crearGrupo } from '@/services/firestore'
import { useAppStore } from '@/store/useAppStore'

export function CrearGrupoScreen() {
  const usuario = useAppStore((state) => state.usuarioActual)
  const amigos = useAppStore((state) => state.amigos)
  const [nombre, setNombre] = useState('')
  const [elegidos, setElegidos] = useState<string[]>([])
  const [error, setError] = useState('')
  const [guardando, setGuardando] = useState(false)
  const enviando = useRef(false)
  async function guardar() {
    if (enviando.current) return
    if (!usuario) {
      setError('Iniciá sesión para crear un grupo.')
      return
    }
    if (!nombre.trim()) {
      setError('Ingresá un nombre para el grupo.')
      return
    }
    enviando.current = true
    setGuardando(true)
    setError('')
    try {
      const miembros = elegidos.filter((id) =>
        amigos.some((amigo) => amigo.id === id),
      )
      const grupo = await crearGrupo(nombre.trim(), usuario.id, miembros)
      router.replace({ pathname: '/grupos/[id]', params: { id: grupo.id } })
    } catch {
      setError(
        'No pudimos crear el grupo. Revisá la conexión y volvé a intentar.',
      )
    } finally {
      enviando.current = false
      setGuardando(false)
    }
  }
  return (
    <Pantalla>
      <Titulo>Un nuevo plan compartido</Titulo>
      <Text className="text-text-muted">
        Creá un grupo y elegí con quién vas a compartir los gastos.
      </Text>
      <Tarjeta>
        <Campo
          label="Nombre del grupo"
          placeholder="Ej: Viaje a la costa"
          value={nombre}
          onChangeText={setNombre}
          maxLength={80}
          editable={!guardando}
          autoCapitalize="sentences"
        />
        <Text className="text-sm font-semibold text-text">Integrantes</Text>
        <Text className="text-sm text-text-muted">Vos ya estás incluido.</Text>
        {amigos.map((amigo) => (
          <Opcion
            key={amigo.id}
            texto={amigo.nombre}
            elegida={elegidos.includes(amigo.id)}
            disabled={guardando}
            onPress={() =>
              setElegidos((lista) =>
                lista.includes(amigo.id)
                  ? lista.filter((id) => id !== amigo.id)
                  : [...lista, amigo.id],
              )
            }
          />
        ))}
        {!amigos.length && (
          <Text className="text-sm text-text-muted">
            Podés agregar amigos después desde el detalle del grupo.
          </Text>
        )}
      </Tarjeta>
      <Mensaje texto={error} error />
      <Boton
        texto="Crear grupo"
        onPress={() => {
          void guardar()
        }}
        cargando={guardando}
      />
    </Pantalla>
  )
}
