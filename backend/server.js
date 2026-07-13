/**
 * Author: Fatimata Tidiane Dia
 * Created: December 1, 2025
 * Description: Main server file for BDS E-commerce API
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const fs = require('fs');

// Charge .env.{NODE_ENV} s'il existe (ex: .env.production sur le serveur de prod),
// sinon retombe sur .env (usage local classique).
const nodeEnv = process.env.NODE_ENV || 'development';
const envSpecificPath = path.join(__dirname, '..', `.env.${nodeEnv}`);
const defaultEnvPath = path.join(__dirname, '..', '.env');
require('dotenv').config({ path: fs.existsSync(envSpecificPath) ? envSpecificPath : defaultEnvPath });

const { common } = require('./locales');

const app = express();
const port = process.env.PORT || 3000;

// Middlewares de sécurité
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));

// CORS restreint aux origines autorisées (voir ALLOWED_ORIGINS dans .env)
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:5173,http://localhost:4173')
  .split(',')
  .map(origin => origin.trim());

app.use(cors({
  origin: (origin, callback) => {
    // Autorise aussi les requêtes sans origine (ex: Postman, curl, apps mobiles).
    // Pour une origine non autorisée, on ne lève pas d'erreur (ça remonterait en 500
    // avec la stack trace) : on omet juste les en-têtes CORS, et c'est le navigateur
    // qui bloquera la lecture de la réponse côté client.
    callback(null, !origin || allowedOrigins.includes(origin));
  },
  credentials: true
}));

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Fichiers statiques (images de produits téléversées)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Route de test
app.get('/', (req, res) => {
  res.json({ 
    success: true, 
    message: 'API E-commerce BDS - Backend en ligne' 
  });
});

// Import and use routes
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/users", require("./routes/user.routes"));
app.use("/api/products", require("./routes/product.routes"));
app.use("/api/cart", require("./routes/cart.routes"));
app.use("/api/orders", require("./routes/order.routes"));
app.use("/api/upload", require("./routes/upload.routes"));
app.use("/api/contact", require("./routes/contact.routes"));

// Middleware de gestion d'erreurs (doit être en dernier)
const errorHandler = require('./middleware/error.middleware');
app.use(errorHandler);

// Start the server
app.listen(port, () => {
  console.log(`${common.logServerStarted} ${port}`);
  console.log(`${common.logServerAccess} http://localhost:${port}`);
});