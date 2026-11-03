import { Tabs } from 'expo-router'
import { Receipt, Settings, User, UserPlus } from 'lucide-react-native'

import { colores } from '@/theme/colores'

// Mismas tabs y etiquetas que web/src/components/TabsLayout.tsx.
export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colores.primaryDark,
        tabBarInactiveTintColor: colores.textMuted,
        tabBarStyle: { backgroundColor: colores.surface, borderTopColor: colores.primaryLight },
        headerTitleStyle: { color: colores.text },
        sceneStyle: { backgroundColor: colores.background },
      }}
    >
      <Tabs.Screen
        name="grupos"
        options={{ title: 'Gastos', tabBarIcon: ({ color }) => <Receipt color={color} size={22} /> }}
      />
      <Tabs.Screen
        name="actividad"
        options={{ title: 'Amigos', tabBarIcon: ({ color }) => <UserPlus color={color} size={22} /> }}
      />
      <Tabs.Screen
        name="perfil"
        options={{ title: 'Perfil', tabBarIcon: ({ color }) => <User color={color} size={22} /> }}
      />
      <Tabs.Screen
        name="configuracion"
        options={{
          title: 'Configuración',
          tabBarIcon: ({ color }) => <Settings color={color} size={22} />,
        }}
      />
    </Tabs>
  )
}
