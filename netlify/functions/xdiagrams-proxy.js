// ===== PROXY PARA XDIAGRAMS =====
// Función que actúa como proxy entre xdiagrams y SheetBest
// Valida autenticación y usa API key segura

const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');
const { rateLimitMiddleware } = require('../utils/rate-limiter');

// ===== CONFIGURACIÓN =====
const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN;
const SHEETBEST_API_KEY = process.env.SHEETBEST_API_KEY;
const XDIAGRAMS_SHEET_ID = process.env.XDIAGRAMS_SHEET_ID || 'f4c2def0-403c-4197-8020-9f1c42e34515';
const XDIAGRAMS_TAB_NAME = process.env.XDIAGRAMS_TAB_NAME || 'All';

// ===== CLIENTE JWKS =====
const client = jwksClient({
  jwksUri: `https://${AUTH0_DOMAIN}/.well-known/jwks.json`,
  cache: true,
  cacheMaxEntries: 10,
  cacheMaxAge: 3600000
});

// ===== FUNCIÓN PARA OBTENER CLAVE =====
function getKey(header, callback) {
  client.getSigningKey(header.kid, function(err, key) {
    if (err) {
      console.error('🔑 [XDIAGRAMS] Error obteniendo signing key:', err.message);
      return callback(err);
    }
    const signingKey = key.publicKey || key.rsaPublicKey;
    callback(null, signingKey);
  });
}

// ===== VALIDAR TOKEN =====
async function validateToken(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, getKey, {
      issuer: `https://${AUTH0_DOMAIN}/`,
      algorithms: ['RS256'],
      clockTolerance: 30
    }, (err, decoded) => {
      if (err) {
        console.error('🔐 [XDIAGRAMS] Error verificando token:', err.message);
        reject(err);
      } else {
        resolve(decoded);
      }
    });
  });
}

// ===== CARGAR DATOS DESDE SHEETBEST =====
async function loadXDiagramsData() {
  try {
    if (!SHEETBEST_API_KEY) {
      console.warn('⚠️ [XDIAGRAMS] SHEETBEST_API_KEY no configurada');
      throw new Error('API key no configurada');
    }

    // Construir URL para el tab específico
    const url = `https://api.sheetbest.com/sheets/${XDIAGRAMS_SHEET_ID}/tabs/${encodeURIComponent(XDIAGRAMS_TAB_NAME)}`;
    
    console.log(`🔄 [XDIAGRAMS] Cargando datos desde: ${url}`);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-Api-Key': SHEETBEST_API_KEY,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ [XDIAGRAMS] Datos cargados:', data.length, 'registros');
    return data;

  } catch (error) {
    console.error('❌ [XDIAGRAMS] Error cargando datos:', error.message);
    throw error;
  }
}

// ===== HANDLER PRINCIPAL =====
const xdiagramsHandler = async (event, context) => {
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
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
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
      console.log('🔐 [XDIAGRAMS] Header de autorización inválido');
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
      console.log('🔐 [XDIAGRAMS] No se proporcionó token');
      return {
        statusCode: 401,
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          error: 'token_missing',
          message: 'Se requiere un token Bearer válido'
        })
      };
    }

    // ===== VALIDAR TOKEN JWT =====
    let decodedToken;
    try {
      decodedToken = await validateToken(token);
      console.log('✅ [XDIAGRAMS] Token válido para usuario:', decodedToken.sub);
    } catch (error) {
      console.error('❌ [XDIAGRAMS] Token inválido:', error.message);
      return {
        statusCode: 401,
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          error: 'token_invalid',
          message: 'Token inválido o expirado'
        })
      };
    }

    // ===== CARGAR DATOS DESDE SHEETBEST =====
    console.log('🔄 [XDIAGRAMS] Cargando datos desde SheetBest...');
    const data = await loadXDiagramsData();

    // ===== RESPONDER CON DATOS EN FORMATO JSON =====
    return {
      statusCode: 200,
      headers: {
        ...headers,
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300' // Cache por 5 minutos
      },
      body: JSON.stringify(data)
    };

  } catch (error) {
    console.error('❌ [XDIAGRAMS] Error en handler:', error);
    
    return {
      statusCode: 500,
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        error: 'server_error',
        message: 'Error interno del servidor',
        timestamp: new Date().toISOString()
      })
    };
  }
};

// ===== EXPORTAR HANDLER CON RATE LIMITING =====
exports.handler = rateLimitMiddleware(xdiagramsHandler);
