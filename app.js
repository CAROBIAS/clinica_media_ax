// app.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { testConnection } = require('./src/config/db');
const errorHandler = require('./src/middlewares/errorHandler');
const swaggerSetup = require('./src/config/swagger');
const authRoutes = require('./src/routes/authRoutes');  
console.log('authRoutes:', authRoutes);  // debe mostrar un objeto router        // ← 1. Importar rutas de auth

const app = express();

// Middlewares globales
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Swagger
// swaggerSetup(app);

// Ruta pública de prueba
app.get('/', (req, res) => {
  res.json({
    ok: true,
    message: 'API Clinica Medica AX funcionando',
    docs: 'http://localhost:3000/api-docs'
  });
});

// ==================================================
// == RUTAS DE AUTENTICACIÓN         ==
// ==================================================
app.use('/api/auth', authRoutes);   // ← 2. Montar rutas de login

// (OPCIONAL) Ruta protegida de ejemplo para probar el middleware
const { authMiddleware } = require('./src/middlewares/authMiddleware');
app.get('/api/perfil', authMiddleware, (req, res) => {
  res.json({ mensaje: 'Acceso permitido', usuario: req.user });
});
// ==================================================

// Middleware de manejo de errores (siempre al final, antes del listen)
app.use(errorHandler);

// Puerto y arranque
const PORT = process.env.PORT || 3000;

async function start() {
  await testConnection();
  app.listen(PORT, () => {
    console.log(`🚀 Servidor en http://localhost:${PORT}`);
  });
}

start();