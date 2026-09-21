import {
  addDoc,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore'
import { db, MODO_SEEDS } from './firebase'
import * as seed from './seedBackend'

export interface UsuarioFirestore {
  id: string
  nombre: string
  email: string
  alias: string
  fotoUrl?: string | null
  descripcion?: string
  amigos?: Array<Pick<UsuarioFirestore, 'id' | 'nombre' | 'email' | 'alias'>>
  updatedAt?: string
}

export interface GrupoFirestore {
  id: string
  nombre: string
  miembros: string[]
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
    alias: (usuario.alias ?? usuario.nombre).trim() || 'usuario',
    fotoUrl: usuario.fotoUrl ?? null,
    descripcion: usuario.descripcion?.trim() ?? '',
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
  amigos: Array<Pick<UsuarioFirestore, 'id' | 'nombre' | 'email' | 'alias'>>,
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

export async function crearGrupo(nombre: string, creadorId: string) {
  if (MODO_SEEDS) return seed.seedCrearGrupo(nombre, creadorId)
  if (!db) {
    throw new Error('Firebase no configurado aún.')
  }

  const payload: Omit<GrupoFirestore, 'id'> = {
    nombre: nombre.trim() || 'Nuevo grupo',
    miembros: [creadorId],
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

export async function eliminarGasto(grupoId: string, gastoId: string) {
  if (MODO_SEEDS) return seed.seedEliminarGasto(grupoId, gastoId)
  if (!db) {
    throw new Error('Firebase no configurado aún.')
  }

  await deleteDoc(doc(db, 'grupos', grupoId, 'gastos', gastoId))
}
