// ===== PROTECCIÓN DE CONTENIDO MARKDOWN =====
// Esta función intercepta requests a archivos markdown y verifica autenticación

const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');
const fs = require('fs').promises;
const path = require('path');
const { marked } = require('marked');

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

// ===== LEER ARCHIVO MARKDOWN =====
async function readMarkdownFile(filePath) {
    try {
        const content = await fs.readFile(filePath, 'utf8');
        return content;
    } catch (error) {
        if (error.code === 'ENOENT') {
            throw new Error('Archivo no encontrado');
        }
        throw error;
    }
}

// ===== CONVERTIR MARKDOWN A HTML =====
function markdownToHtml(markdown) {
    // Configurar marked para seguridad
    marked.setOptions({
        breaks: true,
        gfm: true,
        sanitize: false, // Usaremos DOMPurify en el cliente
        smartLists: true,
        smartypants: true
    });
    
    return marked(markdown);
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
                    message: 'Token requerido para acceder a este contenido'
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

        // ===== OBTENER RUTA DEL ARCHIVO =====
        const requestPath = event.path.replace('/.netlify/functions/protect-content', '');
        
        // Extraer solo el nombre del archivo (remover /app/content/ si está presente)
        let fileName = requestPath.replace('/app/content/', '').replace('/app/content', '');
        // Remover trailing slash si existe
        fileName = fileName.replace(/\/$/, '');
        
        // Usar process.cwd() que debería apuntar al directorio del proyecto
        const projectRoot = process.cwd();
        const contentPath = path.join(projectRoot, 'app', 'content', fileName);
        
        // ===== VALIDAR RUTA SEGURA =====
        const normalizedPath = path.normalize(contentPath);
        const contentDir = path.join(projectRoot, 'app', 'content');
        
        // Debug: Log de rutas
        console.log('🔍 Debug de rutas:');
        console.log('  - event.path:', event.path);
        console.log('  - requestPath:', requestPath);
        console.log('  - fileName:', fileName);
        console.log('  - projectRoot:', projectRoot);
        console.log('  - contentPath:', contentPath);
        console.log('  - normalizedPath:', normalizedPath);
        console.log('  - contentDir:', contentDir);
        console.log('  - process.cwd():', process.cwd());
        
        if (!normalizedPath.startsWith(contentDir)) {
            console.log('❌ Ruta fuera del directorio permitido');
            return {
                statusCode: 403,
                headers: { ...headers, 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    error: 'forbidden',
                    message: 'Acceso denegado a esta ruta'
                })
            };
        }

        // ===== DETERMINAR FORMATO DE RESPUESTA =====
        const acceptHeader = event.headers.accept || event.headers.Accept || '';
        const wantsJson = acceptHeader.includes('application/json');
        const wantsRaw = acceptHeader.includes('text/markdown') || acceptHeader.includes('text/plain');

        // ===== LEER Y PROCESAR ARCHIVO =====
        let fileContent;
        let fileExtension = path.extname(normalizedPath);
        
        // Si no tiene extensión, intentar con .md
        if (!fileExtension) {
            try {
                fileContent = await readMarkdownFile(normalizedPath + '.md');
                fileExtension = '.md';
            } catch (error) {
                // Intentar sin extensión
                fileContent = await readMarkdownFile(normalizedPath);
            }
        } else {
            fileContent = await readMarkdownFile(normalizedPath);
        }

        // ===== PREPARAR RESPUESTA =====
        if (wantsRaw) {
            // Devolver markdown raw
            return {
                statusCode: 200,
                headers: {
                    ...headers,
                    'Content-Type': 'text/markdown; charset=utf-8',
                    'Cache-Control': 'no-cache, no-store, must-revalidate'
                },
                body: fileContent
            };
        } else if (wantsJson) {
            // Devolver JSON con markdown y HTML
            const htmlContent = markdownToHtml(fileContent);
            return {
                statusCode: 200,
                headers: {
                    ...headers,
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-cache, no-store, must-revalidate'
                },
                body: JSON.stringify({
                    markdown: fileContent,
                    html: htmlContent,
                    metadata: {
                        filename: path.basename(normalizedPath),
                        extension: fileExtension,
                        size: fileContent.length,
                        lastModified: new Date().toISOString()
                    },
                    user: {
                        sub: decoded.sub,
                        email: decoded.email,
                        name: decoded.name
                    }
                })
            };
        } else {
            // Devolver HTML por defecto
            const htmlContent = markdownToHtml(fileContent);
            return {
                statusCode: 200,
                headers: {
                    ...headers,
                    'Content-Type': 'text/html; charset=utf-8',
                    'Cache-Control': 'no-cache, no-store, must-revalidate'
                },
                body: htmlContent
            };
        }

    } catch (error) {
        console.error('❌ Error en protección de contenido:', error);
        
        if (error.message === 'Archivo no encontrado') {
            return {
                statusCode: 404,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    error: 'not_found',
                    message: 'Contenido no encontrado'
                })
            };
        }

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
