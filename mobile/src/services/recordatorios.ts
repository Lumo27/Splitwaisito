import { Platform } from 'react-native'
import * as Notifications from 'expo-notifications'
import { MODO_SEEDS } from './firebase'

// En modo demo el recordatorio llega a los pocos segundos para poder
// mostrarlo en vivo; con datos reales, una hora después.
export const DEMORA_RECORDATORIO_SEGUNDOS = MODO_SEEDS ? 10 : 60 * 60

export const recordatoriosDisponibles = Platform.OS !== 'web'

if (recordatoriosDisponibles) {
  // Sin esto, iOS y Android no muestran la notificación con la app abierta.
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  })
}

/**
 * Programa una notificación local en este teléfono para acordarse de pagar.
 * Devuelve false si el usuario no dio permiso.
 */
export async function programarRecordatorioDePago(
  titulo: string,
  cuerpo: string,
): Promise<boolean> {
  if (!recordatoriosDisponibles) return false
  const permiso = await Notifications.requestPermissionsAsync()
  if (!permiso.granted) return false

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('recordatorios', {
      name: 'Recordatorios de deudas',
      importance: Notifications.AndroidImportance.HIGH,
    })
  }

  await Notifications.scheduleNotificationAsync({
    content: {
      title: titulo,
      body: cuerpo,
      data: { tipo: 'recordatorio-deuda' },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: DEMORA_RECORDATORIO_SEGUNDOS,
      channelId: 'recordatorios',
    },
  })
  return true
}

export async function cancelarRecordatoriosDeuda(): Promise<void> {
  if (!recordatoriosDisponibles) return

  const programadas = await Notifications.getAllScheduledNotificationsAsync()
  const recordatorios = programadas.filter(
    ({ content }) =>
      content.data?.tipo === 'recordatorio-deuda' ||
      content.title === 'Tenés una deuda pendiente',
  )

  await Promise.all(
    recordatorios.map(({ identifier }) =>
      Notifications.cancelScheduledNotificationAsync(identifier),
    ),
  )
}
