# Informe de uso de IA — Splitwaisito

Registro del uso de IA en el proyecto, como pide la consigna. Este informe cubre el trabajo de **Lucas Tomas Motta**; cada integrante completa el suyo (ver sección 5). Para el detalle fila por fila se usa la planilla `planilla-uso-ia.xlsx`.

Actualizado al **21/09/2026**.

## 1. Herramienta y criterio

- **Herramienta:** Claude Code (asistente de programación de Anthropic, modelo Claude Sonnet 5), usado desde VS Code sobre el repositorio.
- **Para qué se usó:** configurar herramientas del proyecto, revisar Pull Requests, escribir y probar código, ordenar el tablero de Trello y documentar.
- **Criterio de trabajo:** la IA propone o implementa; Lucas define qué se hace, prueba en su navegador y decide qué se integra. Todo cambio entra por Pull Request, pasa por el CI (lint, tipos, tests y build) y necesita la aprobación de otra persona.
- **Lo que no hizo la IA:** crear la cuenta y el proyecto de Firebase, publicar las reglas de Firestore, probar el login real con Google (requiere el navegador y una cuenta) ni asignar personas a las tarjetas de Trello. Eso lo hizo Lucas.

## 2. Resumen por sesión

| Sesión | Fecha | Qué se hizo | Resultado |
|---|---|---|---|
| 1 | 04/09 | Sincronizar `main` y `develop` con los documentos de diseño; ordenar las tarjetas de Trello según lo hecho. | `main` y `develop` al día. |
| 2 | 14–16/09 | Conectar el front con Firebase, configurar los tests y armar el CI con protección de ramas. | Ver tabla 3 (tareas 1 a 3). |
| 3 | 20/09 | Revisar y corregir los PRs #2 y #3, crear el modo demo y reordenar el tablero. | PR #2 aprobado y mergeado, PR #5 mergeado. |
| 4 | 21/09 | Verificar `develop` y redactar esta documentación. | `docs/DOCUMENTACION.md` y este informe. |

## 3. Detalle por tarea

