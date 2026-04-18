@echo off
setlocal

cd /d "%~dp0"
set PORT=8181

where py >nul 2>nul
if %errorlevel%==0 (
    echo Serving this project at http://localhost:%PORT%/
    py -m http.server %PORT%
    goto :eof
)

where python >nul 2>nul
if %errorlevel%==0 (
    echo Serving this project at http://localhost:%PORT%/
    python -m http.server %PORT%
    goto :eof
)

echo Python was not found in PATH.
echo Install Python or add it to PATH, then run this file again.
pause
