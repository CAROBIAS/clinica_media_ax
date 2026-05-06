// app.js
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

// Configuraciones y middlewares globales
import { testConnection } from './src/config/db.js';
// Asumo que errorHandler se exporta por defecto (export default). Si falla, probá con: import { errorHandler } from ...
import errorHandler from './src/middlewares/errorHandler.js'; 
// import swaggerSetup from './src/config/swagger.js';
import { authMiddleware } from './src/middlewares/authMiddleware.js';

// ==================================================
// == IMPORTACIÓN DE RUTAS                         ==
// ==================================================
import authRoutes from './src/routes/authRoutes.js';
import especialidadRoutes from './src/routes/especialidad.routes.js';
import medicoRoutes from './src/routes/medico.routes.js';

// Rutas de Walter (asumiendo que están dentro de src/)
import obrasRoutes from './src/routes/obrasSociales.routes.js'; 

const app = express();

// ==================================================
// == MIDDLEWARES GLOBALES                         ==
// ==================================================
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Ruta pública de prueba
app.get('/', (req, res) => {
  res.json({
    ok: true,
    message: 'API Clinica Medica AX funcionando',
    docs: 'http://localhost:3000/api-docs'
  });
});

// ==================================================
// == MONTAJE DE RUTAS                             ==
// ==================================================
// Autenticación
app.use('/api/auth', authRoutes);

// (OPCIONAL) Ruta protegida de ejemplo para probar el middleware
app.get('/api/perfil', authMiddleware, (req, res) => {
  res.json({ mensaje: 'Acceso permitido', usuario: req.user });
});

// Entidades
app.use('/api/especialidades', especialidadRoutes);
app.use('/api/medicos', medicoRoutes);
app.use('/api', obrasRoutes);

// Middleware de manejo de errores (siempre al final, antes del listen)
app.use(errorHandler);

// ==================================================
// == ARRANQUE DEL SERVIDOR                        ==
// ==================================================
const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await testConnection();
    app.listen(PORT, () => {
      console.log(`🚀 Servidor en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Error al iniciar el servidor:', error);
  }
}

start();