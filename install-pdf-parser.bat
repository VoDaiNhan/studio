@echo off
echo Installing PDF parser library...
echo.
npm install pdf-parse
echo.
if %ERRORLEVEL% EQU 0 (
    echo Installation successful!
) else (
    echo Installation failed!
)
echo.
pause
