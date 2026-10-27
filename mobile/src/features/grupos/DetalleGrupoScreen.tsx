import { useCallback, useMemo, useRef, useState } from 'react'
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router'
import {
  ActivityIndicator,
  Linking,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from 'react-native'
import { Plus, Receipt, Trash2, UserPlus } from 'lucide-react-native'

import {
  agregarMiembroAlGrupo,
  eliminarGasto,
  obtenerGastosDelGrupo,
  obtenerGrupoPorId,
  type GastoFirestore,
  type GrupoFirestore,
} from '@/services/firestore'
import { useAppStore } from '@/store/useAppStore'
import { COLOR_CATEGORIAS } from '@/theme/categorias'
import { colores } from '@/theme/colores'
import { formatearMoneda } from '@/theme/moneda'
import { avisar, confirmar } from '@/utils/alerta'
import { EquivalenciaPesos } from '@/components/EquivalenciaPesos'
import { useActualizarCotizacionPesos } from '@/hooks/useActualizarCotizacionPesos'
import { participantesDelGrupo } from './deudas'
import { deudasDelGrupo } from './deudasDelGrupo'
import { formatearFecha } from './formatearFecha'

export function DetalleGrupoScreen() {
  const { id: rawId } = useLocalSearchParams<{ id: string }>()
  const id = typeof rawId === 'string' ? rawId : Array.isArray(rawId) ? rawId[0] : ''
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

  const moneda = grupo?.moneda ?? 'ARS'
  const dinero = (monto: number) => formatearMoneda(monto, moneda)
  const totalGastos = gastos.reduce((total, gasto) => total + gasto.monto, 0)
  useActualizarCotizacionPesos(moneda)

  function recordarPorWhatsApp(deudorId: string, monto: number) {
    const deudorNombre = nombre(deudorId)
    const montoTexto = dinero(monto)
    const aliasUsuario = usuario?.alias?.trim()
      ? ` al alias ${usuario.alias.trim()}`
      : ' a mi cuenta'
    const grupoNombre = grupo?.nombre ?? 'el grupo'
    const texto = `¡Hola ${deudorNombre}! Te recuerdo que tenemos un saldo pendiente en Splitwaisito de ${montoTexto} en el grupo "${grupoNombre}". Podés transferirme${aliasUsuario}. ¡Muchas gracias!`
    const url = `https://wa.me/?text=${encodeURIComponent(texto)}`
    void Linking.openURL(url).catch(() => {
      avisar(
        'WhatsApp no disponible',
        'No pudimos abrir WhatsApp. Verificá que esté instalado en tu dispositivo.',
      )
    })
  }

  function recordarPorEmail(deudorId: string, monto: number) {
    const deudor = participantes.find((persona) => persona.id === deudorId)
    const deudorNombre = deudor?.nombre ?? 'Usuario'
    const deudorEmail = deudor?.email?.trim()
    if (!deudorEmail) {
      avisar(
        'E-mail no disponible',
        `No tenemos registrado el e-mail de ${deudorNombre}.`,
      )
      return
    }
    const montoTexto = dinero(monto)
    const aliasUsuario = usuario?.alias?.trim()
      ? ` al alias ${usuario.alias.trim()}`
      : ' a mi cuenta'
    const grupoNombre = grupo?.nombre ?? 'el grupo'
    const asunto = `Saldo pendiente en Splitwaisito - ${grupoNombre}`
    const texto = `¡Hola ${deudorNombre}!\n\nTe recuerdo que tenemos un saldo pendiente en Splitwaisito de ${montoTexto} en el grupo "${grupoNombre}".\n\nPodés transferirme${aliasUsuario}.\n\n¡Muchas gracias!`
    const url = `mailto:${deudorEmail}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(texto)}`
    void Linking.openURL(url).catch(() => {
      avisar(
        'Correo no disponible',
        'No pudimos abrir tu aplicación de correo.',
      )
    })
  }

  function abrirRecordatorio(deudorId: string, monto: number) {
    const deudorNombre = nombre(deudorId)
    if (Platform.OS === 'web') {
      const elegirWhatsApp = typeof window !== 'undefined'
        ? window.confirm(
            `Recordar saldo a ${deudorNombre}\n\nPresioná Aceptar para enviar por WhatsApp o Cancelar para enviar por E-mail.`,
          )
        : true
      if (elegirWhatsApp) {
        recordarPorWhatsApp(deudorId, monto)
      } else {
        recordarPorEmail(deudorId, monto)
      }
      return
    }

    confirmar({
      titulo: `Recordar a ${deudorNombre}`,
      mensaje: '¿Deseás abrir WhatsApp para enviar el recordatorio del saldo pendiente?',
      textoConfirmar: 'Abrir WhatsApp',
      textoCancelar: 'Por E-mail',
      destructivo: false,
      alConfirmar: () => recordarPorWhatsApp(deudorId, monto),
      alCancelar: () => recordarPorEmail(deudorId, monto),
    })
  }

  async function ejecutar(accion: () => Promise<unknown>) {
    if (mutacion.current) return
    mutacion.current = true
    setOcupado(true)
    try {
      await accion()
      await cargar()
    } catch {
      avisar(
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
      contentContainerStyle={{ padding: 20, paddingBottom: 36 }}
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
      <Text className="text-xs font-bold uppercase tracking-widest text-primary-dark">
        Espacio compartido
      </Text>
      <Text
        accessibilityRole="header"
        className="mt-2 text-3xl font-bold text-text"
      >
        {grupo.nombre}
      </Text>
      <Text className="mt-2 text-sm text-text-muted">
        {grupo.descripcion || 'Gastos y saldos en un solo lugar'}
      </Text>
      {error ? (
        <Text accessibilityRole="alert" className="mt-3 text-red-700">
          {error}
        </Text>
      ) : null}
      <View className="my-5 gap-1 rounded-2xl bg-primary-light p-5">
        <Text className="text-xs font-bold uppercase text-primary-dark">
          Total de gastos del grupo
        </Text>
        <Text className="text-3xl font-bold text-primary-dark">
          {dinero(totalGastos)}
        </Text>
        <EquivalenciaPesos monto={totalGastos} moneda={moneda} />
      </View>
      <Pressable
        accessibilityRole="button"
        onPress={() =>
          router.push({ pathname: '/grupos/[id]/cargar-gasto', params: { id } })
        }
        className="min-h-12 flex-row items-center justify-center gap-2 rounded-2xl bg-primary p-3"
      >
        <Plus color="#FFFFFF" size={20} />
        <Text className="font-bold text-white">Cargar gasto</Text>
      </Pressable>
      <View className="mt-5 gap-3 rounded-2xl bg-white p-4">
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
      <View className="mt-5 gap-3 rounded-2xl bg-white p-4">
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
              className="gap-2 rounded-xl bg-slate-50 p-3"
            >
              <Text className="text-sm text-text">
                {nombre(deuda.de)} → {nombre(deuda.a)}
              </Text>
              <Text className="text-lg font-bold text-primary-dark">
                {dinero(deuda.monto)}
              </Text>
              <EquivalenciaPesos monto={deuda.monto} moneda={moneda} />
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
              {deuda.a === usuarioId && (
                <Pressable
                  accessibilityRole="button"
                  onPress={() => abrirRecordatorio(deuda.de, deuda.monto)}
                  className="min-h-11 justify-center"
                >
                  <Text className="font-bold text-primary-dark">
                    Recordar a {nombre(deuda.de)}
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
      {gastos.map((gasto, index) => {
        const paleta = COLOR_CATEGORIAS[gasto.categoria] ?? COLOR_CATEGORIAS.Otro
        return (
          <View
            key={gasto.id ?? String(index)}
            className="mb-3 rounded-3xl bg-white shadow-sm"
            style={{
              borderWidth: 1.5,
              borderColor: paleta ? `${paleta.primary}33` : '#E2E8F0',
              overflow: 'hidden',
            }}
          >
            {/* En la lista solo va el color de la categoría: la ilustración
                se reserva para los botones, así el scroll no dibuja imágenes. */}
            <View style={{ padding: 20 }}>
              <View className="flex-row items-center gap-3">
                <View
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 10,
                    backgroundColor: paleta?.light ?? '#F1F5F9',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Receipt size={18} color={paleta?.dark ?? colores.primaryDark} />
                </View>
                <Text className="flex-1 text-base font-bold text-text">
                  {gasto.descripcion}
                </Text>
                <View
                  style={{
                    paddingHorizontal: 10,
                    paddingVertical: 4,
                    borderRadius: 12,
                    backgroundColor: paleta?.light ?? '#F1F5F9',
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: '700',
                      color: paleta?.dark ?? colores.primaryDark,
                    }}
                  >
                    {gasto.categoria}
                  </Text>
                </View>
              </View>

              <Text className="mt-2 text-xl font-bold text-text">
                {dinero(gasto.monto)}
              </Text>

              <Text className="mt-0.5 text-xs text-text-muted">
                Pagó {gasto.pagadoPorNombre} · {formatearFecha(gasto.fecha)}
              </Text>

              <View className="mt-3 flex-row items-center justify-between border-t border-slate-200/60 pt-2">
                {gasto.id ? (
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`Editar gasto ${gasto.descripcion}`}
                    className="min-h-11 justify-center py-1"
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
                ) : (
                  <View />
                )}
                {gasto.id ? (
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`Eliminar gasto ${gasto.descripcion}`}
                    disabled={ocupado}
                    className="min-h-11 flex-row items-center justify-end gap-1.5 py-1"
                    onPress={() => {
                      const gastoIdAEliminar = gasto.id!
                      confirmar({
                        titulo: 'Eliminar gasto',
                        mensaje: `¿Eliminar “${gasto.descripcion}”? Esta acción no se puede deshacer.`,
                        textoConfirmar: 'Eliminar',
                        textoCancelar: 'Cancelar',
                        destructivo: true,
                        alConfirmar: async () => {
                          // Actualización optimista inmediata
                          setGastos((prev) =>
                            prev.filter((item) => item.id !== gastoIdAEliminar),
                          )
                          await ejecutar(() => eliminarGasto(id, gastoIdAEliminar))
                        },
                      })
                    }}
                  >
                    <Trash2 size={16} color="#B42318" />
                    <Text className="font-semibold text-red-700">Eliminar</Text>
                  </Pressable>
                ) : null}
              </View>
            </View>
          </View>
        )
      })}
    </ScrollView>
  )
}
