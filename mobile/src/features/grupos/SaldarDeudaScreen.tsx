import { useLocalSearchParams } from 'expo-router'

import { PantallaPendiente } from '@/components/PantallaPendiente'

export function SaldarDeudaScreen() {
  // La deuda se identifica por deudor (de) y acreedor (a), no por su posición
  // en la lista simplificada, que cambia si se carga un gasto en el medio.
  const { de, a } = useLocalSearchParams<{ id: string; de: string; a: string }>()

  return <PantallaPendiente titulo={`Saldar deuda de ${de} a ${a}`} />
}
