import { describe, expect, it } from 'vitest'
import { compararComprobante } from './compararComprobante'

const esperado = {
  acreedorNombre: 'Germán',
  acreedorAlias: 'german.mp',
  monto: 147000,
  hoy: '2026-11-02',
}
const valido = {
  destinatario: 'German Ejemplo',
  alias: 'GERMAN.MP',
  monto: 147000,
  fecha: '2026-11-02',
}

describe('compararComprobante', () => {
  it('acepta un comprobante con alias, monto y fecha correctos', () => {
    expect(compararComprobante(valido, esperado)).toEqual({
      coincide: true,
      motivos: [],
    })
  })

  it('acepta el destinatario por nombre aunque no figure el alias', () => {
    const { coincide } = compararComprobante(
      { ...valido, alias: undefined, destinatario: 'Germán Pérez' },
      esperado,
    )
    expect(coincide).toBe(true)
  })

  it('rechaza si se le transfirió a otra persona', () => {
    const resultado = compararComprobante(
      { ...valido, alias: 'otro.alias', destinatario: 'Vladi' },
      esperado,
    )
    expect(resultado.coincide).toBe(false)
    expect(resultado.motivos[0]).toContain('no coincide con Germán')
  })

  it('rechaza un monto distinto, una fecha vieja o datos ilegibles', () => {
    expect(
      compararComprobante({ ...valido, monto: 100000 }, esperado).motivos,
    ).toHaveLength(1)
    expect(
      compararComprobante({ ...valido, fecha: '2026-08-01' }, esperado).motivos,
    ).toEqual(['El comprobante tiene más de 30 días.'])
    expect(compararComprobante({}, esperado).motivos).toHaveLength(3)
  })
})
