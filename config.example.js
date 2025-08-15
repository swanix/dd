// Configuración de Auth0 - Copiar este archivo como config.js y llenar con tus valores
const config = {
  // Dominio de tu aplicación Auth0 (ej: mi-app.auth0.com)
  AUTH0_DOMAIN: 'TU_DOMINIO_AUTH0.auth0.com',
  
  // Client ID de tu aplicación SPA en Auth0
  AUTH0_CLIENT_ID: 'TU_CLIENTE_ID',
  
  // Audience (opcional) - puede ser tu API identifier
  AUTH0_AUDIENCE: 'TU_AUDIENCIA',
  
  // URLs permitidas para redirección
  ALLOWED_CALLBACK_URLS: [
    'http://localhost:8888',
    'https://tu-sitio.netlify.app'
  ],
  
  // URLs permitidas para logout
  ALLOWED_LOGOUT_URLS: [
    'http://localhost:8888',
    'https://tu-sitio.netlify.app'
  ]
};

module.exports = config;
