import {
  getAI,
  getGenerativeModel,
  GoogleAIBackend,
  Schema,
} from 'firebase/ai'
import type { DatosComprobante } from '@/features/grupos/compararComprobante'
import { app } from './firebase'

// Firebase AI Logic con la Gemini Developer API: funciona en el plan Spark
// (gratis) y la clave no queda dentro de la app. Hay que habilitarlo una vez
// en la consola de Firebase (Build > AI Logic).
const MODELO = 'gemini-2.5-flash'

const esquema = Schema.object({
  properties: {
    destinatario: Schema.string({ description: 'Nombre de quien recibe' }),
    alias: Schema.string({ description: 'Alias de quien recibe' }),
    cbuCvu: Schema.string({ description: 'CBU o CVU de quien recibe' }),
    monto: Schema.number({ description: 'Importe transferido, sin símbolos' }),
    fecha: Schema.string({ description: 'Fecha de la operación, AAAA-MM-DD' }),
  },
  optionalProperties: ['destinatario', 'alias', 'cbuCvu', 'monto', 'fecha'],
})

const INSTRUCCIONES =
  'Es un comprobante de transferencia bancaria de Argentina. Extraé los datos ' +
  'de quien RECIBE el dinero (no de quien lo envía), el importe y la fecha. ' +
  'Si un dato no aparece, omitilo; no lo inventes.'

const modelo = app
  ? getGenerativeModel(getAI(app, { backend: new GoogleAIBackend() }), {
      model: MODELO,
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: esquema,
      },
    })
  : null

/**
 * Lee los datos del comprobante con IA. Devuelve null si la IA no está
 * disponible (modo demo o Firebase sin configurar) o si la lectura falla: en
 * ese caso el pago queda pendiente de aprobación manual.
 */
export async function leerComprobante(
  imagen: string,
): Promise<DatosComprobante | null> {
  if (!modelo) return null
  const coincidencia = /^data:(image\/\w+);base64,(.+)$/.exec(imagen)
  if (!coincidencia) return null
  try {
    const respuesta = await modelo.generateContent([
      INSTRUCCIONES,
      { inlineData: { mimeType: coincidencia[1], data: coincidencia[2] } },
    ])
    return JSON.parse(respuesta.response.text()) as DatosComprobante
  } catch {
    return null
  }
}
