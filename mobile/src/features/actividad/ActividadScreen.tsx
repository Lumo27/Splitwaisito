import { useCallback, useRef, useState } from 'react'
import { useFocusEffect } from 'expo-router'
import { ActivityIndicator, Alert, Text } from 'react-native'
import {
  Boton,
  Campo,
  Mensaje,
  Pantalla,
  Tarjeta,
  Titulo,
} from '@/components/Formulario'
import {
  crearSolicitudAmistad,
  eliminarAmistad,
  obtenerAmigosAceptados,
  obtenerSolicitudesAmistad,
  responderSolicitudAmistad,
  type SolicitudAmistad,
} from '@/services/amistades'
import { guardarAmigosDelUsuario } from '@/services/firestore'
import { useAppStore } from '@/store/useAppStore'
import { colores } from '@/theme/colores'

export function ActividadScreen() {
  const usuario = useAppStore((state) => state.usuarioActual)
  const amigos = useAppStore((state) => state.amigos)
  const reemplazarAmigos = useAppStore((state) => state.reemplazarAmigos)
  const [solicitudes, setSolicitudes] = useState<SolicitudAmistad[]>([])
  const [email, setEmail] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(true)
  const [ocupado, setOcupado] = useState(false)
  const peticion = useRef(0)
  const mutacion = useRef(false)
  const uid = usuario?.id
  const emailUsuario = usuario?.email

  const cargar = useCallback(async () => {
    const turno = ++peticion.current
    setCargando(true)
    setError('')
    try {
      if (!uid || !emailUsuario) return
      const [lista, pendientes] = await Promise.all([
        obtenerAmigosAceptados(uid),
        obtenerSolicitudesAmistad(emailUsuario),
      ])
      if (
        turno !== peticion.current ||
        useAppStore.getState().usuarioActual?.id !== uid
      )
        return
      reemplazarAmigos(lista)
      setSolicitudes(pendientes)
    } catch {
      if (turno === peticion.current)
        setError('No pudimos cargar tus amigos. Volvé a intentar.')
    } finally {
      if (turno === peticion.current) setCargando(false)
    }
  }, [uid, emailUsuario, reemplazarAmigos])
  useFocusEffect(
    useCallback(() => {
      void cargar()
      return () => {
        peticion.current += 1
      }
    }, [cargar]),
  )

  async function ejecutar(
    accion: () => Promise<unknown>,
    confirmacion: string,
    actualizarPerfil = false,
  ) {
    if (
      mutacion.current ||
      !usuario ||
      useAppStore.getState().usuarioActual?.id !== usuario.id
    )
      return
    mutacion.current = true
    setOcupado(true)
    setMensaje('')
    setError('')
    try {
      await accion()
      if (actualizarPerfil) {
        const lista = await obtenerAmigosAceptados(usuario.id)
        await guardarAmigosDelUsuario(usuario.id, lista)
      }
      await cargar()
      setMensaje(confirmacion)
    } catch (fallo) {
      setError(
        fallo instanceof Error
          ? fallo.message
          : 'No se pudo completar la acción. Volvé a intentar.',
      )
    } finally {
      mutacion.current = false
      setOcupado(false)
    }
  }
  function enviar() {
    const destinatario = email.trim().toLowerCase()
    if (!usuario) return
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(destinatario)) {
      setError('Ingresá un e-mail válido.')
      return
    }
    if (destinatario === usuario.email.toLowerCase()) {
      setError('Ingresá el e-mail de otra persona.')
      return
    }
    if (amigos.some((amigo) => amigo.email.toLowerCase() === destinatario)) {
      setError('Esta persona ya está en tus amigos.')
      return
    }
    void ejecutar(async () => {
      await crearSolicitudAmistad(usuario, destinatario)
      setEmail('')
    }, 'Solicitud enviada.')
  }
  if (!usuario)
    return (
      <Pantalla>
        <Mensaje texto="Iniciá sesión para ver tus amigos." />
      </Pantalla>
    )
  return (
    <Pantalla>
      <Titulo>Amigos</Titulo>
      <Text className="text-text-muted">
        Compartí gastos con tus amigos y gestioná sus solicitudes.
      </Text>
      <Tarjeta>
        <Campo
          label="Invitar por e-mail"
          placeholder="amigo@correo.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          editable={!ocupado}
        />
        <Boton texto="Enviar solicitud" onPress={enviar} cargando={ocupado} />
      </Tarjeta>
      <Mensaje texto={mensaje} />
      <Mensaje texto={error} error />
      <Boton
        texto="Actualizar amigos"
        secundario
        disabled={ocupado || cargando}
        onPress={() => {
          void cargar()
        }}
      />
      {cargando && <ActivityIndicator color={colores.primary} />}
      <Text accessibilityRole="header" className="text-lg font-bold text-text">
        Solicitudes pendientes ({solicitudes.length})
      </Text>
      {!solicitudes.length && !cargando && (
        <Text className="text-sm text-text-muted">
          No tenés solicitudes pendientes.
        </Text>
      )}
      {solicitudes.map((solicitud) => (
        <Tarjeta key={solicitud.id}>
          <Text className="font-bold text-text">{solicitud.emisor.nombre}</Text>
          <Text className="text-sm text-text-muted">
            {solicitud.emisor.email}
          </Text>
          <Boton
            texto={`Aceptar a ${solicitud.emisor.nombre}`}
            disabled={ocupado}
            onPress={() => {
              void ejecutar(
                () => responderSolicitudAmistad(solicitud, true, usuario),
                'Solicitud aceptada.',
                true,
              )
            }}
          />
          <Boton
            texto="Rechazar solicitud"
            secundario
            disabled={ocupado}
            onPress={() => {
              void ejecutar(
                () => responderSolicitudAmistad(solicitud, false, usuario),
                'Solicitud rechazada.',
              )
            }}
          />
        </Tarjeta>
      ))}
      <Text accessibilityRole="header" className="text-lg font-bold text-text">
        Tus amigos ({amigos.length})
      </Text>
      {!amigos.length && !cargando && (
        <Text className="text-sm text-text-muted">
          Todavía no tenés amigos. Enviá una solicitud para empezar.
        </Text>
      )}
      {amigos.map((amigo) => (
        <Tarjeta key={amigo.id}>
          <Text className="font-bold text-text">{amigo.nombre}</Text>
          <Text className="text-sm text-text-muted">{amigo.email}</Text>
          <Boton
            texto={`Eliminar a ${amigo.nombre}`}
            secundario
            disabled={ocupado}
            onPress={() =>
              Alert.alert(
                'Eliminar amigo',
                `¿Eliminar a ${amigo.nombre} de tus amigos?`,
                [
                  { text: 'Cancelar', style: 'cancel' },
                  {
                    text: 'Eliminar',
                    style: 'destructive',
                    onPress: () => {
                      void ejecutar(
                        () => eliminarAmistad(usuario.id, amigo.id),
                        'Amigo eliminado.',
                        true,
                      )
                    },
                  },
                ],
              )
            }
          />
        </Tarjeta>
      ))}
    </Pantalla>
  )
}
