import { useCallback, useState } from 'react'
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router'
import {
  ActivityIndicator,
  Image,
  Linking,
  Pressable,
  Text,
  View,
} from 'react-native'
import { MapPin } from 'lucide-react-native'
import {
  Boton,
  Mensaje,
  Pantalla,
  Tarjeta,
  Titulo,
} from '@/components/Formulario'
import { MapaGoogle, urlGoogleMaps } from '@/components/MapaGoogle'
import {
  actualizarGasto,
  obtenerFotoGasto,
  obtenerGastosDelGrupo,
  obtenerGrupoPorId,
  type EstadoPago,
  type GastoFirestore,
  type GrupoFirestore,
} from '@/services/firestore'
import {
  ETIQUETAS_ESTADO_PAGO,
  esPago,
  estadoDelPago,
  receptorDelPago,
  situacionEnGasto,
  type SituacionEnGasto,
} from '../grupos/pagos'
import { useAppStore } from '@/store/useAppStore'
import { COLOR_CATEGORIAS } from '@/theme/categorias'
import { colores } from '@/theme/colores'
import { formatearMoneda } from '@/theme/moneda'
import { participantesDelGrupo } from '../grupos/deudas'
import { deudasDelGrupo } from '../grupos/deudasDelGrupo'
import { formatearFecha } from '../grupos/formatearFecha'

const SITUACIONES: Record<
  SituacionEnGasto['tipo'],
  { texto: string; color: string }
> = {
  pagador: { texto: 'Pagó el total', color: colores.primaryDark },
  'pago-aprobado': {
    texto: 'Ya pagó su parte',
    color: ETIQUETAS_ESTADO_PAGO.aprobado.color,
  },
  'pago-en-revision': {
    texto: 'Pago en revisión',
    color: ETIQUETAS_ESTADO_PAGO.pendiente.color,
  },
  debe: { texto: 'Todavía debe', color: ETIQUETAS_ESTADO_PAGO.rechazado.color },
  'al-dia': { texto: 'Al día', color: colores.textMuted },
}

