// app.js
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

// Configuraciones y middlewares globales
import { testConnection } from './src/config/db.js';
import errorHandler from './src/middlewares/errorHandler.js'; 
import swaggerSetup from './src/config/swagger.js';
import { authMiddleware } from './src/middlewares/authMiddleware.js';

// ==================================================
// == IMPORTACIÓN DE RUTAS                         ==
// ==================================================
import authRoutes from './src/routes/authRoutes.js';
import especialidadRoutes from './src/routes/especialidad.routes.js';
import medicoRoutes from './src/routes/medico.routes.js';
import obrasRoutes from './src/routes/obrasSociales.routes.js'; 
// Nueva ruta de Braian
import turnosRoutes from './src/routes/turnos.routes.js';

const app = express();

// ==================================================
// == MIDDLEWARES GLOBALES                         ==
// ==================================================
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Configuración de Swagger (Traído de la rama de Braian)
swaggerSetup(app);

// Ruta pública de prueba unificada
app.get('/', (req, res) => {
  res.json({
    ok: true,
    message: 'API Clínica Médica AX funcionando',
    endpoints: {
      auth: '/api/auth',
      turnos: '/api/turnos',
      especialidades: '/api/especialidades',
      medicos: '/api/medicos',
      docs: '/api-docs'
    }
  });
});

// ==================================================
// == MONTAJE DE RUTAS                             ==
// ==================================================
// Autenticación
app.use('/api/auth', authRoutes);

// Perfil (protegido)
app.get('/api/perfil', authMiddleware, (req, res) => {
  res.json({ mensaje: 'Acceso permitido', usuario: req.user });
});

// Entidades principales
app.use('/api/especialidades', especialidadRoutes);
app.use('/api/medicos', medicoRoutes);
app.use('/api/turnos', turnosRoutes); // Montada según Braian
app.use('/api', obrasRoutes);

// Middleware de manejo de errores (SIEMPRE al final)
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
      console.log(`📄 Swagger en http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
  }
}

start();