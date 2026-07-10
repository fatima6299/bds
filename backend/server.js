/**
 * Author: Saliou Samba DIAO
 * Created: December 1, 2025
 * Description: Main server file for BDS E-commerce API
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();
const { common } = require('./locales');

const app = express();
const port = process.env.PORT || 3000;

// Middlewares de sécurité
app.use(helmet());
app.use(cors());

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

// Middleware de gestion d'erreurs (doit être en dernier)
const errorHandler = require('./middleware/error.middleware');
app.use(errorHandler);

// Start the server
app.listen(port, () => {
  console.log(`${common.logServerStarted} ${port}`);
  console.log(`${common.logServerAccess} http://localhost:${port}`);
});