export function DetalleGastoScreen() {
  const { id, gastoId } = useLocalSearchParams<{
    id: string
    gastoId: string
  }>()
  const usuario = useAppStore((state) => state.usuarioActual)
  const amigos = useAppStore((state) => state.amigos)
  const [grupo, setGrupo] = useState<GrupoFirestore | null>(null)
  const [gasto, setGasto] = useState<GastoFirestore | null>(null)
  const [movimientos, setMovimientos] = useState<GastoFirestore[]>([])
  const [foto, setFoto] = useState<string | null>(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [resolviendo, setResolviendo] = useState(false)

  const cargar = useCallback(async () => {
    setCargando(true)
    setError('')
    try {
      const [actual, gastos] = await Promise.all([
        obtenerGrupoPorId(id),
        obtenerGastosDelGrupo(id),
      ])
      const encontrado = gastos.find((item) => item.id === gastoId)
      if (!actual || !encontrado) throw new Error('El movimiento ya no existe.')
      setGrupo(actual)
      setGasto(encontrado)
      setMovimientos(gastos)
      setFoto(
        encontrado.tieneFoto
          ? await obtenerFotoGasto(id, gastoId)
          : (encontrado.fotoUrl ?? null),
      )
    } catch (fallo) {
      setError(
        fallo instanceof Error
          ? fallo.message
          : 'No pudimos cargar el movimiento.',
      )
    } finally {
      setCargando(false)
    }
  }, [id, gastoId])

  async function resolverPago(estado: EstadoPago) {
    setResolviendo(true)
    setError('')
    try {
      const cambios = { estado, aprobacion: 'manual' as const }
      await actualizarGasto(id, gastoId, cambios)
      setGasto((actual) => (actual ? { ...actual, ...cambios } : actual))
    } catch {
      setError('No pudimos actualizar el pago. Volvé a intentar.')
    } finally {
      setResolviendo(false)
    }
  }

  useFocusEffect(
    useCallback(() => {
      void cargar()
    }, [cargar]),
  )

  if (cargando)
    return (
      <Pantalla>
        <ActivityIndicator color={colores.primary} />
      </Pantalla>
    )
  if (!gasto || !grupo)
    return (
      <Pantalla>
        <Mensaje texto={error} error />
        <Boton texto="Volver" onPress={() => router.back()} />
      </Pantalla>
    )

  const pago = esPago(gasto)
  const moneda = grupo.moneda ?? 'ARS'
  const participantes = participantesDelGrupo(grupo.miembros, usuario, amigos)
  const reparto = gasto.participantes?.length
    ? participantes.filter((persona) =>
        gasto.participantes?.includes(persona.id),
      )
    : participantes
  const paleta = COLOR_CATEGORIAS[gasto.categoria] ?? COLOR_CATEGORIAS.Otro
  const { lat, lng, direccion } = gasto.ubicacion ?? {}
  const tieneCoordenadas = typeof lat === 'number' && typeof lng === 'number'
  const deudas = deudasDelGrupo(participantes, movimientos)
  const nombre = (personaId?: string) =>
    participantes.find((persona) => persona.id === personaId)?.nombre ??
    'quien recibe'
  const estado = ETIQUETAS_ESTADO_PAGO[estadoDelPago(gasto)]
  const puedeResolver =
    pago &&
    gasto.estado === 'pendiente' &&
    usuario?.id === receptorDelPago(gasto)

  return (
    <Pantalla>
      <Tarjeta>
        <View
          className="self-start rounded-xl px-3 py-1"
          style={{ backgroundColor: pago ? estado.fondo : paleta.light }}
        >
          <Text
            style={{
              color: pago ? estado.color : paleta.dark,
              fontWeight: '700',
              fontSize: 12,
            }}
          >
            {pago ? estado.texto : gasto.categoria}
          </Text>
        </View>
        <Titulo>{gasto.descripcion}</Titulo>
        <Text className="text-4xl font-bold text-primary-dark">
          {formatearMoneda(gasto.monto, moneda)}
        </Text>
        <Text className="text-sm text-text-muted">
          {pago ? 'Transferencia' : `Pagó ${gasto.pagadoPorNombre}`} ·{' '}
          {formatearFecha(gasto.fecha)} · {grupo.nombre}
        </Text>
      </Tarjeta>

      {pago && estadoDelPago(gasto) === 'aprobado' && (
        <Tarjeta>
          <Text className="font-bold text-text">
            {gasto.aprobacion === 'automatica'
              ? 'Verificado automáticamente'
              : `Aprobado por ${nombre(receptorDelPago(gasto))}`}
          </Text>
          <Text className="text-sm text-text-muted">
            {gasto.aprobacion === 'automatica'
              ? 'El destinatario, el monto y la fecha del comprobante coinciden con la deuda.'
              : 'Quien recibió el dinero revisó el comprobante y confirmó el pago.'}
          </Text>
        </Tarjeta>
      )}

      {pago && gasto.estado === 'pendiente' && (
        <Tarjeta>
          <Text className="font-bold text-text">
            {puedeResolver
              ? 'Revisá el comprobante'
              : 'Esperando que quien recibe lo apruebe'}
          </Text>
          {gasto.motivos?.map((motivo) => (
            <Text key={motivo} className="text-sm text-text-muted">
              • {motivo}
            </Text>
          ))}
          {puedeResolver && (
            <>
              <Boton
                texto="Aprobar: recibí el dinero"
                cargando={resolviendo}
                disabled={resolviendo}
                onPress={() => {
                  void resolverPago('aprobado')
                }}
              />
              <Boton
                texto="Rechazar"
                peligro
                disabled={resolviendo}
                onPress={() => {
                  void resolverPago('rechazado')
                }}
              />
            </>
          )}
        </Tarjeta>
      )}
      <Mensaje texto={error} error />

      {!pago && reparto.length > 0 && (
        <Tarjeta>
          <Text className="font-bold text-text">
            Dividido entre {reparto.length}
          </Text>
          {reparto.map((persona) => {
            const situacion = situacionEnGasto(
              persona.id,
              gasto,
              movimientos,
              deudas,
            )
            const pagoRelacionado =
              'pago' in situacion ? situacion.pago : undefined
            return (
              <Pressable
                key={persona.id}
                accessibilityRole={pagoRelacionado ? 'button' : 'text'}
                disabled={!pagoRelacionado?.id}
                onPress={() =>
                  pagoRelacionado?.id &&
                  router.push({
                    pathname: '/grupos/[id]/gasto/[gastoId]',
                    params: { id, gastoId: pagoRelacionado.id },
                  })
                }
                className="gap-0.5 border-t border-slate-100 pt-2"
              >
                <View className="flex-row justify-between">
                  <Text className="text-text">{persona.nombre}</Text>
                  <Text className="text-text-muted">
                    {formatearMoneda(gasto.monto / reparto.length, moneda)}
                  </Text>
                </View>
                <Text
                  className="text-xs font-semibold"
                  style={{ color: SITUACIONES[situacion.tipo].color }}
                >
                  {SITUACIONES[situacion.tipo].texto}
                  {pagoRelacionado ? ' · Ver comprobante' : ''}
                </Text>
              </Pressable>
            )
          })}
        </Tarjeta>
      )}

      {foto && (
        <Tarjeta>
          <Text className="font-bold text-text">
            {pago ? 'Comprobante' : 'Foto del ticket o del lugar'}
          </Text>
          <Image
            source={{ uri: foto }}
            accessibilityLabel={pago ? 'Comprobante de pago' : 'Foto del gasto'}
            className="w-full rounded-xl"
            style={{ height: 360 }}
            resizeMode="contain"
          />
        </Tarjeta>
      )}

      {(direccion || tieneCoordenadas) && (
        <Tarjeta>
          <View className="flex-row items-center gap-2">
            <MapPin size={18} color={colores.primaryDark} />
            <Text className="flex-1 font-bold text-text">
              {direccion || 'Ubicación'}
            </Text>
          </View>
          {tieneCoordenadas && (
            <>
              <View className="h-56 overflow-hidden rounded-xl">
                <MapaGoogle lat={lat} lng={lng} />
              </View>
              <Boton
                texto="Abrir en Google Maps"
                secundario
                onPress={() => {
                  void Linking.openURL(urlGoogleMaps({ lat, lng }))
                }}
              />
            </>
          )}
        </Tarjeta>
      )}

      {!pago && (
        <Boton
          texto="Editar gasto"
          secundario
          onPress={() =>
            router.push({
              pathname: '/grupos/[id]/cargar-gasto',
              params: { id, gastoId },
            })
          }
        />
      )}
    </Pantalla>
  )
}
