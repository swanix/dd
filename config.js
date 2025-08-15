// Configuración temporal para pruebas
const config = {
  // Estos valores son temporales - reemplazar con valores reales de Auth0
  AUTH0_DOMAIN: 'dev-7kj3jxtxwwirocri.us.auth0.com',
  AUTH0_CLIENT_ID: 'BORj4AB79Rho5yP5uSavuP4sern8pemZ',
  AUTH0_AUDIENCE: 'https://api.example.com',
  
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
