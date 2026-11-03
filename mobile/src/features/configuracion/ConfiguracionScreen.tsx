import { useRef, useState } from 'react'
import { router } from 'expo-router'
import { Text } from 'react-native'
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
import { confirmar } from '@/utils/alerta'

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
      await restablecerSeeds()
      const perfil = await getUsuarioPerfil(usuario.id)
      if (perfil) {
        useAppStore.getState().iniciarSesion(
          perfil.nombre,
          perfil.email,
          perfil.alias,
          perfil.id,
          perfil.fotoUrl,
          perfil.descripcion,
          perfil.moneda,
        )
      }
      setMensaje('Datos de ejemplo restablecidos.')
    } catch {
      setError('No pudimos restablecer los datos de ejemplo.')
    } finally {
      mutacion.current = false
      setOcupado(false)
    }
  }
  return (
    <Pantalla>
      <Titulo>Ajustes de cuenta</Titulo>
      <Text className="text-text-muted">
        Gestioná tu sesión y el entorno de la aplicación.
      </Text>
      <Mensaje texto={mensaje} />
      <Mensaje texto={error} error />
      <Tarjeta>
        <Text className="font-bold text-text">Sesión actual</Text>
        <Text className="text-sm text-text-muted">
          {usuario?.email || 'Sin sesión activa'}
        </Text>
        <Text className="text-xs text-text-muted">
          {MODO_SEEDS
            ? 'Modo demo activo (sin credenciales reales de Firebase).'
            : 'Estás conectado a Firebase.'}
        </Text>
        <Boton
          texto="Cerrar sesión"
          secundario
          disabled={ocupado}
          onPress={() =>
            confirmar({
              titulo: 'Cerrar sesión',
              mensaje: '¿Querés salir de tu cuenta?',
              textoConfirmar: 'Salir',
              textoCancelar: 'Cancelar',
              destructivo: false,
              alConfirmar: () => {
                void salir()
              },
            })
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
            peligro
            disabled={ocupado}
            onPress={() =>
              confirmar({
                titulo: 'Restablecer datos',
                mensaje:
                  'Se borrarán los cambios realizados en el modo demo de este dispositivo. ¿Continuar?',
                textoConfirmar: 'Restablecer',
                textoCancelar: 'Cancelar',
                destructivo: true,
                alConfirmar: () => {
                  void reiniciar()
                },
              })
            }
          />
        </Tarjeta>
      )}
      <Tarjeta>
        <Text className="font-bold text-text">Splitwaisito</Text>
        <Text className="text-xs text-text-muted">
          Versión 1.0.0 · Gastos compartidos simplificados
        </Text>
      </Tarjeta>
    </Pantalla>
  )
}
