import { Navigate, Route, Routes } from 'react-router-dom'
import { TabsLayout } from './components/TabsLayout'
import { LoginScreen } from './features/auth/LoginScreen'
import { GruposScreen } from './features/grupos/GruposScreen'
import { ActividadScreen } from './features/actividad/ActividadScreen'
import { PerfilScreen } from './features/perfil/PerfilScreen'
import { GastosScreen } from './features/gastos/GastosScreen'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginScreen />} />
      <Route element={<TabsLayout />}>
        <Route path="/grupos" element={<GruposScreen />} />
        <Route path="/actividad" element={<ActividadScreen />} />
        <Route path="/gastos" element={<GastosScreen />} />
        <Route path="/perfil" element={<PerfilScreen />} />
      </Route>
      <Route path="*" element={<Navigate to="/grupos" replace />} />
    </Routes>
  )
}
