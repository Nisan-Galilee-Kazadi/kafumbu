#!/usr/bin/env bash
# 🚀 KAFUMBU SMART CITY - ADMIN DASHBOARD START SCRIPT
# ========================================================

echo "╔════════════════════════════════════════════════════════════════════════════╗"
echo "║                 KAFUMBU SMART CITY - ADMIN DASHBOARD                       ║"
echo "║                      🚀 DÉMARRAGE RAPIDE                                   ║"
echo "╚════════════════════════════════════════════════════════════════════════════╝"
echo ""

# Vérifications préalables
echo "📋 Vérifications préalables..."
echo ""

if ! command -v mysql &> /dev/null
then
    echo "❌ MySQL n'est pas installé ou n'est pas dans le PATH"
    echo "   Installez MySQL: https://dev.mysql.com/downloads/mysql/"
    exit 1
fi

if ! command -v node &> /dev/null
then
    echo "❌ Node.js n'est pas installé"
    echo "   Installez Node.js: https://nodejs.org/"
    exit 1
fi

echo "✅ MySQL détecté: $(mysql --version)"
echo "✅ Node.js détecté: $(node --version)"
echo ""

# Base de données
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "1️⃣  CONFIGURATION BASE DE DONNÉES"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Importer le schéma SQL:"
echo ""
echo "  mysql -u root -p < database_schema.sql"
echo ""
echo "Si la commande ci-dessus échoue, essayez:"
echo "  mysql -u root -p kafumbu_smartcity < database_schema.sql"
echo ""
read -p "Appuyez sur ENTRÉE après avoir importé la BD..."
echo ""

# Backend
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "2️⃣  INSTALLATION ET DÉMARRAGE DU BACKEND"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Installation des dépendances backend..."
cd server
npm install --quiet

echo ""
echo "✅ Backend prêt!"
echo ""
echo "Pour démarrer le backend dans un NOUVEAU TERMINAL, exécutez:"
echo ""
echo "  cd server"
echo "  npm run dev"
echo ""
echo "Le backend démarre sur http://localhost:4000"
echo ""
read -p "Appuyez sur ENTRÉE quand le backend est démarré..."
echo ""

# Frontend
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "3️⃣  INSTALLATION ET DÉMARRAGE DU FRONTEND"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Remontrer à la racine
cd ..

echo "Installation des dépendances frontend..."
npm install --quiet

echo ""
echo "✅ Frontend prêt!"
echo ""
echo "Pour démarrer le frontend, exécutez:"
echo ""
echo "  npm run dev"
echo ""
echo "Le frontend démarre sur http://localhost:5173"
echo ""

# Infos finales
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎉 CONFIGURATION TERMINÉE!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📌 ÉTAPES FINALES:"
echo ""
echo "1. Assurez-vous que MySQL est en cours d'exécution"
echo ""
echo "2. Dans un premier TERMINAL, démarrez le backend:"
echo "   cd server && npm run dev"
echo ""
echo "3. Dans un deuxième TERMINAL, démarrez le frontend:"
echo "   npm run dev"
echo ""
echo "4. Ouvrez http://localhost:5173/admin dans votre navigateur"
echo ""
echo "5. Connectez-vous avec:"
echo "   Email: admin@kafumbu-smartcity.cd"
echo "   Password: Admin@123"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📚 Documentation:"
echo "   • ADMIN_SETUP.md - Guide d'installation détaillé"
echo "   • IMPLEMENTATION_SUMMARY.md - Résumé technique"
echo "   • VERIFICATION_CHECKLIST.md - Checklist complète"
echo ""
echo "✨ C'est bon! Bon développement! 🚀"
echo ""
