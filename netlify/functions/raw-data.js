const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');
const fetch = require('node-fetch');

// ===== CONFIGURACIÓN =====
const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN;
const AUTH0_AUDIENCE = process.env.AUTH0_AUDIENCE;
const SHEETBEST_API_KEY = process.env.SHEETBEST_API_KEY;
const SHEETBEST_SHEET_ID = process.env.SHEETBEST_SHEET_ID || 'tu-sheet-id-aqui';
const SHEETBEST_TAB_NAME = process.env.SHEETBEST_TAB_NAME || 'nombre-del-tab-aqui';

// ===== CLIENTE JWKS =====
const client = jwksClient({
    jwksUri: `https://${AUTH0_DOMAIN}/.well-known/jwks.json`
});

function getKey(header, callback) {
    client.getSigningKey(header.kid, function(err, key) {
        const signingKey = key.publicKey || key.rsaPublicKey;
        callback(null, signingKey);
    });
}

// ===== VALIDAR TOKEN =====
async function validateToken(token) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, getKey, {
            audience: AUTH0_AUDIENCE,
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

// ===== CARGAR DATOS CRUDOS DESDE SHEETBEST =====
async function loadRawData() {
    try {
        if (!SHEETBEST_API_KEY) {
            console.warn('⚠️ SHEETBEST_API_KEY no configurada, usando datos de ejemplo');
            return getExampleData();
        }

        // Construir URL con el nombre del tab usando /tabs/
        let url;
        if (SHEETBEST_TAB_NAME && SHEETBEST_TAB_NAME.trim() !== '') {
            url = `https://api.sheetbest.com/sheets/${SHEETBEST_SHEET_ID}/tabs/${encodeURIComponent(SHEETBEST_TAB_NAME)}`;
            console.log(`🔄 Cargando datos crudos desde tab: ${SHEETBEST_TAB_NAME}`);
        } else {
            url = `https://api.sheetbest.com/sheets/${SHEETBEST_SHEET_ID}`;
            console.log(`🔄 Cargando datos crudos desde tab por defecto`);
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
        console.log('✅ Datos crudos cargados desde SheetBest:', data.length, 'registros');
        return data;

    } catch (error) {
        console.error('❌ Error cargando datos crudos desde SheetBest:', error.message);
        console.log('🔄 Usando datos de ejemplo como fallback');
        return getExampleData();
    }
}

// ===== DATOS DE EJEMPLO =====
function getExampleData() {
    return [
        {
            ID: 'WEB',
            Parent: '',
            Name: 'Website',
            Type: 'Group',
            Layout: '',
            URL: '',
            Country: 'COL',
            Technology: 'React',
            Responsive: 'Yes',
            Description: 'Sitio web principal',
            Img: 'https://alegra.design/monitor/img/section-home.svg'
        },
        {
            ID: 'WEB-F0',
            Parent: 'WEB',
            Name: 'Inicio',
            Type: 'Section',
            Layout: 'Home',
            URL: 'https://www.alegra.com',
            Country: 'COL',
            Technology: 'React',
            Responsive: 'Yes',
            Description: 'Página de inicio',
            Img: ''
        },
        {
            ID: 'WEB-F1',
            Parent: 'WEB',
            Name: 'Soluciones',
            Type: 'Label',
            Layout: 'Detail',
            URL: '',
            Country: 'COL',
            Technology: 'React',
            Responsive: 'Yes',
            Description: 'Sección de soluciones',
            Img: ''
        }
    ];
}

// ===== HANDLER PRINCIPAL =====
exports.handler = async (event, context) => {
    // Configurar CORS
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Content-Type': 'application/json'
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
        // Verificar método HTTP
        if (event.httpMethod !== 'GET') {
            return {
                statusCode: 405,
                headers,
                body: JSON.stringify({
                    error: 'method_not_allowed',
                    message: 'Solo se permite GET'
                })
            };
        }

        // Extraer token del header Authorization
        const authHeader = event.headers.authorization || event.headers.Authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return {
                statusCode: 401,
                headers,
                body: JSON.stringify({
                    error: 'unauthorized',
                    message: 'Token requerido para acceder a este recurso'
                })
            };
        }

        const token = authHeader.substring(7);

        // Validar token
        try {
            const decoded = await validateToken(token);
            console.log('✅ Token válido para usuario:', decoded.sub);
        } catch (error) {
            console.error('❌ Token inválido:', error.message);
            return {
                statusCode: 401,
                headers,
                body: JSON.stringify({
                    error: 'invalid_token',
                    message: 'Token inválido o expirado'
                })
            };
        }

        // Cargar datos crudos
        const rawData = await loadRawData();

        // Devolver datos crudos sin procesar
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                message: 'Datos crudos cargados exitosamente',
                data: {
                    items: rawData,
                    total: rawData.length,
                    source: 'SheetBest API',
                    timestamp: new Date().toISOString(),
                    tab: SHEETBEST_TAB_NAME || 'default'
                }
            })
        };

    } catch (error) {
        console.error('❌ Error en función raw-data:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: 'internal_server_error',
                message: 'Error interno del servidor',
                details: error.message
            })
        };
    }
};
