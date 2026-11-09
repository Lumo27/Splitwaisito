import { Platform, ScrollView, Switch, Text, View } from 'react-native'
import { useAppStore } from '@/store/useAppStore'
import { colores } from '@/theme/colores'

export function NotificacionesScreen() {
  const preferencias = useAppStore((state) => state.preferencias)
  const actualizarPreferencias = useAppStore((state) => state.actualizarPreferencias)

  if (Platform.OS === 'web') {
    return (
      <View className="flex-1 items-center justify-center bg-background p-8">
        <Text className="text-center text-base text-textMuted">
          Las notificaciones no están disponibles en la versión web.
        </Text>
      </View>
    )
  }

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{ padding: 16, paddingBottom: 48 }}
    >
      <View className="overflow-hidden rounded-2xl border border-slate-100 bg-white">
        {/* Recordatorios de deuda */}
        <View className="flex-row items-center gap-3 border-b border-slate-100 px-4 py-4">
          <View className="flex-1 gap-0.5">
            <Text className="text-base font-medium text-text">Recordatorios de deuda</Text>
            <Text className="text-xs leading-4 text-textMuted">
              Te avisamos cuando tenés deudas pendientes
            </Text>
          </View>
          <Switch
            value={preferencias.notificacionesRecordatorios}
            onValueChange={(valor) =>
              actualizarPreferencias({ notificacionesRecordatorios: valor })
            }
            trackColor={{ false: '#CBD5E1', true: colores.primary }}
            thumbColor="#FFFFFF"
            accessibilityLabel="Recordatorios de deuda"
          />
        </View>

        {/* Actividad del grupo */}
        <View className="flex-row items-center gap-3 px-4 py-4">
          <View className="flex-1 gap-0.5">
            <Text className="text-base font-medium text-text">Actividad del grupo</Text>
            <Text className="text-xs leading-4 text-textMuted">
              Nuevos gastos y pagos en tus grupos
            </Text>
          </View>
          <Switch
            value={preferencias.notificacionesActividad}
            onValueChange={(valor) =>
              actualizarPreferencias({ notificacionesActividad: valor })
            }
            trackColor={{ false: '#CBD5E1', true: colores.primary }}
            thumbColor="#FFFFFF"
            accessibilityLabel="Actividad del grupo"
          />
        </View>
      </View>

      <Text className="mt-4 px-1 text-xs leading-5 text-textMuted">
        Los recordatorios se envían como notificaciones locales en este dispositivo.
      </Text>
    </ScrollView>
  )
}
