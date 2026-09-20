import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore'
import { db } from './firebase'

export interface PerfilAmistad {
  id: string
  nombre: string
  email: string
  alias: string
  descripcion?: string
  fotoUrl?: string | null
}

export interface SolicitudAmistad {
  id: string
  emisor: PerfilAmistad
  destinatarioEmail: string
  estado: 'pendiente' | 'aceptada' | 'rechazada'
  createdAt: string
}

export async function crearSolicitudAmistad(
  emisor: PerfilAmistad,
  destinatarioEmail: string,
) {
  if (!db) throw new Error('Firebase no configurado aún.')

  const email = destinatarioEmail.trim().toLowerCase()
  if (!email || email === emisor.email.toLowerCase()) {
    throw new Error('Ingresá el email de otra persona.')
  }

  await addDoc(collection(db, 'solicitudesAmistad'), {
    emisor,
    emisorId: emisor.id,
    destinatarioEmail: email,
    estado: 'pendiente',
    createdAt: new Date().toISOString(),
  })
}

export async function obtenerSolicitudesAmistad(email: string) {
  if (!db) return []

  const solicitudesQuery = query(
    collection(db, 'solicitudesAmistad'),
    where('destinatarioEmail', '==', email.toLowerCase()),
    where('estado', '==', 'pendiente'),
  )
  const snap = await getDocs(solicitudesQuery)

  return snap.docs.map((solicitud) => ({
    id: solicitud.id,
    ...solicitud.data(),
  })) as SolicitudAmistad[]
}

export async function responderSolicitudAmistad(
  solicitud: SolicitudAmistad,
  aceptar: boolean,
  receptor: PerfilAmistad,
) {
  if (!db) throw new Error('Firebase no configurado aún.')

  await updateDoc(doc(db, 'solicitudesAmistad', solicitud.id), {
    estado: aceptar ? 'aceptada' : 'rechazada',
  })

  if (!aceptar) return

  const perfiles = [solicitud.emisor, receptor].sort((a, b) =>
    a.id.localeCompare(b.id),
  )
  const amistadId = perfiles.map((perfil) => perfil.id).join('__')

  await setDoc(doc(db, 'amistades', amistadId), {
    miembros: perfiles.map((perfil) => perfil.id),
    perfiles,
    createdAt: new Date().toISOString(),
  })
}

export async function obtenerAmigosAceptados(uid: string) {
  if (!db) return []

  const amistadesQuery = query(
    collection(db, 'amistades'),
    where('miembros', 'array-contains', uid),
  )
  const snap = await getDocs(amistadesQuery)

  return snap.docs.flatMap((amistad) => {
    const perfiles = amistad.data().perfiles as PerfilAmistad[] | undefined
    return perfiles?.filter((perfil) => perfil.id !== uid) ?? []
  })
}

export async function eliminarAmistad(uid: string, amigoId: string) {
  if (!db) throw new Error('Firebase no configurado aún.')

  const amistadesQuery = query(
    collection(db, 'amistades'),
    where('miembros', 'array-contains', uid),
  )
  const snap = await getDocs(amistadesQuery)
  const amistad = snap.docs.find((documento) => {
    const miembros = documento.data().miembros
    return Array.isArray(miembros) && miembros.includes(amigoId)
  })

  if (!amistad) {
    return false
  }

  await deleteDoc(amistad.ref)
  return true
}
