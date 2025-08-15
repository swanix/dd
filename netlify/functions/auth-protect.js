const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');
const { rateLimitMiddleware } = require('./rate-limiter');

// ===== CONFIGURACIÓN DE AUTH0 =====
const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN || 'dev-7kj3jxtxwwirocri.us.auth0.com';

// ===== CLIENTE JWKS =====
const client = jwksClient({
  jwksUri: `https://${AUTH0_DOMAIN}/.well-known/jwks.json`,
  cache: true,
  cacheMaxEntries: 5,
  cacheMaxAge: 600000, // 10 minutos
  rateLimit: true,
  jwksRequestsPerMinute: 5
});

// ===== FUNCIÓN PARA OBTENER CLAVE PÚBLICA =====
function getKey(header, callback) {
  client.getSigningKey(header.kid, function(err, key) {
    if (err) {
      console.error('🔑 [AUTH] Error obteniendo signing key:', err.message);
      return callback(err);
    }
    const signingKey = key.publicKey || key.rsaPublicKey;
    callback(null, signingKey);
  });
}

// ===== VALIDACIÓN ROBUSTA DE TOKENS =====
function validateTokenClaims(decodedToken) {
  const now = Math.floor(Date.now() / 1000);
  const errors = [];

  // Verificar expiración
  if (!decodedToken.exp) {
    errors.push('Token no tiene claim de expiración');
  } else if (decodedToken.exp < now) {
    errors.push('Token expirado');
  }

  // Verificar issuer
  const expectedIssuer = `https://${AUTH0_DOMAIN}/`;
  if (!decodedToken.iss || decodedToken.iss !== expectedIssuer) {
    errors.push('Issuer inválido');
  }

  // Verificar issued at
  if (!decodedToken.iat) {
    errors.push('Token no tiene claim de issued at');
  } else if (decodedToken.iat > now) {
    errors.push('Token emitido en el futuro');
  }

  // Verificar subject
  if (!decodedToken.sub) {
    errors.push('Token no tiene subject');
  }

  // Verificar email (opcional pero recomendado)
  if (!decodedToken.email) {
    errors.push('Token no tiene email');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

// ===== LOGGING SEGURO =====
function logAuthEvent(event, userInfo = null, error = null) {
  const logData = {
    timestamp: new Date().toISOString(),
    ip: event.headers['client-ip'] || event.headers['x-forwarded-for'] || 'unknown',
    userAgent: event.headers['user-agent'] || 'unknown',
    method: event.httpMethod,
    path: event.path
  };

  if (userInfo) {
    logData.user = {
      sub: userInfo.sub,
      email: userInfo.email ? `${userInfo.email.substring(0, 3)}***@${userInfo.email.split('@')[1]}` : 'no-email',
      hasName: !!userInfo.name
    };
  }

  if (error) {
    logData.error = {
      type: error.name,
      message: error.message
    };
  }

  console.log('🔐 [AUTH] Evento de autenticación:', JSON.stringify(logData));
}

// ===== FUNCIÓN PRINCIPAL DE NETLIFY =====
const authHandler = async (event, context) => {
  // ===== CONFIGURAR CORS SEGURO =====
  const allowedOrigins = [
    'http://localhost:8888',
    'https://swanixdd.netlify.app'
  ];
  
  const origin = event.headers.origin || event.headers.Origin;
  const corsOrigin = allowedOrigins.includes(origin) ? origin : allowedOrigins[0];

  const headers = {
    'Access-Control-Allow-Origin': corsOrigin,
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Max-Age': '86400',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY'
  };

  // ===== MANEJAR PREFLIGHT REQUESTS =====
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    // ===== OBTENER Y VALIDAR TOKEN =====
    const authHeader = event.headers.authorization || event.headers.Authorization || '';
    
    if (!authHeader.startsWith('Bearer ')) {
      logAuthEvent(event, null, { name: 'InvalidHeader', message: 'Header de autorización inválido' });
      return {
        statusCode: 401,
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          error: 'header_invalid',
          message: 'Header de autorización debe ser Bearer token'
        })
      };
    }

    const token = authHeader.replace('Bearer ', '');

    if (!token) {
      logAuthEvent(event, null, { name: 'NoToken', message: 'No se proporcionó token' });
      return {
        statusCode: 401,
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          error: 'token_missing',
          message: 'Se requiere un token Bearer válido'
        })
      };
    }

    // ===== VERIFICAR TOKEN JWT =====
    const decodedToken = await new Promise((resolve, reject) => {
      jwt.verify(token, getKey, {
        issuer: `https://${AUTH0_DOMAIN}/`,
        algorithms: ['RS256'],
        clockTolerance: 30 // 30 segundos de tolerancia
      }, (err, decoded) => {
        if (err) {
          console.error('🔐 [AUTH] Error verificando token:', err.message);
          reject(err);
        } else {
          resolve(decoded);
        }
      });
    });

    // ===== VALIDAR CLAIMS ADICIONALES =====
    const validation = validateTokenClaims(decodedToken);
    
    if (!validation.isValid) {
      logAuthEvent(event, decodedToken, { 
        name: 'InvalidClaims', 
        message: `Claims inválidos: ${validation.errors.join(', ')}` 
      });
      
      return {
        statusCode: 401,
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          error: 'token_invalid_claims',
          message: 'Token tiene claims inválidos',
          details: validation.errors
        })
      };
    }

    // ===== TOKEN VÁLIDO - LOGGING Y RESPUESTA =====
    logAuthEvent(event, decodedToken);

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
          name: decodedToken.name,
          email_verified: decodedToken.email_verified || false
        },
        token_info: {
          issued_at: new Date(decodedToken.iat * 1000).toISOString(),
          expires_at: new Date(decodedToken.exp * 1000).toISOString(),
          issuer: decodedToken.iss
        },
        permissions: decodedToken.permissions || [],
        scope: decodedToken.scope || '',
        timestamp: new Date().toISOString()
      })
    };

  } catch (error) {
    // ===== MANEJO DE ERRORES MEJORADO =====
    logAuthEvent(event, null, error);
    
    let statusCode = 401;
    let errorCode = 'token_invalid';
    let message = 'Token inválido o expirado';

    if (error.name === 'TokenExpiredError') {
      errorCode = 'token_expired';
      message = 'Token expirado';
    } else if (error.name === 'JsonWebTokenError') {
      errorCode = 'token_malformed';
      message = 'Token malformado';
    } else if (error.name === 'NotBeforeError') {
      errorCode = 'token_not_active';
      message = 'Token no está activo aún';
    }

    return {
      statusCode,
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        error: errorCode,
        message,
        timestamp: new Date().toISOString()
      })
    };
  }
};

// ===== EXPORTAR HANDLER CON RATE LIMITING =====
exports.handler = rateLimitMiddleware(authHandler);
