import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title:       'API Clínica Médica AX',
      version:     '2.0.0',
      description: 'TFI Programación III - UNER 2026. Endpoints versionados: /api/v1 (originales) y /api/v2 (nuevos de pacientes)',
    },
    servers: [
      { url: `http://localhost:${process.env.PORT || 3000}/api/v1`, description: 'Versión 1 - Endpoints originales' },
      { url: `http://localhost:${process.env.PORT || 3000}/api/v2`, description: 'Versión 2 - Endpoints nuevos (pacientes)' }
    ],
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: [
    './src/routes/authRoutes.js',
    './src/routes/especialidad.routes.js',
    './src/routes/medico.routes.js',
    './src/routes/obrasSociales.routes.js',
    './src/routes/turnos.routes.js',
    './src/routes/pacientes.routes.js'
  ],
};

export default function swaggerSetup(app) {
  const spec = swaggerJsdoc(options);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(spec));
  console.log('📚 Swagger disponible en http://localhost:3000/api-docs');
}