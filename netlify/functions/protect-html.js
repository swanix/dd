// ===== PROTECCIÓN DE ARCHIVOS HTML A NIVEL DE SERVIDOR =====
// Esta función intercepta requests a archivos HTML y verifica autenticación

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
            console.log('📸 Información del usuario:', {
                name: decoded.name,
                email: decoded.email,
                picture: decoded.picture,
                sub: decoded.sub
            });
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
        // Extraer información del usuario del token
        const userEmail = decoded.email || 'usuario@email.com';
        const userName = decoded.name || 'Usuario';
        const userInitial = userName.charAt(0).toUpperCase();
        
        // Extraer foto de perfil de Google (si está disponible)
        const userPicture = decoded.picture || null;
        
        // ===== CARGAR CONTENIDO DESDE ARCHIVOS SEPARADOS =====
        // Aquí puedes cargar contenido desde archivos HTML, base de datos, etc.
        const loadContent = () => {
            return `
                <div class="article">
                    <h3>Dashboard</h3>
                    <p>Bienvenido ${userName} (${userEmail})</p>
                    
                    <div class="dashboard-grid">
                        <div class="dashboard-card">
                            <h4>Estadísticas</h4>
                            <p>Ver estadísticas y métricas</p>
                        </div>
                        
                        <div class="dashboard-card">
                            <h4>Documentos</h4>
                            <p>Gestionar documentos</p>
                        </div>
                        
                        <div class="dashboard-card">
                            <h4>Configuración</h4>
                            <p>Ajustar preferencias</p>
                        </div>
                        
                        <div class="dashboard-card">
                            <h4>Notificaciones</h4>
                            <p>Ver mensajes</p>
                        </div>
                    </div>
                </div>
            `;
        };
        
        const protectedHtml = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Aplicación</title>
    <link rel="stylesheet" href="/assets/css/main.css">
    

</head>
<body>
    <div class="app-container">
        <aside class="sidebar">
            <div class="sidebar-header">
                <h2>Aplicación</h2>
            </div>
            <nav class="sidebar-nav">
                <ul>
                    <li><a href="/app/" class="nav-link active">Inicio</a></li>
                    <li><a href="/app/dashboard.html" class="nav-link">Dashboard</a></li>
                </ul>
            </nav>
        </aside>
        
        <div class="main-content">
            <header class="topbar">
                <div class="topbar-left">
                    <h1>Dashboard</h1>
                </div>
                <div class="topbar-right">
                    <div class="user-menu">
                        <button id="userButton" class="user-button">
                            <div class="user-avatar">
                                ${userPicture ? `<img src="${userPicture}" alt="${userName}" id="userPicture" style="width: 32px; height: 32px; border-radius: 50%; object-fit: cover;">` : `<span id="userInitial">${userInitial}</span>`}
                            </div>
                            <span id="userName">${userName}</span>
                            <i>▼</i>
                        </button>
                        <div class="user-dropdown" id="userDropdown">
                            <div class="user-dropdown-item">
                                <span id="userEmail">${userEmail}</span>
                            </div>
                            <div class="user-dropdown-item">
                                <span id="userId">${decoded.sub}</span>
                            </div>
                            <a href="#" class="user-dropdown-item logout" id="logoutButton">
                                <span>Cerrar Sesión</span>
                            </a>
                        </div>
                    </div>
                </div>
            </header>
            
            <main class="content-area">
                <div class="content-header">
                    <h2>Bienvenido</h2>
                    <p>Contenido protegido de la aplicación</p>
                </div>

                ${loadContent()}
            </main>
        </div>
    </div>
    
    <!-- Scripts -->
    <script src="https://cdn.auth0.com/js/auth0-spa-js/1.13/auth0-spa-js.production.js"></script>
    <script src="/assets/js/env-config.js"></script>
    <script src="/assets/js/utils.js"></script>
    <script src="/assets/js/auth.js"></script>
    
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            const userButton = document.getElementById('userButton');
            const userDropdown = document.getElementById('userDropdown');
            const logoutButton = document.getElementById('logoutButton');
            
            const auth0Config = window.AUTH0_CONFIG || {
                domain: window.AUTH0_CONFIG?.domain || '',
                client_id: window.AUTH0_CONFIG?.client_id || '',
                redirect_uri: window.location.origin + '/app/',
                cacheLocation: 'localstorage'
            };
            
            createAuth0Client(auth0Config).then(auth0 => {
                userButton.addEventListener('click', function() {
                    userDropdown.classList.toggle('show');
                });
                
                document.addEventListener('click', function(event) {
                    if (!userButton.contains(event.target)) {
                        userDropdown.classList.remove('show');
                    }
                });
                
                logoutButton.addEventListener('click', function(e) {
                    e.preventDefault();
                    auth0.logout({
                        returnTo: window.location.origin + '/login.html'
                    });
                });
            }).catch(error => {
                console.error('Error inicializando Auth0:', error);
            });
        });
    </script>
</body>
</html>`;

                            return {
                        statusCode: 200,
                        headers: {
                            ...headers,
                            'Content-Type': 'application/json',
                            'Cache-Control': 'no-cache, no-store, must-revalidate'
                        },
                        body: JSON.stringify({
                            content: loadContent(),
                            user: {
                                name: userName,
                                email: userEmail,
                                picture: userPicture,
                                sub: decoded.sub
                            }
                        })
                    };

    } catch (error) {
        console.error('❌ Error en protección HTML:', error);
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
