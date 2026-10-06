# Splitwaisito en Expo Go

## Probar en Android y iPhone

Requisitos: Node.js 22.13 o superior y Expo Go compatible con SDK 57.

```powershell
cd mobile
npm install
npm run start:seeds -- --go
```

Conectar teléfono y computadora a la misma Wi-Fi. Android: escanear desde Expo Go. iPhone: escanear con Cámara y abrir Expo Go. Si la red bloquea la conexión local, usar `npm run start:seeds -- --go --tunnel`.

El modo demo usa AsyncStorage sin credenciales de Firebase. Las pantallas migradas son inicio de sesión, grupos, detalle, crear grupo, cargar/editar gasto, saldar deuda, amigos, perfil, configuración y pantalla no encontrada. Foto y ubicación son opcionales. Las deudas respetan los participantes seleccionados en cada gasto. Saldar copia los datos y abre Mercado Pago; la app no transfiere dinero ni registra una transferencia como pagada automáticamente.

## Acceso real

Copiar `.env.example` a `.env.local`, completar Firebase y ejecutar `npm start -- --go` sin la variable de modo demo. El acceso por e-mail/contraseña requiere habilitar ese proveedor en Firebase y un usuario existente. Las reglas de Firestore y Storage deben permitir las operaciones autorizadas. No se verificó el flujo real con credenciales en esta migración.

Google OAuth sigue pendiente de implementación y configuración y requiere una compilación de desarrollo con esquema propio: https://docs.expo.dev/guides/authentication/.

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