import { describe, expect, it } from 'vitest'

import {
  tieneAceptacionRegistrada,
  TERMINOS_DOCUMENTO,
  TERMINOS_VERSION,
} from './terminos'

describe('términos de Junti', () => {
  it('incluye el documento completo y los datos de contacto y jurisdicción', () => {
    for (let seccion = 1; seccion <= 14; seccion += 1) {
      expect(TERMINOS_DOCUMENTO).toContain(`## ${seccion}. `)
    }

    for (const texto of [
      '## 1. Descripción del servicio',
      '## 14. Contacto',
      'orden judicial, mandato legal o requerimiento formal',
      'Nota: Este documento es un borrador general.',
      '**Última actualización:** 02/11/2026',
      'operada por No name',
      'con domicilio en N/A',
      'splitwaisito@gmail.com',
      'legislación aplicable en ARGENTINA',
      'tribunales competentes de Buenos Aires, Argentina',
      '[monto] si el servicio es gratuito',
    ]) {
      expect(TERMINOS_DOCUMENTO).toContain(texto)
    }
  })

  it('conserva la aceptación aunque cambie la versión de los términos', () => {
    expect(tieneAceptacionRegistrada({ estado: 'aceptado', version: TERMINOS_VERSION })).toBe(true)
    expect(tieneAceptacionRegistrada({ estado: 'aceptado', version: '0.9.0' })).toBe(true)
    expect(tieneAceptacionRegistrada({ estado: 'pendiente', version: TERMINOS_VERSION })).toBe(false)
    expect(tieneAceptacionRegistrada(null)).toBe(false)
  })
})
