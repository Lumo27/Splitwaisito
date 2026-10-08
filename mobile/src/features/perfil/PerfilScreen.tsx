import { useCallback, useRef, useState } from 'react'
import { useFocusEffect } from 'expo-router'
import { Image, Text, View } from 'react-native'
import {
  Boton,
  Campo,
  Mensaje,
  Pantalla,
  Tarjeta,
  Titulo,
} from '@/components/Formulario'
import { upsertUsuarioPerfil } from '@/services/firestore'
import { useAppStore } from '@/store/useAppStore'

export function PerfilScreen() {
  const usuario = useAppStore((state) => state.usuarioActual)
  const actualizarAlias = useAppStore((state) => state.actualizarAlias)
  const actualizarDescripcion = useAppStore(
    (state) => state.actualizarDescripcion,
  )
  const [alias, setAlias] = useState(usuario?.alias ?? '')
  const [descripcion, setDescripcion] = useState(usuario?.descripcion ?? '')
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')
  const [guardando, setGuardando] = useState(false)
  const enviando = useRef(false)
  const uid = usuario?.id
  const aliasGuardado = usuario?.alias ?? ''
  const descripcionGuardada = usuario?.descripcion ?? ''
  useFocusEffect(
    useCallback(() => {
      setAlias(uid ? aliasGuardado : '')
      setDescripcion(uid ? descripcionGuardada : '')
    }, [uid, aliasGuardado, descripcionGuardada]),
  )
  async function guardar() {
    if (!usuario || enviando.current) return
    if (!alias.trim()) {
      setError('Ingresá tu alias para transferencias.')
      return
    }
    enviando.current = true
    setGuardando(true)
    setMensaje('')
    setError('')
    try {
      await upsertUsuarioPerfil({
        ...usuario,
        alias: alias.trim(),
        descripcion: descripcion.trim(),
      })
      if (useAppStore.getState().usuarioActual?.id !== usuario.id) return
      actualizarAlias(usuario.id, alias.trim())
      actualizarDescripcion(descripcion.trim())
      setMensaje('Perfil guardado.')
    } catch {
      setError(
        'No pudimos guardar el perfil. Tus datos anteriores se conservan; volvé a intentar.',
      )
    } finally {
      enviando.current = false
      setGuardando(false)
    }
  }
  if (!usuario)
    return (
      <Pantalla>
        <Mensaje texto="Iniciá sesión para editar tu perfil." />
      </Pantalla>
    )
  const iniciales = usuario.nombre
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((parte) => parte[0])
    .join('')
    .toUpperCase()
  return (
    <Pantalla>
      <Titulo>Mi perfil</Titulo>
      <Tarjeta>
        <View className="flex-row items-center gap-4">
          {usuario.fotoUrl ? (
            <Image
              source={{ uri: usuario.fotoUrl }}
              accessibilityLabel={`Foto de ${usuario.nombre}`}
              style={{ width: 64, height: 64, borderRadius: 32 }}
            />
          ) : (
            <View className="h-16 w-16 items-center justify-center rounded-full bg-primary-light">
              <Text className="text-xl font-bold text-primary-dark">
                {iniciales}
              </Text>
            </View>
          )}
          <View className="flex-1 gap-1">
            <Text className="text-lg font-bold text-text">
              {usuario.nombre}
            </Text>
            <Text selectable className="text-sm text-text-muted">
              {usuario.email}
            </Text>
          </View>
        </View>
      </Tarjeta>
      <Tarjeta>
        <Campo
          label="Alias para transferencias"
          placeholder="Ej: german123"
          value={alias}
          maxLength={80}
          autoCapitalize="none"
          editable={!guardando}
          onChangeText={(valor) => {
            setAlias(valor)
            setMensaje('')
          }}
        />
        <Campo
          label="Descripción breve"
          placeholder="Contá algo sobre vos"
          value={descripcion}
          maxLength={160}
          multiline
          textAlignVertical="top"
          editable={!guardando}
          onChangeText={(valor) => {
            setDescripcion(valor)
            setMensaje('')
          }}
        />
        <Text className="text-right text-xs text-text-muted">
          {descripcion.length}/160
        </Text>
      </Tarjeta>
      <Mensaje texto={mensaje} />
      <Mensaje texto={error} error />
      <Boton
        texto="Guardar cambios"
        cargando={guardando}
        onPress={() => {
          void guardar()
        }}
      />
    </Pantalla>
  )
}
