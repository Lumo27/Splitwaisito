import { useCallback, useMemo, useRef, useState } from 'react'
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router'
import {
  ActivityIndicator,
  Alert,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from 'react-native'
import { Receipt, Trash2, UserPlus } from 'lucide-react-native'

import {
  agregarMiembroAlGrupo,
  eliminarGasto,
  obtenerGastosDelGrupo,
  obtenerGrupoPorId,
  type GastoFirestore,
  type GrupoFirestore,
} from '@/services/firestore'
import { useAppStore } from '@/store/useAppStore'
import { Portada } from '@/components/Portada'
import { Boton } from '@/components/Formulario'
import { colores } from '@/theme/colores'
import { participantesDelGrupo } from './deudas'
import { deudasDelGrupo } from './deudasDelGrupo'
import { formatearFecha } from './formatearFecha'

const dinero = (monto: number) =>
  `$${monto.toLocaleString('es-AR', { maximumFractionDigits: 2 })}`

export function DetalleGrupoScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const usuario = useAppStore((state) => state.usuarioActual)
  const amigos = useAppStore((state) => state.amigos)
  const [grupo, setGrupo] = useState<GrupoFirestore | null>(null)
  const [gastos, setGastos] = useState<GastoFirestore[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [ocupado, setOcupado] = useState(false)
  const peticion = useRef(0)
  const mutacion = useRef(false)
  const usuarioId = usuario?.id

  const cargar = useCallback(async () => {
    const turno = ++peticion.current
    setCargando(true)
    setError('')
    try {
      if (!id || !usuarioId) throw new Error('Sesión o grupo ausente')
      const siguiente = await obtenerGrupoPorId(id)
      if (!siguiente || !siguiente.miembros.includes(usuarioId)) {
        if (turno === peticion.current) {
          setGrupo(null)
          setGastos([])
        }
        return
      }
      const lista = await obtenerGastosDelGrupo(id)
      if (turno !== peticion.current) return
      setGrupo(siguiente)
      setGastos([...lista].sort((a, b) => b.fecha.localeCompare(a.fecha)))
    } catch {
      if (turno === peticion.current)
        setError(
          'No pudimos cargar el grupo. Revisá la conexión y volvé a intentar.',
        )
    } finally {
      if (turno === peticion.current) setCargando(false)
    }
  }, [id, usuarioId])

  useFocusEffect(
    useCallback(() => {
      setGrupo(null)
      setGastos([])
      void cargar()
      return () => {
        peticion.current += 1
      }
    }, [cargar]),
  )

  const participantes = useMemo(
    () => participantesDelGrupo(grupo?.miembros ?? [], usuario, amigos),
    [grupo, usuario, amigos],
  )
  const deudas = useMemo(
    () => deudasDelGrupo(participantes, gastos),
    [gastos, participantes],
  )
  const nombre = (personaId: string) =>
    participantes.find((persona) => persona.id === personaId)?.nombre ??
    'Usuario'

  async function ejecutar(accion: () => Promise<unknown>) {
    if (
      mutacion.current ||
      useAppStore.getState().usuarioActual?.id !== usuarioId
    )
      return
    mutacion.current = true
    setOcupado(true)
    try {
      await accion()
      await cargar()
    } catch {
      Alert.alert(
        'No se pudo guardar',
        'Revisá la conexión y volvé a intentar.',
      )
    } finally {
      mutacion.current = false
      setOcupado(false)
    }
  }

  if (!grupo) {
    return (
      <View className="flex-1 items-center justify-center gap-4 bg-background p-6">
        {cargando ? (
          <ActivityIndicator color={colores.primary} />
        ) : (
          <Text className="text-center text-text-muted">
            {error || 'Este grupo no está disponible o ya no sos integrante.'}
          </Text>
        )}
        {!cargando && (
          <Pressable
            accessibilityRole="button"
            onPress={() => {
              void cargar()
            }}
            className="min-h-12 justify-center"
          >
            <Text className="font-bold text-primary-dark">
              Volver a intentar
            </Text>
          </Pressable>
        )}
      </View>
    )
  }

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{
        padding: 20,
        paddingBottom: 36,
        width: '100%',
        maxWidth: 680,
        alignSelf: 'center',
      }}
      refreshControl={
        <RefreshControl
          refreshing={cargando}
          onRefresh={() => {
            void cargar()
          }}
          tintColor={colores.primary}
        />
      }
    >
      <Portada
        etiquetaValor="Total de gastos del grupo"
        etiqueta="Espacio compartido"
        titulo={grupo.nombre}
        descripcion={grupo.descripcion || 'Gastos y saldos en un solo lugar'}
        valor={dinero(gastos.reduce((total, gasto) => total + gasto.monto, 0))}
        pie={`${gastos.length} gastos · ${grupo.miembros.length} integrantes`}
      />
      {error ? (
        <Text accessibilityRole="alert" className="mt-3 text-red-700">
          {error}
        </Text>
      ) : null}
      <View className="mt-5">
        <Boton
          texto="Cargar gasto"
          onPress={() =>
            router.push({
              pathname: '/grupos/[id]/cargar-gasto',
              params: { id },
            })
          }
        />
      </View>
      <View className="mt-5 gap-3 rounded-3xl bg-white p-5">
        <Text
          accessibilityRole="header"
          className="text-lg font-bold text-text"
        >
          Integrantes
        </Text>
        <View className="flex-row flex-wrap gap-2">
          {participantes.map((persona) => (
            <View
              key={persona.id}
              className="rounded-full bg-primary-light px-3 py-2"
            >
              <Text className="text-sm text-primary-dark">
                {persona.nombre}
                {persona.id === usuarioId ? ' (Vos)' : ''}
              </Text>
            </View>
          ))}
        </View>
        {amigos
          .filter((amigo) => !grupo.miembros.includes(amigo.id))
          .map((amigo) => (
            <Pressable
              key={amigo.id}
              accessibilityRole="button"
              accessibilityLabel={`Agregar a ${amigo.nombre} al grupo`}
              disabled={ocupado}
              onPress={() => {
                void ejecutar(() => agregarMiembroAlGrupo(id, amigo.id))
              }}
              className="min-h-12 flex-row items-center gap-2 border-t border-slate-100 py-2"
            >
              <UserPlus size={18} color={colores.primaryDark} />
              <Text className="flex-1 text-sm text-primary-dark">
                Agregar a {amigo.nombre}
              </Text>
            </Pressable>
          ))}
        {ocupado && <ActivityIndicator color={colores.primary} />}
      </View>
      <View className="mt-5 gap-3 rounded-3xl bg-white p-5">
        <Text
          accessibilityRole="header"
          className="text-lg font-bold text-text"
        >
          Deudas simplificadas
        </Text>
        {deudas.length === 0 ? (
          <Text className="text-sm text-text-muted">
            Todo está saldado. No hay transferencias pendientes.
          </Text>
        ) : (
          deudas.map((deuda) => (
            <View
              key={`${deuda.de}-${deuda.a}`}
              className="gap-2 rounded-2xl bg-secondary-light p-4"
            >
              <Text className="text-sm text-text">
                {nombre(deuda.de)} → {nombre(deuda.a)}
              </Text>
              <Text className="text-lg font-bold text-primary-dark">
                {dinero(deuda.monto)}
              </Text>
              {deuda.de === usuarioId && (
                <Pressable
                  accessibilityRole="button"
                  onPress={() =>
                    router.push({
                      pathname: '/grupos/[id]/saldar',
                      params: { id, de: deuda.de, a: deuda.a },
                    })
                  }
                  className="min-h-11 justify-center"
                >
                  <Text className="font-bold text-primary-dark">
                    Saldar deuda
                  </Text>
                </Pressable>
              )}
            </View>
          ))
        )}
      </View>
      <Text
        accessibilityRole="header"
        className="mb-3 mt-6 text-lg font-bold text-text"
      >
        Gastos ({gastos.length})
      </Text>
      {!gastos.length && (
        <Text className="text-sm text-text-muted">
          Todavía no hay gastos. Cargá el primero para empezar.
        </Text>
      )}
      {gastos.map((gasto, index) => (
        <View
          key={gasto.id ?? String(index)}
          className="mb-3 gap-2 rounded-3xl bg-white p-5"
        >
          <View className="flex-row items-center gap-3">
            <Receipt size={20} color={colores.primaryDark} />
            <Text className="flex-1 text-base font-bold text-text">
              {gasto.descripcion}
            </Text>
          </View>
          <Text className="text-xl font-bold text-text">
            {dinero(gasto.monto)}
          </Text>
          <Text className="text-xs text-text-muted">
            {gasto.categoria} · Pagó {gasto.pagadoPorNombre} ·{' '}
            {formatearFecha(gasto.fecha)}
          </Text>
          {gasto.id && (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Editar gasto ${gasto.descripcion}`}
              className="min-h-11 justify-center"
              onPress={() =>
                router.push({
                  pathname: '/grupos/[id]/cargar-gasto',
                  params: { id, gastoId: gasto.id },
                })
              }
            >
              <Text className="font-semibold text-primary-dark">
                Editar gasto
              </Text>
            </Pressable>
          )}
          {gasto.id && (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Eliminar gasto ${gasto.descripcion}`}
              disabled={ocupado}
              className="min-h-11 flex-row items-center justify-end gap-2"
              onPress={() =>
                Alert.alert(
                  'Eliminar gasto',
                  `¿Eliminar “${gasto.descripcion}”?`,
                  [
                    { text: 'Cancelar', style: 'cancel' },
                    {
                      text: 'Eliminar',
                      style: 'destructive',
                      onPress: () => {
                        void ejecutar(() => eliminarGasto(id, gasto.id!))
                      },
                    },
                  ],
                )
              }
            >
              <Trash2 size={17} color={colores.textMuted} />
              <Text className="text-xs text-text-muted">Eliminar</Text>
            </Pressable>
          )}
        </View>
      ))}
    </ScrollView>
  )
}
