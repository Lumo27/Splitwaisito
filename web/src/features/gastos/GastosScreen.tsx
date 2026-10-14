import { useMemo, useState, type FormEvent } from 'react'
import { Camera, LocateFixed, MapPin, Plus, ReceiptText } from 'lucide-react'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { Button } from '../../components/Button'
import { Card } from '../../components/Card'
import { Input } from '../../components/Input'

const categories = ['Alojamiento', 'Comida', 'Transporte', 'Otro'] as const
type Category = (typeof categories)[number]

const categoryColors: Record<Category, string> = {
  Alojamiento: '#3FA772',
  Comida: '#38BDF8',
  Transporte: '#F59E0B',
  Otro: '#94A3B8',
}

interface Expense {
  id: number
  title: string
  amount: number
  category: Category
  date: string
  location: string
  photo?: string
}

const initialExpenses: Expense[] = [
  { id: 1, title: 'Hospedaje', amount: 48000, category: 'Alojamiento', date: '2026-10-12', location: 'Córdoba' },
  { id: 2, title: 'Cena del grupo', amount: 18500, category: 'Comida', date: '2026-10-13', location: 'Córdoba' },
  { id: 3, title: 'Traslados', amount: 9200, category: 'Transporte', date: '2026-10-13', location: '' },
  { id: 4, title: 'Entradas al museo', amount: 6500, category: 'Otro', date: '2026-10-14', location: '' },
]

const today = new Date().toISOString().slice(0, 10)

