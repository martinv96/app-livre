# Application de Gestion de Bibliothèque

Application web complète pour gérer une bibliothèque avec système d'emprunts de livres.

## 📋 Fonctionnalités

- **Authentification** : Inscription et connexion des utilisateurs
- **Catalogue de livres** : Consultation avec recherche et filtres
- **Emprunts** : Système de réservation de livres
- **Historique** : Suivi des emprunts par utilisateur
- **Administration** : Gestion complète des livres (ajout, modification, suppression)

## 🛠️ Technologies utilisées

### Backend
- **Node.js** + **Express.js** 5.1.0
- **MongoDB** + **Mongoose** 8.20.0
- **JWT** (jsonwebtoken 9.0.2) pour l'authentification
- **bcrypt** 6.0.0 pour le hashage des mots de passe

### Frontend
- HTML5, CSS3, JavaScript vanilla
- Interface responsive et moderne
- Single Page Application (SPA)

## 📁 Structure du projet

```
app-livre/
├── config/
│   └── database.js          # Configuration MongoDB
├── models/
│   ├── User.js              # Modèle utilisateur
│   ├── Book.js              # Modèle livre
│   └── Loan.js              # Modèle emprunt
├── controllers/
│   ├── userController.js    # Logique authentification
│   ├── bookController.js    # Logique gestion livres
│   └── loanController.js    # Logique emprunts
├── routes/
│   ├── userRoutes.js        # Routes utilisateurs
│   ├── bookRoutes.js        # Routes livres
│   └── loanRoutes.js        # Routes emprunts
├── middleware/
│   └── authMiddleware.js    # Middleware JWT
├── public/
│   ├── index.html           # Interface utilisateur
│   ├── style.css            # Styles
│   └── app.js               # JavaScript frontend
├── .env                     # Variables d'environnement
├── server.js                # Point d'entrée
└── package.json
```

## 🚀 Installation

1. **Cloner le projet**
```bash
git clone <url-du-repo>
cd app-livre
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configurer les variables d'environnement**

Créer un fichier `.env` à la racine :
```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/bibliotheque
JWT_SECRET=votre_secret_jwt_super_securise
```

4. **Lancer MongoDB**

Assurez-vous que MongoDB est installé et en cours d'exécution sur votre machine.

5. **Démarrer l'application**

**Mode développement** (avec nodemon) :
```bash
npm run dev
```

**Mode production** :
```bash
npm start
```

6. **Accéder à l'application**

Ouvrir le navigateur : `http://localhost:3000`

## 📖 API Endpoints

### Utilisateurs
- `POST /api/users/register` - Inscription
- `POST /api/users/login` - Connexion

### Livres
- `GET /api/books` - Liste des livres (avec filtres optionnels)
- `POST /api/books` - Ajouter un livre (protégé)
- `PUT /api/books/:id` - Modifier un livre (protégé)
- `DELETE /api/books/:id` - Supprimer un livre (protégé)

### Emprunts
- `POST /api/loans` - Emprunter un livre (protégé)
- `GET /api/loans/:userId` - Historique d'un utilisateur (protégé)

## 🔐 Authentification

L'application utilise JWT (JSON Web Tokens) :
- Le token est stocké dans `localStorage` côté client
- Les routes protégées nécessitent un header `Authorization: Bearer <token>`
- Durée de validité : 24 heures

## 💡 Utilisation

1. **S'inscrire** avec un email et un mot de passe
2. **Se connecter** pour accéder aux fonctionnalités
3. **Parcourir le catalogue** et rechercher des livres
4. **Emprunter un livre** disponible
5. **Consulter l'historique** des emprunts
6. **Gérer les livres** via l'interface admin

## 📝 Modèles de données

### User
- email (unique)
- password (hashé)
- historiqueEmprunts (références vers Loan)

### Book
- titre
- auteur
- categorie
- isbn (unique)
- disponibilite (boolean)
- resume

### Loan
- userId (référence vers User)
- bookId (référence vers Book)
- dateEmprunt
- dateRetour
- status (en cours / retourné / en retard)

## 🎨 Interface

- **Page d'authentification** : Formulaires inscription/connexion
- **Catalogue** : Grille de livres avec recherche et filtres
- **Mon Profil** : Historique des emprunts
- **Admin** : Gestion des livres (CRUD)
- **Notifications** : Messages personnalisés pour chaque action
- **Confirmations** : Modales pour les actions critiques

## 🐛 Notes

- Les livres supprimés apparaissent comme "Livre supprimé" dans l'historique
- Un livre emprunté n'est plus disponible pour les autres utilisateurs
- L'interface est responsive et s'adapte aux mobiles

## 📦 Dépendances principales

```json
{
  "express": "^5.1.0",
  "mongoose": "^8.8.4",
  "jsonwebtoken": "^9.0.2",
  "bcrypt": "^6.0.0",
  "cors": "^2.8.5",
  "dotenv": "^16.4.7"
}
```

## 👨‍💻 Auteur
Martin Vallée
Projet réalisé dans le cadre de la formation CDA.
