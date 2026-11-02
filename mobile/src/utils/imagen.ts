import * as ImagePicker from 'expo-image-picker'
import * as ImageManipulator from 'expo-image-manipulator'

/**
 * Abre la cámara o la galería y devuelve la imagen comprimida (1200 px, JPEG)
 * como data URI, lista para guardar en Firestore. Devuelve null si el usuario
 * cancela; lanza un error con mensaje para mostrar si falta un permiso.
 */
export async function elegirImagen(camara: boolean): Promise<string | null> {
  const { granted } = camara
    ? await ImagePicker.requestCameraPermissionsAsync()
    : await ImagePicker.requestMediaLibraryPermissionsAsync()
  if (!granted) {
    throw new Error(
      camara
        ? 'Permití el acceso a la cámara para tomar la foto.'
        : 'Permití el acceso a tus fotos para elegir una imagen.',
    )
  }
  const opciones: ImagePicker.ImagePickerOptions = {
    mediaTypes: ['images'],
    quality: 0.8,
  }
  const resultado = camara
    ? await ImagePicker.launchCameraAsync(opciones)
    : await ImagePicker.launchImageLibraryAsync(opciones)
  if (resultado.canceled || !resultado.assets?.[0]) return null
  const manipulada = await ImageManipulator.manipulateAsync(
    resultado.assets[0].uri,
    [{ resize: { width: 1200 } }],
    { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG, base64: true },
  )
  return manipulada.base64
    ? `data:image/jpeg;base64,${manipulada.base64}`
    : manipulada.uri
}
