# Guía de migración a React Native (Expo) — paso a paso

Fecha: 23/09/2026. El docente pidió volver a Expo/React Native, revirtiendo el cambio a PWA que el equipo había consultado y que se aprobó el 01/09 (ver [`../CLAUDE.md`](../CLAUDE.md) y la [ficha técnica](./ficha-tecnica-splitwaisito.pdf)). Este archivo es un runbook para que **Lucas lo siga paso a paso, comando por comando, usando Claude Code y supervisando cada paso** — no para delegar toda la migración de una.

Lo que hoy existe en `/web` (Vite + React + TS + Tailwind + Firebase + PWA) está documentado en [`DOCUMENTACION.md`](./DOCUMENTACION.md). Esta guía asume ese estado como punto de partida.

## Cómo usar esta guía

- Cada paso dice **qué hacer**, **con qué modelo** (`/model opus` o `/model sonnet`, escrito así en Claude Code) y trae **comandos** y/o un **prompt** listo para pegar.
- Arquitectura y decisiones con criterio → Opus. Conversión mecánica repetitiva, una vez que el patrón ya quedó definido con la primera pantalla → Sonnet. Cambiá de modelo antes de cada paso, no lo dejes en uno solo para todo el proceso.
- Anteponé siempre "leé CLAUDE.md y docs/DOCUMENTACION.md antes de tocar nada" en la primera interacción de cada sesión nueva de Claude Code, si no lo hace solo.
- Andá tildando los pasos a medida que los cerrás. Esto es punto de partida, no receta cerrada — si algo no aplica o lo resolvés distinto, anotalo en el propio archivo o en `docs/DOCUMENTACION.md` al terminar.

## Antes de arrancar: ramas, PRs y trabajo en curso

La guía original asumía que una sola persona migra en una sola rama y que el repo está quieto. No es así: el equipo es de 6, `main` y `develop` tienen protección (PR + 1 aprobación + CI verde) y hay trabajo abierto sobre `/web`. Antes del Paso 1:

### A. Dejar `develop` listo

- [x] **Mergear el PR #6 (docs).** Los prompts de esta guía dicen "leé `docs/DOCUMENTACION.md`"; ya está en `develop`.
- [x] **Commitear esta guía** dentro de un PR de docs, para que el resto del equipo la vea.
- [x] **Mergear el PR #3 (Cande).** Mergeado el 30/09 como `[#15] [#18] Cargar gasto y saldar deuda`: sin conflictos con `develop` y sin duplicar nada. Deja en `develop` la base que se porta a RN (ver B).

### B. Decidir qué pasa con el trabajo abierto en `/web`

