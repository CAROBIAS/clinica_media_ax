import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

import { testConnection } from './src/config/db.js';
import errorHandler from './src/middlewares/errorHandler.js';
import swaggerSetup from './src/config/swagger.js';
import { authMiddleware } from './src/middlewares/authMiddleware.js';

import authRoutes from './src/routes/authRoutes.js';
import especialidadRoutes from './src/routes/especialidad.routes.js';
import medicoRoutes from './src/routes/medico.routes.js';
import obrasRoutes from './src/routes/obrasSociales.routes.js';
import turnosRoutes from './src/routes/turnos.routes.js';
import pacientesRoutes from './src/routes/pacientes.routes.js';
import metricasRoutes from './src/routes/metricas.routes.js';

import { runSeed } from './src/config/seed.js';

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

swaggerSetup(app);

app.get('/', (req, res) => {
  res.json({
    ok: true,
    message: 'API Clínica Médica AX funcionando',
    endpoints: {
      auth: '/api/v1/auth',
      turnos: '/api/v1/turnos',
      especialidades: '/api/v1/especialidades',
      medicos: '/api/v1/medicos',
      obras: '/api/v1/obras-sociales',
      pacientes: '/api/v2/pacientes',
      metricas: '/api/v3/metricas/reporte',
      docs: '/api-docs'
    }
  });
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/especialidades', especialidadRoutes);
app.use('/api/v1/medicos', medicoRoutes);
app.use('/api/v1/turnos', turnosRoutes);
app.use('/api/v1', obrasRoutes);

app.use('/api/v2', pacientesRoutes);

app.use('/api/v3', metricasRoutes);

app.get('/api/perfil', authMiddleware, (req, res) => {
  res.json({ mensaje: 'Acceso permitido', usuario: req.user });
});

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await testConnection();
    await runSeed();
    app.listen(PORT, () => {
      console.log(`Servidor en http://localhost:${PORT}`);
      console.log(`Swagger en http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    console.error('Error al iniciar el servidor:', error);
  }
}

start();