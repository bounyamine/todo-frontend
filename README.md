# TaskManager Frontend

Interface frontend moderne pour l'API TaskManager construite avec React, Vite et Tailwind CSS.

## Fonctionnalités

- **Authentification complète** : Inscription, connexion et déconnexion
- **Gestion des tâches** : Créer, modifier, supprimer et marquer comme terminées
- **Filtrage avancé** : Par statut, utilisateur assigné et recherche textuelle
- **Tableau de bord** : Statistiques en temps réel et vue d'ensemble
- **Interface responsive** : Optimisée pour mobile et desktop
- **Notifications** : Toast notifications pour toutes les actions
- **Design moderne** : Interface clean avec Tailwind CSS

## Technologies utilisées

- React 18
- Vite
- Tailwind CSS
- React Router DOM
- Axios
- React Hook Form
- React Hot Toast
- Lucide React (icônes)
- date-fns

## Installation

1. Installer les dépendances :
```bash
npm install
```

2. Démarrer le serveur de développement :
```bash
npm run dev
```

3. Construire pour la production :
```bash
npm run build
```

## Configuration

L'application est configurée pour communiquer avec l'API backend sur `http://localhost:5000`. Assurez-vous que votre serveur backend est démarré avant d'utiliser l'interface.

## Structure du projet

```
src/
├── components/          # Composants réutilisables
│   ├── Navbar.jsx
│   ├── TaskCard.jsx
│   ├── TaskModal.jsx
│   └── ProtectedRoute.jsx
├── contexts/            # Contextes React
│   └── AuthContext.jsx
├── pages/              # Pages principales
│   ├── Login.jsx
│   ├── Register.jsx
│   └── Dashboard.jsx
├── services/           # Services API
│   └── api.js
├── App.jsx
├── main.jsx
└── index.css
```

## Fonctionnalités détaillées

### Authentification
- Inscription avec validation des champs
- Connexion sécurisée avec token JWT
- Gestion automatique des sessions
- Déconnexion avec nettoyage du localStorage

### Gestion des tâches
- Création de tâches avec titre, description, échéance et assignation
- Modification en temps réel
- Suppression avec confirmation
- Marquage comme terminé avec horodatage
- Statuts : À faire, En cours, Terminée

### Interface utilisateur
- Design responsive et moderne
- Cartes de tâches avec informations complètes
- Modales pour création/édition
- Filtres en temps réel
- Statistiques visuelles
- Notifications toast

### Sécurité
- Routes protégées
- Gestion automatique des tokens
- Redirection en cas de session expirée
- Validation côté client

L'interface est entièrement fonctionnelle et prête à être utilisée avec l'API backend.# todo-frontend
# todo-frontend
