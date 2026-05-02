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
const errorHandler    = require('./src/middlewares/errorHandler');
const especialidadRoutes = require('./src/routes/especialidad.routes');
const medicoRoutes = require('./src/routes/medico.routes');
const swaggerSetup    = require('./src/config/swagger');

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
// Monta las rutas de especialidades y médicos con el prefijo /api
app.use('/api/especialidades', especialidadRoutes);
app.use('/api/medicos', medicoRoutes);
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