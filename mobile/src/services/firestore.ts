import {
  addDoc,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  runTransaction,
  setDoc,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore'
import { db, MODO_SEEDS } from './firebase'
import * as seed from './seedBackend'
import { MAX_TRANSFERENCIAS_PENDIENTES } from './transferenciasConfig'
import type { MonedaCodigo } from '@/theme/moneda'

export interface UsuarioFirestore {
  id: string
  nombre: string
  email: string
  alias: string
  fotoUrl?: string | null
  descripcion?: string
  moneda?: MonedaCodigo
  amigos?: Pick<UsuarioFirestore, 'id' | 'nombre' | 'email' | 'alias'>[]
  updatedAt?: string
}

export interface GrupoFirestore {
  id: string
  nombre: string
  miembros: string[]
  moneda?: MonedaCodigo
  descripcion?: string
  createdAt?: string
  updatedAt?: string
}

export interface GastoFirestore {
  id?: string
  descripcion: string
  monto: number
  categoria: 'Comida' | 'Transporte' | 'Alojamiento' | 'Otro'
  pagadoPorId: string
  pagadoPorNombre: string
  fecha: string
  tieneFoto?: boolean
  fotoUrl?: string
  ubicacion?: { lat?: number; lng?: number; direccion?: string }
  participantes?: string[]
  /** 'pago' marca una transferencia registrada al saldar una deuda. */
  tipo?: 'gasto' | 'pago'
  /** Solo en pagos. Sin estado (pagos viejos) cuenta como aprobado. */
  estado?: EstadoPago
  /** Solo en pagos: por qué la verificación automática no lo aprobó. */
  motivos?: string[]
}

export type EstadoPago = 'pendiente' | 'aprobado' | 'rechazado'

export interface TransferenciaFirestore {
  id: string
  deudorId: string
  acreedorId: string
  monto: number
  estado: 'pendiente' | 'confirmada' | 'rechazada'
  fechaCreacion: string
  fechaRespuesta?: string
}

export const usuariosRef = db
  ? (collection(db, 'usuarios') as ReturnType<typeof collection>)
  : (null as unknown as ReturnType<typeof collection>)

export const gruposRef = db
  ? (collection(db, 'grupos') as ReturnType<typeof collection>)
  : (null as unknown as ReturnType<typeof collection>)

export async function upsertUsuarioPerfil(usuario: {
  id: string
  nombre: string
  email: string
  alias?: string
  fotoUrl?: string | null
  descripcion?: string
  moneda?: MonedaCodigo
}) {
  if (MODO_SEEDS) return seed.seedUpsertUsuario(usuario)
  if (!db) {
    throw new Error('Firebase no configurado aún.')
  }

  const usuarioRef = doc(db, 'usuarios', usuario.id)
  const payload: UsuarioFirestore = {
    id: usuario.id,
    nombre: usuario.nombre.trim() || 'Usuario',
    email: usuario.email.trim() || 'sin-email@local.com',
    alias: usuario.alias !== undefined ? usuario.alias.trim() : '',
    fotoUrl: usuario.fotoUrl ?? null,
    descripcion: usuario.descripcion?.trim() ?? '',
    moneda: usuario.moneda ?? 'ARS',
    updatedAt: new Date().toISOString(),
  }

  await setDoc(usuarioRef, payload, { merge: true })
  return payload
}

export async function getUsuarioPerfil(id: string) {
  if (MODO_SEEDS) return seed.seedGetUsuario(id)
  if (!db) {
    return null
  }

  const snap = await getDoc(doc(db, 'usuarios', id))
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as UsuarioFirestore) : null
}

export async function guardarAmigosDelUsuario(
  usuarioId: string,
  amigos: Pick<UsuarioFirestore, 'id' | 'nombre' | 'email' | 'alias'>[],
) {
  if (MODO_SEEDS) return seed.seedGuardarAmigos(usuarioId, amigos)
  if (!db) {
    throw new Error('Firebase no configurado aún.')
  }

  await setDoc(
    doc(db, 'usuarios', usuarioId),
    { amigos, updatedAt: new Date().toISOString() },
    { merge: true },
  )
}

