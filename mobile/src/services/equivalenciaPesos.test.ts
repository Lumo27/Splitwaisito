import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  convertirAPesos,
  cotizacionValida,
  cotizacionVencida,
  obtenerCotizacionPesos,
  _resetSolicitudesEnCurso,
  TIEMPO_LIMITE_COTIZACION_MS,
  VIGENCIA_COTIZACION_MS,
} from './equivalenciaPesos'

describe('equivalencia a pesos', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    // Limpia el Map de solicitudes en curso para evitar que una Promise
    // colgada de un test anterior (p.ej. el de abort) interfiera con el siguiente.
    _resetSolicitudesEnCurso()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('convierte dólares usando la cotización de venta recibida', () => {
    expect(convertirAPesos(100, 1540)).toBe(154000)
  })

  it('convierte reales usando la cotización de venta recibida', () => {
    expect(convertirAPesos(100, 285)).toBe(28500)
  })

  it('considera vigente una cotización hasta cumplir seis horas', () => {
    const ahora = 1_800_000_000_000
    const cotizacion = { venta: 1540, consultadaEn: ahora - VIGENCIA_COTIZACION_MS }

    expect(cotizacionVencida(cotizacion, ahora)).toBe(false)
    expect(
      cotizacionVencida(
        { ...cotizacion, consultadaEn: cotizacion.consultadaEn - 1 },
        ahora,
      ),
    ).toBe(true)
  })

  it('considera vencida una cotización con fecha futura por reloj desajustado', () => {
    const ahora = 1_800_000_000_000
    const cotizacionFutura = { venta: 1540, consultadaEn: ahora + 1 }

    expect(
      cotizacionVencida(cotizacionFutura, ahora),
    ).toBe(true)
    expect(cotizacionValida(cotizacionFutura, ahora)).toBe(false)
  })

  it('no considera válida una cotización persistida corrupta', () => {
    expect(cotizacionValida(undefined)).toBe(false)
    expect(cotizacionValida({ venta: Number.NaN, consultadaEn: 1 })).toBe(false)
    expect(cotizacionValida({ venta: 1540, consultadaEn: Number.NaN })).toBe(false)
  })

  it.each([
    ['USD', 'https://dolarapi.com/v1/dolares/oficial'],
    ['BRL', 'https://dolarapi.com/v1/cotizaciones/brl'],
  ] as const)(
    'obtiene el valor de venta de %s desde DolarApi',
    async (moneda, url) => {
      const fetchMock = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ venta: 1540 }),
      })
      vi.stubGlobal('fetch', fetchMock)

      const cotizacion = await obtenerCotizacionPesos(moneda)

      expect(cotizacion).toMatchObject({
        venta: 1540,
        consultadaEn: expect.any(Number),
      })
      expect(fetchMock).toHaveBeenCalledWith(
        url,
        expect.objectContaining({ signal: expect.any(AbortSignal) }),
      )
    },
  )

  it('comparte una única petición simultánea para la misma moneda', async () => {
    let resolver: ((value: { ok: boolean; json: () => Promise<{ venta: number }> }) => void) | undefined
    const fetchMock = vi.fn(
      () =>
        new Promise<{ ok: boolean; json: () => Promise<{ venta: number }> }>(
          (resolve) => {
            resolver = resolve
          },
        ),
    )
    vi.stubGlobal('fetch', fetchMock)

    const primera = obtenerCotizacionPesos('USD')
    const segunda = obtenerCotizacionPesos('USD')
    resolver?.({ ok: true, json: async () => ({ venta: 1540 }) })

    await expect(Promise.all([primera, segunda])).resolves.toEqual([
      expect.objectContaining({ venta: 1540 }),
      expect.objectContaining({ venta: 1540 }),
    ])
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('rechaza una respuesta sin una cotización de venta válida', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ venta: 0 }),
      }),
    )

    await expect(obtenerCotizacionPesos('USD')).rejects.toThrow(
      'DolarApi devolvió una cotización inválida para USD.',
    )
  })

  it('rechaza los errores HTTP de DolarApi', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: false, status: 503 }),
    )

    await expect(obtenerCotizacionPesos('BRL')).rejects.toThrow(
      'DolarApi respondió con estado 503.',
    )
  })

  it('aborta una petición que queda pendiente', async () => {
    vi.useFakeTimers()
    vi.stubGlobal(
      'fetch',
      vi.fn(
        (_url: string, opciones?: RequestInit) =>
          new Promise((_resolve, reject) => {
            opciones?.signal?.addEventListener('abort', () =>
              reject(new Error('Solicitud abortada.')),
            )
          }),
      ),
    )

    const solicitud = obtenerCotizacionPesos('USD')
    const resultadoEsperado = expect(solicitud).rejects.toThrow(
      'Solicitud abortada.',
    )
    await vi.advanceTimersByTimeAsync(TIEMPO_LIMITE_COTIZACION_MS)
    await resultadoEsperado
  })
})
