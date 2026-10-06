# Splitwaisito en Expo Go

## Probar en Android y iPhone

Requisitos: Node.js 22.13 o superior y Expo Go compatible con SDK 57.

```powershell
cd C:\Users\German\Desktop\Splitwaisito\mobile
npm install
npm run start:seeds -- --go
```

Conectar el celular y la computadora a la misma red Wi-Fi. En Android, escanear el QR desde Expo Go. En iPhone, escanearlo con Cámara y abrir Expo Go. Si la red bloquea la conexión local, probar `npm run start:seeds -- --go --tunnel` (Expo puede solicitar instalar su dependencia de túnel).

El modo demo usa datos de ejemplo y AsyncStorage, sin credenciales ni conexiones a Firebase. Permite entrar, listar grupos y comprobar navegación. Crear grupo, cargar gasto, saldar, amigos y perfil siguen pendientes de migración: la compilación correcta no implica que esas funciones estén terminadas.

## Login real

Google OAuth necesita una compilación de desarrollo con un esquema propio; Expo Go no admite ese flujo. Ver https://docs.expo.dev/guides/authentication/. Firebase y su persistencia están preparados, pero la pantalla de login real sigue pendiente. No usar el acceso temporal como prueba de autenticación.

## Verificaciones

```powershell
npm run typecheck
npm test
npx expo lint
npx expo-doctor
```

Para comprobar los paquetes móviles sin un teléfono:

```powershell
$env:EXPO_PUBLIC_MODO_SEEDS = 'true'
npx expo export --platform android --platform ios
```

La prueba final requiere abrir la app en dispositivos Android e iOS, entrar con datos de ejemplo, navegar por los grupos y cerrar/reabrir para verificar persistencia.
