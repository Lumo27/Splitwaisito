import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowRight, Check, Copy, X } from 'lucide-react'
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
  const [montoCopiado, setMontoCopiado] = useState(false)
  const [gastos, setGastos] = useState<GastoFirestore[]>([])

  // El grupo viaja en la URL para reconstruir exactamente los mismos participantes
  // que usa GruposScreen, y así calcular las deudas en el mismo orden.
  const [grupo, setGrupo] = useState<{ nombre: string; miembros: string[] | null } | null>(null)

  useEffect(() => {
    if (!grupoId) return

    let vigente = true

    obtenerGrupoPorId(grupoId)
      .then((grupoCargado) => {
        if (!vigente) return
        setGrupo(
          grupoCargado
            ? { nombre: grupoCargado.nombre, miembros: grupoCargado.miembros }
            : { nombre: '', miembros: null },
        )
      })
      .catch(() => {
        if (vigente) setGrupo({ nombre: '', miembros: null })
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
    () => participantesDelGrupo(grupo?.miembros ?? undefined, usuarioActual, amigos),
    [amigos, grupo, usuarioActual],
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

  // Cuántos gastos del grupo respaldan esta deuda. Una deuda simplificada puede
  // juntar varios gastos, así que se informa el total real en vez de inventar una
  // descripción que no le corresponde a ninguna transferencia.
  const cantidadGastos = gastos.length

  const descripcionGrupo = useMemo(() => {
    const nombre = grupo?.nombre?.trim() ?? ''
    if (!nombre) return ''

    const etiqueta = cantidadGastos === 1 ? '1 gasto' : `${cantidadGastos} gastos`
    return `${nombre} · ${etiqueta}`
  }, [cantidadGastos, grupo?.nombre])

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

  const cerrar = () => navigate('/grupos')

  if (!deuda) {
    return (
      <Modal onCerrar={cerrar} titulo="Saldar deuda">
        <p className="text-base font-bold text-text">No encontramos esa transferencia</p>
        <p className="text-sm text-text-muted">
          Volvé al grupo y elegí una de las transferencias pendientes.
        </p>
        <button
          type="button"
          onClick={cerrar}
          className="mt-2 w-full rounded-xl bg-primary px-4 py-3 text-sm font-bold text-white transition hover:bg-primary-dark"
        >
          Volver al grupo
        </button>
      </Modal>
    )
  }

  return (
    <Modal onCerrar={cerrar} titulo="Saldar deuda">
      {acreedor && (
        <div
          aria-hidden="true"
          className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 text-base font-bold text-purple-700"
        >
          {initials(acreedor.nombre)}
        </div>
      )}

      <p className="text-sm text-text-muted">
        Le debés a <strong className="font-bold text-text">{acreedor?.nombre ?? 'otro participante'}</strong>
      </p>

      <p className="my-1 text-5xl font-black tracking-tight text-red-800">
        {fmt.format(deuda.monto)}
      </p>

      {descripcionGrupo && (
        <p className="text-sm text-text-muted">{descripcionGrupo}</p>
      )}

      {email && emailCopiado && (
        <span className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-primary-light px-3 py-1 text-xs font-semibold text-primary-dark">
          <Check size={13} /> e-mail copiado
        </span>
      )}

      <button
        type="button"
        onClick={() =>
          window.open(MERCADO_PAGO_TRANSFERENCIA, '_blank', 'noopener,noreferrer')
        }
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3.5 text-sm font-bold text-white transition hover:bg-primary-dark"
      >
        <ArrowRight size={16} />
        Abrir &quot;Enviar dinero&quot; (Mercado Pago)
      </button>

      <div className="mt-2 space-y-2">
        <BotonBlanco
          onClick={() => {
            if (!email) return
            navigator.clipboard?.writeText(email).catch(() => undefined)
            setEmailCopiado(true)
          }}
          disabled={!email}
        >
          {email && (
            <Copy size={14} className={emailCopiado ? 'text-primary-dark' : 'text-text-muted'} />
          )}
          {email ? `Copiar e-mail · ${email}` : 'Copiar e-mail'}
        </BotonBlanco>

        <BotonBlanco
          onClick={() => {
            navigator.clipboard?.writeText(String(deuda.monto)).catch(() => undefined)
            setMontoCopiado(true)
          }}
        >
          <Copy size={14} className={montoCopiado ? 'text-primary-dark' : 'text-text-muted'} />
          {montoCopiado ? 'Monto copiado' : 'Copiar monto'}
        </BotonBlanco>
      </div>

      <p className="mt-4 text-[11px] leading-relaxed text-text-muted">
        Pegá el e-mail en &quot;Enviar dinero&quot; dentro de Mercado Pago y confirmá el monto.
        Splitwaisito no mueve tu dinero — te ahorra buscar el dato.
      </p>
    </Modal>
  )
}

function Modal({
  onCerrar,
  titulo,
  children,
}: {
  onCerrar: () => void
  titulo: string
  children: React.ReactNode
}) {
  return (
    <div
      onClick={onCerrar}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 md:items-center md:p-4"
    >
      <div
        onClick={(evento) => evento.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={titulo}
        className="w-full max-w-md rounded-t-[28px] bg-surface p-5 pb-8 shadow-xl md:rounded-[28px] md:p-6 md:pb-8"
      >
        <div className="relative flex items-center justify-center">
          <button
            type="button"
            onClick={onCerrar}
            aria-label="Cerrar"
            className="absolute left-0 rounded-lg p-1 text-text-muted transition hover:bg-slate-100 hover:text-text"
          >
            <X size={20} />
          </button>
          <h1 className="text-base font-bold text-text">{titulo}</h1>
        </div>

        <div className="mt-4 text-center">{children}</div>
      </div>
    </div>
  )
}

function BotonBlanco({
  onClick,
  disabled,
  children,
}: {
  onClick: () => void
  disabled?: boolean
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-text transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {children}
    </button>
  )
}

function initials(nombre: string) {
  return nombre
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((parte) => parte[0]?.toUpperCase())
    .join('')
}

