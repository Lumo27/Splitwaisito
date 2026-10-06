> Actualización 06/10/2026: el frontend móvil actual está en `mobile/`, con Expo SDK 57, React Native y Expo Router. Todas las pantallas principales están migradas para Expo Go; ver [instrucciones y alcance verificado](mobile/README.md) y [plan de migración](docs/GUIA-MIGRACION-REACT-NATIVE.md). El frontend `web/` conserva la implementación PWA anterior. El login móvil ofrece demo y e-mail/contraseña; Google móvil sigue pendiente. La información PWA debajo se conserva como antecedente.
# Splitwaisito

Clon gratuito de Splitwise para el trabajo práctico integrador de Aplicaciones Móviles (equipo de 6, sin sprints). Grupos de gasto compartido (viajes, convivencia, etc.): cargar gastos, dividirlos, simplificar deudas y saldarlas. Incluye lo que Splitwise cobra como premium, gratis. Meta doble: aprobar la materia y quedar como una PWA real que el equipo use y sume al portfolio de cada uno — no es solo un entregable académico, tratarlo con ese nivel de cuidado.

**Importante:** no nombrar "Splitwise" ni hacer referencia directa a la competencia en nada de cara al usuario (UI, copys, nombres de archivo público, README de cara afuera).

## Stack técnico (definido y cerrado — no re-discutir sin motivo)

- **Frontend:** React 18 + Vite + TypeScript en modo strict.
- **Estilos:** Tailwind CSS.
- **Estado/cache local:** Zustand + middleware `persist`.
- **Ruteo:** React Router v6 — stack de login + tabs (Grupos, Actividad, Perfil) + pantallas modales.
- **Fechas:** date-fns. **Íconos:** lucide-react. **Gráficos:** recharts (para el extra de gráfico de gastos por categoría).
- **PWA:** `vite-plugin-pwa` — manifest + service worker (Workbox), instalable desde el navegador en cualquier dispositivo, sin pasar por ninguna store.
- **Testing:** Vitest — mismo motor que Vite (sin config extra para ESM/TS), API compatible con Jest, más rápido.
- **Backend/datos:** Firebase — Authentication (proveedor de Google), Firestore, Storage (fotos de ticket), Cloud Functions (simplificación de deudas server-side).
- **Cámara y GPS:** APIs estándar del navegador — `<input type="file" capture="environment">` / `getUserMedia` para la foto del ticket; `navigator.geolocation` + geocodificación inversa para la ubicación (editable a mano).

Este stack reemplaza al Expo + React Native que pedía la consigna originalmente — cambio aprobado explícitamente por el docente para poder ir por PWA. Firebase se mantiene tal cual pedía la consigna.

## Estructura de carpetas objetivo

```
/src
  /components   → sistema de diseño base (Botón, Tarjeta, Avatar, Input) + reutilizables
  /features     → una carpeta por feature (grupos, gastos, deudas, perfil, auth)
  /services     → integración con Firebase (auth.ts, firestore.ts, storage.ts)
/functions      → Cloud Functions (simplificación de deudas)
```

Monorepo: el repo ya existe (lo creó un compañero de equipo). Confirmar el nombre exacto de la carpeta del frontend (`/app` o `/web`) al clonar.

## Diseño visual

Paleta clara: fondo blanco/gris muy claro, acento primario **verde** (no muy saturado), acento secundario **celeste**. Sin modo oscuro. Mobile-first: navegación inferior en mobile, sidebar en desktop. El sistema de diseño base (Botón, Tarjeta, Avatar, Input) va en `/src/components` siguiendo esta paleta — hay wireframes de las 6 pantallas núcleo como referencia visual exacta (login, lista de grupos, detalle de grupo, cargar gasto, saldar deuda, perfil).

## Modelo de datos (Firestore)

Colecciones: `usuarios`, `grupos`, `grupos/{id}/gastos`. Reglas de seguridad (`firestore.rules`): solo integrantes de un grupo leen/escriben sus gastos; cada usuario edita solo su propio perfil.

**Categorías de gasto — fijas, solo 4:** Alojamiento, Comida, Transporte, Otro. Elegidas así (en vez de una lista larga) para que cargar un gasto sea rápido; "Otro" es la categoría de escape para no bloquear ningún caso. No agregar categorías nuevas sin que quede justificado en la ficha técnica.

**Monedas — fijas, solo 3:** ARS, USD, BRL. No implementar multi-moneda genérica.

**Simplificación de deudas:** algoritmo tipo "mayor deudor paga al mayor acreedor", corriendo en una Cloud Function, para mostrar quién le debe a quién con la menor cantidad de transferencias posibles (no que todos le deban a todos). Cubrir con al menos 3 casos de prueba.

## Mecanismo de pago (saldar deuda)

**No hay integración de pagos real ni API de Mercado Pago para enviar dinero (no existe esa API pública — confirmado con spike previo).** El flujo es: la pantalla "Saldar deuda" copia automáticamente el e-mail del acreedor al portapapeles, muestra el monto, y tiene un botón que abre el flujo web de Mercado Pago "Enviar dinero" (`mercadopago.com.ar/money-transfer`) para que el usuario pegue el e-mail y confirme a mano. Splitwaisito no mueve dinero — solo evita que el usuario tenga que buscar el dato. Ya verificado end-to-end con una transferencia real. No perder tiempo reintentando precargar el monto/destinatario por query params: se probó exhaustivamente y no es posible.

## Git / CI

Flujo: rama (`feature/...` o `fix/...` desde `develop`) → commits → PR hacia `develop` → review de un compañero → merge → `develop` a `main` solo en momentos de entrega, coordinado, también por PR. Branch protection en `main` y `develop` (require PR + 1 aprobación + check de CI verde, sin bypass, sin force-push) — instrucciones en `SETUP-REPO.md` del repo. CI (`ci.yml`, GitHub Actions) corre lint/typecheck/test/build con `--if-present`, así no rompe antes de que existan esos scripts.

## Gestión del equipo

Tablero Trello: https://trello.com/b/KnB9B2kP/splitwaisito (espacio "uni pilar") — 5 listas (Backlog → Asignada → En progreso → En revisión → Hecho), 25 tarjetas ya cargadas con historia, tamaño y dependencias, coloreadas por área. Cada uno se autoasigna arrastrando su tarjeta a "Asignada".

## Documentación de proceso (pedido explícito de la consigna)

La consigna exige documentar y justificar el proceso de creación, incluyendo **todo uso de IA con su motivo** — no alcanza con "usamos IA". Hay una ficha técnica (`ficha-tecnica-splitwaisito.docx`) y una planilla de uso de IA (`planilla-uso-ia.xlsx`) ya armadas y en la carpeta del proyecto. **Cada vez que uses IA (Claude Code incluido) para algo no trivial — generar código, resolver un error, decidir un enfoque — sumá una fila a la planilla** (herramienta, finalidad, prompt clave, qué se usó). No hace falta registrar cada mensaje suelto, sí cada tarea concreta.

## Primer paso

La tarjeta 1 del backlog ("Inicializar el proyecto — Vite + React + TS") es el punto de partida: crear el proyecto base con Vite, la estructura de carpetas de arriba, y a partir de ahí seguir con Firebase y PWA (tarjetas 2 y 3), que también son de las primeras y bloquean al resto del equipo.
