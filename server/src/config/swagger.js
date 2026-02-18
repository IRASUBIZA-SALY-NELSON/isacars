import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Nova Transport Taxi API',
      version: '1.0.0',
      description: `Comprehensive API documentation for the Nova Transport taxi booking and management platform.`,
      contact: {
        name: 'Nova Transport Support',
        email: 'info@novatransport.rw',
        url: 'https://novatransport.rw'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'https://isacars.onrender.com',
        description: 'Production server'
      },
      {
        url: 'http://localhost:5000',
        description: 'Development server'
      }
    ]
  },
  apis: [
    './src/routes/authRoutes.js',
    './src/routes/driverRoutes.js',
    './src/routes/rideRoutes.js'
  ]
};

const specs = swaggerJsdoc(options);

export { specs, swaggerUi };