export async function crearGrupo(nombre: string, creadorId: string, miembros: string[] = [], moneda: MonedaCodigo = 'ARS') {
  if (MODO_SEEDS) return seed.seedCrearGrupo(nombre, creadorId, miembros, moneda)
  if (!db) {
    throw new Error('Firebase no configurado aún.')
  }

  const payload: Omit<GrupoFirestore, 'id'> = {
    nombre: nombre.trim() || 'Nuevo grupo',
    miembros: [...new Set([creadorId, ...miembros])],
    moneda,
    descripcion: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  const ref = await addDoc(collection(db, 'grupos'), payload)

  return {
    id: ref.id,
    ...payload,
  } as GrupoFirestore
}

export async function obtenerGrupoPorId(grupoId: string) {
  if (MODO_SEEDS) return seed.seedGetGrupo(grupoId)
  if (!db) {
    return null
  }

  const snap = await getDoc(doc(db, 'grupos', grupoId))
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as GrupoFirestore) : null
}

export async function obtenerGruposDelUsuario(uid: string) {
  if (MODO_SEEDS) return seed.seedGruposDelUsuario(uid)
  if (!db) {
    return []
  }

  const gruposQuery = query(
    collection(db, 'grupos'),
    where('miembros', 'array-contains', uid),
  )

  const snap = await getDocs(gruposQuery)

  return snap.docs.map((documento) => ({
    id: documento.id,
    ...documento.data(),
  })) as GrupoFirestore[]
}

export async function agregarMiembroAlGrupo(grupoId: string, uid: string) {
  if (MODO_SEEDS) return seed.seedAgregarMiembro(grupoId, uid)
  if (!db) {
    throw new Error('Firebase no configurado aún.')
  }

  await updateDoc(doc(db, 'grupos', grupoId), {
    miembros: arrayUnion(uid),
    updatedAt: new Date().toISOString(),
  })
}

export async function eliminarGrupo(grupoId: string) {
  if (MODO_SEEDS) return seed.seedEliminarGrupo(grupoId)
  if (!db) {
    throw new Error('Firebase no configurado aún.')
  }

  const gastosSnap = await getDocs(collection(db, 'grupos', grupoId, 'gastos'))
  if (gastosSnap.docs.length > 0) {
    const gastosBatch = writeBatch(db)
    gastosSnap.docs.forEach((gasto) => gastosBatch.delete(gasto.ref))
    await gastosBatch.commit()
  }

  await deleteDoc(doc(db, 'grupos', grupoId))
}

export async function guardarGasto(
  grupoId: string,
  gasto: Omit<GastoFirestore, 'id'>,
) {
  if (MODO_SEEDS) return seed.seedGuardarGasto(grupoId, gasto)
  if (!db) {
    throw new Error('Firebase no configurado aún.')
  }

  const ref = await addDoc(collection(db, 'grupos', grupoId, 'gastos'), {
    ...gasto,
    fecha: gasto.fecha || new Date().toISOString(),
  })

  return {
    id: ref.id,
    ...gasto,
  } as GastoFirestore
}

/**
 * Registra que `de` le transfirió `monto` a `a`. Se guarda como un movimiento
 * pagado por el deudor y repartido solo con el acreedor, así el cálculo de
 * deudas lo compensa sin lógica aparte. El comprobante se guarda como la foto
 * del movimiento. Si la verificación automática no lo aprobó, queda pendiente
 * hasta que quien recibe el dinero lo apruebe.
 */
export async function registrarPago(
  grupoId: string,
  pago: {
    deId: string
    deNombre: string
    aId: string
    aNombre: string
    monto: number
    comprobante?: string
    estado: EstadoPago
    motivos?: string[]
  },
) {
  const guardado = await guardarGasto(grupoId, {
    tipo: 'pago',
    estado: pago.estado,
    ...(pago.motivos?.length ? { motivos: pago.motivos } : {}),
    tieneFoto: Boolean(pago.comprobante),
    descripcion: `Pago de ${pago.deNombre} a ${pago.aNombre}`,
    monto: pago.monto,
    categoria: 'Otro',
    pagadoPorId: pago.deId,
    pagadoPorNombre: pago.deNombre,
    participantes: [pago.aId],
    fecha: new Date().toISOString(),
  })
  if (pago.comprobante && guardado.id) {
    await guardarFotoGasto(grupoId, guardado.id, pago.comprobante)
  }
  return guardado
}

