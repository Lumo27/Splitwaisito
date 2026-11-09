import type { Preferencias } from '@/store/useAppStore'

export interface PaletaTema {
  background: string
  surface: string
  subtle: string
  outline: string
  text: string
  textMuted: string
  primaryLight: string
  primaryDark: string
  dangerLight: string
  danger: string
}

const CLARO: PaletaTema = {
  background: '#F8FAFC',
  surface: '#FFFFFF',
  subtle: '#F1F5F9',
  outline: '#E2E8F0',
  text: '#152238',
  textMuted: '#64748B',
  primaryLight: '#DCF3E6',
  primaryDark: '#2E7D57',
  dangerLight: '#FFF1F2',
  danger: '#BE123C',
}

const OSCURO: PaletaTema = {
  background: '#111A24',
  surface: '#1B2835',
  subtle: '#253545',
  outline: '#45586B',
  text: '#F1F5F9',
  textMuted: '#C0CBD7',
  primaryLight: '#213E31',
  primaryDark: '#8ED8B0',
  dangerLight: '#3D222A',
  danger: '#FDA4AF',
}

function rgb(hex: string): string {
  const normalizado = hex.replace('#', '')

  return [
    parseInt(normalizado.slice(0, 2), 16),
    parseInt(normalizado.slice(2, 4), 16),
    parseInt(normalizado.slice(4, 6), 16),
  ].join(' ')
}

export function obtenerPaleta(
  oscuro: boolean,
  altoContraste = false,
): PaletaTema {
  const base = oscuro ? OSCURO : CLARO
  if (!altoContraste) return base

  return {
    ...base,
    subtle: oscuro ? '#45586B' : '#E2E8F0',
    text: oscuro ? '#FFFFFF' : '#0B1724',
    textMuted: oscuro ? '#F1F5F9' : '#334155',
    outline: oscuro ? '#CBD5E1' : '#475569',
  }
}

export function obtenerVariablesTema(
  paleta: PaletaTema,
): Record<string, string> {
  return {
    '--color-background': rgb(paleta.background),
    '--color-surface': rgb(paleta.surface),
    '--color-subtle': rgb(paleta.subtle),
    '--color-outline': rgb(paleta.outline),
    '--color-text': rgb(paleta.text),
    '--color-text-muted': rgb(paleta.textMuted),
    '--color-primary-light': rgb(paleta.primaryLight),
    '--color-primary-dark': rgb(paleta.primaryDark),
    '--color-danger-light': rgb(paleta.dangerLight),
    '--color-danger': rgb(paleta.danger),
    '--color-primary': '63 167 114',
    '--color-secondary': '56 189 248',
  }
}

export function temaOscuroPreferido(
  tema: Preferencias['theme'],
  sistemaOscuro: boolean,
): boolean {
  return tema === 'dark' || (tema === 'system' && sistemaOscuro)
}

export const FACTORES_TAMANO_TEXTO: Record<
  Preferencias['fontSize'],
  number
> = {
  verySmall: 0.85,
  small: 0.92,
  normal: 1,
  large: 1.12,
  veryLarge: 1.25,
}

export function obtenerFuente(
  fuente: Preferencias['fontFamily'],
  platform: 'web' | 'ios' | 'android' | 'other',
): string {
  if (fuente === 'serif') {
    return platform === 'ios' ? 'Georgia' : 'serif'
  }
  if (fuente === 'monospace') {
    return platform === 'ios' ? 'Menlo' : 'monospace'
  }
  return platform === 'web'
    ? 'system-ui'
    : platform === 'android'
      ? 'sans-serif'
      : 'System'
}
