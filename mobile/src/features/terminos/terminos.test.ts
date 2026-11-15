import { describe, expect, it } from 'vitest'

import {
  tieneAceptacionRegistrada,
  TERMINOS_DOCUMENTO,
  TERMINOS_FECHA_ACTUALIZACION,
  TERMINOS_VERSION,
} from './terminos'

describe('términos de Junti', () => {
  it('incluye el documento completo y los datos de contacto y jurisdicción', () => {
    for (let seccion = 1; seccion <= 14; seccion += 1) {
      expect(TERMINOS_DOCUMENTO).toContain(`## ${seccion}. `)
    }

    for (const texto of [
      '## 1. Objeto y descripción del servicio',
      '## 2. Naturaleza del servicio: ausencia de custodia de fondos',
      '## 14. Contacto',
      '**Última actualización:** 4 de noviembre de 2026',
      '[nombre completo del titular]',
      '[dirección]',
      'Junti@gmail.com',
      'orden judicial, mandato legal o requerimiento formal',
      '[país/jurisdicción]',
      'los últimos [12] meses o, si el servicio es gratuito, la suma de [monto]',
      '[ciudad/país]',
    ]) {
      expect(TERMINOS_DOCUMENTO).toContain(texto)
    }
    expect(TERMINOS_FECHA_ACTUALIZACION).toBe('4 de noviembre de 2026')
    expect(TERMINOS_VERSION).toBe('1.0.2')
  })

  it('conserva la aceptación aunque cambie la versión de los términos', () => {
    expect(tieneAceptacionRegistrada({ estado: 'aceptado', version: TERMINOS_VERSION })).toBe(true)
    expect(tieneAceptacionRegistrada({ estado: 'aceptado', version: '0.9.0' })).toBe(true)
    expect(tieneAceptacionRegistrada({ estado: 'pendiente', version: TERMINOS_VERSION })).toBe(false)
    expect(tieneAceptacionRegistrada(null)).toBe(false)
  })
})
