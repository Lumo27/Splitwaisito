import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useAppStore } from '../../store/useAppStore'
import { Card } from '../../components/Card'
import { Input } from '../../components/Input'
import { Button } from '../../components/Button'
import { FileInput } from '../../components/FileInput'
import { MapPicker } from '../../components/MapPicker'
import { actualizarGasto, guardarGasto, obtenerGastosDelGrupo, obtenerGruposDelUsuario, type GrupoFirestore } from '../../services/firestore'
import { subirFotoTicket } from '../../services/storage'
import { MODO_SEEDS } from '../../services/firebase'
import { CategoryPill } from '../../components/CategoryPill'
import { ParticipantCircle } from '../../components/ParticipantCircle'

// Pantalla /grupos/:id/cargar: mismo formulario que el modal de GruposScreen,
// pero como ruta propia. Usa datos reales del grupo (no mocks).
export function CargarGastoScreen() {
  const navigate = useNavigate()
  const { id: grupoId } = useParams<{ id: string }>()
  const [searchParams] = useSearchParams()
  // Si llega ?gastoId= es el paso 2: el gasto ya se creo en el modal y aca se completa
  const gastoId = searchParams.get('gastoId')
  const { usuarioActual, amigos, gastos, agregarGasto, reemplazarGastos } = useAppStore()
  const gastoACompletar = gastoId ? (gastos.find((g) => g.id === gastoId) ?? null) : null

  const [grupo, setGrupo] = useState<GrupoFirestore | null>(null)
  const [descripcion, setDescripcion] = useState('')
  const [monto, setMonto] = useState('')
  const [pagadoPorId, setPagadoPorId] = useState('')
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [guardado, setGuardado] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [categoria, setCategoria] = useState<'Comida' | 'Transporte' | 'Alojamiento' | 'Otro'>('Comida')
  const [foto, setFoto] = useState<File | null>(null)
  const [ubicacion, setUbicacion] = useState<{ lat: number; lng: number } | null>(null)
  const [resetFoto, setResetFoto] = useState(0)

  // Participantes reales: miembros del grupo cruzados con usuarioActual + amigos
  const participantes = useMemo(() => {
    const conocidos = [
      { id: usuarioActual?.id ?? 'user-me', nombre: usuarioActual?.nombre ?? 'Yo' },
      ...amigos.map((a) => ({ id: a.id, nombre: a.nombre })),
    ]
    if (!grupo) return conocidos
    return grupo.miembros.map(
      (miembroId) => conocidos.find((c) => c.id === miembroId) ?? { id: miembroId, nombre: 'Usuario' },
    )
  }, [amigos, grupo, usuarioActual])

  useEffect(() => {
    if (!usuarioActual || !grupoId) return
    obtenerGruposDelUsuario(usuarioActual.id)
      .then((gs) => setGrupo(gs.find((g) => g.id === grupoId) ?? null))
      .catch(() => setGrupo(null))
    obtenerGastosDelGrupo(grupoId)
      .then((gs) => {
        const conId = gs.flatMap((g) => (g.id ? [{ ...g, id: g.id }] : []))
        reemplazarGastos(conId)

        // Paso 2: prellenar con lo que ya se cargo en el modal de GruposScreen
        const yaCargado = gastoId ? conId.find((g) => g.id === gastoId) : undefined
        if (yaCargado) {
          setDescripcion(yaCargado.descripcion)
          setMonto(String(yaCargado.monto))
          setCategoria(yaCargado.categoria)
          setPagadoPorId(yaCargado.pagadoPorId)
        }
      })
      .catch(() => undefined)
  }, [gastoId, grupoId, reemplazarGastos, usuarioActual])

  useEffect(() => {
    setSelectedIds(participantes.map((p) => p.id))
    if (participantes[0] && !participantes.some((p) => p.id === pagadoPorId)) {
      setPagadoPorId(participantes[0].id)
    }
  }, [participantes, pagadoPorId])

  function toggleMember(id: string) {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  // La foto va a Firebase Storage; en modo seeds (sin backend) la guardamos como data URL
  function leerComoDataUrl(file: File) {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(String(reader.result))
      reader.onerror = () => reject(new Error('No se pudo leer la foto.'))
      reader.readAsDataURL(file)
    })
  }

  async function subirFoto(clave: string, file: File): Promise<string | null> {
    if (MODO_SEEDS) return leerComoDataUrl(file)

    try {
      return await subirFotoTicket(clave, file)
    } catch {
      // Firebase configurado pero Storage fallo: el gasto se guarda igual, sin foto
      return null
    }
  }

  // Ubicacion real del dispositivo (el MapPicker de la app es un mock)
  function usarUbicacionActual() {
    if (!navigator.geolocation) return setError('Tu dispositivo no soporta geolocalización.')
    setError(null)
    navigator.geolocation.getCurrentPosition(
      (pos) => setUbicacion({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setError('No pudimos obtener tu ubicación.'),
    )
  }

  // Guardar el gasto con la firma real del store + Firestore
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    const parsed = Number(monto.replace(',', '.'))

    if (!grupoId) return setError('Sin grupo seleccionado.')
    if (!descripcion.trim()) return setError('La descripción es obligatoria.')
    if (Number.isNaN(parsed) || parsed <= 0) return setError('El monto debe ser mayor que 0.')
    if (!selectedIds.length) return setError('Selecciona al menos un participante.')
    if (!selectedIds.includes(pagadoPorId)) return setError('El pagador debe estar en los participantes.')
    if (!foto) return setError('La foto del ticket es obligatoria.')
    if (foto.size > 2 * 1024 * 1024) return setError('La foto del ticket no puede superar los 2 MB.')
    if (!ubicacion) return setError('Marcá la ubicación del gasto en el mapa.')

    const pagadorNombre =
      participantes.find((p) => p.id === pagadoPorId)?.nombre ?? 'Desconocido'

    // Foto del ticket: se sube (Firebase Storage o data URL en seeds) y se guarda junto al gasto
    const fotoUrlBruta = await subirFoto(`${grupoId}-${Date.now()}`, foto)
    const fotoUrl = fotoUrlBruta ?? undefined
    if (!fotoUrlBruta) setError('No se pudo subir la foto, el gasto se guarda igual.')

    // Todo lo que carga la pantalla viaja en el gasto: reparto, foto del ticket y ubicacion
    const datos = {
      descripcion: descripcion.trim(),
      monto: parsed,
      categoria,
      pagadoPorId,
      pagadoPorNombre: pagadorNombre,
      fotoUrl,
      ubicacion,
      participantes: selectedIds,
    }

    // Paso 2: el gasto ya se creo en el modal de GruposScreen y aca se completa
    if (gastoId) {
      try {
        await actualizarGasto(grupoId, gastoId, datos)
        reemplazarGastos(
          useAppStore.getState().gastos.map((g) => (g.id === gastoId ? { ...g, ...datos } : g)),
        )
        navigate('/grupos')
      } catch {
        setError('No se pudo completar el gasto.')
      }
      return
    }

    try {
      const guardadoFirestore = await guardarGasto(grupoId, {
        ...datos,
        fecha: new Date().toISOString(),
      })
      reemplazarGastos([
        { ...guardadoFirestore, id: guardadoFirestore.id ?? `gasto-${Date.now()}` },
        ...useAppStore.getState().gastos,
      ])
    } catch {

     agregarGasto(datos.descripcion, datos.monto, datos.categoria, datos.pagadoPorId, {
        fotoUrl: datos.fotoUrl,
        ubicacion: datos.ubicacion,
        participantes: datos.participantes,
      })
    }
    setGuardado(true)
    setTimeout(() => setGuardado(false), 2500)

    setDescripcion('')
    setMonto('')
    setSelectedIds(participantes.map((p) => p.id))
    setFoto(null)
    setUbicacion(null)
    setResetFoto((n) => n + 1)
  }

  const categories = [
    { key: 'Alojamiento' as const, label: 'Alojamiento' },
    { key: 'Comida' as const, label: 'Comida' },
    { key: 'Transporte' as const, label: 'Transporte' },
    { key: 'Otro' as const, label: 'Otro' },
  ]

  // Seleccionar quien pago (el pagador siempre queda incluido en el reparto)
  function togglePagador(id: string) {
    setPagadoPorId(id)
    // Asegurar que el pagador este seleccionado como participante
    setSelectedIds((prev) => (prev.includes(id) ? prev : [...prev, id]))
  }

  // Renderizado
  return (
    <div className="mx-auto max-w-md max-h-screen overflow-y-auto p-4 pb-28">
      <button type="button" onClick={() => navigate(-1)} className="mb-4 text-sm text-text-muted">
        Volver
      </button>
      <h1 className="mb-6 text-2xl font-bold">{gastoId ? 'Completar gasto' : 'Cargar gasto'}</h1>

      {/* Paso 2: resumen de lo que ya se cargo en el modal de GruposScreen */}
      {gastoACompletar && (
        <Card className="mb-4">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary-dark">
            Gasto ya cargado
          </p>
          <p className="mt-1 text-lg font-bold text-text">{gastoACompletar.descripcion}</p>
          <p className="text-sm text-text-muted">
            ${gastoACompletar.monto.toLocaleString('es-AR')} · {gastoACompletar.categoria} · pagó{' '}
            {gastoACompletar.pagadoPorNombre}
          </p>
          <p className="mt-2 text-xs text-text-muted">
            Terminá de cargarlo: entre quiénes se divide, la foto del ticket y la ubicación son
            obligatorias.
          </p>
        </Card>
      )}

      <form onSubmit={(e) => void handleSubmit(e)}>
        <Card>
          <div>
            {/* Mostrar monto grande */}
            <div className="mb-6 text-center">
              <p className="text-xs text-gray-500">Monto</p>
              <p className="text-5xl font-bold text-gray-800">
                ARS ${monto ? Number(monto.replace(',', '.')).toLocaleString('es-AR') : '0'}
              </p>
            </div>

            {/* Input: descripcion */}
            <Input
              label="Descripcion"
              type="text"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Ej: Alquiler cabana"
              className="mb-4"
            />

            {/* Input: monto */}
            <Input
              label="Monto"
              type="text"
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
              placeholder="0,00"
              className="mb-4"
            />

            {/* Categorias */}
            <div className="mb-4">
              <label className="mb-2 block text-sm font-semibold">Categoria</label>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <CategoryPill
                    key={cat.key}
                    label={cat.label}
                    selected={categoria === cat.key}
                    onClick={() => setCategoria(cat.key)}
                  />
                ))}
              </div>
            </div>

            {/* Quien pago */}
            <div className="mb-4">
              <label className="mb-2 block text-sm font-semibold">QUIEN PAGO</label>
              <div className="flex flex-wrap gap-2">
                {participantes.map((member) => (
                  <ParticipantCircle
                    key={member.id}
                    id={member.id}
                    name={member.nombre}
                    selected={pagadoPorId === member.id}
                    onToggle={togglePagador}
                  />
                ))}
              </div>
            </div>

            {/* Entre quienes se divide */}
            <div className="mb-4">
              <label className="mb-2 block text-sm font-semibold">ENTRE QUIENES SE DIVIDE</label>
              <div className="flex flex-wrap gap-2">
                {participantes.map((member) => (
                  <ParticipantCircle
                    key={member.id}
                    id={member.id}
                    name={member.nombre}
                    selected={selectedIds.includes(member.id)}
                    onToggle={toggleMember}
                  />
                ))}
              </div>
              {selectedIds.length > 0 && monto && (
                <p className="mt-2 text-xs text-gray-600">
                  Dividido en partes iguales · ${(Number(monto.replace(',', '.')) / selectedIds.length).toFixed(2)} c/u
                </p>
              )}
            </div>

            {/* Foto del ticket */}
            <div className="mb-4">
              <FileInput key={resetFoto} onFile={setFoto} />
              {foto && (
                <p className="mt-1 text-xs text-text-muted">
                  {foto.name} · {(foto.size / 1024).toFixed(0)} KB
                </p>
              )}
            </div>

            {/* Ubicacion en mapa */}
            <div className="mb-4">
              <MapPicker onPick={setUbicacion} />
              {ubicacion && (
                <p className="mt-1 text-xs text-text-muted">
                  {ubicacion.lat.toFixed(4)}, {ubicacion.lng.toFixed(4)}
                </p>
              )}
              <button
                type="button"
                onClick={usarUbicacionActual}
                className="mt-2 text-xs font-semibold text-primary-dark underline"
              >
                Usar mi ubicación actual
              </button>
            </div>

            {/* Mostrar errores */}
            {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

            {/* Mostrar que se guardó */}
            {guardado && <p className="mb-4 text-sm text-green-600">Gasto guardado</p>}

            {/* Botón para guardar */}
            <Button type="submit" className="w-full bg-green-600">
              {gastoId ? 'Guardar y volver a Grupos' : 'Guardar gasto'}
            </Button>
          </div>
        </Card>
      </form>
    </div>
  )
}

