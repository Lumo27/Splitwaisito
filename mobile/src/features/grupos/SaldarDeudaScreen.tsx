import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router'
import { ActivityIndicator, Linking, Text } from 'react-native'
import * as Clipboard from 'expo-clipboard'
import {
  Boton,
  Mensaje,
  Pantalla,
  Tarjeta,
  Titulo,
} from '@/components/Formulario'
import {
  obtenerGastosDelGrupo,
  obtenerGrupoPorId,
  type GastoFirestore,
  type GrupoFirestore,
} from '@/services/firestore'
import { useAppStore } from '@/store/useAppStore'
import { colores } from '@/theme/colores'
import { participantesDelGrupo } from './deudas'
import { deudasDelGrupo } from './deudasDelGrupo'

export function SaldarDeudaScreen() {
  const { id, de, a } = useLocalSearchParams<{
    id: string
    de: string
    a: string
  }>()
  const usuario = useAppStore((state) => state.usuarioActual)
  const amigos = useAppStore((state) => state.amigos)
  const [grupo, setGrupo] = useState<GrupoFirestore | null>(null)
  const [gastos, setGastos] = useState<GastoFirestore[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [copiado, setCopiado] = useState('')
  const peticion = useRef(0)
  const usuarioId = usuario?.id
  const cargar = useCallback(async () => {
    const turno = ++peticion.current
    setCargando(true)
    setError('')
    setCopiado('')
    try {
      if (!id || !usuarioId || de !== usuarioId)
        throw new Error('Elegí una deuda tuya desde el detalle del grupo.')
      const actual = await obtenerGrupoPorId(id)
      if (!actual?.miembros.includes(usuarioId))
        throw new Error('El grupo no está disponible.')
      const lista = await obtenerGastosDelGrupo(id)
      if (turno === peticion.current) {
        setGrupo(actual)
        setGastos(lista)
      }
    } catch (fallo) {
      if (turno === peticion.current) {
        setGrupo(null)
        setError(
          fallo instanceof Error
            ? fallo.message
            : 'No pudimos cargar la deuda.',
        )
      }
    } finally {
      if (turno === peticion.current) setCargando(false)
    }
  }, [id, de, usuarioId])
  useFocusEffect(
    useCallback(() => {
      void cargar()
      return () => {
        peticion.current += 1
      }
    }, [cargar]),
  )
  const deuda = useMemo(
    () =>
      grupo
        ? deudasDelGrupo(
            participantesDelGrupo(grupo.miembros, usuario, amigos),
            gastos,
          ).find((item) => item.de === de && item.a === a)
        : undefined,
    [grupo, usuario, amigos, gastos, de, a],
  )
  const acreedor = amigos.find((amigo) => amigo.id === a)
  const email = deuda && de === usuarioId ? (acreedor?.email?.trim() ?? '') : ''
  useEffect(() => {
    let vigente = true
    if (!email || cargando) return
    void Clipboard.setStringAsync(email)
      .then(() => {
        if (vigente) setCopiado('E-mail copiado.')
      })
      .catch(() => {
        if (vigente)
          setError('No pudimos copiar el e-mail. Podés volver a intentarlo.')
      })
    return () => {
      vigente = false
    }
  }, [email, cargando])
  async function copiar(valor: string, mensaje: string) {
    try {
      await Clipboard.setStringAsync(valor)
      setCopiado(mensaje)
      setError('')
    } catch {
      setError('No pudimos copiar el dato. Volvé a intentar.')
    }
  }
  async function abrirMercadoPago() {
    try {
      await Linking.openURL('https://www.mercadopago.com.ar/money-transfer')
    } catch {
      setError(
        'No pudimos abrir Mercado Pago. Abrilo desde tu teléfono y elegí Enviar dinero.',
      )
    }
  }
  function volver() {
    router.replace({ pathname: '/grupos/[id]', params: { id } })
  }
  if (cargando)
    return (
      <Pantalla>
        <ActivityIndicator color={colores.primary} />
      </Pantalla>
    )
  if (!deuda)
    return (
      <Pantalla>
        <Titulo>Saldar deuda</Titulo>
        <Mensaje
          texto={
            error ||
            'Esta transferencia ya no está pendiente. Volvé al grupo para consultar el saldo actualizado.'
          }
          error={Boolean(error)}
        />
        <Boton texto="Volver al grupo" onPress={volver} />
        <Boton
          texto="Actualizar"
          secundario
          onPress={() => {
            void cargar()
          }}
        />
      </Pantalla>
    )
  return (
    <Pantalla>
      <Titulo>Saldar deuda</Titulo>
      <Tarjeta>
        <Text className="text-text-muted">
          Le debés a {acreedor?.nombre ?? 'otro integrante'}
        </Text>
        <Text className="text-4xl font-bold text-primary-dark">
          ${deuda.monto.toLocaleString('es-AR', { maximumFractionDigits: 2 })}
        </Text>
        <Text className="text-sm text-text-muted">
          {grupo?.nombre} · {gastos.length} gasto
          {gastos.length === 1 ? '' : 's'}
        </Text>
        {email ? (
          <Text selectable className="text-text">
            {email}
          </Text>
        ) : (
          <Text className="text-text-muted">
            No tenemos el e-mail del acreedor. Pedíselo antes de transferir.
          </Text>
        )}
      </Tarjeta>
      <Mensaje texto={copiado} />
      <Mensaje texto={error} error />
      <Boton
        texto="Abrir Enviar dinero en Mercado Pago"
        onPress={() => {
          void abrirMercadoPago()
        }}
      />
      <Boton
        texto="Copiar e-mail"
        secundario
        disabled={!email}
        onPress={() => {
          void copiar(email, 'E-mail copiado.')
        }}
      />
      <Boton
        texto="Copiar monto"
        secundario
        onPress={() => {
          void copiar(String(deuda.monto), 'Monto copiado.')
        }}
      />
      <Text className="text-sm leading-6 text-text-muted">
        Pegá el e-mail en Mercado Pago y confirmá el destinatario y el monto. La
        transferencia la realizás desde Mercado Pago; Splitwaisito te ayuda a
        consultar los datos.
      </Text>
      <Boton texto="Volver al grupo" secundario onPress={volver} />
    </Pantalla>
  )
}
