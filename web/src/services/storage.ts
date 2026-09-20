import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { storage } from './firebase'

export async function subirFotoTicket(gastoId: string, file: Blob) {
  if (!storage) {
    throw new Error('Firebase no configurado aún.')
  }

  const fotoRef = ref(storage, `tickets/${gastoId}`)
  await uploadBytes(fotoRef, file)
  return getDownloadURL(fotoRef)
}
