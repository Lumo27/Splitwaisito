// React import not required in new JSX runtimes

/**
 * CategoryPill
 * - Small rounded button used to display a category (icon + label).
 * - Props: `label`, optional `icon`, `selected` boolean and `onClick` handler.
 */
import type { ReactNode } from 'react'

interface Props {
  label: string
  icon?: ReactNode
  selected?: boolean
  onClick?: () => void
}

export function CategoryPill({ label, icon, selected = false, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium transition-shadow border ${
        selected
          ? 'bg-primary text-white shadow-md border-transparent'
          : 'bg-surface text-text-muted border-primary-light'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  )
}

export default CategoryPill
