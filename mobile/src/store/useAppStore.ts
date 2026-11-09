import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { MODO_SEEDS } from '@/services/firebase'
import type { MonedaCodigo } from '@/theme/moneda'
import type { CotizacionesPesos } from '@/services/equivalenciaPesos'

export interface Preferencias {
  theme: 'light' | 'dark' | 'system'
  fontFamily: 'system' | 'serif' | 'monospace'
  fontSize: 'verySmall' | 'small' | 'normal' | 'large' | 'veryLarge'
  language: 'es' | 'en' | 'pt'
  highContrast: boolean
  reducedMotion: boolean
  accessibilityOptions: {
    respectSystemMotion: boolean
    improveReadability: boolean
    highlightInteractive: boolean
    largeTouchTargets: boolean
  }
  notificacionesGenerales: boolean
  notificacionesCuenta: boolean
  notificacionesRecordatorios: boolean
  notificacionesActividad: boolean
  notificacionesNovedades: boolean
  notificacionesActualizaciones: boolean
  notificacionesAlertas: boolean
  monedaPreferida: 'ARS' | 'USD' | 'BRL'
}

export const PREFERENCIAS_PREDETERMINADAS: Preferencias = {
  theme: 'light',
  fontFamily: 'system',
  fontSize: 'normal',
  language: 'es',
  highContrast: false,
  reducedMotion: false,
  accessibilityOptions: {
    respectSystemMotion: true,
    improveReadability: false,
    highlightInteractive: true,
    largeTouchTargets: false,
  },
  notificacionesGenerales: true,
  notificacionesCuenta: true,
  notificacionesRecordatorios: true,
  notificacionesActividad: true,
  notificacionesNovedades: false,
  notificacionesActualizaciones: true,
  notificacionesAlertas: true,
  monedaPreferida: 'ARS',
}

type PreferenciasParciales = Omit<Partial<Preferencias>, 'accessibilityOptions'> & {
  accessibilityOptions?: Partial<Preferencias['accessibilityOptions']>
}

export function crearPreferenciasPredeterminadas(
  cambios: PreferenciasParciales = {},
): Preferencias {
  return {
    ...PREFERENCIAS_PREDETERMINADAS,
    ...cambios,
    accessibilityOptions: {
      ...PREFERENCIAS_PREDETERMINADAS.accessibilityOptions,
      ...cambios.accessibilityOptions,
    },
  }
}

export interface Usuario {
  id: string
  nombre: string
  email: string
  alias: string
  descripcion?: string
  fotoUrl?: string | null
  moneda?: MonedaCodigo
}

export interface Gasto {
  id: string
  descripcion: string
  monto: number
  categoria: 'Comida' | 'Transporte' | 'Alojamiento' | 'Otro'
  pagadoPorId: string
  pagadoPorNombre: string
  fecha: string
  fotoUrl?: string | null
  ubicacion?: { lat: number; lng: number } | null
  participantes?: string[]
}

interface AppState {
  usuarioActual: Usuario | null
  amigos: Usuario[]
  gastos: Gasto[]
  cotizacionesPesos: CotizacionesPesos
  preferencias: Preferencias
  actualizarPreferencias: (cambios: Partial<Preferencias>) => void
  iniciarSesion: (
    nombre: string,
    email: string,
    alias?: string,
    id?: string,
    fotoUrl?: string | null,
    descripcion?: string,
    moneda?: MonedaCodigo,
  ) => void
  cerrarSesion: () => void
  actualizarDescripcion: (descripcion: string) => void
  actualizarMoneda: (moneda: MonedaCodigo) => void
  reemplazarAmigos: (amigos: Usuario[]) => void
  agregarAmigo: (nombre: string, email: string, alias?: string) => void
  actualizarAlias: (id: string, alias: string) => void
  eliminarAmigo: (id: string) => void
  agregarGasto: (
    descripcion: string,
    monto: number,
    categoria: Gasto['categoria'],
    pagadoPorId: string,
    extras?: { fotoUrl?: string | null; ubicacion?: { lat: number; lng: number } | null; participantes?: string[] }
  ) => void
  reemplazarGastos: (gastos: Gasto[]) => void
  eliminarGasto: (id: string) => void
  guardarCotizacionesPesos: (cotizaciones: CotizacionesPesos) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      usuarioActual: null,
      amigos: [],
      gastos: [],
      cotizacionesPesos: {},
      preferencias: crearPreferenciasPredeterminadas(),

      actualizarPreferencias: (cambios) =>
        set((state) => ({
          preferencias: { ...state.preferencias, ...cambios },
        })),

