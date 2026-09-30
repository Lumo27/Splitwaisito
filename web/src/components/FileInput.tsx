// React import not required in new JSX runtimes

/**
 * FileInput
 * - Simple file picker for image uploads (ticket photo).
 * - Props: `onFile(file|null)` called when a file is selected.
 */
interface Props {
  onFile?: (file: File | null) => void
}

export function FileInput({ onFile }: Props) {
  return (
    <label className="flex items-center gap-2 rounded-lg border border-primary-light bg-surface px-3 py-2">
      <input
        type="file"
        accept="image/*"
        onChange={(e) => onFile?.(e.target.files?.[0] ?? null)}
        className="hidden"
      />
      <span className="text-sm text-text-muted">Agregar foto del ticket</span>
    </label>
  )
}

export default FileInput
