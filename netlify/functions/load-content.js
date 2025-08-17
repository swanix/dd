// ===== CARGA DE CONTENIDO DINÁMICO =====
// Función base para cargar contenido dinámico desde el servidor
// Esta función valida autenticación y devuelve contenido JSON

const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

// ===== CONFIGURACIÓN =====
const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN;
const SHEETBEST_API_KEY = process.env.SHEETBEST_API_KEY;
const SHEETBEST_SHEET_ID = process.env.SHEETBEST_SHEET_ID || 'tu-sheet-id-aqui';
const SHEETBEST_TAB_NAME = process.env.SHEETBEST_TAB_NAME || 'nombre-del-tab-aqui';

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

// ===== CARGAR DATOS DESDE SHEETBEST =====
async function loadSheetBestData() {
    try {
        if (!SHEETBEST_API_KEY) {
            console.warn('⚠️ SHEETBEST_API_KEY no configurada, usando datos de ejemplo');
            return getExampleData();
        }

        // Construir URL con el nombre del tab usando /tabs/
        let url;
        if (SHEETBEST_TAB_NAME && SHEETBEST_TAB_NAME.trim() !== '') {
            url = `https://api.sheetbest.com/sheets/${SHEETBEST_SHEET_ID}/tabs/${encodeURIComponent(SHEETBEST_TAB_NAME)}`;
            console.log(`🔄 Cargando datos desde tab: ${SHEETBEST_TAB_NAME}`);
        } else {
            url = `https://api.sheetbest.com/sheets/${SHEETBEST_SHEET_ID}`;
            console.log(`🔄 Cargando datos desde tab por defecto`);
        }
        
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
        console.log('✅ Datos cargados desde SheetBest:', data.length, 'registros');
        return data;

    } catch (error) {
        console.error('❌ Error cargando datos desde SheetBest:', error.message);
        console.log('🔄 Usando datos de ejemplo como fallback');
        return getExampleData();
    }
}

// ===== DATOS DE EJEMPLO (FALLBACK) =====
function getExampleData() {
    return [
        {
            id: 1,
            titulo: 'Proyecto Alpha',
            descripcion: 'Desarrollo de aplicación web moderna',
            estado: 'En Progreso',
            prioridad: 'Alta',
            fecha_creacion: '2024-01-15',
            responsable: 'Juan Pérez',
            categoria: 'Desarrollo'
        },
        {
            id: 2,
            titulo: 'Diseño de UI/UX',
            descripcion: 'Creación de interfaces de usuario',
            estado: 'Completado',
            prioridad: 'Media',
            fecha_creacion: '2024-01-10',
            responsable: 'María García',
            categoria: 'Diseño'
        },
        {
            id: 3,
            titulo: 'Testing de Calidad',
            descripcion: 'Pruebas de funcionalidad y rendimiento',
            estado: 'Pendiente',
            prioridad: 'Alta',
            fecha_creacion: '2024-01-20',
            responsable: 'Carlos López',
            categoria: 'QA'
        },
        {
            id: 4,
            titulo: 'Documentación Técnica',
            descripcion: 'Manuales y guías de usuario',
            estado: 'En Progreso',
            prioridad: 'Baja',
            fecha_creacion: '2024-01-18',
            responsable: 'Ana Rodríguez',
            categoria: 'Documentación'
        },
        {
            id: 5,
            titulo: 'Optimización de Base de Datos',
            descripcion: 'Mejora de consultas y rendimiento',
            estado: 'Completado',
            prioridad: 'Media',
            fecha_creacion: '2024-01-12',
            responsable: 'Luis Martínez',
            categoria: 'Backend'
        }
    ];
}

// ===== PROCESAR DATOS DINÁMICOS =====
function processDynamicContent(rawData) {
    try {
        // Filtrar datos válidos (con ID y Name)
        const validData = rawData.filter(item => 
            item.ID && item.Name && item.ID !== '' && item.Name !== ''
        );

        // Mantener la estructura original de los datos de Google Sheets
        const mappedData = validData.map(item => ({
            ID: item.ID,
            Parent: item.Parent || '',
            Name: item.Name,
            Type: item.Type || '',
            Layout: item.Layout || '',
            URL: item.URL || '',
            Country: item.Country || '',
            Technology: item.Technology || '',
            Responsive: item.Responsive || '',
            Description: item.Description || '',
            Img: item.Img || ''
        }));

        // Estadísticas simples
        const stats = {
            totalItems: mappedData.length,
            tipos: [...new Set(mappedData.map(item => item.Type).filter(Boolean))].length,
            layouts: [...new Set(mappedData.map(item => item.Layout).filter(Boolean))].length,
            paises: [...new Set(mappedData.map(item => item.Country).filter(Boolean))].length
        };

        // Agrupar por tipo
        const categorias = {};
        mappedData.forEach(item => {
            const tipo = item.Type || 'Sin Tipo';
            if (!categorias[tipo]) {
                categorias[tipo] = [];
            }
            categorias[tipo].push(item);
        });

        // Agrupar por país
        const responsables = {};
        mappedData.forEach(item => {
            const pais = item.Country || 'Sin País';
            if (!responsables[pais]) {
                responsables[pais] = [];
            }
            responsables[pais].push(item);
        });

        // Actividad reciente (últimos 5 items)
        const actividadReciente = mappedData
            .slice(0, 5);

        return {
            stats,
            categorias,
            responsables,
            actividadReciente,
            items: mappedData
        };

    } catch (error) {
        console.error('Error procesando datos dinámicos:', error);
        return {
            stats: { totalItems: 0, enProgreso: 0, completados: 0, pendientes: 0 },
            categorias: {},
            responsables: {},
            actividadReciente: [],
            items: []
        };
    }
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

        // ===== CARGAR CONTENIDO DINÁMICO DESDE SHEETBEST =====
        console.log('🔄 Cargando datos desde SheetBest...');
        const rawData = await loadSheetBestData();
        const processedData = processDynamicContent(rawData);

        // ===== CONSTRUIR RESPUESTA =====
        const content = {
            type: 'table',
            title: 'Tabla de Productos Alegra',
            content: {
                welcome: `Bienvenido ${userName}`,
                email: userEmail,
                lastLogin: new Date().toISOString(),
                dataSource: SHEETBEST_API_KEY ? 'SheetBest API' : 'Datos de Ejemplo',
                stats: processedData.stats,
                headers: ['ID', 'Parent', 'Name', 'Type', 'Layout', 'URL', 'Country', 'Technology', 'Responsive', 'Description', 'Img'],
                data: processedData.items
            }
        };

        // ===== RESPONDER CON CONTENIDO =====
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
                timestamp: new Date().toISOString(),
                dataSource: SHEETBEST_API_KEY ? 'SheetBest API' : 'Example Data'
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
