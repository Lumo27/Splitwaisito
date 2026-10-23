import { Tabs } from 'expo-router'
import { Receipt, Settings, User, UserPlus } from 'lucide-react-native'

import { colores } from '@/theme/colores'

// Navegación principal de las pantallas móviles.
export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colores.primaryDark,
        tabBarInactiveTintColor: colores.textMuted,
        tabBarStyle: {
          backgroundColor: colores.surface,
          borderTopColor: '#E4ECE9',
          paddingTop: 8,
        },
        headerTitleStyle: { color: colores.text, fontWeight: '700' },
        headerShadowVisible: false,
        tabBarActiveBackgroundColor: colores.primaryLight,
        tabBarItemStyle: { borderRadius: 18, marginHorizontal: 3 },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        sceneStyle: { backgroundColor: colores.background },
      }}
    >
      <Tabs.Screen
        name="grupos"
        options={{
          title: 'Grupos',
          tabBarIcon: ({ color }) => <Receipt color={color} size={22} />,
        }}
      />
      <Tabs.Screen
        name="actividad"
        options={{
          title: 'Amigos',
          tabBarIcon: ({ color }) => <UserPlus color={color} size={22} />,
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color }) => <User color={color} size={22} />,
        }}
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
