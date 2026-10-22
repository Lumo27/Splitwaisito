import { useCallback, useEffect, useRef, useState } from 'react'
import { useFocusEffect } from 'expo-router'
import {
  ActivityIndicator,
  Image,
  Pressable,
  Text,
  View,
} from 'react-native'
import { Calendar, DollarSign, RefreshCw, TrendingUp } from 'lucide-react-native'

import {
  Boton,
  Campo,
  Mensaje,
  Pantalla,
  Tarjeta,
  Titulo,
} from '@/components/Formulario'
import {
  CASAS_PRINCIPALES,
  formatearFechaCotizacion,
  obtenerCotizacionesDolar,
  type CotizacionDolar,
} from '@/services/dolar'
import { upsertUsuarioPerfil } from '@/services/firestore'
import { useAppStore } from '@/store/useAppStore'
import { colores } from '@/theme/colores'

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
  const [cotizaciones, setCotizaciones] = useState<CotizacionDolar[]>([])
  const [cargandoDolar, setCargandoDolar] = useState(false)
  const [errorDolar, setErrorDolar] = useState('')
  const enviando = useRef(false)
  const uid = usuario?.id
  const aliasGuardado = usuario?.alias ?? ''
  const descripcionGuardada = usuario?.descripcion ?? ''

  const cargarCotizaciones = useCallback(async () => {
    setCargandoDolar(true)
    setErrorDolar('')
    try {
      const datos = await obtenerCotizacionesDolar()
      setCotizaciones(datos)
    } catch {
      setErrorDolar('No pudimos actualizar la cotización.')
    } finally {
      setCargandoDolar(false)
    }
  }, [])

  useEffect(() => {
    void cargarCotizaciones()
  }, [cargarCotizaciones])

  useFocusEffect(
    useCallback(() => {
      setAlias(uid ? aliasGuardado : '')
      setDescripcion(uid ? descripcionGuardada : '')
    }, [uid, aliasGuardado, descripcionGuardada]),
  )

  async function guardar() {
    if (!usuario || enviando.current) return
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

  const cotizacionesFiltradas = cotizaciones.filter((item) =>
    CASAS_PRINCIPALES.includes(item.casa as (typeof CASAS_PRINCIPALES)[number]),
  )
  const fechaActualizacionDolar = cotizaciones[0]?.fechaActualizacion
    ? formatearFechaCotizacion(cotizaciones[0].fechaActualizacion)
    : ''

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

      {/* Cotización del Dólar en Argentina */}
      <Tarjeta>
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            <View className="h-8 w-8 items-center justify-center rounded-lg bg-emerald-50">
              <DollarSign size={18} color="#059669" />
            </View>
            <View>
              <Text className="text-base font-bold text-text">
                Dólar hoy en Argentina
              </Text>
              <Text className="text-xs text-text-muted">
                Cotizaciones oficiales y de mercado
              </Text>
            </View>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Actualizar cotización del dólar"
            disabled={cargandoDolar}
            onPress={() => {
              void cargarCotizaciones()
            }}
            className="h-9 w-9 items-center justify-center rounded-xl bg-slate-100"
          >
            {cargandoDolar ? (
              <ActivityIndicator size="small" color={colores.primary} />
            ) : (
              <RefreshCw size={16} color={colores.textMuted} />
            )}
          </Pressable>
        </View>

        {errorDolar ? (
          <View className="rounded-xl bg-slate-50 p-3">
            <Text className="text-xs text-text-muted">{errorDolar}</Text>
            <Pressable
              accessibilityRole="button"
              onPress={() => {
                void cargarCotizaciones()
              }}
              className="mt-1"
            >
              <Text className="text-xs font-bold text-primary-dark">
                Reintentar
              </Text>
            </Pressable>
          </View>
        ) : null}

        {cotizacionesFiltradas.length > 0 ? (
          <View className="gap-2">
            <View className="flex-row flex-wrap gap-2">
              {cotizacionesFiltradas.map((cotizacion) => (
                <View
                  key={cotizacion.casa}
                  className="min-w-[45%] flex-1 rounded-xl border border-slate-100 bg-slate-50 p-3"
                >
                  <View className="flex-row items-center justify-between">
                    <Text className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      {cotizacion.nombre}
                    </Text>
                    <TrendingUp size={13} color="#10B981" />
                  </View>
                  <View className="mt-2 flex-row justify-between">
                    <View>
                      <Text className="text-[10px] uppercase text-text-muted">
                        Compra
                      </Text>
                      <Text className="text-sm font-semibold text-text">
                        ${cotizacion.compra?.toLocaleString('es-AR') ?? '-'}
                      </Text>
                    </View>
                    <View className="items-end">
                      <Text className="text-[10px] uppercase text-text-muted">
                        Venta
                      </Text>
                      <Text className="text-base font-bold text-emerald-700">
                        ${cotizacion.venta?.toLocaleString('es-AR') ?? '-'}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>

            {fechaActualizacionDolar ? (
              <View className="mt-1 flex-row items-center gap-1">
                <Calendar size={12} color={colores.textMuted} />
                <Text className="text-[11px] text-text-muted">
                  Actualizado: {fechaActualizacionDolar}
                </Text>
              </View>
            ) : null}
          </View>
        ) : null}
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
