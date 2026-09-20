import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../components/Button'
import { Card } from '../../components/Card'
import { Input } from '../../components/Input'
import { signInWithGoogle } from '../../services/auth'
import { isFirebaseAvailable } from '../../services/firebase'
import { useAppStore } from '../../store/useAppStore'

function GoogleLogo() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 shrink-0">
      <path
        d="M21.6 12.23c0-.7-.06-1.37-.18-2.02H12v3.82h5.39a4.62 4.62 0 0 1-2 3.02v2.5h3.24c1.9-1.75 2.97-4.34 2.97-7.32Z"
        fill="#4285F4"
      />
      <path
        d="M12 22c2.7 0 4.96-.9 6.62-2.43l-3.24-2.5c-.9.6-2.06.96-3.38.96-2.6 0-4.8-1.75-5.58-4.1H.87v2.63A10 10 0 0 0 12 22Z"
        fill="#34A853"
      />
      <path
        d="M6.42 19.89A6 6 0 0 1 6 17.1V14.47H2.75A10 10 0 0 0 2 12c0-1.6.38-3.11 1.05-4.47L6.42 10.1A5.98 5.98 0 0 1 6 12c0 .8.14 1.56.42 2.29v5.6Z"
        fill="#FBBC05"
      />
      <path
        d="M12 3.98c1.47 0 2.79.5 3.83 1.49l2.88-2.88A10 10 0 0 0 2.05 7.53L6.42 10.1A6 6 0 0 1 12 3.98Z"
        fill="#EA4335"
      />
    </svg>
  )
}

export function LoginScreen() {
  const navigate = useNavigate()
  const { usuarioActual, iniciarSesion } = useAppStore()
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [alias, setAlias] = useState('')
  const [googleError, setGoogleError] = useState('')

  useEffect(() => {
    if (usuarioActual) {
      navigate('/grupos', { replace: true })
    }
  }, [usuarioActual, navigate])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const nombreLimpio = nombre.trim()
    const emailLimpio = email.trim()
    const aliasLimpio = alias.trim()

    if (!emailLimpio) return

    iniciarSesion(nombreLimpio, emailLimpio, aliasLimpio || nombreLimpio)
    navigate('/grupos', { replace: true })
  }

  async function handleGoogleLogin() {
    setGoogleError('')

    if (!isFirebaseAvailable()) {
      setGoogleError(
        'Firebase no está configurado. Copiá web/.env.example a web/.env.local y pedile las credenciales a Lucas.',
      )
      return
    }

    try {
      const result = await signInWithGoogle()
      const usuario = result.user

      iniciarSesion(
        usuario.displayName || 'Usuario Google',
        usuario.email || 'google@usuario.com',
        usuario.displayName || 'google-user',
        usuario.uid,
        usuario.photoURL,
      )
      navigate('/grupos', { replace: true })
    } catch (error) {
      const message =
        error instanceof Error && error.message
          ? error.message
          : 'No se pudo completar el login con Google todavía.'

      setGoogleError(message)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-xl font-black text-white">
            $
          </div>
          <h1 className="text-2xl font-bold text-text">Splitwaisito</h1>
          <p className="text-sm text-text-muted">
            Ingresá tus datos para gestionar las cuentas del grupo.
          </p>
        </div>

        {usuarioActual ? (
          <div className="space-y-4 text-center">
            <p className="text-sm text-text">
              Sesión iniciada como <strong>{usuarioActual.nombre}</strong> (
              {usuarioActual.email})
            </p>
            <Button className="w-full" onClick={() => navigate('/grupos')}>
              Ir a mis gastos
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              id="nombre"
              label="Tu Nombre"
              placeholder=""
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
            <Input
              id="email"
              label="Tu Correo / Cuenta Mercado Pago"
              type="email"
              placeholder=""
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              id="alias"
              label="Alias para transferencias"
              placeholder=""
              value={alias}
              onChange={(e) => setAlias(e.target.value)}
            />
            <Button type="submit" className="w-full">
              Entrar a la app
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-[11px] uppercase tracking-[0.2em] text-text-muted">
                <span className="bg-white px-2">o</span>
              </div>
            </div>

            <Button
              type="button"
              variant="secondary"
              className="flex w-full items-center justify-center gap-2 border-2 border-slate-300 bg-white text-text shadow-sm hover:border-primary hover:bg-slate-50"
              onClick={handleGoogleLogin}
            >
              <GoogleLogo />
              <span>Iniciar sesión con Google</span>
            </Button>

            {googleError && (
              <p className="text-center text-xs text-text-muted">{googleError}</p>
            )}
          </form>
        )}
      </Card>
    </div>
  )
}