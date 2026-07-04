@echo off
setlocal

pushd "%~dp0"
set "PORT=8181"

echo.
echo KP_Code Digital Studio source preview
echo Serving source project on:
echo   http://localhost:8181
echo.
echo This preview reads source files directly.
echo Refresh the browser after editing source files.
echo Press Ctrl+C to stop the preview server.
echo.

call npm run preview:source
set "PREVIEW_EXIT_CODE=%ERRORLEVEL%"

echo.
if not "%PREVIEW_EXIT_CODE%"=="0" echo Source preview exited with code %PREVIEW_EXIT_CODE%.

popd
pause
exit /b %PREVIEW_EXIT_CODE%