export async function actualizarGasto(
  grupoId: string,
  gastoId: string,
  data: Partial<Omit<GastoFirestore, 'id'>>,
) {
  if (MODO_SEEDS) return seed.seedActualizarGasto(grupoId, gastoId, data)
  if (!db) throw new Error('Firebase no configurado aún.')

  await updateDoc(doc(db, 'grupos', grupoId, 'gastos', gastoId), data)
}

export async function obtenerGastosDelGrupo(grupoId: string) {
  if (MODO_SEEDS) return seed.seedGastosDelGrupo(grupoId)
  if (!db) {
    return []
  }

  const snap = await getDocs(collection(db, 'grupos', grupoId, 'gastos'))

  return snap.docs.map((documento) => ({
    id: documento.id,
    ...documento.data(),
  })) as GastoFirestore[]
}

export async function obtenerTransferenciasDelGrupo(grupoId: string) {
  if (MODO_SEEDS) return seed.seedTransferenciasDelGrupo(grupoId)
  if (!db) {
    throw new Error('Firebase no configurado aún.')
  }

  const snap = await getDocs(
    collection(db, 'grupos', grupoId, 'transferencias'),
  )

  const transferencias = snap.docs.map(
    (documento) =>
      ({
      id: documento.id,
      ...documento.data(),
      }) as TransferenciaFirestore,
  )

  return transferencias.sort((a, b) =>
    b.fechaCreacion.localeCompare(a.fechaCreacion),
  )
}

export async function crearTransferenciaPendiente(
  grupoId: string,
  deudorId: string,
  acreedorId: string,
  monto: number,
) {
  if (MODO_SEEDS) {
    return seed.seedCrearTransferenciaPendiente(
      grupoId,
      deudorId,
      acreedorId,
      monto,
    )
  }
  if (!db) throw new Error('Firebase no configurado aún.')
  if (!Number.isFinite(monto) || monto <= 0 || deudorId === acreedorId) {
    throw new Error('Los datos de la transferencia no son válidos.')
  }
  const firestore = db

  const payload = {
    deudorId,
    acreedorId,
    monto,
    estado: 'pendiente' as const,
    fechaCreacion: new Date().toISOString(),
  }
  const grupoRef = doc(firestore, 'grupos', grupoId)
  const transferenciaRef = doc(
    collection(firestore, 'grupos', grupoId, 'transferencias'),
  )

  await runTransaction(firestore, async (transaccion) => {
    const grupoSnapshot = await transaccion.get(grupoRef)
    if (!grupoSnapshot.exists()) {
      throw new Error('El grupo no está disponible.')
    }

    const grupo = grupoSnapshot.data()
    if (
      !Array.isArray(grupo.miembros) ||
      !grupo.miembros.includes(deudorId) ||
      !grupo.miembros.includes(acreedorId)
    ) {
      throw new Error('Ambas personas deben ser integrantes del grupo.')
    }

    const idsPendientes = grupo.transferenciasPendientes ?? []
    if (!Array.isArray(idsPendientes)) {
      throw new Error('No pudimos validar las transferencias pendientes del grupo.')
    }
    if (idsPendientes.length >= MAX_TRANSFERENCIAS_PENDIENTES) {
      throw new Error(
        'El grupo ya tiene 10 transferencias pendientes. Esperá a que se confirme o rechace alguna.',
      )
    }

    const existentes = await Promise.all(
      idsPendientes.map((transferenciaId: string) =>
        transaccion.get(
          doc(firestore, 'grupos', grupoId, 'transferencias', transferenciaId),
        ),
      ),
    )
    if (
      existentes.some((snapshot) => {
        const transferencia = snapshot.data()
        return (
          snapshot.exists() &&
          transferencia?.estado === 'pendiente' &&
          transferencia.deudorId === deudorId &&
          transferencia.acreedorId === acreedorId
        )
      })
    ) {
      throw new Error('Ya hay una transferencia pendiente para esta deuda.')
    }

    transaccion.update(grupoRef, {
      transferenciasPendientes: [...idsPendientes, transferenciaRef.id],
    })
    transaccion.set(transferenciaRef, payload)
  })

  return { id: transferenciaRef.id, ...payload }
}

