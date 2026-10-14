import { useState } from 'react'
import { Bell, Check, Pencil, UserRound } from 'lucide-react'
import { Avatar } from '../../components/Avatar'
import { Button } from '../../components/Button'
import { Card } from '../../components/Card'
import { Input } from '../../components/Input'

export function PerfilScreen() {
  const [name, setName] = useState('Usuario')
  const [email, setEmail] = useState('')
  const [city, setCity] = useState('')
  const [editing, setEditing] = useState(false)
  const [notifications, setNotifications] = useState(true)

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-4 pb-8 sm:p-6">
      <header>
        <p className="text-sm font-medium text-primary-dark">Tu cuenta</p>
        <h1 className="mt-1 text-2xl font-bold text-text">Perfil</h1>
      </header>

      <Card>
        <div className="flex flex-wrap items-center gap-4">
          <Avatar name={name} />
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-xl font-semibold text-text">{name}</h2>
            <p className="truncate text-sm text-text-muted">{email || 'Completá tus datos de contacto'}</p>
            {city && <p className="mt-1 text-sm text-text-muted">{city}</p>}
          </div>
          <Button type="button" variant="ghost" className="flex items-center gap-2" onClick={() => setEditing((value) => !value)}>
            {editing ? <Check size={17} /> : <Pencil size={17} />}{editing ? 'Listo' : 'Editar'}
          </Button>
        </div>

        {editing && (
          <form className="mt-5 grid gap-4 border-t border-primary-light pt-5 sm:grid-cols-2" onSubmit={(event) => { event.preventDefault(); setEditing(false) }}>
            <Input id="profile-name" label="Nombre" value={name} onChange={(event) => setName(event.target.value)} required />
            <Input id="profile-email" label="Correo electrónico" type="email" placeholder="nombre@correo.com" value={email} onChange={(event) => setEmail(event.target.value)} />
            <Input id="profile-city" label="Ciudad" placeholder="Tu ciudad" value={city} onChange={(event) => setCity(event.target.value)} />
            <div className="flex items-end"><Button type="submit" className="w-full">Guardar cambios</Button></div>
          </form>
        )}
      </Card>

      <section aria-label="Resumen de cuenta" className="grid gap-3 sm:grid-cols-3">
        <Card className="!p-4"><p className="text-sm text-text-muted">Grupos</p><p className="mt-1 text-lg font-semibold text-text">Por configurar</p></Card>
        <Card className="!p-4"><p className="text-sm text-text-muted">Gastos cargados</p><p className="mt-1 text-lg font-semibold text-text">Datos locales</p></Card>
        <Card className="!p-4"><p className="text-sm text-text-muted">Moneda preferida</p><p className="mt-1 text-2xl font-semibold text-text">ARS</p></Card>
      </section>

      <Card>
        <div className="mb-4 flex items-center gap-2">
          <UserRound className="text-primary-dark" size={19} />
          <h2 className="font-semibold text-text">Datos personales</h2>
        </div>
        <dl className="grid gap-4 sm:grid-cols-2">
          <div><dt className="text-sm text-text-muted">Nombre</dt><dd className="mt-1 text-text">{name}</dd></div>
          <div><dt className="text-sm text-text-muted">Correo</dt><dd className="mt-1 text-text">{email || 'Sin agregar'}</dd></div>
          <div><dt className="text-sm text-text-muted">Ciudad</dt><dd className="mt-1 text-text">{city || 'Sin agregar'}</dd></div>
          <div><dt className="text-sm text-text-muted">Moneda</dt><dd className="mt-1 text-text">Peso argentino (ARS)</dd></div>
        </dl>
      </Card>

      <Card>
        <label className="flex cursor-pointer items-center justify-between gap-4">
          <span className="flex items-center gap-3">
            <Bell className="text-primary-dark" size={19} />
            <span><span className="block font-medium text-text">Notificaciones</span><span className="text-sm text-text-muted">Avisos sobre actividad de tus grupos</span></span>
          </span>
          <input className="size-5 accent-primary" type="checkbox" checked={notifications} onChange={(event) => setNotifications(event.target.checked)} />
        </label>
      </Card>
    </div>
  )
}
