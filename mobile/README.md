# Splitwaisito en Expo Go

## Inicio con doble clic en Windows

Abrir **Iniciar-Expo-Go.bat** desde la raiz del repositorio. Instala las dependencias si faltan e inicia Expo Go en modo demo mostrando el QR en la consola. Requiere Node.js y npm. Mantener la ventana abierta; detener con Ctrl+C. Si otro servidor esta usando el puerto, Expo puede ofrecer uno alternativo.

## Probar en Android y iPhone

Requisitos: Node.js 22.13 o superior y Expo Go compatible con SDK 57.

```powershell
cd mobile
npm install
npm run start:seeds -- --go
```

Conectar teléfono y computadora a la misma Wi-Fi. Android: escanear desde Expo Go. iPhone: escanear con Cámara y abrir Expo Go. Si la red bloquea la conexión local, usar `npm run start:seeds -- --go --tunnel`.

El modo demo usa AsyncStorage sin credenciales de Firebase. Las pantallas migradas son inicio de sesión, grupos, detalle, crear grupo, cargar/editar gasto, saldar deuda, amigos, perfil, configuración y pantalla no encontrada. Foto y ubicación son opcionales. Las deudas respetan los participantes seleccionados en cada gasto. Saldar copia el alias (o el e-mail) del acreedor para transferir desde cualquier banco o billetera; la app no mueve dinero. Después se sube la foto o captura del comprobante: Gemini (Firebase AI Logic) lee destinatario, alias, monto y fecha, y si coinciden con la deuda el pago se aprueba solo; si no, queda pendiente hasta que quien recibe el dinero lo apruebe o rechace desde el detalle del pago. Solo los pagos aprobados saldan la deuda. En modo demo no hay IA, así que los pagos nuevos quedan pendientes; el grupo «Viaje a Bariloche» trae un pago pendiente de Nahuel para probar la aprobación, y «Cena con Cande» muestra un gasto con ticket y ubicación ya saldado con un pago verificado. En el detalle de un gasto se ve, por persona, si ya pagó su parte (con enlace al comprobante), si el pago está en revisión o si todavía debe. Tocar un gasto o pago abre su detalle con foto, reparto y ubicación en Google Maps. «Recordarme pagar más tarde» programa una notificación local: en modo demo llega a los 10 segundos, con datos reales a la hora (no disponible en web).

En grupos en USD o BRL, el total, las deudas y la pantalla para saldarlas pueden mostrar una equivalencia aproximada en pesos. Se consulta DolarApi con el valor de venta y se guarda localmente por seis horas; sin conexión se conserva la última cotización disponible. Es una referencia informativa: los saldos y pagos siguen en la moneda del grupo. En grupos en ARS no se muestra.

## Datos de ejemplo (seeds)

Los datos mockeados existen solo en modo demo (`npm run start:seeds`); con `npm start` la app usa Firebase real y arranca vacía. Los seeds viven en `src/services/seedBackend.ts` (imágenes en `seedFotos.ts`) y sirven para mostrar cada funcionalidad a medida que se implementa. Al agregar datos, subir la versión de `CLAVE_DB` para que los dispositivos los regeneren. Desde Configuración, «Restablecer datos de ejemplo» vuelve al estado inicial.

| Grupo | Para mostrar |
|---|---|
| Viaje a Bariloche | Gasto con foto del ticket y ubicación (Cabaña), gasto con ubicación, gráfico por categoría, deudas simplificadas y un pago de Nahuel **pendiente de aprobación** con comprobante. |
| Cena con Cande | Gasto con ticket y mapa saldado por un pago **verificado automáticamente**; en el detalle se ve quién pagó su parte. |
| Depto Palermo | Deuda propia para probar Saldar deuda, subir comprobante y el estado «Pago en revisión». |
| Asado del sábado | Grupo chico sin extras. |

Además: una solicitud de amistad pendiente (Sofi) y cuatro amigos.

## Inicio de sesión

