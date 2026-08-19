@echo off
setlocal

set "PROJECT_DIR=%~dp0"
set "RUNTIME_PY=C:\Users\Mmm\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe"

if exist "%RUNTIME_PY%" (
  set "PYTHON_EXE=%RUNTIME_PY%"
) else (
  set "PYTHON_EXE=python"
)

echo Building and starting Digital Baltic...
echo.
echo The local preview now matches the GitHub Pages static deployment.
echo If you want fresh Copernicus SST data first, run:
echo   %PYTHON_EXE% scripts\update_copernicus.py
echo.
echo Opening:
echo   http://127.0.0.1:8000/
echo.
cd /d "%PROJECT_DIR%"
start "" "http://127.0.0.1:8000/"
"%PYTHON_EXE%" scripts\build_site.py
"%PYTHON_EXE%" frontend\serve_frontend.py
