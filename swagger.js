const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Sportify API',
      version: '1.0.0',
      description: 'Documentació de l’API REST de Sportify',
    },
  },
  apis: ['./presentation/server/routes/*.js'], // ← aquí els comentaris JSDoc
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
