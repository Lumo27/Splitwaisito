import { useEffect, useMemo, useRef, useState } from 'react'
import { router, useLocalSearchParams } from 'expo-router'
import { ActivityIndicator, Image, Text, View } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
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
import {
  actualizarGasto,
  guardarGasto,
  obtenerGastosDelGrupo,
  obtenerGrupoPorId,
  type GastoFirestore,
  type GrupoFirestore,
} from '@/services/firestore'
import { subirFotoTicket } from '@/services/storage'
import { MODO_SEEDS } from '@/services/firebase'
import { useAppStore } from '@/store/useAppStore'
import { participantesDelGrupo } from '@/features/grupos/deudas'
import { colores } from '@/theme/colores'
import { categorias, validarGasto } from './validarGasto'

export function CargarGastoScreen() {
  const { id, gastoId } = useLocalSearchParams<{
    id: string
    gastoId?: string
  }>()
  const usuario = useAppStore((state) => state.usuarioActual)
  const amigos = useAppStore((state) => state.amigos)
  const [grupo, setGrupo] = useState<GrupoFirestore | null>(null)
  const [descripcion, setDescripcion] = useState('')
  const [monto, setMonto] = useState('')
  const [categoria, setCategoria] =
    useState<GastoFirestore['categoria']>('Comida')
  const [pagador, setPagador] = useState('')
  const [seleccion, setSeleccion] = useState<string[]>([])
  const [foto, setFoto] = useState<string | null>(null)
  const [ubicacion, setUbicacion] = useState<GastoFirestore['ubicacion']>()
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
        setFoto(existente?.fotoUrl ?? null)
        setUbicacion(existente?.ubicacion)
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
      if (
        camara &&
        !(await ImagePicker.requestCameraPermissionsAsync()).granted
      )
        throw new Error('Permití el acceso a la cámara para tomar la foto.')
      const opciones: ImagePicker.ImagePickerOptions = {
        mediaTypes: ['images'],
        quality: 0.5,
        base64: true,
      }
      const resultado = camara
        ? await ImagePicker.launchCameraAsync(opciones)
        : await ImagePicker.launchImageLibraryAsync(opciones)
      if (resultado.canceled) return
      const imagen = resultado.assets[0]
      if (!imagen.base64) throw new Error('No pudimos leer la imagen.')
      if (imagen.base64.length * 0.75 > 2 * 1024 * 1024)
        throw new Error('Elegí una imagen de menos de 2 MB.')
      setFoto(`data:image/jpeg;base64,${imagen.base64}`)
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
      if (!(await Location.requestForegroundPermissionsAsync()).granted)
        throw new Error(
          'Permití el acceso a la ubicación o continuá sin agregarla.',
        )
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
      const direccion = lugar
        ? [lugar.street, lugar.streetNumber, lugar.city]
            .filter(Boolean)
            .join(' ')
        : ''
      setUbicacion(direccion ? { ...punto, direccion } : punto)
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
      let fotoUrl = foto
      if (foto?.startsWith('data:') && !MODO_SEEDS) {
        const archivo = await (await fetch(foto)).blob()
        fotoUrl = await subirFotoTicket(`${id}-${Date.now()}`, archivo)
      }
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
        ...(fotoUrl ? { fotoUrl } : {}),
        ...(ubicacion ? { ubicacion } : {}),
      }
      if (gastoId) {
        await actualizarGasto(id, gastoId, datos)
      } else {
        await guardarGasto(id, datos)
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
          label="Monto total (ARS)"
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
            ? `Cada participante: $${(Number(monto.replace(',', '.')) / seleccion.length || 0).toLocaleString('es-AR', { maximumFractionDigits: 2 })}`
            : 'Elegí al menos un participante.'}
        </Text>
      </Tarjeta>
      <Tarjeta>
        <Text className="font-bold text-text">
          Ticket y ubicación (opcionales)
        </Text>
        {foto && (
          <Image
            source={{ uri: foto }}
            accessibilityLabel="Foto del ticket"
            style={{ width: '100%', height: 180, borderRadius: 12 }}
            resizeMode="contain"
          />
        )}
        <Boton
          texto="Tomar foto"
          secundario
          disabled={ocupado}
          onPress={() => {
            void elegirFoto(true)
          }}
        />
        <Boton
          texto="Elegir foto"
          secundario
          disabled={ocupado}
          onPress={() => {
            void elegirFoto(false)
          }}
        />
        {foto && !gastoId && (
          <Boton
            texto="Quitar foto"
            secundario
            disabled={ocupado}
            onPress={() => setFoto(null)}
          />
        )}
        <Boton
          texto="Usar mi ubicación"
          secundario
          disabled={ocupado}
          onPress={() => {
            void localizar()
          }}
        />
        {ubicacion && (
          <Text className="text-sm text-text-muted">
            {ubicacion.direccion ||
              `${ubicacion.lat.toFixed(5)}, ${ubicacion.lng.toFixed(5)}`}
          </Text>
        )}
        {ubicacion && !gastoId && (
          <Boton
            texto="Quitar ubicación"
            secundario
            disabled={ocupado}
            onPress={() => setUbicacion(undefined)}
          />
        )}
      </Tarjeta>
      <Mensaje texto={error} error />
      <Boton
        texto="Guardar gasto"
        cargando={ocupado}
        onPress={() => {
          void guardar()
        }}
      />
    </Pantalla>
  )
}
