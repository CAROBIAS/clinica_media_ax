// src/config/swagger.js
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi   = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title:       'API Clinica Medica AX',
      version:     '1.0.0',
      description: 'TFI Programacion III - UNER 2026',
    },
    servers: [{ url: `http://localhost:${process.env.PORT || 3000}` }],
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./src/routes/*.js'],
};

module.exports = (app) => {
  const spec = swaggerJsdoc(options);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(spec));
  console.log('📄 Swagger en http://localhost:3000/api-docs');
};