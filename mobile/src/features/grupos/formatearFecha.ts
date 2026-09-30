import { format, isValid, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'

export function formatearFecha(fecha: string) {
  const parseada = parseISO(fecha)
  return isValid(parseada) ? format(parseada, "d MMM, HH:mm", { locale: es }) : fecha
}
