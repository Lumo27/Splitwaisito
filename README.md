# Splitwaisito

PWA gratuita para organizar gastos compartidos en grupo (viajes, convivencia, etc.): cargar gastos, dividirlos, simplificar deudas entre integrantes y saldarlas. Trabajo práctico integrador de Aplicaciones Móviles — equipo de 6 personas.

Instalable desde el navegador en cualquier dispositivo, sin pasar por ninguna store.

## Stack técnico

- **Frontend:** React 18 + Vite + TypeScript (modo strict)
- **Estilos:** Tailwind CSS
- **Estado/cache local:** Zustand + middleware `persist`
- **Ruteo:** React Router v6
- **Fechas:** date-fns · **Íconos:** lucide-react · **Gráficos:** recharts
- **PWA:** vite-plugin-pwa (manifest + service worker con Workbox)
- **Backend/datos:** Firebase — Authentication (Google), Firestore, Storage, Cloud Functions
- **Cámara y GPS:** APIs estándar del navegador (`capture="environment"`, `getUserMedia`, `navigator.geolocation`)

## Estructura del repo

```
/web            → frontend (Vite + React + TS)
  /src
    /components → sistema de diseño base (Botón, Tarjeta, Avatar, Input) + reutilizables
    /features   → una carpeta por feature (auth, grupos, actividad, perfil, configuracion)
    /services   → integración con Firebase (auth.ts, firestore.ts, amistades.ts, storage.ts) y modo demo
/functions      → Cloud Functions (simplificación de deudas)
```

## Empezar a trabajar

1. Cloná el repo.
2. `cd web && npm install && npm run dev`.
3. Copiá `web/.env.example` a `web/.env.local` y completalo con las credenciales de Firebase (Auth/Firestore/Storage) — pedíselas a Lucas, no están en el repo.
4. Revisá el tablero de Trello para autoasignarte una tarjeta.

## Flujo de trabajo (Git)

Rama (`feature/...` o `fix/...` desde `develop`) → commits → PR hacia `develop` → review de un compañero → merge. `develop` pasa a `main` solo en momentos de entrega, coordinado, también por PR.

`main` y `develop` tienen branch protection (PR + 1 aprobación + CI verde, sin bypass ni force-push). Setup detallado en [`SETUP-REPO.md`](./SETUP-REPO.md).

## Gestión del equipo

Tablero Trello: [trello.com/b/KnB9B2kP/splitwaisito](https://trello.com/b/KnB9B2kP/splitwaisito) — Backlog → Asignada → En progreso → En revisión → Hecho. Cada uno se autoasigna arrastrando su tarjeta a "Asignada".

## Documentación del proceso

- [`docs/DOCUMENTACION.md`](./docs/DOCUMENTACION.md) — estado del proyecto, cómo correrlo, estructura, modelo de datos, flujo de trabajo y quién hizo qué.
- [`docs/INFORME-USO-IA.md`](./docs/INFORME-USO-IA.md) — informe de uso de IA por sesión y por tarea.
- [`docs/ficha-tecnica-splitwaisito.pdf`](./docs/ficha-tecnica-splitwaisito.pdf) — justificación de decisiones técnicas y de diseño.
- `planilla-uso-ia.xlsx` — registro de todo uso de IA (herramienta, finalidad, prompt clave, qué se usó).

Más contexto y decisiones cerradas del proyecto en [`CLAUDE.md`](./CLAUDE.md).