export function GastosScreen() {
  const [expenses, setExpenses] = useState(initialExpenses)
  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState<Category>('Comida')
  const [date, setDate] = useState(today)
  const [location, setLocation] = useState('')
  const [photo, setPhoto] = useState<string>()
  const [locationError, setLocationError] = useState('')

  const categoryTotals = useMemo(() => categories.map((name) => ({
    name,
    amount: expenses.filter((expense) => expense.category === name).reduce((sum, expense) => sum + expense.amount, 0),
  })), [expenses])
  const total = expenses.reduce((sum, expense) => sum + expense.amount, 0)

  function handlePhoto(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => setPhoto(typeof reader.result === 'string' ? reader.result : undefined)
    reader.readAsDataURL(file)
  }

  function handleLocation() {
    setLocationError('')
    if (!navigator.geolocation) {
      setLocationError('Este dispositivo no permite obtener la ubicación.')
      return
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => setLocation(`${coords.latitude.toFixed(5)}, ${coords.longitude.toFixed(5)}`),
      () => setLocationError('No se pudo obtener la ubicación. Podés escribirla manualmente.'),
      { enableHighAccuracy: true, timeout: 10000 },
    )
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setExpenses((current) => [{
      id: Date.now(),
      title: title.trim(),
      amount: Number(amount),
      category,
      date,
      location: location.trim(),
      photo,
    }, ...current])
    setTitle('')
    setAmount('')
    setCategory('Comida')
    setDate(today)
    setLocation('')
    setPhoto(undefined)
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 pb-8 sm:p-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-primary-dark">Tu resumen</p>
          <h1 className="mt-1 text-2xl font-bold text-text">Gastos</h1>
          <p className="mt-1 text-sm text-text-muted">Vista de demostración: los datos se conservan solo mientras esta pantalla está abierta.</p>
        </div>
        <p className="text-sm text-text-muted">{expenses.length} gastos registrados</p>
      </header>

      <Card className="grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(280px,0.85fr)]">
        <div className="min-w-0">
          <div className="mb-1 flex items-center gap-2 text-sm text-text-muted">
            <ReceiptText size={17} /> Total registrado
          </div>
          <p className="text-3xl font-bold text-text">${total.toLocaleString('es-AR')}</p>
          <p className="mt-1 text-sm text-text-muted">Distribución por categoría</p>
          <div className="mt-3 h-56" role="img" aria-label="Gráfico de gastos por categoría">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryTotals} dataKey="amount" nameKey="name" innerRadius={58} outerRadius={88} paddingAngle={3}>
                  {categoryTotals.map((entry) => <Cell key={entry.name} fill={categoryColors[entry.name]} />)}
                </Pie>
                <Tooltip formatter={(value) => `$${Number(value).toLocaleString('es-AR')}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-2">
            {categoryTotals.map(({ name, amount: categoryAmount }) => (
              <li key={name} className="flex min-w-0 items-center gap-2 text-sm">
                <span className="size-2.5 shrink-0 rounded-full" style={{ backgroundColor: categoryColors[name] }} />
                <span className="truncate text-text-muted">{name}</span>
                <span className="ml-auto font-medium text-text">${categoryAmount.toLocaleString('es-AR')}</span>
              </li>
            ))}
          </ul>
        </div>

        <form className="space-y-4 border-t border-primary-light pt-5 md:border-l md:border-t-0 md:pl-6 md:pt-0" onSubmit={handleSubmit}>
          <div>
            <h2 className="text-lg font-semibold text-text">Agregar gasto</h2>
            <p className="text-sm text-text-muted">Completá los datos y adjuntá un comprobante si lo necesitás.</p>
          </div>
          <Input id="expense-title" label="Descripción" placeholder="Ej. Almuerzo" value={title} onChange={(event) => setTitle(event.target.value)} required />
          <div className="grid grid-cols-2 gap-3">
            <Input id="expense-amount" label="Monto (ARS)" type="number" min="1" step="0.01" placeholder="0" value={amount} onChange={(event) => setAmount(event.target.value)} required />
            <Input id="expense-date" label="Fecha" type="date" value={date} onChange={(event) => setDate(event.target.value)} required />
          </div>
          <label className="flex flex-col gap-1 text-sm text-text-muted" htmlFor="expense-category">
            Categoría
            <select id="expense-category" className="rounded-lg border border-primary-light bg-surface px-3 py-2 text-text outline-none focus:border-primary" value={category} onChange={(event) => setCategory(event.target.value as Category)}>
              {categories.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>

          <div className="space-y-2">
            <label className="flex flex-col gap-1 text-sm text-text-muted" htmlFor="expense-location">
              Ubicación
              <input id="expense-location" className="rounded-lg border border-primary-light bg-surface px-3 py-2 text-text outline-none focus:border-primary" placeholder="Ciudad o dirección" value={location} onChange={(event) => setLocation(event.target.value)} />
            </label>
            <Button type="button" variant="secondary" className="flex w-full items-center justify-center gap-2" onClick={handleLocation}>
              <LocateFixed size={17} /> Usar ubicación actual
            </Button>
            {locationError && <p className="text-sm text-danger" role="status">{locationError}</p>}
          </div>

          <div>
            <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-primary px-3 py-3 text-sm font-medium text-primary-dark transition-colors hover:bg-primary-light/50" htmlFor="expense-photo">
              <Camera size={18} /> {photo ? 'Cambiar foto' : 'Tomar o adjuntar foto'}
            </label>
            <input className="sr-only" id="expense-photo" type="file" accept="image/*" capture="environment" onChange={handlePhoto} />
            {photo && <img className="mt-3 h-36 w-full rounded-lg object-cover" src={photo} alt="Vista previa del comprobante" />}
          </div>

          <Button type="submit" className="flex w-full items-center justify-center gap-2">
            <Plus size={18} /> Guardar gasto
          </Button>
        </form>
      </Card>

      <section aria-labelledby="recent-expenses-heading">
        <h2 id="recent-expenses-heading" className="mb-3 text-lg font-semibold text-text">Movimientos recientes</h2>
        <div className="divide-y divide-primary-light rounded-xl border border-primary-light bg-surface">
          {expenses.map((expense) => (
            <article key={expense.id} className="flex items-center gap-3 p-4">
              {expense.photo
                ? <img className="size-11 shrink-0 rounded-lg object-cover" src={expense.photo} alt="" />
                : <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary-light text-primary-dark"><ReceiptText size={20} /></span>}
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-text">{expense.title}</p>
                <p className="flex flex-wrap items-center gap-x-2 text-sm text-text-muted">
                  <span>{expense.category}</span><span>·</span><span>{expense.date}</span>
                  {expense.location && <><span>·</span><span className="inline-flex items-center gap-1"><MapPin size={13} />{expense.location}</span></>}
                </p>
              </div>
              <p className="shrink-0 font-semibold text-text">${expense.amount.toLocaleString('es-AR')}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}