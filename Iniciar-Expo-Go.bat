@echo off
setlocal
 title Splitwaisito - Expo Go
cd /d "%~dp0mobile"
if errorlevel 1 goto carpeta_error

where node >nul 2>nul
if errorlevel 1 goto node_error
where npm >nul 2>nul
if errorlevel 1 goto node_error

if exist "node_modules\expo\package.json" goto iniciar
 echo Instalando las dependencias de la app...
call npm ci
if errorlevel 1 goto instalar_error

:iniciar
 echo.
 echo Conecta el celular y la computadora a la misma red Wi-Fi.
 echo Android: escanea el QR desde Expo Go.
 echo iPhone: escanea el QR con la Camara.
 echo Deja esta ventana abierta mientras usas la app.
 echo Para detenerla, presiona Ctrl+C.
 echo.
if exist ".env.local" goto iniciar_firebase
 echo Iniciando Splitwaisito en modo demo sin credenciales...
 call npm run start:seeds -- --go --lan
 goto verificar_salida

:iniciar_firebase
 echo Iniciando Splitwaisito conectado a Firebase real...
 call npx expo start --clear --go --lan

:verificar_salida
if errorlevel 1 goto iniciar_error
 goto fin

:node_error
 echo No se encontro Node.js o npm. Instala Node.js y vuelve a abrir este archivo.
 goto fin

:carpeta_error
 echo No se encontro la carpeta mobile. Deja este BAT en la raiz del proyecto.
 goto fin

:instalar_error
 echo No se pudieron instalar las dependencias. Revisa la conexion y el mensaje anterior.
 goto fin

:iniciar_error
 echo Expo no pudo iniciarse. Revisa el mensaje anterior.

:fin
 echo.
pause
endlocal