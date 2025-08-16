// ===== CARGA DE CONTENIDO DINÁMICO =====
// Función base para cargar contenido dinámico desde el servidor
// Esta función valida autenticación y devuelve contenido JSON

const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

// ===== CONFIGURACIÓN =====
const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN;

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
            algorithms: ['RS256']
        }, (err, decoded) => {
            if (err) {
                reject(err);
            } else {
                resolve(decoded);
            }
        });
    });
}

// ===== HANDLER PRINCIPAL =====
exports.handler = async (event, context) => {
    try {
        // ===== CONFIGURAR CORS =====
        const headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Access-Control-Allow-Methods': 'GET, OPTIONS'
        };

        // ===== MANEJAR PREFLIGHT =====
        if (event.httpMethod === 'OPTIONS') {
            return {
                statusCode: 200,
                headers,
                body: ''
            };
        }

        // ===== OBTENER TOKEN =====
        const authHeader = event.headers.authorization || event.headers.Authorization || '';
        
        if (!authHeader.startsWith('Bearer ')) {
            return {
                statusCode: 401,
                headers: { ...headers, 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    error: 'unauthorized',
                    message: 'Token requerido para acceder a este recurso'
                })
            };
        }

        const token = authHeader.replace('Bearer ', '');

        // ===== VALIDAR TOKEN =====
        let decoded;
        try {
            if (!AUTH0_DOMAIN) {
                throw new Error('AUTH0_DOMAIN no configurado');
            }
            decoded = await validateToken(token);
            console.log('✅ Token válido para usuario:', decoded.sub);
        } catch (error) {
            console.error('❌ Token inválido:', error.message);
            return {
                statusCode: 401,
                headers: { ...headers, 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    error: 'invalid_token',
                    message: 'Token inválido o expirado'
                })
            };
        }

        // ===== SI LLEGA AQUÍ, EL TOKEN ES VÁLIDO =====
        const userEmail = decoded.email || 'usuario@email.com';
        const userName = decoded.name || 'Usuario';
        const userPicture = decoded.picture || null;

        // ===== CARGAR CONTENIDO DINÁMICO =====
        // Aquí puedes cargar contenido desde base de datos, archivos, APIs, etc.
        const loadDynamicContent = () => {
            // Ejemplo: contenido dinámico basado en el usuario
            return {
                type: 'dashboard',
                title: 'Dashboard Personal',
                content: {
                    welcome: `Bienvenido ${userName}`,
                    email: userEmail,
                    lastLogin: new Date().toISOString(),
                    stats: {
                        totalItems: 42,
                        pendingTasks: 5,
                        completedTasks: 37
                    },
                    recentActivity: [
                        { id: 1, action: 'Documento creado', timestamp: '2024-01-15T10:30:00Z' },
                        { id: 2, action: 'Configuración actualizada', timestamp: '2024-01-15T09:15:00Z' },
                        { id: 3, action: 'Notificación recibida', timestamp: '2024-01-15T08:45:00Z' }
                    ]
                }
            };
        };

        // ===== RESPONDER CON CONTENIDO =====
        const content = loadDynamicContent();
        
        return {
            statusCode: 200,
            headers: {
                ...headers,
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache, no-store, must-revalidate'
            },
            body: JSON.stringify({
                success: true,
                content: content,
                user: {
                    name: userName,
                    email: userEmail,
                    picture: userPicture,
                    sub: decoded.sub
                },
                timestamp: new Date().toISOString()
            })
        };

    } catch (error) {
        console.error('❌ Error cargando contenido:', error);
        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                error: 'server_error',
                message: 'Error interno del servidor'
            })
        };
    }
};
