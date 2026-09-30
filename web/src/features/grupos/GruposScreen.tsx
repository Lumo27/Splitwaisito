import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Plus,
  Utensils,
  Car,
  Home,
  Receipt,
  X,
  Trash2,
  Send,
  ArrowRightLeft,
  Users,
  UserPlus,
} from 'lucide-react'
import { Card } from '../../components/Card'
import { Button } from '../../components/Button'
import { Input } from '../../components/Input'
import { Avatar } from '../../components/Avatar'
import { formatearFecha } from './formatearFecha'
import { useAppStore, type Gasto } from '../../store/useAppStore'
import {
  crearGrupo,
  agregarMiembroAlGrupo,
  eliminarGasto as eliminarGastoFirestore,
  eliminarGrupo,
  guardarGasto,
  obtenerGastosDelGrupo,
  obtenerGruposDelUsuario,
  type GrupoFirestore,
} from '../../services/firestore'
import { calcularBalances, participantesDelGrupo, simplificarDeudas } from './deudas'

const iconoCategoria: Record<Gasto['categoria'], typeof Utensils> = {
  Comida: Utensils,
  Transporte: Car,
  Alojamiento: Home,
  Otro: Receipt,
}

export function GruposScreen() {
  const {
    usuarioActual,
    amigos,
    gastos,
    agregarGasto,
    reemplazarGastos,
    eliminarGasto,
  } = useAppStore()
  const navigate = useNavigate()

  const [modalGastoAbierto, setModalGastoAbierto] = useState(false)
  const [modalGrupoAbierto, setModalGrupoAbierto] = useState(false)
  const [grupos, setGrupos] = useState<GrupoFirestore[]>([])
  const [grupoSeleccionadoId, setGrupoSeleccionadoId] = useState<string | null>(
    null,
  )
  const [nombreGrupo, setNombreGrupo] = useState('')
  const [amigoAAgregarId, setAmigoAAgregarId] = useState('')
  const [errorGrupo, setErrorGrupo] = useState('')

  const [descripcion, setDescripcion] = useState('')
  const [monto, setMonto] = useState('')
  const [categoria, setCategoria] = useState<Gasto['categoria']>('Comida')
  const [pagadoPorId, setPagadoPorId] = useState(
    usuarioActual?.id || 'user-me',
  )

  useEffect(() => {
    if (!usuarioActual) {
      setGrupos([])
      return
    }

    obtenerGruposDelUsuario(usuarioActual.id)
      .then((gruposDelUsuario) => {
        setGrupos(gruposDelUsuario)
        setErrorGrupo('')
        setGrupoSeleccionadoId((grupoActual) => grupoActual ?? gruposDelUsuario[0]?.id ?? null)
      })
      .catch(() => {
        setGrupos([])
        setErrorGrupo('No se pudieron cargar los grupos. Revisá tu sesión de Firebase.')
      })
  }, [usuarioActual])

  useEffect(() => {
    if (!grupoSeleccionadoId) return

    obtenerGastosDelGrupo(grupoSeleccionadoId)
      .then((gastosDelGrupo) =>
        reemplazarGastos(
          gastosDelGrupo.flatMap((gasto) =>
            gasto.id ? [{ ...gasto, id: gasto.id } as Gasto] : [],
          ),
        ),
      )
      .catch(() => undefined)
  }, [grupoSeleccionadoId, reemplazarGastos])

  const total = gastos.reduce((acc, g) => acc + g.monto, 0)
  const grupoSeleccionado = grupos.find(
    (grupo) => grupo.id === grupoSeleccionadoId,
  )
  const amigosDisponibles = amigos.filter(
    (amigo) => !grupoSeleccionado?.miembros.includes(amigo.id),
  )

  const participantes = useMemo(
    () =>
      participantesDelGrupo(
        grupoSeleccionado?.miembros,
        usuarioActual,
        amigos,
      ),
    [amigos, grupoSeleccionado, usuarioActual],
  )

  const balances = useMemo(
    () =>
      calcularBalances(
        participantes,
        gastos.map((gasto) => ({
          id: gasto.id,
          monto: gasto.monto,
          pagadoPorId: gasto.pagadoPorId,
        })),
      ),
    [gastos, participantes],
  )

  const deudasSimplificadas = useMemo(
    () => simplificarDeudas(balances),
    [balances],
  )

  const pagadores = participantes.map((participante) => ({
    id: participante.id,
    nombre:
      participante.id === usuarioActual?.id
        ? `${participante.nombre} (Vos)`
        : participante.nombre,
  }))

  async function handleGuardarGasto(e: React.FormEvent) {
    e.preventDefault()
    const valor = parseFloat(monto)
    if (!descripcion.trim() || isNaN(valor) || valor <= 0) return

    const pagador = pagadores.find((pagadorActual) => pagadorActual.id === pagadoPorId)
    const fecha = new Date().toISOString()

    if (grupoSeleccionadoId && usuarioActual) {
      const gastoGuardado = await guardarGasto(grupoSeleccionadoId, {
        descripcion: descripcion.trim(),
        monto: valor,
        categoria,
        pagadoPorId,
        pagadoPorNombre: pagador?.nombre ?? 'Desconocido',
        fecha,
      })
      reemplazarGastos([gastoGuardado as Gasto, ...gastos])
    } else {
      agregarGasto(descripcion, valor, categoria, pagadoPorId)
    }

    setDescripcion('')
    setMonto('')
    setModalGastoAbierto(false)
  }

  async function handleEliminarGasto(gastoId: string) {
    if (grupoSeleccionadoId) {
      await eliminarGastoFirestore(grupoSeleccionadoId, gastoId)
    }

    eliminarGasto(gastoId)
  }

  async function handleCrearGrupo(e: React.FormEvent) {
    e.preventDefault()
    if (!usuarioActual || !nombreGrupo.trim()) return

    try {
      const grupoCreado = await crearGrupo(nombreGrupo.trim(), usuarioActual.id)
      setGrupos((gruposActuales) => [...gruposActuales, grupoCreado])
      setGrupoSeleccionadoId(grupoCreado.id)
      setNombreGrupo('')
      setErrorGrupo('')
      setModalGrupoAbierto(false)
    } catch {
      setErrorGrupo('No se pudo guardar el grupo en Firebase.')
    }
  }

  async function handleAgregarMiembro() {
    if (!grupoSeleccionado || !amigoAAgregarId) return

    try {
      await agregarMiembroAlGrupo(grupoSeleccionado.id, amigoAAgregarId)
      setGrupos((gruposActuales) =>
        gruposActuales.map((grupo) =>
          grupo.id === grupoSeleccionado.id
            ? {
                ...grupo,
                miembros: [...grupo.miembros, amigoAAgregarId],
              }
            : grupo,
        ),
      )
      setAmigoAAgregarId('')
      setErrorGrupo('')
    } catch {
      setErrorGrupo('No se pudo agregar el integrante al grupo.')
    }
  }

  async function handleEliminarGrupo(grupoId: string) {
    const grupo = grupos.find((grupoActual) => grupoActual.id === grupoId)
    if (!grupo) return

    const confirmado = window.confirm(
      `¿Eliminar el grupo "${grupo.nombre}" y todos sus gastos?`,
    )
    if (!confirmado) return

    try {
      await eliminarGrupo(grupoId)
      const gruposRestantes = grupos.filter((grupoActual) => grupoActual.id !== grupoId)
      setGrupos(gruposRestantes)
      setGrupoSeleccionadoId((grupoActual) =>
        grupoActual === grupoId ? gruposRestantes[0]?.id ?? null : grupoActual,
      )
      if (grupoSeleccionadoId === grupoId) reemplazarGastos([])
      setErrorGrupo('')
    } catch {
      setErrorGrupo('No se pudo eliminar el grupo.')
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-5 p-4 pb-28 sm:p-6 sm:pb-32">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.18em] text-primary-dark">
            Espacio compartido
          </p>
          <h1 className="text-3xl font-black tracking-tight text-text">
            {grupoSeleccionado?.nombre || 'Mis grupos'}
          </h1>
          <p className="mt-1 text-sm text-text-muted">
            Gastos y saldos en un solo lugar
          </p>
        </div>
        <div className="hidden rounded-2xl bg-primary-light px-4 py-3 text-right sm:block">
          <p className="text-[10px] font-bold uppercase tracking-wider text-primary-dark">
            Total
          </p>
          <p className="text-xl font-black text-primary-dark">
            ${total.toLocaleString('es-AR')}
          </p>
        </div>
      </div>

      <Card className="overflow-hidden border-0 bg-white p-0 shadow-md shadow-slate-200/60">
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-4 sm:px-5">
          <div className="flex items-center gap-2 text-text">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-light text-primary-dark">
              <Users size={17} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-text">Tus grupos</h2>
              <p className="text-xs text-text-muted">Elegí dónde estás registrando gastos</p>
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            className="px-2 py-1 text-xs font-bold text-primary-dark"
            onClick={() => setModalGrupoAbierto(true)}
          >
            <Plus size={15} className="mr-1 inline" /> Crear
          </Button>
        </div>

        {grupos.length === 0 ? (
          <div className="space-y-3 px-4 py-5 sm:px-5">
            <p className="text-sm leading-6 text-text-muted">
              Todavía no creaste ningún grupo. Empezá con uno para organizar gastos.
            </p>
            <Button type="button" className="w-full" onClick={() => setModalGrupoAbierto(true)}>
              Crear mi primer grupo
            </Button>
          </div>
        ) : (
          <div className="space-y-2 p-3 sm:p-4">
            {grupos.map((grupo) => (
              <div
                key={grupo.id}
                role="button"
                tabIndex={0}
                onClick={() => setGrupoSeleccionadoId(grupo.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    setGrupoSeleccionadoId(grupo.id)
                  }
                }}
                className={`cursor-pointer rounded-xl border px-3 py-3 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/30 ${
                  grupo.id === grupoSeleccionadoId
                    ? 'border-primary bg-primary-light/70 shadow-sm'
                    : 'border-slate-100 bg-slate-50/70 hover:border-primary-light hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-bold text-text">{grupo.nombre}</p>
                    <p className="mt-1 text-xs text-text-muted">
                      {grupo.miembros.length} miembro{grupo.miembros.length === 1 ? '' : 's'}
                    </p>
                  </div>
                  {grupo.id === grupoSeleccionadoId && (
                    <span className="rounded-full bg-primary px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                      Activo
                    </span>
                  )}
                  <button
                    type="button"
                    title={`Eliminar ${grupo.nombre}`}
                    aria-label={`Eliminar ${grupo.nombre}`}
                    onClick={(e) => {
                      e.stopPropagation()
                      void handleEliminarGrupo(grupo.id)
                    }}
                    className="rounded-lg p-2 text-text-muted transition hover:bg-red-50 hover:text-danger"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
            {grupoSeleccionado && (
              <div className="mt-3 rounded-xl border border-secondary-light bg-secondary-light/40 p-3">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-secondary-dark">
                    Integrantes del grupo
                  </p>
                  <span className="text-xs font-semibold text-text-muted">
                    {participantes.length}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {participantes.map((participante) => (
                    <div
                      key={participante.id}
                      className="flex items-center gap-2 rounded-full bg-white py-1 pl-1 pr-3 shadow-sm"
                    >
                      <Avatar name={participante.nombre} size={25} />
                      <span className="max-w-[130px] truncate text-xs font-semibold text-text">
                        {participante.id === usuarioActual?.id
                          ? `${participante.nombre} (Vos)`
                          : participante.nombre}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {grupoSeleccionado && amigosDisponibles.length > 0 && (
              <div className="mt-3 flex flex-col gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:items-center">
                <UserPlus size={16} className="shrink-0 text-primary-dark" />
                <select
                  value={amigoAAgregarId}
                  onChange={(e) => setAmigoAAgregarId(e.target.value)}
                  className="min-w-0 flex-1 rounded-lg border border-primary-light bg-surface px-2 py-2 text-xs text-text"
                >
                  <option value="">Agregar integrante...</option>
                  {amigosDisponibles.map((amigo) => (
                    <option key={amigo.id} value={amigo.id}>
                      {amigo.nombre}
                    </option>
                  ))}
                </select>
                <Button
                  type="button"
                  variant="secondary"
                  className="px-3 py-2 text-xs"
                  onClick={() => void handleAgregarMiembro()}
                  disabled={!amigoAAgregarId}
                >
                  Agregar
                </Button>
              </div>
            )}
            {errorGrupo && <p className="px-1 text-xs text-danger">{errorGrupo}</p>}
          </div>
        )}
      </Card>

      <Card className="border-0 bg-white p-0 shadow-md shadow-slate-200/60">
        <div className="flex items-center justify-between gap-2 border-b border-slate-100 px-4 py-4 sm:px-5">
          <div className="flex items-center gap-2 text-text">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary-light text-secondary-dark">
              <ArrowRightLeft size={17} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-text">Deudas simplificadas</h2>
              <p className="text-xs text-text-muted">Menos transferencias, más claridad</p>
            </div>
          </div>
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-text-muted">
            {deudasSimplificadas.length} mov.
          </span>
        </div>

        {deudasSimplificadas.length === 0 ? (
          <p className="px-4 py-5 text-sm text-text-muted sm:px-5">
            Todo está saldado. No hay transferencias pendientes.
          </p>
        ) : (
          <div className="space-y-2 p-3 sm:p-4">
            {deudasSimplificadas.map((deuda, index) => {
              const deudorNombre =
                participantes.find((p) => p.id === deuda.de)?.nombre ?? 'Usuario'
              const acreedorNombre =
                participantes.find((p) => p.id === deuda.a)?.nombre ?? 'Usuario'

              return (
                <div
                  key={`${deuda.de}-${deuda.a}-${index}`}
                  className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50/70 px-3 py-3 text-xs"
                >
                  <div>
                    <span className="font-bold text-text">{deudorNombre}</span>
                    <span className="mx-1 text-text-muted">→</span>
                    <span className="font-bold text-text">{acreedorNombre}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-primary-dark">
                      ${deuda.monto.toLocaleString('es-AR')}
                    </span>
                    {deuda.de === usuarioActual?.id && grupoSeleccionadoId && (
                      <button
                        type="button"
                        onClick={() =>
                          navigate(`/saldar/${grupoSeleccionadoId}/${index}`)
                        }
                        className="flex items-center gap-1 rounded-lg bg-secondary-light px-2.5 py-1.5 text-xs font-semibold text-secondary-dark transition hover:bg-secondary hover:text-white"
                      >
                        <Send size={13} />
                        Saldar
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </Card>

      {/* Listado de gastos */}
      {gastos.length === 0 ? (
        <Card className="py-12 text-center text-text-muted">
          <p className="mb-3">No hay ningún gasto registrado todavía.</p>
          <Button onClick={() => setModalGastoAbierto(true)}>
            + Cargar el primer gasto
          </Button>
        </Card>
      ) : (
        <div className="space-y-3">
          {gastos.map((gasto) => {
            const Icon = iconoCategoria[gasto.categoria]

            return (
              <Card key={gasto.id} className="p-3.5 shadow-sm">
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-light text-primary-dark">
                      <Icon size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-text">
                        {gasto.descripcion}
                      </p>
                      <p className="text-xs text-text-muted">
                        Pagó:{' '}
                        <span className="font-medium text-text">
                          {gasto.pagadoPorNombre}
                        </span>{' '}
                        · {formatearFecha(gasto.fecha)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-base font-bold text-text">
                      ${gasto.monto.toLocaleString('es-AR')}
                    </p>
                    <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-text-muted">
                      {gasto.categoria}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-2">
                  <button
                    onClick={() => void handleEliminarGasto(gasto.id)}
                    className="p-1.5 text-text-muted transition hover:text-danger"
                    title="Eliminar gasto"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </Card>
            )
          })}
        </div>
      )}

      {/* Botón flotante (+) */}
      <button
        onClick={() => setModalGastoAbierto(true)}
        className="fixed bottom-20 right-6 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-lg transition hover:bg-primary-dark md:bottom-8"
        title="Nuevo gasto"
      >
        <Plus size={28} />
      </button>

      {/* Modal: Cargar Gasto */}
      {modalGastoAbierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <Card className="w-full max-w-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-text">
                Cargar nuevo gasto
              </h2>
              <button
                onClick={() => setModalGastoAbierto(false)}
                className="text-text-muted hover:text-text"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleGuardarGasto} className="space-y-4">
              <Input
                id="desc"
                label="¿Qué compraste?"
                placeholder="Ej: Asado, Cervezas, Combustible"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                required
              />

              <Input
                id="monto"
                label="Monto total ($)"
                type="number"
                step="any"
                placeholder="0.00"
                value={monto}
                onChange={(e) => setMonto(e.target.value)}
                required
              />

              <div>
                <label className="mb-1 block text-xs font-semibold text-text-muted">
                  ¿Quién lo pagó?
                </label>
                <select
                  value={pagadoPorId}
                  onChange={(e) => setPagadoPorId(e.target.value)}
                  className="w-full rounded-lg border border-primary-light bg-surface px-3 py-2 text-sm text-text outline-none focus:border-primary"
                >
                  {pagadores.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-text-muted">
                  Categoría
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(
                    ['Comida', 'Transporte', 'Alojamiento', 'Otro'] as const
                  ).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategoria(cat)}
                      className={`rounded-lg border px-3 py-2 text-xs font-semibold transition ${
                        categoria === cat
                          ? 'border-primary bg-primary-light text-primary-dark'
                          : 'border-slate-200 text-text hover:bg-slate-50'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <Button type="submit" className="w-full">
                Guardar gasto
              </Button>
            </form>
          </Card>
        </div>
      )}

      {modalGrupoAbierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <Card className="w-full max-w-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-text">Crear nuevo grupo</h2>
              <button
                type="button"
                onClick={() => setModalGrupoAbierto(false)}
                className="text-text-muted hover:text-text"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCrearGrupo} className="space-y-4">
              <Input
                id="nombreGrupo"
                label="Nombre del grupo"
                placeholder="Ej: Viaje, Casa, Trabajo"
                value={nombreGrupo}
                onChange={(e) => setNombreGrupo(e.target.value)}
                required
              />

              <Button type="submit" className="w-full">
                Crear grupo
              </Button>
            </form>
          </Card>
        </div>
      )}
    </div>
  )
}