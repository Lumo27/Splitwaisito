import { describe, expect, it, vi, beforeEach } from 'vitest'
import {
  formatearFechaCotizacion,
  obtenerCotizacionesDolar,
  type CotizacionDolar,
} from './dolar'

describe('Servicio de cotización del Dólar', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('formatea correctamente una fecha ISO a formato argentino legible', () => {
    const fecha = '2026-10-22T14:30:00.000Z'
    const formateada = formatearFechaCotizacion(fecha)
    expect(formateada).toContain('2026')
    expect(formateada).toContain('hs')
  })

  it('retorna el string original si la fecha es inválida', () => {
    expect(formatearFechaCotizacion('fecha-invalida')).toBe('fecha-invalida')
  })

  it('obtiene cotizaciones correctamente desde la API', async () => {
    const mockData: CotizacionDolar[] = [
      {
        moneda: 'USD',
        casa: 'blue',
        nombre: 'Blue',
        compra: 1545,
        venta: 1565,
        fechaActualizacion: '2026-10-22T14:58:00.000Z',
      },
      {
        moneda: 'USD',
        casa: 'oficial',
        nombre: 'Oficial',
        compra: 1500,
        venta: 1550,
        fechaActualizacion: '2026-10-22T12:00:00.000Z',
      },
    ]

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockData,
      }),
    )

    const resultado = await obtenerCotizacionesDolar()
    expect(resultado).toHaveLength(2)
    expect(resultado[0].nombre).toBe('Blue')
    expect(resultado[0].venta).toBe(1565)
  })

  it('lanza un error si la API responde con un status no exitoso', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
      }),
    )

    await expect(obtenerCotizacionesDolar()).rejects.toThrow(
      'No se pudo obtener la cotización del dólar.',
    )
  })
})
