// React import not required in new JSX runtimes

/**
 * MapPicker (mock)
 * - Placeholder map component used to pick a location for an expense.
 * - Props: optional `location` and `onPick(loc)` callback when user taps the mock map.
 */
interface Props {
  onPick?: (loc: { lat: number; lng: number }) => void
}

export function MapPicker({ onPick }: Props) {
  return (
    <div className="rounded-lg border border-primary-light bg-surface p-4 text-center">
      <div className="text-sm text-text-muted">Mapa (mock)</div>
      <div className="mt-3 h-32 w-full rounded-md bg-primary-light/20" onClick={() => onPick?.({ lat: -34.6, lng: -58.4 })}>
        <div className="pt-12 text-sm text-primary-dark">Tocá el mapa para ajustar el pin</div>
      </div>
    </div>
  )
}

export default MapPicker
