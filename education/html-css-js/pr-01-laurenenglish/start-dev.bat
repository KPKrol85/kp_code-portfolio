@echo off
setlocal
cd /d "%~dp0"

set "PYTHON_COMMAND="
set "PYTHON_ARGUMENTS="

where py >nul 2>&1
if not errorlevel 1 (
  py -3 --version >nul 2>&1
  if not errorlevel 1 (
    set "PYTHON_COMMAND=py"
    set "PYTHON_ARGUMENTS=-3"
  )
)

if not defined PYTHON_COMMAND (
  where python >nul 2>&1
  if not errorlevel 1 (
    python --version >nul 2>&1
    if not errorlevel 1 set "PYTHON_COMMAND=python"
  )
)

if not defined PYTHON_COMMAND (
  echo ERROR: Python 3 is required. Install Python and make ^"py -3^" or ^"python^" available.
  pause
  exit /b 1
)

%PYTHON_COMMAND% %PYTHON_ARGUMENTS% scripts\dev-server.py --check-port --port 8181
if errorlevel 1 (
  echo ERROR: Lauren English development server could not use port 8181.
  pause
  exit /b 1
)

call npm run build:html
if errorlevel 1 (
  echo ERROR: Initial shared HTML assembly failed.
  pause
  exit /b 1
)

%PYTHON_COMMAND% %PYTHON_ARGUMENTS% scripts\dev-server.py --port 8181 --skip-initial-build %*
set "EXIT_CODE=%ERRORLEVEL%"

if not "%EXIT_CODE%"=="0" (
  echo Development server stopped with exit code %EXIT_CODE%.
  pause
)

exit /b %EXIT_CODE%
