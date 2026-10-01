import { Pressable, Text } from 'react-native'

// Botón de texto para los placeholders del esqueleto, hasta que exista el
// componente Botón del sistema de diseño (Paso 6).
export function BotonPendiente({ texto, onPress }: { texto: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} className="rounded-lg bg-primary px-4 py-2 active:bg-primary-dark">
      <Text className="text-base font-semibold text-white">{texto}</Text>
    </Pressable>
  )
}