La pantalla de acceso mantiene la paleta verde y celeste de la app, con cabecera curva, campos con opción para mostrar la contraseña y animaciones de entrada y cambio entre acceso y registro. El correo se valida antes de enviar las credenciales; “¿Olvidaste tu contraseña?” usa el restablecimiento por correo de Firebase Authentication. El enlace “Leer Términos y Condiciones” abre el documento completo sin iniciar sesión. Google solo se muestra en builds nativos configurados; Expo Go ofrece demo y correo/contraseña. La pantalla se adapta al área segura y al teclado en iOS y Android.

## Términos y Condiciones

Las rutas de la app móvil y de la PWA web requieren aceptar los términos una sola vez por cuenta. La aceptación se guarda en `aceptacionesTerminos/{uid}` de Firestore con el UID, la versión aceptada, el estado y la fecha del servidor; las reglas de `firestore.rules` limitan lectura y escritura al titular y bloquean el acceso a grupos y amistades hasta aceptar. Una aceptación registrada no se invalida al cambiar la versión de los términos ni al cerrar sesión. La pantalla queda bloqueada si no se puede verificar el registro. En modo demo, sin autenticación ni backend, la aceptación se guarda solo para el usuario de ejemplo en el almacenamiento local.

El contenido aceptado compartido por ambas plataformas está en `shared/features/terminos/terminos.ts`. La versión 1.0.2 está fechada el 4 de noviembre de 2026. Si cambian las cláusulas, actualizar `TERMINOS_VERSION` en ese archivo y la versión permitida en `firestore.rules`; esto registra la versión aceptada por nuevas cuentas, pero no vuelve a pedir aceptación a cuentas que ya aceptaron. Publicar las reglas actualizadas en Firebase para que acepte la nueva versión.

## Ayuda interactiva

El botón `?` aparece en las pantallas autenticadas de móvil y web, y abre un tutorial por contexto con pasos navegables. Los textos compartidos están en `shared/features/ayuda/tutoriales.ts`. El contexto se deriva de la ruta para cubrir grupos, gastos, detalle y comprobantes, saldos, amistades, perfil y configuración.

Los módulos compartidos se mantienen fuera de `web/` y `mobile/` para que el build web no lea la configuración TypeScript de Expo. Metro incluye `shared/` como watch folder para poder empaquetar esos módulos en la app móvil.

## Acceso real

Copiar `.env.example` a `.env.local`, completar Firebase y ejecutar `npm start -- --go` sin la variable de modo demo. El acceso y el restablecimiento por e-mail requieren habilitar ese proveedor en Firebase Authentication; para crear una cuenta, el alta genera el usuario y su perfil. Las reglas de Firestore deben permitir las operaciones autorizadas. Para la verificación de comprobantes hay que habilitar Firebase AI Logic con la Gemini Developer API en la consola (Build > AI Logic); funciona en el plan Spark. No se verificó el flujo real con credenciales en esta migración.

El inicio de sesión con Google usa `@react-native-google-signin/google-signin` y solo funciona en el APK (compilación propia); en Expo Go se usan demo o e-mail/contraseña.

## Verificaciones

```powershell
npm run typecheck
npm test
npm run lint
npx expo-doctor
```

```powershell
$env:EXPO_PUBLIC_MODO_SEEDS = 'true'
npx expo export --platform android --platform ios --platform web --max-workers 2
```

Se verificó en navegador el recorrido demo: crear grupo, cargar y editar gasto, calcular deuda, copiar monto, aceptar amistad y guardar perfil con persistencia tras recargar. Las pruebas automáticas cubren importes y reparto de gastos. Exportar los paquetes no sustituye las pruebas en dispositivos: comprobar en Android e iOS cámara, galería, permisos/GPS, regreso desde Mercado Pago, teclado, cierre de sesión y persistencia tras reabrir.

En Windows Metro limita sus trabajadores a dos para reducir los errores de archivos abiertos durante desarrollo.