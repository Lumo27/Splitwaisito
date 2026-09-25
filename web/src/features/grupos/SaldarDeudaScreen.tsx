import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Check, ExternalLink } from 'lucide-react'
import { Avatar } from '../../components/Avatar'
import { Button } from '../../components/Button'
import { Card } from '../../components/Card'
import { obtenerGrupoPorId, obtenerGastosDelGrupo, type GastoFirestore } from '../../services/firestore'
import { useAppStore } from '../../store/useAppStore'
import {
  calcularBalances,
  participantesDelGrupo,
  simplificarDeudas,
} from './deudas'

const MERCADO_PAGO_TRANSFERENCIA = 'https://www.mercadopago.com.ar/money-transfer'

export function SaldarDeudaScreen() {
  const { grupoId, index } = useParams<{ grupoId: string; index: string }>()
  const navigate = useNavigate()
  const { amigos, usuarioActual } = useAppStore()
  const [emailCopiado, setEmailCopiado] = useState(false)
  const [gastos, setGastos] = useState<GastoFirestore[]>([])

  // El grupo viaja en la URL para reconstruir exactamente los mismos participantes
  // que usa GruposScreen, y así calcular las deudas en el mismo orden.
  const [miembros, setMiembros] = useState<string[] | null>(null)

  useEffect(() => {
    if (!grupoId) return

    let vigente = true

    obtenerGrupoPorId(grupoId)
      .then((grupo) => {
        if (!vigente) return
        setMiembros(grupo?.miembros ?? null)
      })
      .catch(() => {
        if (vigente) setMiembros(null)
      })

    obtenerGastosDelGrupo(grupoId)
      .then((gastosDelGrupo) => {
        if (vigente) setGastos(gastosDelGrupo)
      })
      .catch(() => {
        if (vigente) setGastos([])
      })

    return () => {
      vigente = false
    }
  }, [grupoId])

  const participantes = useMemo(
    () => participantesDelGrupo(miembros ?? undefined, usuarioActual, amigos),
    [amigos, miembros, usuarioActual],
  )

  const deudas = useMemo(
    () =>
      simplificarDeudas(
        calcularBalances(
          participantes,
          gastos.map((gasto) => ({
            id: gasto.id ?? '',
            monto: gasto.monto,
            pagadoPorId: gasto.pagadoPorId,
          })),
        ),
      ),
    [gastos, participantes],
  )

  const indice = Number(index)
  const deuda = Number.isInteger(indice) && indice >= 0 ? deudas[indice] : undefined

  const acreedor = deuda
    ? (amigos.find((amigo) => amigo.id === deuda.a) ??
      (deuda.a === usuarioActual?.id ? usuarioActual : undefined))
    : undefined

  const email = acreedor?.email?.trim() ?? ''

  // Al entrar se copia el e-mail del acreedor, como pide la especificación.
  useEffect(() => {
    if (!email) return

    let vigente = true
    navigator.clipboard?.writeText(email).catch(() => undefined)

    const timer = setTimeout(() => {
      if (vigente) setEmailCopiado(true)
    }, 0)

    return () => {
      vigente = false
      clearTimeout(timer)
    }
  }, [email])

  const fmt = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
  })

  if (!deuda) {
    return (
      <div className="mx-auto max-w-lg space-y-5 p-4">
        <Encabezado onVolver={() => navigate(-1)} />
        <Card className="space-y-4 py-10 text-center">
          <p className="font-bold text-text">No encontramos esa transferencia</p>
          <p className="text-sm text-text-muted">
            Volvé al grupo y elegí una de las transferencias pendientes.
          </p>
          <Button type="button" className="w-full" onClick={() => navigate(-1)}>
            Volver al grupo
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-lg space-y-5 p-4">
      <Encabezado onVolver={() => navigate(-1)} />

      <Card className="space-y-4 p-6 text-center">
        {acreedor && (
          <div className="mx-auto w-fit rounded-full bg-white p-1 shadow-sm">
            <Avatar name={acreedor.nombre} photoUrl={acreedor.fotoUrl ?? undefined} size={72} />
          </div>
        )}

        <p className="text-sm text-text-muted">
          Le debés a <strong className="text-text">{acreedor?.nombre ?? 'otro participante'}</strong>
        </p>

        <p className="my-1 text-4xl font-black text-danger">{fmt.format(deuda.monto)}</p>

        {email ? (
          <p className="flex items-center justify-center gap-1.5 text-xs text-text-muted">
            {emailCopiado && <Check size={14} className="text-success" />}
            {emailCopiado ? `E-mail copiado: ${email}` : email}
          </p>
        ) : (
          <p className="text-xs text-text-muted">
            Este participante todavía no cargó un e-mail para recibir la transferencia.
          </p>
        )}

        <Button
          type="button"
          variant="primary"
          className="w-full justify-center gap-2 py-3 text-base"
          onClick={() =>
            window.open(MERCADO_PAGO_TRANSFERENCIA, '_blank', 'noopener,noreferrer')
          }
        >
          Abrir Mercado Pago <ExternalLink size={16} />
        </Button>
      </Card>
    </div>
  )
}

function Encabezado({ onVolver }: { onVolver: () => void }) {
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={onVolver}
        aria-label="Volver"
        className="rounded-full bg-white p-2 shadow-sm"
      >
        <ArrowLeft size={20} />
      </button>
      <h1 className="text-lg font-bold">Saldar deuda</h1>
    </div>
  )
}
