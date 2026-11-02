import { useCallback, useState } from 'react'
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router'
import { ActivityIndicator, Image, Linking, Text, View } from 'react-native'
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
  esPago,
  obtenerFotoGasto,
  obtenerGastosDelGrupo,
  obtenerGrupoPorId,
  type GastoFirestore,
  type GrupoFirestore,
} from '@/services/firestore'
import { useAppStore } from '@/store/useAppStore'
import { COLOR_CATEGORIAS } from '@/theme/categorias'
import { colores } from '@/theme/colores'
import { formatearMoneda } from '@/theme/moneda'
import { participantesDelGrupo } from '../grupos/deudas'
import { formatearFecha } from '../grupos/formatearFecha'

export function DetalleGastoScreen() {
  const { id, gastoId } = useLocalSearchParams<{
    id: string
    gastoId: string
  }>()
  const usuario = useAppStore((state) => state.usuarioActual)
  const amigos = useAppStore((state) => state.amigos)
  const [grupo, setGrupo] = useState<GrupoFirestore | null>(null)
  const [gasto, setGasto] = useState<GastoFirestore | null>(null)
  const [foto, setFoto] = useState<string | null>(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

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

  return (
    <Pantalla>
      <Tarjeta>
        {!pago && (
          <View
            className="self-start rounded-xl px-3 py-1"
            style={{ backgroundColor: paleta.light }}
          >
            <Text
              style={{ color: paleta.dark, fontWeight: '700', fontSize: 12 }}
            >
              {gasto.categoria}
            </Text>
          </View>
        )}
        <Titulo>{gasto.descripcion}</Titulo>
        <Text className="text-4xl font-bold text-primary-dark">
          {formatearMoneda(gasto.monto, moneda)}
        </Text>
        <Text className="text-sm text-text-muted">
          {pago ? 'Transferencia registrada' : `Pagó ${gasto.pagadoPorNombre}`}{' '}
          · {formatearFecha(gasto.fecha)} · {grupo.nombre}
        </Text>
      </Tarjeta>

      {!pago && reparto.length > 0 && (
        <Tarjeta>
          <Text className="font-bold text-text">
            Dividido entre {reparto.length}
          </Text>
          {reparto.map((persona) => (
            <View key={persona.id} className="flex-row justify-between">
              <Text className="text-text">{persona.nombre}</Text>
              <Text className="text-text-muted">
                {formatearMoneda(gasto.monto / reparto.length, moneda)}
              </Text>
            </View>
          ))}
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
