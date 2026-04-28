// app.js
require('dotenv').config();
const express      = require('express');
const cors         = require('cors');
const morgan       = require('morgan');
const { testConnection } = require('./src/config/db');
const errorHandler    = require('./src/middlewares/errorHandler');
const swaggerSetup    = require('./src/config/swagger');

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

swaggerSetup(app);

app.get('/', (req, res) => {
  res.json({
    ok:      true,
    message: 'API Clinica Medica AX funcionando',
    docs:    'http://localhost:3000/api-docs'
  });
});

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

async function start() {
  await testConnection();
  app.listen(PORT, () => {
    console.log(`🚀 Servidor en http://localhost:${PORT}`);
  });
}

start();