import { useCallback } from 'react'
import { useAppStore } from '@/store/useAppStore'
import { traducirTexto, type Valores } from './textos'

/** Devuelve `t(texto, valores?)` en el idioma elegido por el usuario. */
export function useTraduccion() {
  const idioma = useAppStore((state) => state.preferencias.language)
  return useCallback(
    (texto: string, valores?: Valores) => traducirTexto(idioma, texto, valores),
    [idioma],
  )
}
