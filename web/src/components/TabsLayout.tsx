import { Receipt, UserPlus, User, Settings } from 'lucide-react'
import { NavLink, Outlet } from 'react-router-dom'

const tabs = [
  { to: '/grupos', label: 'Gastos', Icon: Receipt },
  { to: '/actividad', label: 'Amigos', Icon: UserPlus },
  { to: '/perfil', label: 'Perfil', Icon: User },
]

function tabClasses(isActive: boolean) {
  return `flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
    isActive
      ? 'bg-primary-light text-primary-dark font-bold'
      : 'text-text-muted hover:bg-primary-light/60'
  }`
}

export function TabsLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-background md:flex-row">
      {/* Sidebar Desktop */}
      <nav className="hidden w-56 shrink-0 flex-col border-r border-primary-light bg-surface p-4 md:flex">
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary font-bold text-white">
              $
            </div>
            <span className="font-bold text-text">Splitwaisito</span>
          </div>
          <div className="flex flex-col gap-1">
            {tabs.map(({ to, label, Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) => tabClasses(isActive)}
              >
                <Icon size={20} />
                {label}
              </NavLink>
            ))}
            <NavLink
              to="/configuracion"
              className={({ isActive }) => tabClasses(isActive)}
            >
              <Settings size={18} />
              Configuración
            </NavLink>
          </div>
        </div>
      </nav>

      {/* Contenido Principal */}
      <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
        <Outlet />
      </main>

      {/* Barra Inferior Mobile */}
      <nav className="fixed inset-x-0 bottom-0 z-40 flex justify-around border-t border-primary-light bg-surface p-2 md:hidden">
        {tabs.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 rounded-lg px-3 py-1 text-xs font-medium ${
                isActive ? 'font-bold text-primary-dark' : 'text-text-muted'
              }`
            }
          >
            <Icon size={22} />
            {label}
          </NavLink>
        ))}
        <NavLink
          to="/configuracion"
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 rounded-lg px-3 py-1 text-xs font-medium ${
              isActive ? 'font-bold text-primary-dark' : 'text-text-muted'
            }`
          }
        >
          <Settings size={22} />
          Config.
        </NavLink>
      </nav>
    </div>
  )
}