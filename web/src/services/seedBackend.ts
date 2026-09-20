import type { GastoFirestore, GrupoFirestore, UsuarioFirestore } from './firestore'
import type { PerfilAmistad, SolicitudAmistad } from './amistades'

const CLAVE_DB = 'splitwaisito-seeds-db-v1'
const CLAVE_SESION = 'splitwaisito-seeds-sesion-v1'

export const SEED_USUARIO_ID = 'seed-lucas'

type Perfil = Pick<UsuarioFirestore, 'id' | 'nombre' | 'email' | 'alias'>

interface SeedDb {
  usuarios: Record<string, UsuarioFirestore>
  grupos: GrupoFirestore[]
  gastos: Record<string, GastoFirestore[]>
  solicitudes: SolicitudAmistad[]
  amistades: Array<{ miembros: string[]; perfiles: PerfilAmistad[] }>
}

const PERSONAS: Perfil[] = [
  { id: SEED_USUARIO_ID, nombre: 'Lucas', email: 'lucas@example.com', alias: 'lucas.mp' },
  { id: 'seed-cande', nombre: 'Cande', email: 'cande@example.com', alias: 'cande.mp' },
  { id: 'seed-german', nombre: 'Germán', email: 'german@example.com', alias: 'german.mp' },
  { id: 'seed-nahuel', nombre: 'Nahuel', email: 'nahuel@example.com', alias: 'nahuel.mp' },
  { id: 'seed-vladi', nombre: 'Vladi', email: 'vladi@example.com', alias: 'vladi.mp' },
  { id: 'seed-sofi', nombre: 'Sofi', email: 'sofi@example.com', alias: 'sofi.mp' },
]

function persona(id: string) {
  const encontrada = PERSONAS.find((p) => p.id === id)
  if (!encontrada) throw new Error(`Persona de seed inexistente: ${id}`)
  return encontrada
}

function haceDias(dias: number, hora = 20) {
  const fecha = new Date()
  fecha.setDate(fecha.getDate() - dias)
  fecha.setHours(hora, 15, 0, 0)
  return fecha.toISOString()
}

function gasto(
  id: string,
  descripcion: string,
  monto: number,
  categoria: GastoFirestore['categoria'],
  pagadoPorId: string,
  dias: number,
): GastoFirestore {
  return {
    id,
    descripcion,
    monto,
    categoria,
    pagadoPorId,
    pagadoPorNombre: persona(pagadoPorId).nombre,
    fecha: haceDias(dias),
  }
}

function crearSeed(): SeedDb {
  const yo = SEED_USUARIO_ID
  const amigos = PERSONAS.filter((p) => ['seed-cande', 'seed-german', 'seed-nahuel', 'seed-vladi'].includes(p.id))
  const ahora = new Date().toISOString()

  const usuarios: Record<string, UsuarioFirestore> = {}
  for (const p of PERSONAS) {
    usuarios[p.id] = { ...p, fotoUrl: null, descripcion: '', updatedAt: ahora }
  }
  usuarios[yo].descripcion = 'Cuenta de prueba con datos de ejemplo.'
  usuarios[yo].amigos = amigos

  return {
    usuarios,
    grupos: [
      {
        id: 'grupo-bariloche',
        nombre: 'Viaje a Bariloche',
        miembros: [yo, 'seed-cande', 'seed-german', 'seed-nahuel'],
        descripcion: 'Vacaciones de invierno',
        createdAt: haceDias(12),
        updatedAt: haceDias(2),
      },
      {
        id: 'grupo-depto',
        nombre: 'Depto Palermo',
        miembros: [yo, 'seed-german', 'seed-vladi'],
        descripcion: 'Gastos de convivencia',
        createdAt: haceDias(40),
        updatedAt: haceDias(1),
      },
      {
        id: 'grupo-asado',
        nombre: 'Asado del sábado',
        miembros: [yo, 'seed-cande', 'seed-vladi'],
        descripcion: '',
        createdAt: haceDias(5),
        updatedAt: haceDias(4),
      },
    ],
    gastos: {
      'grupo-bariloche': [
        gasto('g-b1', 'Cabaña 4 noches', 240000, 'Alojamiento', yo, 10),
        gasto('g-b2', 'Cena en el centro', 48000, 'Comida', 'seed-cande', 9),
        gasto('g-b3', 'Nafta y peajes', 36000, 'Transporte', 'seed-german', 8),
        gasto('g-b4', 'Supermercado', 62000, 'Comida', 'seed-nahuel', 7),
        gasto('g-b5', 'Excursión Cerro Catedral', 28000, 'Otro', yo, 5),
      ],
      'grupo-depto': [
        gasto('g-d1', 'Alquiler de septiembre', 450000, 'Alojamiento', 'seed-german', 14),
        gasto('g-d2', 'Internet y luz', 18000, 'Otro', yo, 6),
        gasto('g-d3', 'Compras de la semana', 27000, 'Comida', 'seed-vladi', 1),
      ],
      'grupo-asado': [
        gasto('g-a1', 'Carne y chorizos', 32000, 'Comida', yo, 4),
        gasto('g-a2', 'Carbón y bebidas', 12000, 'Otro', 'seed-cande', 4),
      ],
    },
    solicitudes: [
      {
        id: 'solicitud-sofi',
        emisor: persona('seed-sofi'),
        destinatarioEmail: persona(yo).email,
        estado: 'pendiente',
        createdAt: haceDias(1),
      },
    ],
    amistades: amigos.map((amigo) => ({
      miembros: [yo, amigo.id],
      perfiles: [persona(yo), amigo],
    })),
  }
}

