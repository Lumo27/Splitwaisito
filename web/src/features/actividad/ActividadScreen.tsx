import { useEffect, useState } from 'react'
import { Mail, Check, X, Trash2 } from 'lucide-react'
import { Card } from '../../components/Card'
import { Input } from '../../components/Input'
import { Button } from '../../components/Button'
import { Avatar } from '../../components/Avatar'
import { useAppStore } from '../../store/useAppStore'
import {
  crearSolicitudAmistad,
  eliminarAmistad,
  obtenerAmigosAceptados,
  obtenerSolicitudesAmistad,
  responderSolicitudAmistad,
  type SolicitudAmistad,
} from '../../services/amistades'

export function ActividadScreen() {
  const {
    usuarioActual,
    amigos,
    reemplazarAmigos,
  } = useAppStore()
  const [emailSolicitud, setEmailSolicitud] = useState('')
  const [solicitudes, setSolicitudes] = useState<SolicitudAmistad[]>([])
  const [mensajeSolicitud, setMensajeSolicitud] = useState('')

  useEffect(() => {
    if (!usuarioActual) return

    Promise.all([
      obtenerAmigosAceptados(usuarioActual.id),
      obtenerSolicitudesAmistad(usuarioActual.email),
    ]).then(([amigosAceptados, solicitudesPendientes]) => {
      if (amigosAceptados.length > 0) reemplazarAmigos(amigosAceptados)
      setSolicitudes(solicitudesPendientes)
    }).catch(() => setMensajeSolicitud('No se pudieron cargar las solicitudes.'))
  }, [reemplazarAmigos, usuarioActual])

  async function handleEnviarSolicitud(e: React.FormEvent) {
    e.preventDefault()
    if (!usuarioActual || !emailSolicitud.trim()) return

    try {
      await crearSolicitudAmistad(
        {
          id: usuarioActual.id,
          nombre: usuarioActual.nombre,
          email: usuarioActual.email,
          alias: usuarioActual.alias,
          descripcion: usuarioActual.descripcion,
          fotoUrl: usuarioActual.fotoUrl,
        },
        emailSolicitud,
      )
      setEmailSolicitud('')
      setMensajeSolicitud('Solicitud enviada.')
    } catch (error) {
      setMensajeSolicitud(
        error instanceof Error ? error.message : 'No se pudo enviar la solicitud.',
      )
    }
  }

  async function handleResponderSolicitud(
    solicitud: SolicitudAmistad,
    aceptar: boolean,
  ) {
    if (!usuarioActual) return

    await responderSolicitudAmistad(
      solicitud,
      aceptar,
      {
        id: usuarioActual.id,
        nombre: usuarioActual.nombre,
        email: usuarioActual.email,
        alias: usuarioActual.alias,
        descripcion: usuarioActual.descripcion,
        fotoUrl: usuarioActual.fotoUrl,
      },
    )

    setSolicitudes((actuales) => actuales.filter((actual) => actual.id !== solicitud.id))

    if (aceptar) {
      const amigosAceptados = await obtenerAmigosAceptados(usuarioActual.id)
      reemplazarAmigos(amigosAceptados)
    }
  }

  async function handleEliminarAmigo(amigoId: string, nombre: string) {
    if (!usuarioActual) return
    if (!window.confirm(`¿Eliminar a ${nombre} de tus amigos?`)) return

    try {
      await eliminarAmistad(usuarioActual.id, amigoId)
      const amigosAceptados = await obtenerAmigosAceptados(usuarioActual.id)
      reemplazarAmigos(amigosAceptados.filter((amigo) => amigo.id !== amigoId))
      setMensajeSolicitud('Amigo eliminado correctamente.')
    } catch (error) {
      setMensajeSolicitud(
        error instanceof Error
          ? error.message
          : 'No se pudo eliminar. Revisá las reglas de Firestore.',
      )
    }
  }

  return (
    <div className="mx-auto max-w-lg p-4">
      <h1 className="mb-1 text-2xl font-bold text-text">Tus Amigos</h1>
      <p className="mb-6 text-sm text-text-muted">
        Cargá a los integrantes del grupo para poder repartir gastos con ellos.
      </p>
      <Card className="mb-5 border-secondary-light bg-secondary-light/30">
        <div className="mb-3">
          <h2 className="text-sm font-bold text-text">Enviar solicitud de amistad</h2>
          <p className="text-xs text-text-muted">La otra persona deberá aceptarla.</p>
        </div>
        <form onSubmit={handleEnviarSolicitud} className="flex gap-2">
          <Input
            id="emailSolicitud"
            label=""
            type="email"
            placeholder="correo@ejemplo.com"
            value={emailSolicitud}
            onChange={(e) => setEmailSolicitud(e.target.value)}
            required
          />
          <Button type="submit" className="mt-0 shrink-0 px-3">
            Enviar
          </Button>
        </form>
        {mensajeSolicitud && <p className="mt-2 text-xs text-secondary-dark">{mensajeSolicitud}</p>}
      </Card>

      {solicitudes.length > 0 && (
        <Card className="mb-5 border-primary-light">
          <h2 className="mb-3 text-sm font-bold text-text">Solicitudes pendientes</h2>
          <div className="space-y-3">
            {solicitudes.map((solicitud) => (
              <div key={solicitud.id} className="flex items-center gap-3 rounded-xl bg-slate-50 p-2">
                <Avatar name={solicitud.emisor.nombre} photoUrl={solicitud.emisor.fotoUrl ?? undefined} size={38} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-text">{solicitud.emisor.nombre}</p>
                  <p className="truncate text-xs text-text-muted">{solicitud.emisor.descripcion || solicitud.emisor.email}</p>
                </div>
                <button type="button" title="Aceptar" onClick={() => void handleResponderSolicitud(solicitud, true)} className="rounded-lg p-2 text-success hover:bg-primary-light">
                  <Check size={18} />
                </button>
                <button type="button" title="Rechazar" onClick={() => void handleResponderSolicitud(solicitud, false)} className="rounded-lg p-2 text-danger hover:bg-red-50">
                  <X size={18} />
                </button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Listado de amistades aceptadas */}
      <div>
        <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-text-muted">
          Amigos aceptados ({amigos.length})
        </h2>

        {amigos.length === 0 ? (
          <Card className="py-8 text-center text-text-muted">
            Todavía no tenés amistades aceptadas.
          </Card>
        ) : (
          <div className="space-y-2">
            {amigos.map((amigo) => (
              <Card
                key={amigo.id}
                className="flex flex-col gap-3 p-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Avatar name={amigo.nombre} photoUrl={amigo.fotoUrl ?? undefined} size={40} />
                    <div>
                      <p className="text-sm font-semibold text-text">
                        {amigo.nombre}
                      </p>
                      <p className="flex items-center gap-1 text-xs text-text-muted">
                        <Mail size={12} /> {amigo.email}
                      </p>
                      {amigo.descripcion && (
                        <p className="mt-1 text-xs text-text-muted">{amigo.descripcion}</p>
                      )}
                    </div>
                  </div>
                  <button
                    type="button"
                    title={`Eliminar a ${amigo.nombre}`}
                    aria-label={`Eliminar a ${amigo.nombre}`}
                    onClick={() => void handleEliminarAmigo(amigo.id, amigo.nombre)}
                    className="rounded-lg p-2 text-text-muted transition hover:bg-red-50 hover:text-danger"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                <div className="rounded-lg bg-slate-50 px-3 py-2 text-xs text-text-muted">
                  Alias: <span className="font-semibold text-text">{amigo.alias}</span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}