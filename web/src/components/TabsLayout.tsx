import { Users, Activity, User, ChartPie } from 'lucide-react'
import { NavLink, Outlet } from 'react-router-dom'

const tabs = [
  { to: '/grupos', label: 'Grupos', Icon: Users },
  { to: '/actividad', label: 'Actividad', Icon: Activity },
  { to: '/gastos', label: 'Gastos', Icon: ChartPie },
  { to: '/perfil', label: 'Perfil', Icon: User },
]

function tabClasses(isActive: boolean) {
  return `flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
    isActive ? 'bg-primary-light text-primary-dark' : 'text-text-muted hover:bg-primary-light/60'
  }`
}

export function TabsLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-background md:flex-row">
      <nav className="hidden w-56 shrink-0 flex-col gap-1 border-r border-primary-light bg-surface p-4 md:flex">
        {tabs.map(({ to, label, Icon }) => (
          <NavLink key={to} to={to} className={({ isActive }) => tabClasses(isActive)}>
            <Icon size={20} />
            {label}
          </NavLink>
        ))}
      </nav>

      <main className="flex-1 overflow-y-auto pb-16 md:pb-0">
        <Outlet />
      </main>

      <nav className="fixed inset-x-0 bottom-0 flex justify-around border-t border-primary-light bg-surface p-2 md:hidden">
        {tabs.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `flex flex-col items-center gap-0.5 rounded-lg px-3 py-1 text-xs font-medium ${
              isActive ? 'text-primary-dark' : 'text-text-muted'
            }`}
          >
            <Icon size={22} />
            {label}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
