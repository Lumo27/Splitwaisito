import { Avatar } from './Avatar'

/**
 * ParticipantCircle
 * - Circular avatar button used for compact participant selection.
 * - Props: `id`, `name`, `selected`, `onToggle(id)` and optional `size`.
 */
interface Props {
  id: string
  name: string
  selected?: boolean
  onToggle?: (id: string) => void
  size?: number
}

export function ParticipantCircle({ id, name, selected = false, onToggle, size = 48 }: Props) {
  return (
    <button
      onClick={() => onToggle?.(id)}
      aria-pressed={selected}
      className={`flex flex-col items-center justify-center rounded-full p-0 transition-transform focus:outline-none ${
        selected ? 'ring-2 ring-primary' : 'ring-0'
      }`}
      style={{ width: size, height: size }}
    >
      <Avatar name={name} size={size - 8} />
    </button>
  )
}

export default ParticipantCircle
