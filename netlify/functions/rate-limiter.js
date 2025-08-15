// ===== RATE LIMITER PARA NETLIFY FUNCTIONS =====

// En un entorno real, esto debería usar Redis o una base de datos
// Para Netlify Functions, usamos un store en memoria (se resetea en cada deploy)

const rateLimitStore = new Map();

// ===== CONFIGURACIÓN DE RATE LIMITING =====
const RATE_LIMIT_CONFIG = {
  windowMs: 15 * 60 * 1000, // 15 minutos
  maxRequests: 100, // máximo 100 requests por ventana
  skipSuccessfulRequests: false,
  skipFailedRequests: false,
  keyGenerator: (event) => {
    // Usar IP del cliente como clave
    return event.headers['client-ip'] || 
           event.headers['x-forwarded-for'] || 
           event.headers['x-real-ip'] || 
           'unknown';
  },
  handler: (event, context) => {
    return {
      statusCode: 429,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': Math.ceil(RATE_LIMIT_CONFIG.windowMs / 1000)
      },
      body: JSON.stringify({
        error: 'rate_limit_exceeded',
        message: 'Demasiadas solicitudes. Intenta de nuevo más tarde.',
        retryAfter: Math.ceil(RATE_LIMIT_CONFIG.windowMs / 1000)
      })
    };
  }
};

// ===== FUNCIÓN DE RATE LIMITING =====
function checkRateLimit(event) {
  const key = RATE_LIMIT_CONFIG.keyGenerator(event);
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_CONFIG.windowMs;

  // Obtener registros existentes para esta IP
  const records = rateLimitStore.get(key) || [];
  
  // Filtrar registros dentro de la ventana de tiempo
  const validRecords = records.filter(timestamp => timestamp > windowStart);
  
  // Verificar si excede el límite
  if (validRecords.length >= RATE_LIMIT_CONFIG.maxRequests) {
    // Limpiar registros antiguos
    rateLimitStore.set(key, validRecords);
    
    console.log(`🚫 [RATE_LIMIT] IP ${key} excedió el límite: ${validRecords.length}/${RATE_LIMIT_CONFIG.maxRequests}`);
    
    return {
      limited: true,
      remaining: 0,
      resetTime: windowStart + RATE_LIMIT_CONFIG.windowMs
    };
  }

  // Agregar nuevo registro
  validRecords.push(now);
  rateLimitStore.set(key, validRecords);

  // Limpiar registros antiguos periódicamente
  if (Math.random() < 0.01) { // 1% de probabilidad de limpiar
    cleanupOldRecords();
  }

  return {
    limited: false,
    remaining: RATE_LIMIT_CONFIG.maxRequests - validRecords.length,
    resetTime: windowStart + RATE_LIMIT_CONFIG.windowMs
  };
}

// ===== LIMPIEZA DE REGISTROS ANTIGUOS =====
function cleanupOldRecords() {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_CONFIG.windowMs;
  
  for (const [key, records] of rateLimitStore.entries()) {
    const validRecords = records.filter(timestamp => timestamp > windowStart);
    if (validRecords.length === 0) {
      rateLimitStore.delete(key);
    } else {
      rateLimitStore.set(key, validRecords);
    }
  }
}

// ===== MIDDLEWARE DE RATE LIMITING =====
function rateLimitMiddleware(handler) {
  return async (event, context) => {
    // Verificar rate limit
    const rateLimitResult = checkRateLimit(event);
    
    if (rateLimitResult.limited) {
      return RATE_LIMIT_CONFIG.handler(event, context);
    }

    // Agregar headers de rate limit a la respuesta
    const originalHandler = handler;
    const wrappedHandler = async (event, context) => {
      const response = await originalHandler(event, context);
      
      if (response && response.headers) {
        response.headers['X-RateLimit-Limit'] = RATE_LIMIT_CONFIG.maxRequests;
        response.headers['X-RateLimit-Remaining'] = rateLimitResult.remaining;
        response.headers['X-RateLimit-Reset'] = new Date(rateLimitResult.resetTime).toISOString();
      }
      
      return response;
    };

    return wrappedHandler(event, context);
  };
}

// ===== FUNCIÓN DE UTILIDAD PARA OBTENER ESTADÍSTICAS =====
function getRateLimitStats() {
  const stats = {
    totalIPs: rateLimitStore.size,
    totalRequests: 0,
    limitedIPs: 0
  };

  for (const [key, records] of rateLimitStore.entries()) {
    stats.totalRequests += records.length;
    if (records.length >= RATE_LIMIT_CONFIG.maxRequests) {
      stats.limitedIPs++;
    }
  }

  return stats;
}

module.exports = {
  checkRateLimit,
  rateLimitMiddleware,
  getRateLimitStats,
  RATE_LIMIT_CONFIG
};
