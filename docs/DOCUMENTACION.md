# Documentación del proyecto — Splitwaisito

Estado al **21/09/2026**, sobre la rama `develop` (commit `864381b`). Este documento describe lo que hay hoy en el repositorio; las decisiones de stack siguen en [`CLAUDE.md`](../CLAUDE.md) y el estado de las tareas, en el [tablero de Trello](https://trello.com/b/KnB9B2kP/splitwaisito).

## 1. Qué es

PWA gratuita para organizar gastos compartidos en grupo (viajes, convivencia, etc.): cargar gastos, dividirlos, ver quién le debe a quién con la menor cantidad de transferencias y saldar la deuda. Trabajo práctico integrador de Aplicaciones Móviles, equipo de 6 personas. Se instala desde el navegador, sin pasar por ninguna store.

**Mecanismo de pago:** la app no mueve dinero. Al saldar una deuda copia el alias (o el e-mail) del acreedor al portapapeles, muestra el monto y abre el flujo web "Enviar dinero" de Mercado Pago para que el usuario confirme a mano.

## 2. Estado actual

**Funciona (verificado):**
- Login con Google (Firebase Authentication), sesión persistente y rutas protegidas.
- Grupos: crear, listar, eliminar y agregar integrantes de la lista de amigos.
- Gastos: cargar (división en partes iguales entre los integrantes), listar y eliminar. Categorías fijas: Alojamiento, Comida, Transporte, Otro.
- Deudas simplificadas por grupo y modal "Saldar" con el monto neto.
- Amigos: enviar solicitud por e-mail, aceptar, rechazar y eliminar.
- Perfil: alias para transferencias y descripción, guardados en Firestore.
- Modo demo con datos de ejemplo, sin Firebase (ver sección 8).
- PWA con manifest y service worker (Workbox).
- CI en GitHub Actions y branch protection en `main` y `develop`.

**Todavía no está:**
- Selector de moneda preferida ARS/USD/BRL en el perfil (tarjeta #11). Hoy todo se muestra en pesos.
- Crear grupo con tipo (Viaje/Convivencia/Pareja/Otro) y selección múltiple de integrantes (#13).
- Cargar gasto con división personalizada, foto del ticket y ubicación (#15, #16, #17). Hay un formulario avanzado en el PR #3, sin mergear.
- Botón "Recordar deuda" por WhatsApp (#19) y README ampliado (#20).
- Registro con e-mail: el formulario de la pantalla de login abre una sesión local, no crea una cuenta real.
- Cloud Function de deudas desplegada y Firebase Storage: requieren el plan Blaze de Firebase (#9, #28).
- Extras: gráfico por categoría, exportar a PDF/Excel y notificaciones push (#23, #24, #25).
- Despliegue en producción (Vercel, desde `main`).

## 3. Cómo correrlo

Requisitos: Node.js 20 o superior.

```bash
cd web
npm install
```

| Comando | Qué hace |
|---|---|
| `npm run dev` | App con Firebase real. Requiere `web/.env.local` (pedírselo a Lucas). Abrir `http://localhost:5173`. |
| `npm run dev:seeds` | Modo demo: datos de ejemplo, sin Firebase ni credenciales. |
| `npm run test` | Tests (Vitest). |
| `npm run typecheck` | Chequeo de tipos. |
| `npm run lint` | Lint (oxlint). |
| `npm run build` | Build de producción (typecheck + Vite + PWA). |

`web/.env.local` lleva las 6 claves `VITE_FIREBASE_*` (ver `web/.env.example`). No se sube al repositorio. El login con Google solo está autorizado desde `localhost`, no desde una IP de la red.

## 4. Estructura del repositorio

```
/web                    Frontend (Vite + React + TypeScript strict + Tailwind)
  /src
    App.tsx             Rutas y arranque de la sesión
    /components         Button, Card, Avatar, Input, TabsLayout (navegación)
    /features
      /auth             LoginScreen
      /grupos           GruposScreen, deudas.ts (cálculo), formatearFecha.ts
      /actividad        ActividadScreen (pestaña "Amigos")
      /perfil           PerfilScreen
      /configuracion    ConfiguracionScreen (cerrar sesión, reiniciar datos demo)
    /services           firebase.ts, auth.ts, firestore.ts, amistades.ts,
                        deudas.ts, storage.ts, seedBackend.ts (modo demo)
    /store              useAppStore.ts (estado global con Zustand + persist)
/functions              Cloud Function simplificarDeudasGrupo (sin desplegar)
/docs                   Consigna, wireframes, ficha técnica y esta documentación
firestore.rules         Reglas de seguridad de Firestore
.github/workflows       ci.yml
```

**Stack:** React 18, Vite, TypeScript, Tailwind CSS, Zustand, React Router v6, date-fns, lucide-react, vite-plugin-pwa, Vitest, Firebase (Authentication, Firestore, Storage, Cloud Functions).

**Diseño:** paleta clara, acento primario verde (`#3FA772`) y secundario celeste (`#38BDF8`), fondo `#F8FAFC`, sin modo oscuro. Navegación inferior en el celular y barra lateral en escritorio. La tipografía es la del sistema.

## 5. Pantallas y rutas

| Ruta | Pestaña | Qué hace |
|---|---|---|
| `/login` | — | Entrar con Google. |
| `/grupos` | Gastos | Lista de grupos, integrantes, deudas simplificadas, gastos, alta de gasto y modal de saldar. |
| `/actividad` | Amigos | Solicitudes de amistad enviadas y recibidas, amigos aceptados. |
| `/perfil` | Perfil | Alias para transferencias y descripción. |
| `/configuracion` | Config. | Cerrar sesión y, en modo demo, restablecer los datos. |

Las rutas privadas redirigen a `/login` si no hay sesión.

## 6. Modelo de datos (Firestore)

| Colección | Documento | Campos principales |
|---|---|---|
| `usuarios/{uid}` | Perfil | `nombre`, `email`, `alias`, `fotoUrl`, `descripcion`, `amigos` (lista de perfiles), `updatedAt` |
| `grupos/{id}` | Grupo | `nombre`, `miembros` (lista de uid), `descripcion`, `createdAt`, `updatedAt` |
| `grupos/{id}/gastos/{id}` | Gasto | `descripcion`, `monto`, `categoria`, `pagadoPorId`, `pagadoPorNombre`, `fecha` (ISO) |
| `solicitudesAmistad/{id}` | Solicitud | `emisor` (perfil), `emisorId`, `destinatarioEmail`, `estado` (`pendiente`, `aceptada`, `rechazada`), `createdAt` |
| `amistades/{uidA__uidB}` | Amistad | `miembros` (2 uid), `perfiles` (2 perfiles), `createdAt` |

**Reglas de seguridad** (`firestore.rules`): cada usuario lee y escribe solo su propio perfil; solo los integrantes de un grupo leen y modifican el grupo y sus gastos; las solicitudes y amistades solo las ven las personas involucradas. Publicadas y probadas con la app.

Puntos a mejorar en las reglas: cualquiera puede crear una amistad que lo incluya sin que la otra persona acepte, y cualquier integrante puede editar la lista de miembros de un grupo.

## 7. Cálculo de deudas

Implementado en `web/src/features/grupos/deudas.ts`, con tests.

1. **Balances:** por cada gasto, quien pagó recibe `monto − cuota` y cada uno de los demás integrantes `−cuota`, con `cuota = monto / cantidad de integrantes`.
2. **Simplificación:** el mayor deudor le paga al mayor acreedor, y se repite hasta saldar todo. Se ignoran saldos menores a un centavo.

Ejemplo (grupo de 4, gastos por $414.000): un integrante pagó $268.000 y los otros tres deben $67.500, $55.500 y $41.500. Quedan 3 transferencias en lugar de una cruzada entre todos.

La misma lógica existe como Cloud Function (`functions/src/index.ts`), pero la aplicación calcula en el navegador y hoy no la usa.

## 8. Modo demo

`npm run dev:seeds` levanta la app con datos de ejemplo (un usuario, 4 amigos, 3 grupos con gastos y una solicitud de amistad pendiente) y **sin conectarse a Firebase**, por lo que no lee ni pisa datos reales. Los cambios se guardan en el navegador. Configuración → "Restablecer datos de prueba" vuelve al estado inicial. El código está en `web/src/services/seedBackend.ts` y se activa con `--mode seeds`.

## 9. Calidad y flujo de trabajo

- **Ramas:** cada persona trabaja en `feature/...` o `fix/...` desde `develop`. PR hacia `develop`, revisión de un compañero, merge. `develop` pasa a `main` solo en las entregas, también por PR. `main` es producción.
- **Branch protection** en `main` y `develop`: PR obligatorio, 1 aprobación, CI en verde, sin bypass ni force-push. Detalle en [`SETUP-REPO.md`](../SETUP-REPO.md).
- **CI** (`.github/workflows/ci.yml`): `lint`, `typecheck`, `test` y `build` en cada push y PR. No cubre `functions/`.
- **Tests:** 10 tests automáticos (deudas, formato de fecha, configuración de Firebase).
- **Verificación de esta versión:** typecheck, lint, tests y build en verde; CI verde en GitHub; recorrido de 21 pasos en un navegador real (login, deudas, saldar, gastos, grupos, amigos, perfil y cierre de sesión) sin errores de consola.
- **Base de datos real:** login con Google, creación de grupo y de gasto y persistencia tras recargar, probados con Firebase por Lucas.

## 10. Equipo: quién hizo qué

Fuente: historial de git, Pull Requests y tablero de Trello.

| Integrante | Aportes | En curso |
|---|---|---|
| **Lucas Tomas Motta** (GitHub `Lumo27`) | Migración del proyecto a Vite + React + TypeScript + Tailwind, con sistema de diseño, navegación y PWA (#1, #3, #4, #5). Proyecto de Firebase y conexión del front (#2). CI y branch protection (#6). Configuración de Vitest. Modo demo y correcciones de pantallas (PR #5, #27). Revisión de PRs, organización de Trello y esta documentación. | #7 modelo de datos, #8 reglas, #9 función de deudas, #21 planilla de IA |
| **German Morales** (GitHub `Sherman-cdm`) | Estructura y tema visual iniciales (PR #1). Login con Google, sesión, grupos, gastos, deudas, Cloud Function, amistades y reglas de Firestore (PR #2: #10, #14, #26). | #12 lista de grupos con balance |
| **Candela** (GitHub `Candela-Sandoval`) | PR #3 abierto con el formulario de carga de gastos y otras pantallas; pendiente de correcciones y de resolver conflictos. | #15 cargar gasto, #18 saldar deuda |
| **Vladimir Viale** (GitHub `Vladi1221`) | Creó el repositorio. | #19 recordatorio por WhatsApp (todavía sin subir), #20 README |
| **Nahu** (GitHub `Nahu2300`) | — | #11 perfil (asignada, sin código subido) |

`Code-Libre` figura como colaborador en GitHub, sin actividad ni tarjetas hasta hoy.

### Estado del tablero

| Lista | Tarjetas |
|---|---|
| **Hecho** | #1, #2, #3, #4, #5, #6, #10, #14, #26, #27 |
| **En progreso** | #7, #8, #9, #12, #15, #18, #19, #21 |
| **Asignada** | #11, #20 |
| **Backlog** | #13, #16, #17, #22, #23, #24, #25, #28 |

## 11. Pendientes y decisiones abiertas

- Publicar y desplegar en Vercel desde `main`: requiere una entrega de `develop` a `main` (hoy `main` está 16 commits atrás), las claves en Vercel, el dominio agregado en los dominios autorizados de Firebase y un `vercel.json` para las rutas.
- Resolver el PR #3 (conflictos con `develop`): conviene reducirlo al formulario de cargar gasto, porque el detalle de grupo y el saldar ya existen en `GruposScreen`.
- Decidir si se pasa Firebase al plan Blaze para habilitar Storage (foto del ticket) y desplegar la Cloud Function.
- Dejar un único origen del algoritmo de deudas (hoy está en `deudas.ts` y en `functions/src/index.ts`) y cubrir `functions/` con tests y con el CI.
- Documentar los campos del modelo de datos en `src/types/` (tarjeta #7).
- Probar la instalación de la PWA en un celular real (tarjeta #22). El manifest usa solo un ícono SVG.
- Aplicar las tipografías definidas en los wireframes; hoy se usan las del sistema.
- Completar el registro de uso de IA de cada integrante (ver [`INFORME-USO-IA.md`](./INFORME-USO-IA.md)).
