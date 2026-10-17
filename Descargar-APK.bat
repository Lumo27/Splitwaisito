@echo off
setlocal
title Splitwaisito - Descargar APK
cd /d "%~dp0"
if errorlevel 1 goto carpeta_error

where node >nul 2>nul
if errorlevel 1 goto node_error

node "%~dp0Descargar-APK.js"
if errorlevel 1 goto script_error

goto fin

:node_error
echo.
echo [ERROR] No se encontro Node.js instalado o en el PATH.
echo Instala Node.js y vuelve a intentar.
echo.
goto fin

:carpeta_error
echo.
echo [ERROR] No se pudo acceder a la carpeta del proyecto.
echo Deja este archivo .BAT en la raiz de Splitwaisito.
echo.
goto fin

:script_error
echo.
echo [AVISO] El proceso finalizo con advertencias o errores.
echo.

:fin
echo.
pause
endlocal
