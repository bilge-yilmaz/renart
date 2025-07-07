@echo off
echo ==========================================
echo BACKEND HEROKU DEPLOYMENT
echo ==========================================
echo.

echo [STEP 1] Backend klasorune geciliyor...
cd backend

echo [STEP 2] Git repository hazirlaniyor...
git init
git add .
git commit -m "Backend ready for Heroku"

echo [STEP 3] Heroku kontrol ediliyor...
where heroku >nul 2>nul
if errorlevel 1 (
    echo HATA: Heroku CLI bulunamadi!
    echo Lutfen Heroku CLI kurun: https://devcenter.heroku.com/articles/heroku-cli
    pause
    exit /b 1
)

echo.
echo ==========================================
echo HAZIR! Simdi bu komutlari calistir:
echo ==========================================
echo.
echo 1) HEROKU LOGIN:
echo    heroku login
echo.
echo 2) APP OLUSTUR:
echo    heroku create your-backend-name
echo.
echo 3) DEPLOY ET:
echo    git push heroku main
echo.
echo 4) URL'i kopyala ve frontend/.env.production'a yaz
echo.
echo ==========================================
echo Backend Heroku'ya hazir!
echo ==========================================
pause 