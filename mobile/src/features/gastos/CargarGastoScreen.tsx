import { useEffect, useMemo, useRef, useState } from 'react'
import { router, useLocalSearchParams } from 'expo-router'
import { ActivityIndicator, Image, Text, View } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import * as ImageManipulator from 'expo-image-manipulator'
import * as Location from 'expo-location'
import {
  Boton,
  Campo,
  Mensaje,
  Opcion,
  Pantalla,
  Tarjeta,
  Titulo,
} from '@/components/Formulario'
import { MapaSelector } from '@/components/MapaSelector'
import {
  actualizarGasto,
  eliminarFotoGasto,
  eliminarGasto,
  guardarFotoGasto,
  guardarGasto,
  obtenerFotoGasto,
  obtenerGastosDelGrupo,
  obtenerGrupoPorId,
  type GastoFirestore,
  type GrupoFirestore,
} from '@/services/firestore'
import { useAppStore } from '@/store/useAppStore'
import { participantesDelGrupo } from '@/features/grupos/deudas'
import { colores } from '@/theme/colores'
import { formatearMoneda } from '@/theme/moneda'
import { confirmar } from '@/utils/alerta'
import { categorias, validarGasto } from './validarGasto'

export function CargarGastoScreen() {
  const { id: rawId, gastoId: rawGastoId } = useLocalSearchParams<{
    id: string
    gastoId?: string
  }>()
  const id =
    typeof rawId === 'string' ? rawId : Array.isArray(rawId) ? rawId[0] : ''
  const gastoId =
    typeof rawGastoId === 'string'
      ? rawGastoId
      : Array.isArray(rawGastoId)
        ? rawGastoId[0]
        : undefined

  const usuario = useAppStore((state) => state.usuarioActual)
  const amigos = useAppStore((state) => state.amigos)
  const [grupo, setGrupo] = useState<GrupoFirestore | null>(null)
  const [descripcion, setDescripcion] = useState('')
  const [monto, setMonto] = useState('')
  const [categoria, setCategoria] =
    useState<GastoFirestore['categoria']>('Comida')
  const [pagador, setPagador] = useState('')
  const moneda = grupo?.moneda ?? 'ARS'
  const [seleccion, setSeleccion] = useState<string[]>([])
  const [foto, setFoto] = useState<string | null>(null)
  const [ubicacion, setUbicacion] = useState<GastoFirestore['ubicacion']>()
  const [direccionTexto, setDireccionTexto] = useState('')
  const [mostrarMapa, setMostrarMapa] = useState(false)
  const [cargando, setCargando] = useState(true)
  const [ocupado, setOcupado] = useState(false)
  const [error, setError] = useState('')
  const [intento, setIntento] = useState(0)
  const fechaOriginal = useRef<string | null>(null)
  const operacion = useRef(false)
  const usuarioId = usuario?.id
  const personas = useMemo(
    () => participantesDelGrupo(grupo?.miembros ?? [], usuario, amigos),
    [grupo, usuario, amigos],
  )

  useEffect(() => {
    let vigente = true
    void (async () => {
      try {
        if (!id || !usuarioId)
          throw new Error('Iniciá sesión para cargar gastos.')
        const actual = await obtenerGrupoPorId(id)
        if (!actual?.miembros.includes(usuarioId))
          throw new Error('El grupo no está disponible.')
        const existente = gastoId
          ? (await obtenerGastosDelGrupo(id)).find(
              (gasto) => gasto.id === gastoId,
            )
          : undefined
        if (gastoId && !existente)
          throw new Error('El gasto ya no está disponible.')
        if (!vigente) return
        setGrupo(actual)
        setPagador(existente?.pagadoPorId ?? usuarioId)
        setSeleccion(existente?.participantes ?? actual.miembros)
        setDescripcion(existente?.descripcion ?? '')
        setMonto(existente ? String(existente.monto) : '')
        setCategoria(existente?.categoria ?? 'Comida')
        let fotoExistente = existente?.fotoUrl ?? null
        if (gastoId && (existente?.tieneFoto || existente?.fotoUrl)) {
          const fotoSubdoc = await obtenerFotoGasto(id, gastoId)
          if (fotoSubdoc) fotoExistente = fotoSubdoc
        }
        setFoto(fotoExistente)
        setUbicacion(existente?.ubicacion)
        setDireccionTexto(existente?.ubicacion?.direccion ?? '')
        fechaOriginal.current = existente?.fecha ?? null
      } catch (fallo) {
        if (vigente)
          setError(
            fallo instanceof Error
              ? fallo.message
              : 'No pudimos cargar el formulario.',
          )
      } finally {
        if (vigente) setCargando(false)
      }
    })()
    return () => {
      vigente = false
    }
  }, [id, gastoId, usuarioId, intento])

  async function elegirFoto(camara: boolean) {
    if (operacion.current) return
    operacion.current = true
    setOcupado(true)
    setError('')
    try {
      if (camara) {
        const { granted } = await ImagePicker.requestCameraPermissionsAsync()
        if (!granted) {
          throw new Error('Permití el acceso a la cámara para tomar la foto.')
        }
      } else {
        const { granted } =
          await ImagePicker.requestMediaLibraryPermissionsAsync()
        if (!granted) {
          throw new Error(
            'Permití el acceso a tus fotos para elegir una imagen.',
          )
        }
      }
      const opciones: ImagePicker.ImagePickerOptions = {
        mediaTypes: ['images'],
        quality: 0.8,
      }
      const resultado = camara
        ? await ImagePicker.launchCameraAsync(opciones)
        : await ImagePicker.launchImageLibraryAsync(opciones)
      if (resultado.canceled || !resultado.assets?.[0]) return
      const imagen = resultado.assets[0]
      const manipulada = await ImageManipulator.manipulateAsync(
        imagen.uri,
        [{ resize: { width: 1200 } }],
        {
          compress: 0.7,
          format: ImageManipulator.SaveFormat.JPEG,
          base64: true,
        },
      )
      if (manipulada.base64) {
        setFoto(`data:image/jpeg;base64,${manipulada.base64}`)
      } else {
        setFoto(manipulada.uri)
      }
    } catch (fallo) {
      setError(
        fallo instanceof Error
          ? fallo.message
          : 'No pudimos abrir la cámara o las fotos.',
      )
    } finally {
      operacion.current = false
      setOcupado(false)
    }
  }

  async function localizar() {
    if (operacion.current) return
    operacion.current = true
    setOcupado(true)
    setError('')
    try {
      const permiso = await Location.requestForegroundPermissionsAsync()
      if (!permiso.granted) {
        throw new Error(
          'Permití el acceso a la ubicación para detectar tu posición actual.',
        )
      }
      const resultado = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      })
      const punto = {
        lat: resultado.coords.latitude,
        lng: resultado.coords.longitude,
      }
      const direcciones = await Location.reverseGeocodeAsync({
        latitude: punto.lat,
        longitude: punto.lng,
      }).catch(() => [])
      const lugar = direcciones[0]
      const direccionCalculada = lugar
        ? [lugar.name, lugar.street, lugar.streetNumber, lugar.city]
            .filter(Boolean)
            .join(' ')
        : ''
      setUbicacion(punto)
      setDireccionTexto(
        direccionCalculada ||
          `${punto.lat.toFixed(5)}, ${punto.lng.toFixed(5)}`,
      )
    } catch (fallo) {
      setError(
        fallo instanceof Error
          ? fallo.message
          : 'No pudimos obtener tu ubicación.',
      )
    } finally {
      operacion.current = false
      setOcupado(false)
    }
  }

  async function guardar() {
    if (operacion.current || !grupo || !usuarioId) return
    const problema = validarGasto(
      descripcion,
      monto,
      pagador,
      seleccion,
      grupo.miembros,
    )
    if (problema) {
      setError(problema)
      return
    }
    operacion.current = true
    setOcupado(true)
    setError('')
    try {
      const actual = await obtenerGrupoPorId(id)
      if (!actual?.miembros.includes(usuarioId))
        throw new Error('Ya no sos integrante de este grupo.')
      const invalido = validarGasto(
        descripcion,
        monto,
        pagador,
        seleccion,
        actual.miembros,
      )
      if (invalido) throw new Error(invalido)
      const tieneCoords =
        typeof ubicacion?.lat === 'number' && typeof ubicacion?.lng === 'number'
      const tieneDireccion = Boolean(direccionTexto.trim())
      const ubicacionAGuardar =
        tieneCoords || tieneDireccion
          ? {
              ...(tieneCoords
                ? { lat: ubicacion!.lat, lng: ubicacion!.lng }
                : {}),
              ...(tieneDireccion ? { direccion: direccionTexto.trim() } : {}),
            }
          : undefined

      const datos: Omit<GastoFirestore, 'id'> = {
        descripcion: descripcion.trim(),
        monto: Number(monto.trim().replace(',', '.')),
        categoria,
        pagadoPorId: pagador,
        pagadoPorNombre:
          personas.find((persona) => persona.id === pagador)?.nombre ??
          'Usuario',
        participantes: [...new Set(seleccion)],
        fecha: fechaOriginal.current ?? new Date().toISOString(),
        tieneFoto: Boolean(foto),
        ...(ubicacionAGuardar ? { ubicacion: ubicacionAGuardar } : {}),
      }

      if (gastoId) {
        await actualizarGasto(id, gastoId, datos)
        if (foto) {
          await guardarFotoGasto(id, gastoId, foto)
        } else {
          await eliminarFotoGasto(id, gastoId)
        }
      } else {
        const guardado = await guardarGasto(id, datos)
        if (foto && guardado.id) {
          await guardarFotoGasto(id, guardado.id, foto)
        }
      }
      router.back()
    } catch (fallo) {
      setError(
        fallo instanceof Error
          ? fallo.message
          : 'No pudimos guardar el gasto. Volvé a intentar.',
      )
    } finally {
      operacion.current = false
      setOcupado(false)
    }
  }

  function confirmarEliminar() {
    if (!id || !gastoId) return
    confirmar({
      titulo: 'Eliminar gasto',
      mensaje: `¿Seguro que querés eliminar “${descripcion.trim() || 'este gasto'}”? Esta acción no se puede deshacer.`,
      textoConfirmar: 'Eliminar',
      textoCancelar: 'Cancelar',
      destructivo: true,
      alConfirmar: async () => {
        if (operacion.current) return
        operacion.current = true
        setOcupado(true)
        setError('')
        try {
          await eliminarGasto(id, gastoId)
          router.back()
        } catch (fallo) {
          setError(
            fallo instanceof Error
              ? fallo.message
              : 'No pudimos eliminar el gasto. Volvé a intentar.',
          )
        } finally {
          operacion.current = false
          setOcupado(false)
        }
      },
    })
  }

  if (cargando)
    return (
      <Pantalla>
        <ActivityIndicator color={colores.primary} />
      </Pantalla>
    )
  if (!grupo)
    return (
      <Pantalla>
        <Mensaje texto={error} error />
        <Boton
          texto="Volver a intentar"
          onPress={() => {
            setCargando(true)
            setError('')
            setIntento((valor) => valor + 1)
          }}
        />
      </Pantalla>
    )
  return (
    <Pantalla>
      <Titulo>{gastoId ? 'Editar gasto' : 'Cargar gasto'}</Titulo>
      <Text className="text-text-muted">{grupo.nombre}</Text>
      <Tarjeta>
        <Campo
          label="¿Qué compraste?"
          value={descripcion}
          onChangeText={setDescripcion}
          placeholder="Ej: Cena del viaje"
          maxLength={150}
          editable={!ocupado}
        />
        <Campo
          label={`Monto total (${moneda})`}
          value={monto}
          onChangeText={setMonto}
          placeholder="0,00"
          keyboardType="decimal-pad"
          editable={!ocupado}
        />
        <Text className="font-semibold text-text">Categoría</Text>
        <View className="gap-2">
          {categorias.map((opcion) => (
            <Opcion
              key={opcion}
              texto={opcion}
              elegida={categoria === opcion}
              disabled={ocupado}
              onPress={() => setCategoria(opcion)}
            />
          ))}
        </View>
        <Text className="font-semibold text-text">¿Quién pagó?</Text>
        {personas.map((persona) => (
          <Opcion
            key={persona.id}
            texto={persona.nombre}
            elegida={pagador === persona.id}
            disabled={ocupado}
            onPress={() => setPagador(persona.id)}
          />
        ))}
        <Text className="font-semibold text-text">Dividir entre</Text>
        {personas.map((persona) => (
          <Opcion
            key={persona.id}
            texto={persona.nombre}
            elegida={seleccion.includes(persona.id)}
            disabled={ocupado}
            onPress={() =>
              setSeleccion((actual) =>
                actual.includes(persona.id)
                  ? actual.filter((valor) => valor !== persona.id)
                  : [...actual, persona.id],
              )
            }
          />
        ))}
        <Text className="text-sm text-text-muted">
          {seleccion.length
            ? `Cada participante: ${formatearMoneda((Number(monto.replace(',', '.')) / seleccion.length) || 0, moneda)}`
            : 'Elegí al menos un participante.'}
        </Text>
      </Tarjeta>
      <Tarjeta>
        <Text className="font-bold text-text">
          Foto del ticket o del lugar (opcional)
        </Text>
        {foto && (
          <View className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
            <Image
              source={{ uri: foto }}
              accessibilityLabel="Foto del ticket o del lugar"
              style={{ width: '100%', height: 180 }}
              resizeMode="contain"
            />
          </View>
        )}
        <View className="flex-row gap-2">
          <View className="flex-1">
            <Boton
              texto="Tomar foto"
              secundario
              disabled={ocupado}
              onPress={() => {
                void elegirFoto(true)
              }}
            />
          </View>
          <View className="flex-1">
            <Boton
              texto="Elegir foto"
              secundario
              disabled={ocupado}
              onPress={() => {
                void elegirFoto(false)
              }}
            />
          </View>
        </View>
        {foto && (
          <Boton
            texto="Quitar foto"
            secundario
            disabled={ocupado}
            onPress={() => setFoto(null)}
          />
        )}
        <Campo
          label="Lugar o dirección (opcional)"
          placeholder="Ej: Bar Central o Palermo"
          value={direccionTexto}
          onChangeText={setDireccionTexto}
          maxLength={120}
          editable={!ocupado}
        />
        <Boton
          texto="Detectar mi ubicación GPS"
          secundario
          disabled={ocupado}
          onPress={() => {
            void localizar()
          }}
        />
        <Boton
          texto="Marcar en el mapa"
          secundario
          disabled={ocupado}
          onPress={() => setMostrarMapa(true)}
        />
        {direccionTexto ? (
          <Boton
            texto="Quitar ubicación"
            secundario
            disabled={ocupado}
            onPress={() => {
              setUbicacion(undefined)
              setDireccionTexto('')
            }}
          />
        ) : null}
      </Tarjeta>
      <MapaSelector
        visible={mostrarMapa}
        onCerrar={() => setMostrarMapa(false)}
        coordenadasIniciales={
          typeof ubicacion?.lat === 'number' &&
          typeof ubicacion?.lng === 'number'
            ? { lat: ubicacion.lat, lng: ubicacion.lng }
            : undefined
        }
        onSeleccionar={(coords) => {
          setUbicacion(coords)
          if (!direccionTexto.trim()) {
            setDireccionTexto(
              `Punto en mapa (${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)})`,
            )
          }
        }}
      />
      <Mensaje texto={error} error />
      <Boton
        texto="Guardar gasto"
        cargando={ocupado}
        onPress={() => {
          void guardar()
        }}
      />
      {gastoId && (
        <Boton
          texto="Eliminar este gasto"
          peligro
          disabled={ocupado}
          onPress={confirmarEliminar}
        />
      )}
    </Pantalla>
  )
}