Hoy hay trabajo local sin subir de German (#12), Nahu (#11), Vladimir (#19, #20) y Lucas (#7, #8, #9). Toda pantalla hecha en `/web` se va a reescribir.

Regla propuesta hasta que el esqueleto esté mergeado (Pasos 2 a 6): **no se abren pantallas nuevas en `/web`**. Sí puede seguir lo que se porta tal cual: lógica en TypeScript puro (`deudas.ts`, servicios de Firestore), las reglas de Firestore, la función de deudas y los tests. Avisar al equipo antes de empezar.

El PR #3 ya está mergeado. De ahí se porta a RN: `participantesDelGrupo()` en `deudas.ts`, los campos `fotoUrl`, `ubicacion` y `participantes` del gasto (store y `GastoFirestore`), `actualizarGasto()` y la lógica de `SaldarDeudaScreen` (copia el e-mail al entrar, estado vacío, link a Mercado Pago) y las validaciones de `CargarGastoScreen`. No se portan sus componentes web (`CategoryPill`, `ParticipantCircle`, `FileInput`, `MapPicker`). Tres cosas a corregir en la versión RN:

- Falta la pantalla de detalle del grupo (`/grupos/:id`).
- La ruta `/saldar/:grupoId/:index` identifica la deuda por su posición en la lista simplificada; si se carga un gasto en el medio, el índice puede apuntar a otra deuda. En RN se identifica por deudor y acreedor.
- Foto del ticket y ubicación son obligatorias para guardar el gasto; en RN van opcionales, para que cargar un gasto sea rápido.

### C. Una rama corta y un PR por paso (no una rama larga)

Una sola rama `feature/migracion-react-native` con todo terminaría en un PR gigante, imposible de revisar, y bloquearía a los demás hasta el final. Se trabaja así:

| Pasos | Rama (siempre desde `develop` actualizado) | Título del PR |
|---|---|---|
| 2 y 3 | `feature/rn-esqueleto` | `[#N] Esqueleto Expo y NativeWind` |
| CI (antes era el Paso 10) | `feature/rn-ci` | `[#N] CI de /mobile` |
| 4 y 5 | `feature/rn-store-firebase` | `[#N] Store y Firebase en RN` |
| 5 bis | `feature/rn-modo-demo` | `[#N] Modo demo en RN` |
| 6 | `feature/rn-componentes` | `[#N] Componentes base` |
| 8 (una por pantalla) | `feature/rn-pantalla-<nombre>` | `[#N] Pantalla <nombre> en RN` |
| 9 | `feature/rn-camara-gps` | `[#N] Cámara y GPS` |

Reglas: PR a `develop` (nunca a `main`), commits chicos y atómicos, sin línea `Co-Authored-By` (Claude Code la agrega por defecto: revisá la configuración de atribución antes de commitear), 1 aprobación y CI verde. Para probar la rama de otro: `git checkout <rama>`, `cd mobile && npm install && npx expo start`.

Trello: crear tarjetas nuevas para cada pantalla RN (numeración siguiente a la #28). Las tarjetas #11 a #26 quedan como referencia de requisitos, porque nombran archivos de `/web/src/...`.

### D. El CI de `/mobile` va antes, no al final

Hoy `.github/workflows/ci.yml` corre solo dentro de `web/`. Si `/mobile` entra sin CI, los PRs pasan "en verde" sin chequear nada. Por eso el CI de mobile se arma justo después del esqueleto. Cuidado con una trampa: si el workflow se limita a `paths: mobile/**` y se lo agrega como check obligatorio en la protección de ramas, los PRs que no tocan `mobile/` quedan esperando un check que nunca se ejecuta y **no se pueden mergear**. Dos salidas: correrlo siempre (sin filtro de rutas) y marcarlo como obligatorio, o dejarlo como no obligatorio.

### E. Qué necesita cada integrante

Node.js 20 o superior y la app **Expo Go** en el celular (gratis). Xcode y Android Studio son opcionales; el simulador de iPhone solo existe en Mac. Con el **modo demo** (Paso 5 bis) no hace falta ninguna credencial de Firebase, así que cualquiera puede probar la app en su celular con datos de ejemplo.

### F. Repartir el Paso 8

Una vez mergeados los Pasos 2 a 6, cada pantalla es un PR independiente y se puede repartir. Sugerencia según lo que ya tenía cada uno: Lucas, login y Firebase; German, grupos (lista, detalle y crear); Cande, cargar gasto; Nahu, perfil; Vladimir, amigos, configuración y el recordatorio por WhatsApp.

## 0. Antes de tocar código: 9 decisiones a cerrar (una tarde, no más)

| # | Decisión | Recomendación | Por qué |
|---|---|---|---|
| 1 | Estructura del repo | Carpeta nueva `/mobile` al lado de `/web`, no reemplazar `/web` todavía | No se tira el trabajo ya hecho y documentado en `/web`; su CI sigue verde mientras `/mobile` se arma. Se decide después si `/web` se archiva o se deja como estaba. |
| 2 | Expo managed vs RN puro | Expo managed | Para un equipo de facu con deadline, evita pelear con Xcode/Android Studio y da cámara/GPS como módulos ya resueltos. |
| 3 | Estilos | NativeWind | Ya está todo en clases Tailwind en `/web`; con NativeWind se mantiene casi la misma sintaxis en vez de reescribir todo a `StyleSheet`. |
| 4 | Navegación | Expo Router | Sigue siendo React Navigation por dentro (stack + bottom tabs, que era la idea original), pero Expo Router da rutas por archivo y las tabs ya vienen armadas con el template — menos plomería manual. |
| 5 | Estado global (Zustand) | Se mantiene igual; solo el `persist` cambia de `localStorage` a `AsyncStorage` | Es lo único que no existe en RN. |
| 6 | Firebase Auth — persistencia | `initializeAuth` + `getReactNativePersistence(AsyncStorage)` en vez de `getAuth()` | **Es la trampa real**: sin esto, el login no sobrevive un reinicio de la app. Firestore, Storage y `functions/` no cambian nada. |
| 7 | `GruposScreen.tsx` (798 líneas) | Partirlo en pantallas reales durante la migración | Oportunidad de no arrastrar el monolito a RN tal cual — hoy mezcla lista de grupos, detalle, cargar gasto, crear grupo y saldar deuda en un solo archivo. |
| 8 | Login con Google en el celular | `expo-auth-session` para desarrollar (anda en Expo Go); `@react-native-google-signin/google-signin` solo si hace falta la versión nativa (exige un build de desarrollo, no anda en Expo Go) | Necesita client IDs de Google Cloud/Firebase y, para la versión nativa, registrar las apps de iOS y Android. El dominio `localhost` autorizado de la web no aplica. Se configura una vez en la consola; es el único paso de esta migración que no es código. |
| 9 | Fecha de entrega y alcance | Preguntarle al docente antes de empezar | Define si se migra todo o solo lo núcleo (login, grupos, gastos, deudas, saldar) y si `/web` sigue contando como parte de la entrega. |

## Paso 1 — Preparar la rama

Modelo: no importa.

Cada paso (o grupo de pasos) tiene su propia rama corta y su PR a `develop`; ver la tabla de "Antes de arrancar". Para el esqueleto:

```bash
cd ~/splitwaisito/FF-Friend-Fly
git checkout develop
git pull
git checkout -b feature/rn-esqueleto
```

## Paso 2 — Iniciar el proyecto Expo

Modelo: **Opus**.

```bash
npx create-expo-app@latest mobile --template tabs
cd mobile
```

Prompt:

```
Estoy migrando Splitwaisito (hoy en /web, Vite+React+PWA) a React Native con Expo, en /mobile, en la rama feature/rn-esqueleto. Ya generé la base con `create-expo-app --template tabs` (Expo Router).

Leé CLAUDE.md y docs/DOCUMENTACION.md primero. Después:
1. Revisá la estructura que generó el template (carpeta app/(tabs)/).
2. Armá el esqueleto de navegación mapeando las tabs actuales de /web (Grupos, Actividad, Perfil, Configuración — ver web/src/components/TabsLayout.tsx), más una pantalla de Login fuera del grupo de tabs.
3. No migres lógica todavía, solo el esqueleto de navegación y archivos vacíos con el nombre de cada pantalla.
```

## Paso 3 — NativeWind

Modelo: **Opus** para el setup (una sola vez).

```bash
cd mobile
npm install nativewind react-native-reanimated react-native-safe-area-context
npm install --save-dev tailwindcss@^3.4.17
```

`/web` usa Tailwind 3, y NativeWind 4 necesita Tailwind 3 (no 4): dejá la misma versión mayor para que las clases coincidan. Confirmá contra la instalación oficial de NativeWind qué paquetes extra pide la versión que quede instalada (`babel-preset-expo` y otros suelen venir ya con Expo).

Prompt:

```
Configurá NativeWind en este proyecto Expo (mobile/) siguiendo la instalación oficial: tailwind.config.js con el preset de nativewind, global.css con las directivas @tailwind, babel.config.js con el preset y jsxImportSource de nativewind, y metro.config.js con withNativeWind.

Después portá la paleta de colores de /web (verde #3FA772, celeste #38BDF8, fondo #F8FAFC — ver docs/DOCUMENTACION.md sección 4) al theme.extend.colors de mobile/tailwind.config.js, con los mismos nombres de clase que se usan hoy en /web, para no tener que traducir nombres al migrar cada pantalla.
```

## Paso 4 — Estado global: Zustand + AsyncStorage

Modelo: **Sonnet**.

```bash
cd mobile
npm install @react-native-async-storage/async-storage
```

Prompt:

```
Copiá web/src/store/useAppStore.ts a mobile/store/useAppStore.ts, cambiando el storage del middleware `persist` de localStorage a AsyncStorage (@react-native-async-storage/async-storage) con `createJSONStorage`. No cambies la forma del estado ni la lógica, solo el motor de persistencia.

Ojo: ese archivo importa `MODO_SEEDS` de services/firebase.ts, que en /web sale de `import.meta.env.MODE` (Vite). En Expo `import.meta.env` no existe: reemplazalo por `process.env.EXPO_PUBLIC_MODO_SEEDS === 'true'`.
```

## Paso 5 — Firebase: Auth con persistencia real

Modelo: **Opus** (es la decisión con más riesgo de la migración).

Referencia de sintaxis (confirmar contra la versión de `firebase` instalada, porque cambió entre versiones del SDK):

```javascript
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
```

Prompt:

```
Migrá mobile/services/firebase.ts a partir de web/src/services/firebase.ts. La app, Firestore y Storage se inicializan igual que en /web (no cambia nada ahí). Auth sí cambia: en RN hay que inicializarlo con `initializeAuth` + `getReactNativePersistence(AsyncStorage)` en vez de `getAuth()`, si no la sesión no sobrevive un reinicio de la app.

Variables de entorno: en /web salen de `import.meta.env.VITE_FIREBASE_*`. En Expo no existe `import.meta.env`; se usa `process.env.EXPO_PUBLIC_FIREBASE_*` (mismas 6 claves, otro prefijo), definidas en `mobile/.env.local`, y agregá `mobile/.env.example` con las claves vacías. Los valores son los mismos que en `web/.env.local`; hay que pasarle al equipo el archivo nuevo, porque los nombres cambian.

Confirmá la sintaxis exacta contra la versión de `firebase` que quede en mobile/package.json (cambió entre versiones del SDK) y dejá un comentario en el código con la versión que estás asumiendo. Es posible que TypeScript no encuentre los tipos de `getReactNativePersistence`; si pasa, resolvelo acá y anotalo. Si en algún momento corremos `expo start --web`, avisame si este código rompe ahí (getReactNativePersistence no anda con el bundler web) — no es el caso principal de esta migración pero hay que dejarlo anotado si aplica.
```

## Paso 5 bis — Modo demo (datos de ejemplo)

Modelo: **Sonnet**. Rama: `feature/rn-modo-demo`.

La guía original no lo mencionaba, y es lo que permite que todo el equipo pruebe la app en su celular sin credenciales de Firebase ni login con Google (la decisión #8 es la parte más incómoda de configurar). En `/web` es `npm run dev:seeds`, con el backend falso de `web/src/services/seedBackend.ts` y el flag `MODO_SEEDS`.

Hay un problema técnico que hay que resolver acá: `seedBackend.ts` usa `localStorage` (síncrono) en 7 lugares, y en RN el almacenamiento es AsyncStorage (asíncrono). No se puede copiar tal cual.

Prompt:

```
Portá el modo demo de web/src/services/seedBackend.ts a mobile/services/seedBackend.ts. En web usa localStorage (síncrono); en React Native el almacenamiento es AsyncStorage (asíncrono). Proponé cómo adaptarlo (por ejemplo, mantener los datos en memoria y persistirlos en AsyncStorage al cambiar, cargándolos una vez al iniciar la app) antes de escribir código. El modo se activa con process.env.EXPO_PUBLIC_MODO_SEEDS === 'true' y en ese modo Firebase no se inicializa. Agregá el script `"start:seeds": "EXPO_PUBLIC_MODO_SEEDS=true expo start"` a mobile/package.json.
```

## Paso 6 — Sistema de diseño base

Modelo: **Sonnet**.

Prompt:

```
Migrá los componentes base de web/src/components/ (Button.tsx, Card.tsx, Avatar.tsx, Input.tsx) a mobile/components/, usando View/Text/Pressable/TextInput de React Native con las clases de NativeWind ya portadas en el paso 3. Mantené la misma API de props que tienen hoy, para no tener que tocar el código que los usa cuando migremos cada pantalla.
```

## Paso 7 — Partir GruposScreen.tsx

Modelo: **Opus** para el plan, **Sonnet** para ejecutar cada pieza una vez acordado.

Prompt (Opus):

```
web/src/features/grupos/GruposScreen.tsx tiene 798 líneas y mezcla: lista de grupos, detalle de grupo, cargar gasto, crear grupo y saldar deuda. Quiero aprovechar la migración a RN para partirlo en pantallas reales en vez de arrastrar el monolito. Proponeme cómo dividirlo (qué pantallas, qué queda como componente compartido, qué estado se comparte vía useAppStore vs params de navegación) antes de escribir código. No implementes todavía, solo el plan.
```

## Paso 8 — Migrar pantalla por pantalla

Modelo: **Sonnet** (el patrón ya está definido desde acá).

| Pantalla | Origen (`/web`) | Destino sugerido (`/mobile`) | Nota |
|---|---|---|---|
| Login | `features/auth/LoginScreen.tsx` | `app/login.tsx` | Login con Google en RN necesita un paquete propio (`expo-auth-session` o `@react-native-google-signin/google-signin`) — el popup/redirect web de Firebase Auth no funciona nativo. La decisión #8 de la tabla tiene que estar cerrada antes de empezar esta pantalla; usá Opus si hay dudas de cuál conviene. |
| Grupos (lista) | (del split del paso 7) | `app/(tabs)/grupos/index.tsx` | |
| Detalle de grupo | (del split del paso 7) | `app/(tabs)/grupos/[id].tsx` | |
| Cargar gasto | (del split del paso 7) | modal | |
| Crear grupo | (del split del paso 7) | modal | |
| Saldar deuda | (del split del paso 7) | modal | |
| Actividad (amigos) | `features/actividad/ActividadScreen.tsx` | `app/(tabs)/actividad.tsx` | |
| Perfil | `features/perfil/PerfilScreen.tsx` | `app/(tabs)/perfil.tsx` | |
| Configuración | `features/configuracion/ConfiguracionScreen.tsx` | `app/(tabs)/configuracion.tsx` | |

`deudas.ts` y `formatearFecha.ts` (con sus tests) son TypeScript puro, sin nada del DOM — se copian tal cual, solo ajustando imports.

Prompt genérico por pantalla (repetir cambiando origen/destino):

```
Migrá <pantalla origen> a <pantalla destino>. Reusá los componentes de mobile/components/ ya migrados y el store de mobile/store/useAppStore.ts. No reinventes la lógica de negocio: los archivos deudas.ts y formatearFecha.ts se copian tal cual (son TS puro), solo ajustá los imports.
```

## Paso 9 — Cámara y GPS

Modelo: **Sonnet**.

```bash
npx expo install expo-image-picker expo-camera expo-location
```

Prompt:

```
Reemplazá la carga de foto de ticket (en /web, `<input type="file" capture>` / getUserMedia, si ya está esa parte migrada) por expo-image-picker o expo-camera, y la geolocalización (navigator.geolocation + geocodificación inversa) por expo-location.
```

Nota: desde el PR #3, en `/web` el gasto ya guarda `fotoUrl` y `ubicacion` (`CargarGastoScreen` sube la foto y toma la ubicación con `navigator.geolocation`), pero el mapa es un placeholder y no hay geocodificación inversa (tarjetas #16, #17). Portá el modelo de datos y la subida a Storage; el selector de foto y la ubicación se hacen directo con los módulos de Expo.

## Qué NO se toca

- Firestore, Storage, Firestore rules y el proyecto de Firebase: sin cambios.
- `functions/` (Cloud Functions): corre server-side, no le importa qué cliente lo llama.
- La lógica de `deudas.ts`: se porta tal cual.
- El tablero de Trello, salvo actualizar las tarjetas que mencionan rutas de archivo de `/web/src/...`.

## Paso 10 — CI (hacerlo justo después del Paso 2)

Modelo: **Sonnet**. Rama: `feature/rn-ci`. Leer antes la sección D de "Antes de arrancar" (trampa de los checks obligatorios con filtro de rutas).

Prompt:

```
Sumá un job en .github/workflows/ (o un workflow separado) que corra dentro de mobile/: install, typecheck y `npx expo export` para detectar que el build no se rompe, sin tocar el CI existente de /web. Si copiamos deudas.test.ts y formatearFecha.test.ts tal cual, podés correrlos con el mismo Vitest — no hace falta testing de componentes RN para este alcance.
```

## Documentación a actualizar al terminar (pedido explícito de la consigna)

- `CLAUDE.md` y `README.md`: sección de stack técnico (Expo/React Native en vez de Vite/PWA).
- `docs/DOCUMENTACION.md`: estado actual, estructura del repo, cómo correrlo.
- Un archivo nuevo, `docs/decisiones-migracion-rn.md`, dejando por escrito que el docente pidió volver a RN, las 9 decisiones de la tabla y por qué se tomaron así. La consigna pide justificar y documentar decisiones, y este cambio de rumbo es justo el tipo de cosa que hay que dejar registrada.
- `docs/INFORME-USO-IA.md` y `planilla-uso-ia.xlsx`: cada prompt de esta guía que efectivamente uses cuenta como una fila.
- Trello: actualizar o anotar las tarjetas que quedaron desactualizadas por el cambio de rutas.

## Checklist final

- [ ] Todos los pasos entraron a `develop` por PRs separados, con CI verde y 1 aprobación (no una rama gigante)
- [ ] `/web` sigue funcionando y su CI sigue verde
- [ ] `expo start` (o un build de desarrollo) corre en un dispositivo o simulador real
- [ ] El modo demo (`start:seeds`) corre en Expo Go sin credenciales
- [ ] Login con Google funciona y la sesión persiste tras cerrar y reabrir la app
- [ ] Grupos, gastos, deudas simplificadas y saldar deuda funcionan igual que en `/web`
- [ ] Amigos (enviar, aceptar, rechazar) funciona
- [ ] Perfil se guarda en Firestore
- [ ] Firestore rules siguen validando igual (no cambiaron)
- [ ] CI en verde para `/mobile`
- [ ] Documentación del punto anterior actualizada

## Aclaración verificada el 06/10/2026: Expo Go y Google

La recomendación #8 sobre Google con expo-auth-session en Expo Go queda corregida: la documentación oficial actual indica que OAuth/OpenID necesita una compilación de desarrollo con esquema propio (https://docs.expo.dev/guides/authentication/). Para probar en Expo Go se usa el modo demo, sin credenciales. Las instrucciones actuales están en mobile/README.md. La migración funcional de las pantallas continúa pendiente.
