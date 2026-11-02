import { Linking } from 'react-native'

/** Abre WhatsApp con el mensaje cargado para elegir el contacto. */
export function abrirWhatsApp(texto: string) {
  return Linking.openURL(`https://wa.me/?text=${encodeURIComponent(texto)}`)
}
