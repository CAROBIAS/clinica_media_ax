import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title:       'API Clínica Médica AX',
      version:     '3.0.0',
      description: 'TFI Programación III - UNER 2026. Endpoints versionados: /api/v1 (originales), /api/v2 (pacientes) y /api/v3 (métricas estadísticas)',
    },
    servers: [
      { url: `http://localhost:${process.env.PORT || 3000}/api/v1`, description: 'Versión 1 - Endpoints originales' },
      { url: `http://localhost:${process.env.PORT || 3000}/api/v2`, description: 'Versión 2 - Endpoints nuevos (pacientes)' },
      { url: `http://localhost:${process.env.PORT || 3000}/api/v3`, description: 'Versión 3 - Métricas estadísticas' }
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
    './src/routes/pacientes.routes.js',
    './src/routes/metricas.routes.js',
    './src/routes/usuario.routes.js'
  ],
};

export default function swaggerSetup(app) {
  const spec = swaggerJsdoc(options);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(spec));
  console.log('Swagger disponible en http://localhost:3000/api-docs');
}