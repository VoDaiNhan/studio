@echo off
echo Deploying Firestore Rules to studio-3896797610-76c8c...
echo.
firebase deploy --only firestore:rules --project studio-3896797610-76c8c
echo.
if %ERRORLEVEL% EQU 0 (
    echo Deploy thanh cong!
) else (
    echo Deploy that bai! Kiem tra lai Firebase CLI.
)
echo.
pause
