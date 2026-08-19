@echo off
setlocal

set "PROJECT_DIR=%~dp0"
set "RUNTIME_PY=C:\Users\Mmm\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe"

if exist "%RUNTIME_PY%" (
  set "PYTHON_EXE=%RUNTIME_PY%"
) else (
  set "PYTHON_EXE=python"
)

echo Starting Copenhagen Sea Live frontend...
echo.
echo If you have not generated data yet, run:
echo   %PYTHON_EXE% data_pipeline\download_temperature.py
echo.
echo Opening:
echo   http://127.0.0.1:8000/frontend/
echo.
start "" "http://127.0.0.1:8000/frontend/"
cd /d "%PROJECT_DIR%"
"%PYTHON_EXE%" frontend\serve_frontend.py
