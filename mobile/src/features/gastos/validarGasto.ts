import type { GastoFirestore } from '@/services/firestore'

export function validarGasto(descripcion: string, monto: string, pagador: string, participantes: string[], miembros: string[]) {
  if (!descripcion.trim()) return 'Ingresá una descripción.'
  if (!/^\d+(?:[.,]\d{1,2})?$/.test(monto.trim())) return 'Ingresá un monto válido con hasta dos decimales.'
  const valor = Number(monto.trim().replace(',', '.'))
  if (!Number.isFinite(valor) || valor <= 0 || valor > Number.MAX_SAFE_INTEGER / 100) return 'El monto debe ser mayor que cero y estar dentro del rango permitido.'
  if (!miembros.includes(pagador)) return 'Elegí un pagador del grupo.'
  if (!participantes.length || participantes.some((id) => !miembros.includes(id))) return 'Elegí al menos un participante del grupo.'
  return ''
}
export const categorias: GastoFirestore['categoria'][] = ['Comida', 'Transporte', 'Alojamiento', 'Otro']