function cargar(): SeedDb {
  try {
    const guardado = localStorage.getItem(CLAVE_DB)
    if (guardado) return JSON.parse(guardado) as SeedDb
  } catch {
    // datos corruptos: se regeneran abajo
  }

  const db = crearSeed()
  guardar(db)
  return db
}

function guardar(db: SeedDb) {
  try {
    localStorage.setItem(CLAVE_DB, JSON.stringify(db))
  } catch {
    // sin localStorage los cambios viven solo durante la sesión
  }
}

function idNuevo(prefijo: string) {
  return `${prefijo}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
}

export function restablecerSeeds() {
  try {
    localStorage.removeItem(CLAVE_DB)
  } catch {
    // ignorado
  }
  cargar()
}

// --- sesión (equivalente a Firebase Auth) ---

export interface UsuarioSeed {
  uid: string
  displayName: string
  email: string
  photoURL: string | null
}

type Oyente = (usuario: UsuarioSeed | null) => void
const oyentes = new Set<Oyente>()

function usuarioSesion(): UsuarioSeed | null {
  try {
    if (localStorage.getItem(CLAVE_SESION) !== '1') return null
  } catch {
    return null
  }
  const perfil = persona(SEED_USUARIO_ID)
  return { uid: perfil.id, displayName: perfil.nombre, email: perfil.email, photoURL: null }
}

function notificar() {
  const usuario = usuarioSesion()
  oyentes.forEach((oyente) => oyente(usuario))
}

export function seedIniciarSesion() {
  cargar()
  try {
    localStorage.setItem(CLAVE_SESION, '1')
  } catch {
    // ignorado
  }
  notificar()
  return usuarioSesion() as UsuarioSeed
}

export function seedCerrarSesion() {
  try {
    localStorage.removeItem(CLAVE_SESION)
  } catch {
    // ignorado
  }
  notificar()
}

export function seedSuscribirSesion(oyente: Oyente) {
  oyentes.add(oyente)
  oyente(usuarioSesion())
  return () => {
    oyentes.delete(oyente)
  }
}

// --- usuarios y grupos (equivalente a services/firestore.ts) ---

export function seedUpsertUsuario(usuario: {
  id: string
  nombre: string
  email: string
  alias?: string
  fotoUrl?: string | null
  descripcion?: string
}) {
  const db = cargar()
  const previo = db.usuarios[usuario.id]
  const payload: UsuarioFirestore = {
    ...previo,
    id: usuario.id,
    nombre: usuario.nombre.trim() || 'Usuario',
    email: usuario.email.trim() || 'sin-email@local.com',
    alias: (usuario.alias ?? usuario.nombre).trim() || 'usuario',
    fotoUrl: usuario.fotoUrl ?? null,
    descripcion: usuario.descripcion?.trim() ?? '',
    updatedAt: new Date().toISOString(),
  }
  db.usuarios[usuario.id] = payload
  guardar(db)
  return payload
}

export function seedGetUsuario(id: string) {
  return cargar().usuarios[id] ?? null
}

export function seedGuardarAmigos(usuarioId: string, amigos: Perfil[]) {
  const db = cargar()
  const previo = db.usuarios[usuarioId]
  if (!previo) return
  db.usuarios[usuarioId] = { ...previo, amigos, updatedAt: new Date().toISOString() }
  guardar(db)
}

export function seedCrearGrupo(nombre: string, creadorId: string) {
  const db = cargar()
  const ahora = new Date().toISOString()
  const grupo: GrupoFirestore = {
    id: idNuevo('grupo'),
    nombre: nombre.trim() || 'Nuevo grupo',
    miembros: [creadorId],
    descripcion: '',
    createdAt: ahora,
    updatedAt: ahora,
  }
  db.grupos.push(grupo)
  db.gastos[grupo.id] = []
  guardar(db)
  return grupo
}

export function seedGetGrupo(grupoId: string) {
  return cargar().grupos.find((g) => g.id === grupoId) ?? null
}

export function seedGruposDelUsuario(uid: string) {
  return cargar().grupos.filter((g) => g.miembros.includes(uid))
}

export function seedAgregarMiembro(grupoId: string, uid: string) {
  const db = cargar()
  const grupo = db.grupos.find((g) => g.id === grupoId)
  if (!grupo) return
  if (!grupo.miembros.includes(uid)) grupo.miembros.push(uid)
  grupo.updatedAt = new Date().toISOString()
  guardar(db)
}

export function seedEliminarGrupo(grupoId: string) {
  const db = cargar()
  db.grupos = db.grupos.filter((g) => g.id !== grupoId)
  delete db.gastos[grupoId]
  guardar(db)
}

export function seedGuardarGasto(grupoId: string, nuevo: Omit<GastoFirestore, 'id'>) {
  const db = cargar()
  const guardado: GastoFirestore = {
    ...nuevo,
    id: idNuevo('gasto'),
    fecha: nuevo.fecha || new Date().toISOString(),
  }
  db.gastos[grupoId] = [guardado, ...(db.gastos[grupoId] ?? [])]
  guardar(db)
  return guardado
}

export function seedGastosDelGrupo(grupoId: string) {
  return [...(cargar().gastos[grupoId] ?? [])].sort((a, b) => b.fecha.localeCompare(a.fecha))
}

export function seedEliminarGasto(grupoId: string, gastoId: string) {
  const db = cargar()
  db.gastos[grupoId] = (db.gastos[grupoId] ?? []).filter((g) => g.id !== gastoId)
  guardar(db)
}

// --- amistades (equivalente a services/amistades.ts) ---

export function seedCrearSolicitud(emisor: PerfilAmistad, destinatarioEmail: string) {
  const db = cargar()
  db.solicitudes.push({
    id: idNuevo('solicitud'),
    emisor,
    destinatarioEmail,
    estado: 'pendiente',
    createdAt: new Date().toISOString(),
  })
  guardar(db)
}

export function seedSolicitudesPendientes(email: string) {
  return cargar().solicitudes.filter(
    (s) => s.estado === 'pendiente' && s.destinatarioEmail.toLowerCase() === email.toLowerCase(),
  )
}

export function seedResponderSolicitud(
  solicitud: SolicitudAmistad,
  aceptar: boolean,
  receptor: PerfilAmistad,
) {
  const db = cargar()
  const guardada = db.solicitudes.find((s) => s.id === solicitud.id)
  if (guardada) guardada.estado = aceptar ? 'aceptada' : 'rechazada'

  if (aceptar) {
    const miembros = [solicitud.emisor.id, receptor.id].sort()
    const yaExiste = db.amistades.some((a) => miembros.every((id) => a.miembros.includes(id)))
    if (!yaExiste) {
      db.amistades.push({ miembros, perfiles: [solicitud.emisor, receptor] })
    }
  }
  guardar(db)
}

export function seedAmigosAceptados(uid: string) {
  return cargar().amistades.flatMap((a) =>
    a.miembros.includes(uid) ? a.perfiles.filter((p) => p.id !== uid) : [],
  )
}

export function seedEliminarAmistad(uid: string, amigoId: string) {
  const db = cargar()
  const antes = db.amistades.length
  db.amistades = db.amistades.filter((a) => !(a.miembros.includes(uid) && a.miembros.includes(amigoId)))
  guardar(db)
  return db.amistades.length < antes
}
