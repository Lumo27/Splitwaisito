import { useEffect, useState } from 'react'
import { Avatar } from '../../components/Avatar'
import { Card } from '../../components/Card'
import { Input } from '../../components/Input'
import { Button } from '../../components/Button'
import { useAppStore } from '../../store/useAppStore'
import { upsertUsuarioPerfil } from '../../services/firestore'

export function PerfilScreen() {
  const { usuarioActual, actualizarAlias, actualizarDescripcion } = useAppStore()
  const [alias, setAlias] = useState(usuarioActual?.alias || '')
  const [descripcion, setDescripcion] = useState(usuarioActual?.descripcion || '')
  const [guardado, setGuardado] = useState(false)

  useEffect(() => {
    setAlias(usuarioActual?.alias || '')
    setDescripcion(usuarioActual?.descripcion || '')
  }, [usuarioActual])

  async function handleGuardarPerfil(e: React.FormEvent) {
    e.preventDefault()
    if (!usuarioActual) return

    actualizarAlias(usuarioActual.id, alias)
    actualizarDescripcion(descripcion)
    await upsertUsuarioPerfil({
      ...usuarioActual,
      alias: alias.trim(),
      descripcion: descripcion.trim(),
      fotoUrl: usuarioActual.fotoUrl,
    })
    setGuardado(true)
    setTimeout(() => setGuardado(false), 2500)
  }

  if (!usuarioActual) return null

  return (
    <div className="mx-auto max-w-lg p-4">
      <h1 className="mb-4 text-2xl font-bold text-text">Perfil</h1>

      <Card className="mb-5 p-4">
        <div className="flex items-center gap-3">
          <Avatar name={usuarioActual.nombre} photoUrl={usuarioActual.fotoUrl ?? undefined} size={52} />
          <div>
            <p className="text-lg font-bold text-text">{usuarioActual.nombre}</p>
            <p className="text-sm text-text-muted">{usuarioActual.email}</p>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <form onSubmit={handleGuardarPerfil} className="space-y-4">
          <Input
            id="aliasPerfil"
            label="Alias para transferencias"
            placeholder="Ej: german123"
            value={alias}
            onChange={(e) => setAlias(e.target.value)}
          />
          <div>
            <label htmlFor="descripcionPerfil" className="mb-1 block text-xs font-semibold text-text-muted">
              Descripción breve
            </label>
            <textarea
              id="descripcionPerfil"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              maxLength={160}
              rows={3}
              placeholder="Contá algo breve sobre vos"
              className="w-full resize-none rounded-lg border border-primary-light bg-surface px-3 py-2 text-sm text-text outline-none focus:border-primary"
            />
            <p className="mt-1 text-right text-[11px] text-text-muted">
              {descripcion.length}/160
            </p>
          </div>
          <Button type="submit" className="w-full">
            Guardar cambios
          </Button>
          {guardado && <p className="text-center text-xs font-semibold text-success">Perfil guardado</p>}
        </form>
      </Card>
    </div>
  )
}
