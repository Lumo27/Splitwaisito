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
