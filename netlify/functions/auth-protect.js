const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');
const { rateLimitMiddleware } = require('../utils/rate-limiter');

// ===== CONFIGURACIÓN DE AUTH0 =====
const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN;

// ===== ⚡ CLIENTE JWKS OPTIMIZADO =====
const client = jwksClient({
  jwksUri: `https://${AUTH0_DOMAIN}/.well-known/jwks.json`,
  cache: true,
  cacheMaxEntries: 10, // ⚡ Aumentado para mejor cache
  cacheMaxAge: 3600000, // ⚡ 1 hora (aumentado de 10 min)
  rateLimit: true,
  jwksRequestsPerMinute: 10, // ⚡ Aumentado para más requests
  requestAgent: undefined // ⚡ Usar agente por defecto
});

// ===== ⚡ CACHE DE TOKENS VALIDADOS =====
const tokenCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutos

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

// ===== ⚡ VALIDACIÓN SIMPLIFICADA DE TOKENS =====
function validateTokenClaims(decodedToken) {
  const now = Math.floor(Date.now() / 1000);
  
  // ⚡ Validaciones críticas solo
  if (!decodedToken.exp || decodedToken.exp < now) {
    return { isValid: false, errors: ['Token expirado'] };
  }
  
  const expectedIssuer = `https://${AUTH0_DOMAIN}/`;
  if (!decodedToken.iss || decodedToken.iss !== expectedIssuer) {
    return { isValid: false, errors: ['Issuer inválido'] };
  }
  
  if (!decodedToken.sub) {
    return { isValid: false, errors: ['Token no tiene subject'] };
  }
  
  return { isValid: true, errors: [] };
}

// ===== ⚡ LOGGING OPTIMIZADO =====
function logAuthEvent(event, userInfo = null, error = null) {
  // ⚡ Solo log en desarrollo o errores críticos
  if (process.env.NODE_ENV === 'development' || error) {
    const logData = {
      timestamp: new Date().toISOString(),
      ip: event.headers['client-ip'] || event.headers['x-forwarded-for'] || 'unknown',
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
}

// ===== ⚡ FUNCIÓN PRINCIPAL OPTIMIZADA =====
const authHandler = async (event, context) => {
  // ===== CONFIGURAR CORS SEGURO =====
  const allowedOrigins = [
    'http://localhost:8888',
                process.env.NETLIFY_URL || ''
  ];

  const origin = event.headers.origin || event.headers.Origin;
  const corsOrigin = allowedOrigins.includes(origin) ? origin : allowedOrigins[0];

  const headers = {
    'Access-Control-Allow-Origin': corsOrigin,
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
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

    // ===== ⚡ VERIFICAR CACHE DE TOKEN =====
    const cacheKey = token.substring(0, 20); // Usar parte del token como clave
    const cachedResult = tokenCache.get(cacheKey);
    
    if (cachedResult && cachedResult.expiry > Date.now()) {
      logAuthEvent(event, cachedResult.user);
      return {
        statusCode: 200,
        headers: {
          ...headers,
          'Content-Type': 'application/json',
          'X-Cache': 'HIT' // ⚡ Indicar que viene del cache
        },
        body: JSON.stringify(cachedResult.response)
      };
    }

    // ===== ⚡ VERIFICAR TOKEN JWT OPTIMIZADO =====
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

    // ===== ⚡ VALIDAR CLAIMS SIMPLIFICADO =====
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

    // ===== ⚡ PREPARAR RESPUESTA =====
    const response = {
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
    };

    // ===== ⚡ GUARDAR EN CACHE =====
    tokenCache.set(cacheKey, {
      user: decodedToken,
      response: response,
      expiry: Date.now() + CACHE_TTL
    });

    // ===== ⚡ LIMPIAR CACHE PERIÓDICAMENTE =====
    if (Math.random() < 0.01) { // 1% de probabilidad
      const now = Date.now();
      for (const [key, value] of tokenCache.entries()) {
        if (value.expiry < now) {
          tokenCache.delete(key);
        }
      }
    }

    // ===== TOKEN VÁLIDO - LOGGING Y RESPUESTA =====
    logAuthEvent(event, decodedToken);

    return {
      statusCode: 200,
      headers: {
        ...headers,
        'Content-Type': 'application/json',
        'X-Cache': 'MISS' // ⚡ Indicar que no vino del cache
      },
      body: JSON.stringify(response)
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
