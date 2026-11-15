import { useState } from 'react'
import { Platform, ScrollView, Switch, View } from 'react-native'
import { Mensaje } from '@/components/Formulario'
import { cancelarRecordatoriosDeuda, recordatoriosDisponibles } from '@/services/recordatorios'
import { useAppStore, type Preferencias } from '@/store/useAppStore'
import { colores } from '@/theme/colores'
import { Texto as Text } from '@/components/Texto'
import { useTraduccion } from '@/i18n/useTraduccion'
import { usePaletaActual } from '@/theme/usePaletaActual'

type ClaveNotificacion =
  | 'notificacionesGenerales'
  | 'notificacionesRecordatorios'
  | 'notificacionesPagos'

const OPCIONES: {
  clave: ClaveNotificacion
  titulo: string
  descripcion: string
}[] = [
  {
    clave: 'notificacionesGenerales',
    titulo: 'Notificaciones generales',
    descripcion: 'Si la apagás, Junti no muestra ninguna notificación.',
  },
  {
    clave: 'notificacionesRecordatorios',
    titulo: 'Recordatorios',
    descripcion: 'Permite programar recordatorios de pago en este dispositivo.',
  },
  {
    clave: 'notificacionesPagos',
    titulo: 'Pagos para revisar',
    descripcion:
      'Te avisa cuando alguien sube un comprobante que tenés que aprobar.',
  },
]

const CAMBIOS_PREFERENCIA: Record<
  ClaveNotificacion,
  (valor: boolean) => Partial<Preferencias>
> = {
  notificacionesGenerales: (valor) => ({ notificacionesGenerales: valor }),
  notificacionesRecordatorios: (valor) => ({
    notificacionesRecordatorios: valor,
  }),
  notificacionesPagos: (valor) => ({ notificacionesPagos: valor }),
}

function FilaNotificacion({
  clave,
  titulo,
  descripcion,
  activa,
  ocupada,
  cambiar,
}: {
  clave: ClaveNotificacion
  titulo: string
  descripcion: string
  activa: boolean
  ocupada: boolean
  cambiar: (clave: ClaveNotificacion, valor: boolean) => void
}) {
  const paleta = usePaletaActual()

  return (
    <View className="flex-row items-center gap-3 border-b border-slate-100 px-4 py-4 last:border-b-0">
      <View className="flex-1 gap-0.5">
        <Text className="text-base font-medium text-text">{titulo}</Text>
        <Text className="text-xs leading-4 text-textMuted">{descripcion}</Text>
      </View>
      <Switch
        value={activa}
        disabled={ocupada && clave === 'notificacionesRecordatorios'}
        onValueChange={(valor) => cambiar(clave, valor)}
        trackColor={{ false: paleta.outline, true: colores.primary }}
        thumbColor="#FFFFFF"
        accessibilityLabel={titulo}
      />
    </View>
  )
}

export function NotificacionesScreen() {
  const preferencias = useAppStore((state) => state.preferencias)
  const actualizarPreferencias = useAppStore((state) => state.actualizarPreferencias)
  const [ocupada, setOcupada] = useState(false)
  const [error, setError] = useState('')
  const t = useTraduccion()

  async function cambiar(clave: ClaveNotificacion, valor: boolean) {
    setError('')
    const apagarRecordatorios =
      !valor &&
      (clave === 'notificacionesRecordatorios' ||
        clave === 'notificacionesGenerales') &&
      recordatoriosDisponibles
    if (apagarRecordatorios) {
      setOcupada(true)
      try {
        await cancelarRecordatoriosDeuda()
        actualizarPreferencias(CAMBIOS_PREFERENCIA[clave](valor))
      } catch {
        setError(t('No pudimos cancelar los recordatorios programados. Volvé a intentar.'))
      } finally {
        setOcupada(false)
      }
      return
    }

    actualizarPreferencias(CAMBIOS_PREFERENCIA[clave](valor))
  }

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{ padding: 16, paddingBottom: 48 }}
    >
      <Mensaje texto={error} error />
      <View className="overflow-hidden rounded-2xl border border-slate-100 bg-surface">
        {OPCIONES.map((opcion) => (
          <FilaNotificacion
            key={opcion.clave}
            {...opcion}
            titulo={t(opcion.titulo)}
            descripcion={t(opcion.descripcion)}
            activa={preferencias[opcion.clave]}
            ocupada={ocupada}
            cambiar={(clave, valor) => {
              void cambiar(clave, valor)
            }}
          />
        ))}
      </View>

      <Text className="mt-4 px-1 text-xs leading-5 text-textMuted">
        {recordatoriosDisponibles
          ? t('Los recordatorios se programan localmente cuando elegís “Recordarme pagar más tarde”. Al desactivarlos se cancelan los recordatorios pendientes de la app.')
          : t('La programación de notificaciones no está disponible en la versión web.')}
        {' '}
        {t('Todas las opciones se guardan en este dispositivo.')}{' '}
        {t('Los pagos para revisar se avisan cuando abrís la app.')}
      </Text>
      {Platform.OS === 'web' && (
        <Text className="mt-2 px-1 text-xs leading-5 text-textMuted">
          {t('Estas preferencias no se sincronizan con otros dispositivos.')}
        </Text>
      )}
    </ScrollView>
  )
}
