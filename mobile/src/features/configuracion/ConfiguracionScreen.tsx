import { useRef, useState } from 'react'
import { router } from 'expo-router'
import { Alert, Text } from 'react-native'
import {
  Boton,
  Mensaje,
  Pantalla,
  Tarjeta,
  Titulo,
} from '@/components/Formulario'
import { signOutUser } from '@/services/auth'
import { MODO_SEEDS } from '@/services/firebase'
import { getUsuarioPerfil } from '@/services/firestore'
import { restablecerSeeds } from '@/services/seedBackend'
import { useAppStore } from '@/store/useAppStore'

export function ConfiguracionScreen() {
  const usuario = useAppStore((state) => state.usuarioActual)
  const [ocupado, setOcupado] = useState(false)
  const [error, setError] = useState('')
  const [mensaje, setMensaje] = useState('')
  const mutacion = useRef(false)
  async function salir() {
    if (mutacion.current) return
    mutacion.current = true
    setOcupado(true)
    setError('')
    try {
      await signOutUser()
      useAppStore.getState().cerrarSesion()
      router.replace('/login')
    } catch {
      setError('No pudimos cerrar la sesión. Volvé a intentar.')
    } finally {
      mutacion.current = false
      setOcupado(false)
    }
  }
  async function reiniciar() {
    if (mutacion.current || !MODO_SEEDS || !usuario) return
    mutacion.current = true
    setOcupado(true)
    setError('')
    setMensaje('')
    try {
      restablecerSeeds()
      const perfil = await getUsuarioPerfil(usuario.id)
      if (!perfil) throw new Error('Perfil de prueba ausente')
      const store = useAppStore.getState()
      store.iniciarSesion(
        perfil.nombre,
        perfil.email,
        perfil.alias,
        perfil.id,
        perfil.fotoUrl,
        perfil.descripcion,
      )
      store.reemplazarAmigos(perfil.amigos ?? [])
      store.reemplazarGastos([])
      setMensaje('Datos de ejemplo restablecidos.')
      router.replace('/grupos')
    } catch {
      setError('No pudimos restablecer los datos. Volvé a intentar.')
    } finally {
      mutacion.current = false
      setOcupado(false)
    }
  }
  return (
    <Pantalla>
      <Titulo>Configuración</Titulo>
      <Tarjeta>
        <Text className="font-bold text-text">Tu sesión</Text>
        <Text className="text-sm text-text-muted">
          {usuario?.email ?? 'Sin sesión activa'}
        </Text>
        <Text className="text-sm text-text-muted">
          {MODO_SEEDS
            ? 'Estás usando datos de ejemplo, guardados en este dispositivo.'
            : 'Estás conectado a Firebase.'}
        </Text>
        <Boton
          texto="Cerrar sesión"
          secundario
          disabled={ocupado}
          onPress={() =>
            Alert.alert('Cerrar sesión', '¿Querés salir de tu cuenta?', [
              { text: 'Cancelar', style: 'cancel' },
              {
                text: 'Salir',
                onPress: () => {
                  void salir()
                },
              },
            ])
          }
        />
      </Tarjeta>
      {MODO_SEEDS && (
        <Tarjeta>
          <Text className="font-bold text-text">Datos de ejemplo</Text>
          <Text className="text-sm leading-6 text-text-muted">
            Restablecer reemplaza tus grupos, gastos, amigos y perfil de prueba
            por los datos iniciales.
          </Text>
          <Boton
            texto="Restablecer datos de ejemplo"
            secundario
            disabled={ocupado}
            onPress={() =>
              Alert.alert(
                'Restablecer datos',
                'Se borrarán los cambios realizados en el modo demo de este dispositivo. ¿Continuar?',
                [
                  { text: 'Cancelar', style: 'cancel' },
                  {
                    text: 'Restablecer',
                    style: 'destructive',
                    onPress: () => {
                      void reiniciar()
                    },
                  },
                ],
              )
            }
          />
        </Tarjeta>
      )}
      <Tarjeta>
        <Text className="font-bold text-text">Splitwaisito</Text>
        <Text className="text-sm text-text-muted">
          Organizá tus gastos compartidos con claridad.
        </Text>
      </Tarjeta>
      <Mensaje texto={mensaje} />
      <Mensaje texto={error} error />
    </Pantalla>
  )
}
