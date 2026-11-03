import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router'
import { ActivityIndicator, Image, Text, View } from 'react-native'
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
  registrarPago,
  type GastoFirestore,
  type GrupoFirestore,
} from '@/services/firestore'
import { esPago, receptorDelPago } from './pagos'
import {
  DEMORA_RECORDATORIO_SEGUNDOS,
  programarRecordatorioDePago,
  recordatoriosDisponibles,
} from '@/services/recordatorios'
import { useAppStore } from '@/store/useAppStore'
import { colores } from '@/theme/colores'
import { formatearMoneda } from '@/theme/moneda'
import { avisar } from '@/utils/alerta'
import { elegirImagen } from '@/utils/imagen'
import { abrirWhatsApp } from '@/utils/whatsapp'
import { leerComprobante } from '@/services/comprobantes'
import { compararComprobante } from './compararComprobante'
import { participantesDelGrupo } from './deudas'
import { deudasDelGrupo } from './deudasDelGrupo'
import { EquivalenciaPesos } from '@/components/EquivalenciaPesos'
import { useActualizarCotizacionPesos } from '@/hooks/useActualizarCotizacionPesos'

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
  const [registrando, setRegistrando] = useState(false)
  const [comprobante, setComprobante] = useState<string | null>(null)
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
  const alias = deuda && de === usuarioId ? (acreedor?.alias?.trim() ?? '') : ''
  // Lo primero que se pega en el banco o la billetera: el alias si lo hay.
  const datoParaTransferir = alias || email
  const moneda = grupo?.moneda ?? 'ARS'
  const cantidadGastos = gastos.filter((gasto) => !esPago(gasto)).length
  const pagoEnRevision = gastos.some(
    (gasto) =>
      esPago(gasto) &&
      gasto.estado === 'pendiente' &&
      gasto.pagadoPorId === de &&
      receptorDelPago(gasto) === a,
  )
  useActualizarCotizacionPesos(moneda)
  useEffect(() => {
    let vigente = true
    if (!datoParaTransferir || cargando) return
    const que = alias ? 'Alias' : 'E-mail'
    void Clipboard.setStringAsync(datoParaTransferir)
      .then(() => {
        if (vigente) setCopiado(`${que} copiado.`)
      })
      .catch(() => {
        if (vigente)
          setError(
            `No pudimos copiar el ${que.toLowerCase()}. Podés volver a intentarlo.`,
          )
      })
    return () => {
      vigente = false
    }
  }, [datoParaTransferir, alias, cargando])

  async function copiar(valor: string, mensaje: string) {
    try {
      await Clipboard.setStringAsync(valor)
      setCopiado(mensaje)
      setError('')
    } catch {
      setError('No pudimos copiar el dato. Volvé a intentar.')
    }
  }
  async function compartirPorWhatsApp() {
    if (!deuda) return
    const montoTexto = formatearMoneda(deuda.monto, moneda)
    const grupoNombre = grupo?.nombre ?? 'el grupo'
    const destinatarioNombre = acreedor?.nombre ?? 'compañero'
    const aliasDestino = alias
      ? ` al alias ${alias}`
      : email
        ? ` al e-mail ${email}`
        : ''

    const mensaje = `¡Hola ${destinatarioNombre}! Te aviso que te transferí ${montoTexto} por el grupo "${grupoNombre}" en Splitwaisito${aliasDestino}. ¡Avisame cuando te llegue!`

    try {
      await abrirWhatsApp(mensaje)
    } catch {
      setError('No pudimos abrir WhatsApp. Verificá que esté instalado.')
    }
  }
  async function adjuntarComprobante(camara: boolean) {
    setError('')
    try {
      const imagen = await elegirImagen(camara)
      if (imagen) setComprobante(imagen)
    } catch (fallo) {
      setError(
        fallo instanceof Error
          ? fallo.message
          : 'No pudimos abrir la cámara o las fotos.',
      )
    }
  }
  async function registrarConComprobante() {
    if (!deuda || !usuario || !id || !comprobante) return
    const acreedorNombre = acreedor?.nombre ?? 'otro integrante'
    setRegistrando(true)
    setError('')
    try {
      const leidos = await leerComprobante(comprobante)
      const verificacion = leidos
        ? compararComprobante(leidos, {
            acreedorNombre,
            acreedorAlias: alias,
            monto: deuda.monto,
            hoy: new Date().toISOString().slice(0, 10),
          })
        : {
            coincide: false,
            motivos: ['No se pudo verificar el comprobante automáticamente.'],
          }
      await registrarPago(id, {
        deId: usuario.id,
        deNombre: usuario.nombre,
        aId: deuda.a,
        aNombre: acreedorNombre,
        monto: deuda.monto,
        comprobante,
        estado: verificacion.coincide ? 'aprobado' : 'pendiente',
        motivos: verificacion.motivos,
      })
      avisar(
        verificacion.coincide
          ? 'Pago verificado'
          : 'Pago pendiente de aprobación',
        verificacion.coincide
          ? 'El comprobante coincide con la deuda: quedó saldada.'
          : `${acreedorNombre} tiene que revisar el comprobante y aprobarlo. ${verificacion.motivos.join(' ')}`,
      )
      volver()
    } catch {
      setError('No pudimos registrar el pago. Volvé a intentar.')
    } finally {
      setRegistrando(false)
    }
  }
  async function recordarmePagar() {
    if (!deuda) return
    try {
      const programado = await programarRecordatorioDePago(
        'Tenés una deuda pendiente',
        `Le debés ${formatearMoneda(deuda.monto, moneda)} a ${acreedor?.nombre ?? 'otro integrante'} por "${grupo?.nombre ?? 'el grupo'}".`,
      )
      if (programado) {
        const cuando =
          DEMORA_RECORDATORIO_SEGUNDOS < 60
            ? `en ${DEMORA_RECORDATORIO_SEGUNDOS} segundos`
            : 'en una hora'
        setCopiado(`Te vamos a avisar ${cuando}.`)
        setError('')
      } else {
        setError('Activá las notificaciones para recibir el recordatorio.')
      }
    } catch {
      setError('No pudimos programar el recordatorio.')
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
          {formatearMoneda(deuda.monto, moneda)}
        </Text>
        <EquivalenciaPesos monto={deuda.monto} moneda={moneda} />
        <Text className="text-sm text-text-muted">
          {grupo?.nombre} · {cantidadGastos} gasto
          {cantidadGastos === 1 ? '' : 's'}
        </Text>
        {alias ? (
          <Text selectable className="text-text">
            Alias: {alias}
          </Text>
        ) : null}
        {email ? (
          <Text selectable className="text-text">
            E-mail: {email}
          </Text>
        ) : null}
        {!datoParaTransferir && (
          <Text className="text-text-muted">
            No tenemos el alias ni el e-mail del acreedor. Pedíselos antes de
            transferir.
          </Text>
        )}
      </Tarjeta>
      <Mensaje texto={copiado} />
      <Mensaje texto={error} error />
      <Text className="text-sm leading-6 text-text-muted">
        Transferí desde el banco o la billetera que quieras usando el alias o el
        e-mail. Después subí el comprobante para saldar la deuda en el grupo.
      </Text>
      <Boton
        texto="Copiar alias"
        secundario
        disabled={!alias}
        onPress={() => {
          void copiar(alias, 'Alias copiado.')
        }}
      />
      <Boton
        texto="Copiar monto"
        secundario
        onPress={() => {
          void copiar(String(deuda.monto), 'Monto copiado.')
        }}
      />
      {recordatoriosDisponibles && (
        <Boton
          texto="Recordarme pagar más tarde"
          secundario
          onPress={() => {
            void recordarmePagar()
          }}
        />
      )}
      {pagoEnRevision ? (
        <Tarjeta>
          <Text className="font-bold text-text">Pago en revisión</Text>
          <Text className="text-sm text-text-muted">
            Ya subiste un comprobante para esta deuda.{' '}
            {acreedor?.nombre ?? 'El acreedor'} lo tiene que aprobar desde el
            detalle del pago.
          </Text>
        </Tarjeta>
      ) : (
        <Tarjeta>
          <Text className="font-bold text-text">¿Ya transferiste?</Text>
          <Text className="text-sm text-text-muted">
            Subí la captura o la foto del comprobante.
          </Text>
          {comprobante && (
            <Image
              source={{ uri: comprobante }}
              accessibilityLabel="Comprobante de pago"
              className="w-full rounded-xl"
              style={{ height: 360 }}
              resizeMode="contain"
            />
          )}
          <View className="flex-row gap-3">
            <View className="flex-1">
              <Boton
                texto="Tomar foto"
                secundario
                onPress={() => {
                  void adjuntarComprobante(true)
                }}
              />
            </View>
            <View className="flex-1">
              <Boton
                texto="Elegir captura"
                secundario
                onPress={() => {
                  void adjuntarComprobante(false)
                }}
              />
            </View>
          </View>
          <Boton
            texto="Registrar pago con comprobante"
            cargando={registrando}
            disabled={!comprobante || registrando}
            onPress={registrarConComprobante}
          />
        </Tarjeta>
      )}
      <Boton
        texto="Avisar por WhatsApp"
        secundario
        onPress={() => {
          void compartirPorWhatsApp()
        }}
      />
      <Boton texto="Volver al grupo" secundario onPress={volver} />
    </Pantalla>
  )
}
