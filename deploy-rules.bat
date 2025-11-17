@echo off
echo ========================================
echo   Deploy Firebase Rules
echo ========================================
echo.

echo Checking Firebase CLI...
firebase --version >nul 2>&1
if errorlevel 1 (
    echo Firebase CLI is not installed!
    echo.
    echo Please install it first:
    echo npm install -g firebase-tools
    echo.
    pause
    exit /b 1
)

echo Firebase CLI found!
echo.

echo Logging in to Firebase...
firebase login

echo.
echo Deploying Firestore Rules...
firebase deploy --only firestore:rules --project studio-3896797610-76c8c

echo.
echo Deploying Storage Rules...
firebase deploy --only storage --project studio-3896797610-76c8c

echo.
echo ========================================
echo   Deployment Complete!
echo ========================================
echo.
pause
