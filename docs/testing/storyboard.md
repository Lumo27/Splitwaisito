# Storyboard de pruebas — Splitwaisito

## Propósito

Este storyboard representa la navegación principal que debe seguirse durante las pruebas manuales y sirve como guía visual para ejecutar los casos documentados en `casos_de_prueba.csv`.

Las capturas corresponden al frontend móvil ejecutado en web como modo demo, con datos precargados y sin Firebase.

## Convenciones

- **Precondición:** estado inicial necesario antes de comenzar la escena.
- **Acción:** interacción que realiza el usuario.
- **Resultado esperado:** estado visible o navegación esperada.
- **Resultado observado:** dato que debe registrarse al ejecutar la prueba.

## Flujo 1 — Acceso al modo demo

| Escena | Precondición | Acción | Resultado esperado |
|---|---|---|---|
| 1. Login demo | La app inicia con `EXPO_PUBLIC_MODO_SEEDS=true` | El usuario observa la pantalla | Se muestra la opción de entrar con datos de ejemplo, sin credenciales Firebase |
| 2. Entrar | Usuario en login | Toca “Entrar con datos de ejemplo” | Se abre la lista de grupos y se cargan los datos locales |

![Login demo](storyboard/01-login.png)

Casos asociados: `TC-HU01-001` y `TC-HU01-008`.

## Flujo 2 — Consultar y crear grupos

| Escena | Precondición | Acción | Resultado esperado |
|---|---|---|---|
| 1. Lista de grupos | Sesión demo iniciada | Navega a Gastos | Se muestran los grupos precargados y su cantidad de integrantes |
| 2. Alta de grupo | Usuario en la lista | Toca Crear grupo | Se muestra el formulario con nombre, moneda e integrantes |
| 3. Validación | Nombre vacío | Toca Crear grupo | Aparece “Ingresá un nombre para el grupo.” y permanece en el formulario |
| 4. Alta válida | Se completa nombre, moneda y integrantes | Confirma la creación | Se crea el grupo y se abre su detalle |

![Lista de grupos](storyboard/02-grupos.png)

![Crear grupo](storyboard/03-nuevo-grupo.png)

Casos asociados: `TC-HU02-001`, `TC-HU02-002`, `TC-HU02-005`, `TC-HU02-008`.

## Flujo 3 — Consultar gastos y deudas

| Escena | Precondición | Acción | Resultado esperado |
|---|---|---|---|
| 1. Abrir detalle | Existe un grupo demo | Selecciona “Viaje a Bariloche” | Se muestran total, integrantes, gráfico, gastos y deudas |
| 2. Revisar gastos | Detalle cargado | Recorre la lista | Los gastos están ordenados y muestran importe, pagador y fecha |
| 3. Revisar reparto | Un gasto tiene participantes específicos | Abre el detalle o cálculo | El cálculo incluye solo a los participantes seleccionados |
| 4. Validar deudas | Hay saldos pendientes | Revisa la sección Deudas simplificadas | Se muestran las transferencias necesarias y los botones según el rol |

![Detalle del grupo](storyboard/04-detalle-grupo.png)

Casos asociados: `TC-HU03-001`, `TC-HU03-002`, `TC-HU03-003`, `TC-HU03-008`, `TC-HU03-009`.

## Flujo 4 — Cargar y editar gastos

| Escena | Precondición | Acción | Resultado esperado |
|---|---|---|---|
| 1. Abrir formulario | Usuario dentro de un grupo | Toca Cargar gasto | Se muestran descripción, monto, categoría, pagador, participantes y datos opcionales |
| 2. Validar descripción | Descripción vacía | Toca Guardar gasto | Aparece “Ingresá una descripción.” |
| 3. Validar monto | Monto cero, negativo o con formato inválido | Toca Guardar gasto | Aparece el mensaje de formato o rango correspondiente |
| 4. Elegir participantes | Ningún participante está seleccionado | Toca Guardar gasto | Aparece “Elegí al menos un participante del grupo.” |
| 5. Guardar válido | Datos válidos | Toca Guardar gasto | El gasto se agrega al grupo y vuelve al detalle |
| 6. Editar gasto | Existe un gasto | Toca Editar gasto, modifica el importe y guarda | El gasto actualizado reemplaza al anterior |

