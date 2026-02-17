import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ISACARS Taxi API',
      version: '1.0.0',
      description: `Comprehensive API documentation for the ISACARS taxi booking and management platform.`,
      contact: {
        name: 'ISACARS Support',
        email: 'irasubizasalynelson@gmail.com',
        url: 'https://isacars.vercel.app'
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
