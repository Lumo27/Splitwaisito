@echo off
setlocal
title Splitwaisito - Expo Go

if exist "C:\Program Files\nodejs" set "PATH=C:\Program Files\nodejs;%PATH%"

:: Detectar ubicacion de la carpeta mobile
if exist "%~dp0mobile" (
    cd /d "%~dp0mobile"
) else if exist "%~dp0..\mobile" (
    cd /d "%~dp0..\mobile"
) else if exist "C:\Users\naju\.gemini\antigravity\scratch\Splitwaisito\mobile" (
    cd /d "C:\Users\naju\.gemini\antigravity\scratch\Splitwaisito\mobile"
) else (
    goto carpeta_error
)

where node >nul 2>nul
if errorlevel 1 goto node_error
where npm >nul 2>nul
if errorlevel 1 goto node_error

if exist "node_modules\expo\package.json" goto iniciar
echo ========================================================
echo Instalando las dependencias de la app (npm install)...
echo ========================================================
call npm install
if errorlevel 1 goto instalar_error

:iniciar
echo.
echo ========================================================
echo  Iniciando Splitwaisito en modo demo para Expo Go...
echo ========================================================
echo  1. Conecta tu celular y esta PC a la misma red Wi-Fi.
echo  2. Abre la app Expo Go en tu celular:
echo     - En Android: Escanea el codigo QR desde Expo Go.
echo     - En iPhone:  Escanea el codigo QR con la Camara.
echo  3. Deja esta ventana abierta mientras usas la app.
echo  4. Para detener el servidor, presiona Ctrl+C.
echo ========================================================
echo.
call npm run start:seeds -- --go --lan
if errorlevel 1 goto iniciar_error
goto fin

:node_error
echo ========================================================
echo ERROR: No se encontro Node.js o npm instalado.
echo Para poder correr Expo Go necesitas tener Node.js instalado.
echo Puedes descargarlo gratis desde: https://nodejs.org/
echo (Descarga la version LTS recomendada para la mayoria).
echo ========================================================
echo Abriendo sitio de descarga de Node.js en tu navegador...
start https://nodejs.org/
goto fin

:carpeta_error
echo ERROR: No se encontro la carpeta "mobile".
echo Asegurate de que el proyecto este en C:\Users\naju\.gemini\antigravity\scratch\Splitwaisito
goto fin

:instalar_error
echo ERROR: No se pudieron instalar las dependencias.
echo Revisa tu conexion a Internet o permisos.
goto fin

:iniciar_error
echo ERROR: Expo no pudo iniciarse correctamente. Revisa el mensaje anterior.

:fin
echo.
pause
endlocal