![Cargar gasto](storyboard/05-cargar-gasto.png)

Casos asociados: `TC-HU04-005`, `TC-HU04-007` a `TC-HU04-018`.

## Flujo 5 — Amigos

| Escena | Precondición | Acción | Resultado esperado |
|---|---|---|---|
| 1. Abrir Amigos | Sesión demo iniciada | Selecciona Amigos | Se muestran solicitudes pendientes y amigos aceptados |
| 2. Validar e-mail | Se ingresa un e-mail inválido | Toca Enviar solicitud | Aparece un mensaje de e-mail inválido |
| 3. Validar destinatario propio | Se ingresa el e-mail propio | Envía la solicitud | Aparece “Ingresá el e-mail de otra persona.” |
| 4. Validar amigo existente | Se ingresa un amigo ya aceptado | Envía la solicitud | Aparece “Esta persona ya está en tus amigos.” |
| 5. Actualizar | Se vuelve al tab | Toca Actualizar amigos | La lista y las solicitudes se recargan |

![Amigos](storyboard/06-amigos.png)

Casos asociados: `TC-HU06-005`, `TC-HU06-006`, `TC-HU06-007`, `TC-HU06-009`, `TC-HU06-010`.

## Flujo 6 — Perfil

| Escena | Precondición | Acción | Resultado esperado |
|---|---|---|---|
| 1. Consultar perfil | Sesión demo iniciada | Abre Perfil | Se muestran usuario, cotizaciones, alias y descripción |
| 2. Modificar datos | Usuario en Perfil | Cambia alias y descripción y guarda | Aparece confirmación y los datos quedan guardados |
| 3. Alias vacío | Alias borrado | Guarda los cambios | El perfil acepta un alias vacío |
| 4. Límite de descripción | Se ingresan exactamente 160 caracteres | Guarda | El texto se acepta dentro del límite |
| 5. Actualizar cotización | Hay conexión disponible | Toca el botón de actualización | Se solicitan las cotizaciones y se muestra la fecha de actualización |

![Perfil](storyboard/07-perfil.png)

Casos asociados: `TC-HU07-001`, `TC-HU07-002`, `TC-HU07-003`, `TC-HU07-006`, `TC-HU07-007`, `TC-HU07-008`.

## Flujo 7 — Configuración y cierre de sesión

| Escena | Precondición | Acción | Resultado esperado |
|---|---|---|---|
| 1. Consultar configuración | Sesión demo iniciada | Abre Configuración | Se muestran e-mail, modo demo, cerrar sesión y restablecer datos |
| 2. Cancelar cierre | Toca Cerrar sesión | Cancela el diálogo | Permanece en la sesión actual |
| 3. Confirmar cierre | Toca Cerrar sesión | Confirma el diálogo | Vuelve al login demo |
| 4. Cancelar restablecimiento | Toca Restablecer datos | Cancela | Los datos no cambian |
| 5. Confirmar restablecimiento | Confirma el restablecimiento | Toca continuar | Grupos, gastos, amigos y perfil vuelven al estado inicial |

![Configuración](storyboard/08-configuracion.png)

Casos asociados: `TC-HU08-001`, `TC-HU08-002`, `TC-HU08-004`, `TC-HU08-006`, `TC-HU08-007`.

## Matriz breve de evidencia

Durante cada ejecución se debe registrar:

| Caso | Captura esperada | Resultados posibles | Evidencia |
|---|---|---|---|
| Login y navegación | Pantalla de login y grupos | Aprobó / Falló / Bloqueado | Captura o video |
| Grupos | Lista y formulario | Aprobó / Falló / Bloqueado | Captura o video |
| Gastos | Formulario y detalle | Aprobó / Falló / Bloqueado | Captura o video |
| Amigos | Lista, solicitudes y validaciones | Aprobó / Falló / Bloqueado | Captura o video |
| Perfil | Datos cargados y guardados | Aprobó / Falló / Bloqueado | Captura o video |
| Configuración | Diálogos y sesión | Aprobó / Falló / Bloqueado | Captura o video |
