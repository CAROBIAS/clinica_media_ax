require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const { testConnection } = require('./src/config/db');
const errorHandler = require('./src/middlewares/errorHandler');
const swaggerSetup = require('./src/config/swagger');

// ROUTES
const turnosRoutes = require('./src/routes/turnos.routes');

const app = express();

// MIDDLEWARES
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// SWAGGER
swaggerSetup(app);

// ROUTES PRINCIPALES
app.use('/api/turnos', turnosRoutes);

// ROUTE BASE
app.get('/', (req, res) => {
  res.json({
    ok: true,
    message: 'API Clínica Médica AX funcionando',
    endpoints: {
      turnos: 'http://localhost:3000/api/turnos',
      docs: 'http://localhost:3000/api-docs'
    }
  });
});

//MANEJO GLOBAL DE ERRORES
app.use(errorHandler);

// PUERTO
const PORT = process.env.PORT || 3000;

async function start() {
  await testConnection();

  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
    console.log(` Swagger en http://localhost:${PORT}/api-docs`);
  });
}

start();
