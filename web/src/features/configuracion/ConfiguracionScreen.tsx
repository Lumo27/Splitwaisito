import { LogOut, Settings } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../components/Button'
import { Card } from '../../components/Card'
import { signOutUser } from '../../services/auth'
import { useAppStore } from '../../store/useAppStore'

export function ConfiguracionScreen() {
  const navigate = useNavigate()
  const { cerrarSesion } = useAppStore()

  async function handleLogout() {
    try {
      await signOutUser()
    } catch {
      // La sesión local también debe cerrarse si Firebase no responde.
    }

    cerrarSesion()
    navigate('/login', { replace: true })
  }

  return (
    <div className="mx-auto max-w-lg space-y-5 p-4 sm:p-6">
      <div>
        <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.18em] text-primary-dark">
          Cuenta
        </p>
        <h1 className="text-3xl font-black tracking-tight text-text">
          Configuración
        </h1>
        <p className="mt-1 text-sm text-text-muted">
          Administrá tu sesión y las preferencias de la app.
        </p>
      </div>

      <Card className="border-0 p-0 shadow-md shadow-slate-200/60">
        <div className="flex items-center gap-3 border-b border-slate-100 p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-light text-primary-dark">
            <Settings size={19} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-text">Sesión</h2>
            <p className="text-xs text-text-muted">
              Cerrá tu cuenta en este dispositivo.
            </p>
          </div>
        </div>

        <div className="p-4">
          <Button
            type="button"
            variant="ghost"
            className="flex w-full items-center justify-center gap-2 border border-red-100 text-danger hover:bg-red-50"
            onClick={() => void handleLogout()}
          >
            <LogOut size={17} />
            Cerrar sesión
          </Button>
        </div>
      </Card>
    </div>
  )
}