export async function responderTransferencia(
  grupoId: string,
  transferenciaId: string,
  usuarioId: string,
  respuesta: 'confirmada' | 'rechazada',
) {
  if (MODO_SEEDS) {
    return seed.seedResponderTransferencia(
      grupoId,
      transferenciaId,
      usuarioId,
      respuesta,
    )
  }
  if (!db) throw new Error('Firebase no configurado aún.')
  const firestore = db

  const referencia = doc(
    firestore,
    'grupos',
    grupoId,
    'transferencias',
    transferenciaId,
  )
  const grupoRef = doc(firestore, 'grupos', grupoId)

  await runTransaction(firestore, async (transaccion) => {
    const [existente, grupoSnapshot] = await Promise.all([
      transaccion.get(referencia),
      transaccion.get(grupoRef),
    ])
    if (!existente.exists()) {
      throw new Error('La solicitud de transferencia ya no está disponible.')
    }
    if (!grupoSnapshot.exists()) {
      throw new Error('El grupo no está disponible.')
    }

    const transferencia = existente.data()
    if (transferencia.acreedorId !== usuarioId) {
      throw new Error('Solo el acreedor puede responder a esta solicitud.')
    }
    if (transferencia.estado !== 'pendiente') {
      throw new Error('Esta solicitud ya fue respondida.')
    }

    const idsPendientes = grupoSnapshot.data().transferenciasPendientes
    if (!Array.isArray(idsPendientes) || !idsPendientes.includes(transferenciaId)) {
      throw new Error('No pudimos actualizar el límite de transferencias del grupo.')
    }

    transaccion.update(referencia, {
      estado: respuesta,
      fechaRespuesta: new Date().toISOString(),
    })
    transaccion.update(grupoRef, {
      transferenciasPendientes: idsPendientes.filter(
        (id: string) => id !== transferenciaId,
      ),
    })
  })
}

export async function eliminarGasto(grupoId: string, gastoId: string) {
  if (MODO_SEEDS) return seed.seedEliminarGasto(grupoId, gastoId)
  if (!db) {
    throw new Error('Firebase no configurado aún.')
  }

  await eliminarFotoGasto(grupoId, gastoId).catch(() => {})
  await deleteDoc(doc(db, 'grupos', grupoId, 'gastos', gastoId))
}

export async function guardarFotoGasto(
  grupoId: string,
  gastoId: string,
  imagenBase64: string,
) {
  if (MODO_SEEDS) {
    return seed.seedGuardarFotoGasto(grupoId, gastoId, imagenBase64)
  }
  if (!db) throw new Error('Firebase no configurado aún.')
  const ref = doc(db, 'grupos', grupoId, 'gastos', gastoId, 'fotos', 'ticket')
  await setDoc(ref, {
    imagenBase64,
    updatedAt: new Date().toISOString(),
  })
}

export async function obtenerFotoGasto(
  grupoId: string,
  gastoId: string,
): Promise<string | null> {
  if (MODO_SEEDS) {
    return seed.seedObtenerFotoGasto(grupoId, gastoId)
  }
  if (!db) return null
  try {
    const ref = doc(db, 'grupos', grupoId, 'gastos', gastoId, 'fotos', 'ticket')
    const snap = await getDoc(ref)
    return snap.exists() ? (snap.data().imagenBase64 as string) : null
  } catch {
    return null
  }
}

export async function eliminarFotoGasto(grupoId: string, gastoId: string) {
  if (MODO_SEEDS) {
    return seed.seedEliminarFotoGasto(grupoId, gastoId)
  }
  if (!db) return
  try {
    const ref = doc(db, 'grupos', grupoId, 'gastos', gastoId, 'fotos', 'ticket')
    await deleteDoc(ref)
  } catch {
    // Silencioso si no existía
  }
}