| # | Tarea | Prompt clave (resumido) | Qué se usó de la respuesta | Cómo se verificó |
|---|---|---|---|---|
| 1 | Conexión con Firebase | "Configurá Firebase en este proyecto: instalá el paquete, creá `.env.local` y `.env.example`, y el archivo `firebase.ts` sin Analytics." | `services/firebase.ts`, `.env.example`, ajustes de README. Las credenciales las cargó Lucas a mano. | Arranque de la app sin errores; el archivo con claves queda fuera de git. |
| 2 | Vitest | "Instalá y configurá Vitest en el `vite.config.ts` existente, con globals y tipos para TypeScript." | Bloque `test` en `vite.config.ts`, scripts `test` y `test:watch`, tipos en `tsconfig.app.json`. | `npm run test` y `tsc -b` en verde. |
| 3 | CI y protección de ramas | Configurar el CI y dejar documentada la protección de `main` y `develop`. | `.github/workflows/ci.yml`, `SETUP-REPO.md` y el script `typecheck`. Las reglas de la protección las aplicó Lucas en GitHub. | Dos corridas de CI en verde antes de activar la protección; luego comprobación por API de GitHub. |
| 4 | Revisión de los PRs #2 y #3 | "Revisá el código de los dos PRs y dejale un comentario a Cande con lo que está mal." | Diagnóstico de errores de compilación, datos falsos y conflictos; comentario en el PR #3. | Se corrieron typecheck, lint, tests y build sobre cada rama en copias de trabajo aisladas. |
| 5 | Correcciones al PR #2 (login y deudas) | "Fijate de arreglar todo lo que tenga." | Login que ya no abre una sesión falsa cuando Firebase falla; misma tolerancia de un centavo en la simplificación de deudas y su test. | CI en verde y aprobación de Lucas antes del merge. |
| 6 | Modo demo y correcciones de pantallas (PR #5) | "Hacete una rama para mockear o para seeds, así tenemos datos falsos." | `seedBackend.ts` y el modo `npm run dev:seeds`; arreglos de botón de Google, fechas, monto al saldar y alias del perfil. Historial rearmado en 11 commits atómicos. | Recorrido de 21 pasos en Chrome con Playwright, sin errores de consola; CI en verde y aprobación de otro integrante. |
| 7 | Tablero de Trello | "Movéme las tareas que ya terminamos según lo que trabajamos" y reordenar según el estado real de los PRs. | Movimiento de tarjetas y creación de las #27 y #28. | Comparación de cada tarjeta con el código y con los PRs. |
| 8 | Documentación | "Hacete una documentación del proyecto y el informe de uso de IA." | Estos dos documentos. | Datos tomados del historial de git, los PRs y el tablero; `develop` verificado antes de redactar. |

## 4. Consultas y aprendizaje

Lucas no conocía Firebase, así que se usó la IA también para entender qué es y qué hace cada servicio antes de decidir. Temas consultados y qué se aprendió:

- **Servicios:** qué hacen Authentication, Firestore, Storage y Cloud Functions, y cuáles necesita la aplicación hoy.
- **Login con Google:** funciona desde `localhost` sin desplegar, porque ese dominio viene autorizado; desde una IP de la red no.
- **Reglas de Firestore:** cómo se limita el acceso a los datos de cada grupo y usuario, y por qué la base en modo producción rechaza todo hasta publicarlas.
- **Planes de Firebase:** Spark (gratis) y Blaze (pago por uso con la misma cuota gratuita), y qué servicios exigen Blaze (Storage y Cloud Functions).
- **Ambientes y despliegue:** un solo proyecto de Firebase alcanza para este trabajo; `main` es producción y se despliega en Vercel más adelante.

Estas consultas no generaron código por sí mismas; sirvieron para tomar decisiones.

## 5. Uso de IA del resto del equipo

Cada integrante suma sus propias filas a `planilla-uso-ia.xlsx` (herramienta, finalidad, prompt clave y qué se usó), tal como indica la hoja "Cómo completar". Tarjeta de Trello: #21.

| Integrante | Estado del registro |
|---|---|
| Lucas Tomas Motta | Cubierto en este informe. |
| German Morales | Pendiente. |
| Candela | Pendiente. |
| Vladimir Viale | Pendiente. |
| Nahu | Pendiente. |

## Registro de German — 06/10/2026

| Herramienta | Finalidad | Prompt clave | Qué se usó |
|---|---|---|---|
| Codex | Revisar el plan y preparar la base móvil para Expo Go en Android e iOS | «Leíste el plan de esta app? Tenemos que hacer que ande en Expo Go» | Actualización local de develop, diagnóstico de dependencias SDK 57, ajustes de compatibilidad y guía mobile/README.md. Se distingue el modo demo del login Google, que requiere un build de desarrollo. Las pruebas en teléfonos quedan pendientes. |

No se encontró la planilla planilla-uso-ia.xlsx en el repositorio; esta entrada conserva el registro para trasladarlo a la planilla cuando esté disponible.

### Migración de la lista de grupos — German, 06/10/2026

| Herramienta | Finalidad | Prompt clave | Qué se usó |
|---|---|---|---|
| Codex | Migrar la primera pantalla móvil | «Migrar las pantallas una por una, con un commit descriptivo por pantalla en una rama para PR» | Lista de grupos nativa con FlatList, estados de carga/error/vacío, actualización al volver y al deslizar, acceso al detalle y eliminación confirmada. Conserva los servicios Firebase/demo y la paleta existente. |

### Migración del detalle de grupo — German, 06/10/2026

| Herramienta | Finalidad | Prompt clave | Qué se usó |
|---|---|---|---|
| Codex | Migrar el detalle del grupo a Expo Go | «Sigamos con las migraciones de las demás pantallas una por una con sus commits» | Detalle nativo con integrantes, total, gastos, eliminación confirmada, alta de integrantes y deudas identificadas por deudor/acreedor. Reutiliza servicios y respeta participantes por gasto. |

### Crear grupo — German, 06/10/2026
Codex migró el formulario con validación de nombre, selección de amigos y guardado de integrantes en una sola creación; agregó componentes de formulario nativos reutilizables. Prompt: completar las migraciones con un commit por pantalla.

### Cargar gasto — German, 06/10/2026
Codex migró alta/edición, selección del pagador y reparto, validación de importes, ticket por cámara/galería y ubicación con permisos. Foto y GPS son opcionales. Agregó pruebas de validación; el modo demo conserva la foto como data URL y Firebase la sube a Storage.

### Saldar deuda — German, 06/10/2026
Codex migró la consulta de deuda por deudor/acreedor, copia real de e-mail y monto al portapapeles, apertura de Mercado Pago y manejo de transferencias ausentes. Mantiene el flujo manual de pago aprobado; no marca pagos ficticios.

### Amigos — German, 06/10/2026
Codex migró solicitudes por e-mail, aceptación/rechazo, lista y eliminación confirmada. Recarga al volver, sincroniza el store y el perfil incluso si ya no quedan amigos, valida e-mails y bloquea acciones duplicadas.

### Perfil — German, 06/10/2026
Codex migró foto/iniciales, nombre, e-mail, alias y descripción editable. Persiste primero en Firebase/demo y actualiza el store solo tras guardar; muestra confirmación y conserva el estado anterior ante errores.

### Configuración — German, 06/10/2026
Codex migró el estado de la sesión, salida y restablecimiento de demo con confirmaciones nativas. El reinicio restaura perfil, amigos y gastos coherentemente; el cierre no simula éxito si Firebase falla.

### Inicio de sesión — German, 06/10/2026
Codex migró acceso demo y login por e-mail/contraseña Firebase, retiró el acceso temporal sin autenticación y protegió las rutas. El arranque espera la hidratación y descarta respuestas de sesiones anteriores. Google OAuth sigue requiriendo un build de desarrollo y configuración externa; el proveedor e-mail debe estar habilitado en Firebase para el acceso real.

### Pantalla no encontrada — German, 06/10/2026
Codex reemplazó el último placeholder por una pantalla nativa con acceso al inicio y retiró los tres componentes provisionales que ya no se usan.
