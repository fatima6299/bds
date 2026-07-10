<!--
Author: Saliou Samba DIAO
Created: December 1, 2025
-->

# 🛍️ BDS E-commerce Backend API

Une API REST complète pour une plateforme e-commerce développée avec Node.js, Express et MySQL.

## 📋 Table des matières

- [Vue d'ensemble](#vue-densemble)
- [Fonctionnalités](#fonctionnalités)
- [Technologies](#technologies)
- [Installation](#installation)
- [Configuration](#configuration)
- [Démarrage](#démarrage)
- [Architecture](#architecture)
- [API Endpoints](#api-endpoints)
- [Authentification](#authentification)
- [Système de rôles](#système-de-rôles)
- [Exemples d'utilisation](#exemples-dutilisation)
- [Gestion des erreurs](#gestion-des-erreurs)
- [Sécurité](#sécurité)
- [Base de données](#base-de-données)
- [Tests](#tests)
- [Déploiement](#déploiement)

## 🎯 Vue d'ensemble

BDS Backend est une API REST moderne qui fournit toutes les fonctionnalités nécessaires pour une plateforme e-commerce :

- **Authentification JWT** avec gestion des rôles (3 niveaux)
- **Gestion des utilisateurs** avec permissions granulaires
- **Catalogue de produits** avec recherche et filtres avancés
- **Panier d'achat** avec gestion automatique des stocks
- **Système de commandes** avec suivi des statuts
- **Sécurité renforcée** avec token blacklist et validations strictes

## ✨ Fonctionnalités

### 🔐 Authentification & Autorisation
- Inscription/Connexion avec JWT
- Gestion des rôles : `user`, `admin`, `superadmin`
- Réinitialisation de mot de passe avec tokens sécurisés
- Déconnexion avec révocation de token (blacklist)
- Mise à jour de profil utilisateur

### 👥 Gestion des utilisateurs
- CRUD complet des utilisateurs
- Gestion des administrateurs (SuperAdmin uniquement)
- Permissions basées sur les rôles
- Validation des emails et téléphones uniques

### 🛍️ Catalogue produits
- CRUD complet des produits
- Recherche par nom, description, catégorie
- Filtres par catégorie, genre (male/female/unisex)
- Pagination des résultats
- Gestion des stocks en temps réel
- Système de réductions automatiques

### 🛒 Panier d'achat
- Ajout/suppression de produits
- Modification des quantités
- Calcul automatique des totaux avec réductions
- Vérification automatique des stocks

### 📦 Gestion des commandes
- Création de commandes à partir du panier
- Gestion des statuts : `pending`, `paid`, `failed`
- Historique des commandes utilisateur
- Administration des commandes (Admin)
- Annulation de commandes

## 🛠️ Technologies

- **Node.js** v18+ - Runtime JavaScript
- **Express.js** v5.1.0 - Framework web
- **MySQL** v8.0+ - Base de données relationnelle
- **MySQL2** v3.15.3 - Driver MySQL avec support des promesses
- **bcryptjs** v3.0.3 - Hachage des mots de passe
- **jsonwebtoken** v9.0.2 - Authentification JWT
- **express-validator** v7.3.1 - Validation des données
- **cors** v2.8.5 - Cross-Origin Resource Sharing
- **helmet** v8.1.0 - Sécurité HTTP headers
- **dotenv** v17.2.3 - Variables d'environnement

## 🚀 Installation

### Prérequis

- Node.js v18 ou supérieur
- MySQL v8.0 ou supérieur
- npm ou yarn

### Étapes d'installation

1. **Cloner le repository**
```bash
git clone https://github.com/fatima6299/bdsbusiness.git
cd bdsbusiness
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configurer la base de données**
```bash
# Créer la base de données et les tables
npm run init-db

# Créer le premier super administrateur
npm run create-admin
```

## ⚙️ Configuration

### Variables d'environnement

Créer un fichier `.env` à la racine du projet :

```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=votre_mot_de_passe_mysql
DB_NAME=bds

# JWT Configuration
JWT_SECRET=votre_secret_jwt_super_securise_a_changer_en_production
JWT_EXPIRES_IN=7d

# Server Configuration
PORT=3000
NODE_ENV=development
```

### Structure des fichiers

```
bds/
├── backend/
│   ├── controllers/        # Logique métier
│   ├── models/            # Modèles de données
│   ├── routes/            # Définition des routes
│   ├── middleware/        # Middlewares (auth, validation, erreurs)
│   ├── queries/           # Requêtes SQL centralisées
│   ├── locales/           # Messages d'erreur et succès
│   ├── utils/             # Utilitaires (token blacklist)
│   └── server.js          # Point d'entrée de l'application
├── config/                # Scripts de configuration DB
├── package.json
└── README.md
```

## 🏃‍♂️ Démarrage

### Mode développement
```bash
npm run dev
```

### Mode production
```bash
npm start
```

Le serveur sera accessible sur `http://localhost:3000`

### Vérification du fonctionnement
```bash
curl http://localhost:3000
# Réponse attendue: {"success": true, "message": "API E-commerce BDS - Backend en ligne"}
```

## 🏗️ Architecture

### Pattern MVC
- **Models** : Gestion des données et interaction avec MySQL
- **Views** : Réponses JSON (pas de templates)
- **Controllers** : Logique métier et orchestration

### Middlewares
- **auth.middleware.js** : Vérification JWT et gestion des rôles
- **validation.middleware.js** : Validation des données d'entrée
- **error.middleware.js** : Gestion centralisée des erreurs

### Organisation modulaire
- **Routes** : Définition des endpoints par module
- **Queries** : Requêtes SQL centralisées par module  
- **Locales** : Messages internationalisés par module

## 🔌 API Endpoints

### Base URL
```
http://localhost:3000/api
```

## 🔐 Authentification

### 📝 Inscription
```http
POST /api/auth/register
Content-Type: application/json

{
  "firstname": "Jean",
  "lastname": "Dupont",
  "email": "jean.dupont@example.com",
  "phone": "+221771234567",
  "password": "Password123"
}
```

**Réponse :**
```json
{
  "success": true,
  "message": "Inscription réussie.",
  "userId": 1
}
```

### 🔑 Connexion
```http
POST /api/auth/login
Content-Type: application/json

{
  "identifier": "jean.dupont@example.com",
  "password": "Password123"
}
```

**Réponse :**
```json
{
  "success": true,
  "message": "Connexion réussie.",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": "2h",
  "user": {
    "id": 1,
    "firstname": "Jean",
    "lastname": "Dupont",
    "email": "jean.dupont@example.com",
    "phone": "+221771234567",
    "role": "user"
  }
}
```

### 👤 Profil utilisateur
```http
GET /api/auth/profile
Authorization: Bearer {token}
```

### 🔓 Déconnexion
```http
POST /api/auth/logout
Authorization: Bearer {token}
```

### 🔄 Changement de mot de passe
```http
PUT /api/auth/change-password
Authorization: Bearer {token}
Content-Type: application/json

{
  "current_password": "Password123",
  "new_password": "NewPassword456"
}
```

### 🔐 Réinitialisation mot de passe
```http
POST /api/auth/request-reset
Content-Type: application/json

{
  "email": "jean.dupont@example.com"
}
```

```http
POST /api/auth/reset-password
Content-Type: application/json

{
  "reset_token": "123456",
  "new_password": "NewPassword789"
}
```

## 👥 Gestion des utilisateurs

### 📋 Lister les utilisateurs (Admin)
```http
GET /api/users
Authorization: Bearer {admin_token}
```

### 👤 Détails d'un utilisateur (Admin)
```http
GET /api/users/{id}
Authorization: Bearer {admin_token}
```

### ✏️ Modifier un utilisateur (Admin)
```http
PUT /api/users/{id}
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "firstname": "Jean-Marie",
  "lastname": "Dupont",
  "email": "jm.dupont@example.com",
  "phone": "+221771234568"
}
```

### 🗑️ Supprimer un utilisateur (Admin)
```http
DELETE /api/users/{id}
Authorization: Bearer {admin_token}
```

### 👨‍💼 Lister les administrateurs (SuperAdmin)
```http
GET /api/users/admins
Authorization: Bearer {superadmin_token}
```

## 🛍️ Gestion des produits

### 📋 Lister tous les produits
```http
GET /api/products
```

**Filtres disponibles :**
```http
GET /api/products?category=vetements&gender=male&search=chemise&page=1&limit=10
```

### 👤 Détails d'un produit
```http
GET /api/products/{id}
```

### ➕ Créer un produit (Admin)
```http
POST /api/products
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "name": "Chemise Premium",
  "description": "Chemise en coton de haute qualité",
  "category": "vetements",
  "price": 89.99,
  "discount_percent": 10,
  "stock": 50,
  "image_url": "https://example.com/chemise.jpg",
  "gender": "male"
}
```

### ✏️ Modifier un produit (Admin)
```http
PUT /api/products/{id}
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "name": "Chemise Premium Mise à jour",
  "price": 79.99,
  "stock": 45
}
```

### 🗑️ Supprimer un produit (Admin)
```http
DELETE /api/products/{id}
Authorization: Bearer {admin_token}
```

## 🛒 Gestion du panier

### 👀 Voir mon panier
```http
GET /api/cart
Authorization: Bearer {token}
```

**Réponse :**
```json
{
  "success": true,
  "count": 2,
  "total": 159.98,
  "cart": [
    {
      "id": 1,
      "product_id": 1,
      "name": "Chemise Premium",
      "price": 89.99,
      "discounted_price": 80.99,
      "quantity": 1,
      "subtotal": 80.99,
      "stock": 50,
      "image_url": "https://example.com/chemise.jpg"
    }
  ]
}
```

### ➕ Ajouter au panier
```http
POST /api/cart
Authorization: Bearer {token}
Content-Type: application/json

{
  "product_id": 1,
  "quantity": 2
}
```

### ✏️ Modifier la quantité
```http
PUT /api/cart/{product_id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "quantity": 3
}
```

### 🗑️ Retirer du panier
```http
DELETE /api/cart/{product_id}
Authorization: Bearer {token}
```

### 🧹 Vider le panier
```http
DELETE /api/cart
Authorization: Bearer {token}
```

## 📦 Gestion des commandes

### 🛍️ Créer une commande
```http
POST /api/orders
Authorization: Bearer {token}
Content-Type: application/json

{
  "payment_status": "pending"
}
```

**Réponse :**
```json
{
  "success": true,
  "message": "Commande créée avec succès.",
  "order": {
    "id": 1,
    "user_id": 1,
    "total_amount": 159.98,
    "payment_status": "pending",
    "created_at": "2025-12-01T10:30:00.000Z",
    "items": [
      {
        "id": 1,
        "product_id": 1,
        "product_name": "Chemise Premium",
        "quantity": 2,
        "unit_price": 80.99,
        "subtotal": 161.98
      }
    ]
  }
}
```

### 📋 Mes commandes
```http
GET /api/orders/myorders
Authorization: Bearer {token}
```

### 👤 Détails d'une commande
```http
GET /api/orders/{id}
Authorization: Bearer {token}
```

### 🚫 Annuler une commande
```http
DELETE /api/orders/{id}
Authorization: Bearer {token}
```

### 📊 Toutes les commandes (Admin)
```http
GET /api/orders
Authorization: Bearer {admin_token}
```

### ✏️ Modifier le statut (Admin)
```http
PUT /api/orders/{id}/status
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "payment_status": "paid"
}
```

## 🔐 Système de rôles

### Hiérarchie des rôles
1. **user** - Utilisateur standard
2. **admin** - Administrateur
3. **superadmin** - Super administrateur

### Permissions par rôle

| Fonctionnalité | User | Admin | SuperAdmin |
|---|---|---|---|
| Inscription/Connexion | ✅ | ✅ | ✅ |
| Gérer son profil | ✅ | ✅ | ✅ |
| Voir les produits | ✅ | ✅ | ✅ |
| Gérer le panier | ✅ | ✅ | ✅ |
| Passer des commandes | ✅ | ✅ | ✅ |
| Voir ses commandes | ✅ | ✅ | ✅ |
| Gérer les produits | ❌ | ✅ | ✅ 
| Voir tous les utilisateurs | ❌ | ✅ | ✅ |
| Modifier les utilisateurs | ❌ | ✅* | ✅ |
| Voir toutes les commandes | ❌ | ✅ | ✅ |
| Créer des admins | ❌ | ❌ | ✅ |
| Gérer les admins | ❌ | ❌ | ✅ |

*Un admin ne peut pas modifier d'autres admins

## 💡 Exemples d'utilisation

### Intégration Frontend (JavaScript/React)

```javascript
// Configuration de base
const API_BASE_URL = 'http://localhost:3000/api';

// Classe utilitaire pour les appels API
class BDSApiClient {
  constructor(baseURL = API_BASE_URL) {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('bds_token');
  }

  // Headers par défaut
  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }
    
    return headers;
  }

  // Méthode générique pour les requêtes
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getHeaders(),
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `HTTP ${response.status}`);
      }
      
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Authentification
  async login(identifier, password) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ identifier, password }),
    });
    
    if (response.success) {
      this.token = response.token;
      localStorage.setItem('bds_token', response.token);
      localStorage.setItem('bds_user', JSON.stringify(response.user));
    }
    
    return response;
  }

  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async logout() {
    await this.request('/auth/logout', { method: 'POST' });
    this.token = null;
    localStorage.removeItem('bds_token');
    localStorage.removeItem('bds_user');
  }

  // Produits
  async getProducts(filters = {}) {
    const params = new URLSearchParams(filters).toString();
    const endpoint = params ? `/products?${params}` : '/products';
    return this.request(endpoint);
  }

  async getProduct(id) {
    return this.request(`/products/${id}`);
  }

  async createProduct(productData) {
    return this.request('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  }

  // Panier
  async getCart() {
    return this.request('/cart');
  }

  async addToCart(productId, quantity) {
    return this.request('/cart', {
      method: 'POST',
      body: JSON.stringify({ product_id: productId, quantity }),
    });
  }

  async updateCartItem(productId, quantity) {
    return this.request(`/cart/${productId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    });
  }

  async removeFromCart(productId) {
    return this.request(`/cart/${productId}`, { method: 'DELETE' });
  }

  // Commandes
  async createOrder(paymentStatus = 'pending') {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify({ payment_status: paymentStatus }),
    });
  }

  async getMyOrders() {
    return this.request('/orders/myorders');
  }

  async getOrder(id) {
    return this.request(`/orders/${id}`);
  }
}

// Utilisation
const api = new BDSApiClient();

// Exemple d'authentification
async function handleLogin(email, password) {
  try {
    const response = await api.login(email, password);
    console.log('Connexion réussie:', response.user);
    return response.user;
  } catch (error) {
    console.error('Erreur de connexion:', error.message);
    throw error;
  }
}

// Exemple de récupération des produits avec filtres
async function loadProducts(category = '', search = '') {
  try {
    const filters = {};
    if (category) filters.category = category;
    if (search) filters.search = search;
    
    const response = await api.getProducts(filters);
    console.log(`${response.count} produits trouvés`);
    return response.products;
  } catch (error) {
    console.error('Erreur de chargement des produits:', error.message);
    return [];
  }
}

// Exemple d'ajout au panier
async function addProductToCart(productId, quantity = 1) {
  try {
    const response = await api.addToCart(productId, quantity);
    console.log('Produit ajouté au panier:', response.message);
    return response.cart;
  } catch (error) {
    console.error('Erreur ajout panier:', error.message);
    throw error;
  }
}
```

### Exemple React Hook personnalisé

```javascript
// hooks/useBDSApi.js
import { useState, useEffect } from 'react';

export function useBDSApi() {
  const [api] = useState(() => new BDSApiClient());
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté au chargement
    const savedUser = localStorage.getItem('bds_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (identifier, password) => {
    try {
      const response = await api.login(identifier, password);
      setUser(response.user);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await api.logout();
      setUser(null);
    } catch (error) {
      console.error('Erreur de déconnexion:', error);
      // Déconnecter côté client même si l'API échoue
      setUser(null);
    }
  };

  return {
    api,
    user,
    loading,
    isAuthenticated: !!user,
    login,
    logout,
  };
}

// Utilisation dans un composant React
function App() {
  const { api, user, isAuthenticated, login, logout } = useBDSApi();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await api.getProducts();
      setProducts(response.products);
    } catch (error) {
      console.error('Erreur de chargement:', error);
    }
  };

  return (
    <div>
      {isAuthenticated ? (
        <div>
          <h1>Bonjour {user.firstname}!</h1>
          <button onClick={logout}>Se déconnecter</button>
        </div>
      ) : (
        <LoginForm onLogin={login} />
      )}
      
      <ProductList products={products} />
    </div>
  );
}
```

## ⚠️ Gestion des erreurs

### Format des erreurs

Toutes les erreurs retournent le format suivant :

```json
{
  "success": false,
  "message": "Description de l'erreur",
  "errors": [
    {
      "field": "email",
      "message": "Email invalide"
    }
  ]
}
```

### Codes de statut HTTP

- **200** - Succès
- **201** - Créé avec succès
- **400** - Erreur de validation/données invalides
- **401** - Non authentifié/Token invalide
- **403** - Accès refusé/Permissions insuffisantes
- **404** - Ressource non trouvée
- **500** - Erreur serveur interne

### Erreurs communes

| Code | Message | Description |
|---|---|---|
| 401 | "Accès refusé. Token manquant." | Header Authorization absent |
| 401 | "Token invalide ou expiré." | JWT invalide/expiré |
| 401 | "Token révoqué. Veuillez vous reconnecter." | Token dans la blacklist |
| 403 | "Accès refusé. Droits administrateur requis." | Rôle insuffisant |
| 400 | "Cet email est déjà utilisé." | Email en doublon |
| 404 | "Utilisateur non trouvé." | ID utilisateur inexistant |

## 🔒 Sécurité

### Token JWT
- **Expiration** : 2 heures
- **Algorithme** : HS256
- **Blacklist** : Révocation lors déconnexion
- **Payload** : `{ id, email, role }`

### Validation des données
- **express-validator** pour toutes les entrées
- **Sanitisation** automatique des chaînes
- **Validation des emails** et formats téléphone
- **Contraintes de mot de passe** : minimum 6 caractères, majuscule, minuscule, chiffre

### Protection des mots de passe
- **bcryptjs** avec salt rounds 10
- **Jamais de stockage en plain text**
- **Vérification de l'ancien mot de passe** pour les changements

### Sécurité HTTP
- **CORS** configuré
- **Helmet** pour les headers de sécurité
- **Protection SQL injection** avec requêtes préparées
- **Pas d'exposition des stacks traces** en production

## 🗄️ Base de données

### Schéma MySQL

```sql
-- Table des utilisateurs
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    firstname VARCHAR(100),
    lastname VARCHAR(100),
    email VARCHAR(150) UNIQUE,
    phone VARCHAR(30) UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('superadmin', 'admin', 'user') DEFAULT 'user',
    reset_token VARCHAR(10) NULL,
    reset_token_expires DATETIME NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT chk_email_or_phone CHECK (email IS NOT NULL OR phone IS NOT NULL)
);

-- Table des produits
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    price DECIMAL(10,2) NOT NULL,
    discount_percent DECIMAL(5,2) DEFAULT 0,
    discounted_price DECIMAL(10,2) AS (price - (price * discount_percent / 100)) STORED,
    stock INT DEFAULT 0,
    image_url VARCHAR(255),
    gender ENUM('male','female','unisex') DEFAULT 'unisex',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table du panier
CREATE TABLE cart (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT DEFAULT 1,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_product (user_id, product_id)
);

-- Table des commandes
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    payment_status ENUM('pending', 'paid', 'failed') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Table des articles de commande
CREATE TABLE order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) AS (quantity * unit_price) STORED,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);
```

### Scripts utiles

```bash
# Initialiser la base de données
npm run init-db

# Créer le premier super administrateur
npm run create-admin

# Mettre à jour les rôles utilisateurs (si nécessaire)
node config/update_user_roles.js

# Ajouter les colonnes de réinitialisation de mot de passe
node config/add_reset_password_columns.js
```

## 🧪 Tests

### Tests manuels avec cURL

```bash
# Test de connexion
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"identifier":"superadmin@bds.com","password":"SuperAdmin123"}'

# Test de récupération des produits
curl http://localhost:3000/api/products

# Test d'ajout au panier (avec token)
curl -X POST http://localhost:3000/api/cart \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"product_id":1,"quantity":2}'
```

### Tests avec Postman

Importer cette collection Postman :

```json
{
  "info": {
    "name": "BDS E-commerce API",
    "description": "Collection complète pour tester l'API BDS"
  },
  "auth": {
    "type": "bearer",
    "bearer": [
      {
        "key": "token",
        "value": "{{token}}",
        "type": "string"
      }
    ]
  },
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:3000/api"
    },
    {
      "key": "token",
      "value": ""
    }
  ]
}
```

## 🚀 Déploiement

### Variables d'environnement production

```env
DB_HOST=your-production-db-host
DB_USER=your-db-user
DB_PASSWORD=your-secure-db-password
DB_NAME=bds_production
JWT_SECRET=your-ultra-secure-jwt-secret-256-bits-minimum
PORT=3000
NODE_ENV=production
```

### Optimisations pour la production

1. **Token Blacklist** : Migrer vers Redis
```javascript
// utils/redisBlacklist.js (recommandé pour la production)
const redis = require('redis');
const client = redis.createClient();

const revokeToken = async (token) => {
  await client.setEx(token, 7200, 'revoked'); // 2h expiration
};

const isTokenRevoked = async (token) => {
  return await client.exists(token);
};
```

2. **Rate Limiting** :
```bash
npm install express-rate-limit
```

3. **Logging** :
```bash
npm install winston
```

4. **Monitoring** :
```bash
npm install pm2 -g
pm2 start backend/server.js --name bds-api
```

### Commandes de déploiement

```bash
# Build pour la production
npm install --production

# Démarrer avec PM2
pm2 start ecosystem.config.js

# Monitoring
pm2 monit

# Logs
pm2 logs bds-api
```

## 📞 Support

Pour toute question ou problème :

- **Repository** : [https://github.com/fatima6299/bdsbusiness](https://github.com/fatima6299/bdsbusiness)
- **Issues** : Ouvrir une issue sur GitHub
- **Documentation** : Ce README.md

## 📝 Licence

Ce projet est sous licence privée. Tous droits réservés.

---

**🎉 Félicitations ! Vous avez maintenant toutes les informations nécessaires pour intégrer cette API dans votre frontend.**

### Prochaines étapes recommandées :

1. **Tester les endpoints** avec Postman ou cURL
2. **Implémenter l'authentification** dans votre frontend
3. **Créer les composants** produits, panier, commandes
4. **Gérer les états d'erreur** et de chargement
5. **Ajouter la persistance** des données utilisateur

Bon développement ! 🚀