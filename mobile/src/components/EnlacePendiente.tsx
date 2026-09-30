import { Link, type Href } from 'expo-router'

// Enlace de texto para recorrer el esqueleto de navegación.
export function EnlacePendiente({ href, texto }: { href: Href; texto: string }) {
  return (
    <Link href={href} className="text-base font-semibold text-primary-dark">
      {texto}
    </Link>
  )
}
