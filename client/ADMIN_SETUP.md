# KAFUMBU SMART CITY - ADMIN DASHBOARD

## Configuration

### 1. Base de données

- Installez MySQL/MariaDB localement
- Créez la BD en exécutant `database_schema.sql`
- Configurez les identifiants dans `server/.env`

### 2. Backend

```bash
cd server
npm install
npm run dev
```

Cela lancera l'API sur `http://localhost:4000`

### 3. Frontend

```bash
npm install
npm run dev
```

Cela lancera le frontend sur `http://localhost:5173`

## Utilisateur Admin (démo)

- Email: `admin@kafumbu-smartcity.cd`
- Mot de passe: `Admin@123`

## API Endpoints

### Auth

- `POST /api/admin/login` - Connexion admin

### Users

- `GET /api/admin/users` - Lister les utilisateurs
- `GET /api/admin/users/:id` - Détail d'un utilisateur
- `PUT /api/admin/users/:id` - Modifier un utilisateur
- `DELETE /api/admin/users/:id` - Supprimer un utilisateur

### Campaigns

- `GET /api/admin/campaigns` - Lister les campagnes
- `POST /api/admin/campaigns` - Créer une campagne
- `PUT /api/admin/campaigns/:id` - Modifier une campagne
- `DELETE /api/admin/campaigns/:id` - Supprimer une campagne

### News

- `GET /api/admin/news` - Lister les publications
- `POST /api/admin/news` - Créer une publication
- `PUT /api/admin/news/:id` - Modifier une publication
- `DELETE /api/admin/news/:id` - Supprimer une publication

### Media

- `GET /api/admin/media` - Lister les médias
- `DELETE /api/admin/media/:id` - Supprimer un média

### Settings

- `GET /api/admin/settings` - Récupérer les paramètres
- `PUT /api/admin/settings/:key` - Modifier un paramètre

### Stats

- `GET /api/admin/stats` - Statistiques globales

## Fonctionnalités

### Dashboard Admin

- ✓ Vue d'ensemble avec statistiques en temps réel
- ✓ Gestion des utilisateurs (CRUD)
- ✓ Gestion des campagnes (création, modification, suppression)
- ✓ Gestion des publications (brouillon/publication)
- ✓ Gestion des médias
- ✓ Paramètres du site

### Authentification

- ✓ JWT pour l'authentification admin
- ✓ Stockage du token en localStorage
- ✓ Middleware de protection des routes

### Base de données

- ✓ Schema complet avec 8 tables
- ✓ Données de démo réalistes pré-insérées
- ✓ Relations et index pour les performances

## Architecture

```
Frontend (React/Vite)
├── src/
│   ├── pages/admin/ - Composants admin
│   ├── services/adminService.js - Appels API
│   └── context/LangContext.js - Contexte global

Backend (Express/Node.js)
├── src/
│   ├── index.js - Point d'entrée
│   ├── database.js - Connexion MySQL
│   ├── auth.js - Middleware JWT
│   ├── routes/admin.js - Endpoints admin
│   └── routes/payments.js - Endpoints paiements

Database (MySQL)
└── Schéma complet avec 8 tables + données de démo
```

## Notes

- Le mot de passe admin est actuellement en clair (à hasher en production)
- Les uploads de fichiers sont en local (ajouter S3 en production)
- JWT expirant dans 7 jours
- Tous les appels API nécessitent le token JWT
