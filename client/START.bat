@echo off
REM 🚀 KAFUMBU SMART CITY - ADMIN DASHBOARD START (Windows)
REM ========================================================

chcp 65001 >nul 2>&1

echo.
echo ╔════════════════════════════════════════════════════════════════════════════╗
echo ║                 KAFUMBU SMART CITY - ADMIN DASHBOARD                       ║
echo ║                      🚀 DÉMARRAGE RAPIDE (Windows)                         ║
echo ╚════════════════════════════════════════════════════════════════════════════╝
echo.

REM Vérifications
echo 📋 Vérifications préalables...
echo.

where node >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js n'est pas installé ou n'est pas dans le PATH
    echo    Installez Node.js: https://nodejs.org/
    pause
    exit /b 1
)

for /f "tokens=*" %%A in ('node --version') do set NODE_VERSION=%%A
echo ✅ Node.js détecté: %NODE_VERSION%
echo.

REM Base de données
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo 1️⃣  CONFIGURATION BASE DE DONNÉES
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
echo Importer le schéma SQL dans MySQL:
echo.
echo   mysql -u root -p ^< database_schema.sql
echo.
echo Ou si vous avez un mot de passe:
echo.
echo   mysql -u root -p"votre_mot_de_passe" ^< database_schema.sql
echo.
pause

REM Backend
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo 2️⃣  INSTALLATION DU BACKEND
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.

cd server
echo Installation des dépendances backend...
call npm install
echo ✅ Backend prêt!
echo.

cd ..

REM Frontend
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo 3️⃣  INSTALLATION DU FRONTEND
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.

echo Installation des dépendances frontend...
call npm install
echo ✅ Frontend prêt!
echo.

REM Infos finales
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo 🎉 CONFIGURATION TERMINÉE!
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
echo 📌 ÉTAPES FINALES:
echo.
echo 1. Assurez-vous que MySQL est en cours d'exécution
echo.
echo 2. Dans un premier CMD/PowerShell, démarrez le backend:
echo    cd server ^&^& npm run dev
echo.
echo 3. Dans un deuxième CMD/PowerShell, démarrez le frontend:
echo    npm run dev
echo.
echo 4. Ouvrez http://localhost:5173/admin dans votre navigateur
echo.
echo 5. Connectez-vous avec:
echo    Email: admin@kafumbu-smartcity.cd
echo    Mot de passe: Admin@123
echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
echo 📚 Documentation:
echo    • ADMIN_SETUP.md - Guide d'installation détaillé
echo    • IMPLEMENTATION_SUMMARY.md - Résumé technique
echo    • VERIFICATION_CHECKLIST.md - Checklist complète
echo.
echo ✨ C'est bon! Bon développement! 🚀
echo.

pause