      iniciarSesion: (nombre, email, alias, id = 'user-me', fotoUrl, descripcion, moneda) =>
        set((state) => ({
          usuarioActual: {
            id,
            nombre: nombre.trim() || 'Mi Usuario',
            email: email.trim(),
            alias: alias?.trim() ?? '',
            descripcion:
              descripcion ??
              (state.usuarioActual?.id === id
                ? state.usuarioActual.descripcion
                : ''),
            fotoUrl:
              fotoUrl ??
              (state.usuarioActual?.id === id
                ? state.usuarioActual.fotoUrl
                : null),
            moneda:
              moneda ??
              (state.usuarioActual?.id === id
                ? state.usuarioActual.moneda
                : 'ARS') ??
              'ARS',
          },
        })),

      cerrarSesion: () => set({ usuarioActual: null }),

      actualizarDescripcion: (descripcion) =>
        set((state) => ({
          usuarioActual: state.usuarioActual
            ? { ...state.usuarioActual, descripcion: descripcion.trim() }
            : null,
        })),

      actualizarMoneda: (moneda) =>
        set((state) => ({
          usuarioActual: state.usuarioActual
            ? { ...state.usuarioActual, moneda }
            : null,
        })),

      reemplazarAmigos: (amigos) => set({ amigos }),

      agregarAmigo: (nombre, email, alias) => {
        const nuevo: Usuario = {
          id: `amigo-${Date.now()}`,
          nombre: nombre.trim() || 'Amigo',
          email: email.trim(),
          alias: (alias ?? nombre).trim() || 'Amigo',
        }
        set((state) => ({ amigos: [...state.amigos, nuevo] }))
      },

      actualizarAlias: (id, alias) =>
        set((state) => {
          const aliasLimpio = alias.trim() || 'Sin alias'

          return {
            usuarioActual:
              state.usuarioActual?.id === id
                ? { ...state.usuarioActual, alias: aliasLimpio }
                : state.usuarioActual,
            amigos: state.amigos.map((amigo) =>
              amigo.id === id ? { ...amigo, alias: aliasLimpio } : amigo,
            ),
          }
        }),

      eliminarAmigo: (id) =>
        set((state) => ({
          amigos: state.amigos.filter((a) => a.id !== id),
        })),

      agregarGasto: (descripcion, monto, categoria, pagadoPorId , extras)=> {
        const { usuarioActual, amigos } = get()
        let pagadoPorNombre = 'Desconocido'

        if (usuarioActual && pagadoPorId === usuarioActual.id) {
          pagadoPorNombre = `${usuarioActual.nombre} (Vos)`
        } else {
          const amigo = amigos.find((a) => a.id === pagadoPorId)
          if (amigo) pagadoPorNombre = amigo.nombre
        }

        const nuevoGasto: Gasto = {
          id: `gasto-${Date.now()}`,
          descripcion: descripcion.trim(),
          monto,
          categoria,
          pagadoPorId,
          pagadoPorNombre,
          fecha: new Date().toLocaleDateString('es-AR', {
            day: '2-digit',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
          }),
          fotoUrl: extras?.fotoUrl ?? null,
          ubicacion: extras?.ubicacion ?? null,
          participantes: extras?.participantes ?? [],
        }

        set((state) => ({ gastos: [nuevoGasto, ...state.gastos] }))
      },

      reemplazarGastos: (gastos) => set({ gastos }),

      eliminarGasto: (id) =>
        set((state) => ({
          gastos: state.gastos.filter((g) => g.id !== id),
        })),

      guardarCotizacionesPesos: (cotizaciones) =>
        set((state) => ({
          cotizacionesPesos: {
            ...state.cotizacionesPesos,
            ...cotizaciones,
          },
        })),
    }),
    {
      name: MODO_SEEDS ? 'splitwaisito-storage-seeds' : 'splitwaisito-storage',
      // En web el persist usa localStorage por defecto; en React Native no
      // existe, así que se guarda en AsyncStorage.
      storage: createJSONStorage(() => AsyncStorage),
      merge: (persistedState, currentState) => {
        const guardado = persistedState as Partial<AppState> | undefined

        return {
          ...currentState,
          ...guardado,
          preferencias: {
            ...currentState.preferencias,
            ...guardado?.preferencias,
            accessibilityOptions: {
              ...currentState.preferencias.accessibilityOptions,
              ...guardado?.preferencias?.accessibilityOptions,
            },
          },
        }
      },
    },
  ),
)