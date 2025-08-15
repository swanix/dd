const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

// Configuración de Auth0 - CAMBIAR ESTOS VALORES
const AUTH0_DOMAIN = 'dev-7kj3jxtxwwirocri.us.auth0.com';
// const AUTH0_AUDIENCE = 'https://api.example.com'; // Comentado - no necesitamos audience para este ejemplo

// Cliente JWKS para verificar tokens
const client = jwksClient({
  jwksUri: `https://${AUTH0_DOMAIN}/.well-known/jwks.json`
});

// Función para obtener la clave pública
function getKey(header, callback) {
  client.getSigningKey(header.kid, function(err, key) {
    if (err) {
      console.error('Error obteniendo signing key:', err);
      return callback(err);
    }
    const signingKey = key.publicKey || key.rsaPublicKey;
    callback(null, signingKey);
  });
}

// Función principal de Netlify
exports.handler = async (event, context) => {
  // Configurar CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  };

  // Manejar preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    // Obtener el token del header Authorization
    const authHeader = event.headers.authorization || event.headers.Authorization || '';
    const token = authHeader.replace('Bearer ', '');

    if (!token) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({
          error: 'No se proporcionó token de autorización',
          message: 'Se requiere un token Bearer válido'
        })
      };
    }

    // Verificar el token JWT (ID token)
    const decodedToken = await new Promise((resolve, reject) => {
      jwt.verify(token, getKey, {
        issuer: `https://${AUTH0_DOMAIN}/`,
        algorithms: ['RS256']
      }, (err, decoded) => {
        if (err) {
          console.error('Error verificando token:', err);
          reject(err);
        } else {
          resolve(decoded);
        }
      });
    });

    // Token válido - retornar contenido protegido
    return {
      statusCode: 200,
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: 'Acceso concedido al contenido protegido',
        user: {
          sub: decodedToken.sub,
          email: decodedToken.email,
          name: decodedToken.name
        },
        timestamp: new Date().toISOString(),
        permissions: decodedToken.permissions || [],
        scope: decodedToken.scope || ''
      })
    };

  } catch (error) {
    console.error('Error en auth-protect:', error);
    
    return {
      statusCode: 401,
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        error: 'Token inválido o expirado',
        message: 'No tienes permisos para acceder a este recurso'
      })
    };
  }
};
