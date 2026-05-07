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
// Nueva ruta de Braian
import turnosRoutes from './src/routes/turnos.routes.js';

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
      auth: '/api/auth',
      turnos: '/api/turnos',
      especialidades: '/api/especialidades',
      medicos: '/api/medicos',
      docs: '/api-docs'
    }
  });
});

app.use('/api/auth', authRoutes);

app.get('/api/perfil', authMiddleware, (req, res) => {
  res.json({ mensaje: 'Acceso permitido', usuario: req.user });
});

app.use('/api/especialidades', especialidadRoutes);
app.use('/api/medicos', medicoRoutes);
app.use('/api/turnos', turnosRoutes); // Montada según Braian
app.use('/api', obrasRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await testConnection();
    app.listen(PORT, () => {
      console.log(`Servidor en http://localhost:${PORT}`);
      console.log(`Swagger en http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    console.error('Error al iniciar el servidor:', error);
  }
}

start();