import { createContext, useContext } from 'react'

export type EstadoTerminos =
  | 'sin-sesion'
  | 'comprobando'
  | 'requerido'
  | 'aceptado'
  | 'error'

export interface TerminosContextValue {
  estado: EstadoTerminos
  error: string
  aceptar: () => Promise<void>
  reintentar: () => Promise<void>
}

export const TerminosContext =
  createContext<TerminosContextValue | null>(null)

export function useTerminosAcceptance() {
  const contexto = useContext(TerminosContext)
  if (!contexto) {
    throw new Error('useTerminosAcceptance debe usarse dentro de AuthBootstrap.')
  }
  return contexto
}
