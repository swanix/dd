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
            // Por ahora usamos contenido inline, pero puedes cargar desde archivos
            return `
                <div class="article">
                    <h3>🎉 ¡Contenido Realmente Protegido!</h3>
                    <p>Este contenido solo se sirve después de validar el token JWT en el servidor.</p>
                    
                    <div class="highlight">
                        <strong>🎯 Punto Clave:</strong> La autenticación con Auth0 asegura que solo usuarios autorizados puedan acceder a contenido sensible.
                    </div>
                    
                    <h3>📊 Dashboard de Usuario</h3>
                    <p>Bienvenido <strong>${userName}</strong> (${userEmail}) a tu panel de control personalizado.</p>
                    
                    <div class="dashboard-grid">
                        <div class="dashboard-card">
                            <h4>📈 Estadísticas</h4>
                            <p>Aquí puedes ver tus estadísticas personales y métricas importantes.</p>
                        </div>
                        
                        <div class="dashboard-card">
                            <h4>📝 Documentos</h4>
                            <p>Gestiona tus documentos y archivos importantes de forma segura.</p>
                        </div>
                        
                        <div class="dashboard-card">
                            <h4>⚙️ Configuración</h4>
                            <p>Personaliza tu experiencia y ajusta las preferencias de tu cuenta.</p>
                        </div>
                        
                        <div class="dashboard-card">
                            <h4>🔔 Notificaciones</h4>
                            <p>Revisa tus notificaciones y mensajes importantes.</p>
                        </div>
                    </div>
                    
                    <h3>🔧 Características de Seguridad</h3>
                    <ul style="margin: 15px 0; padding-left: 20px;">
                        <li>✅ Validación de token en servidor</li>
                        <li>✅ HTML no se descarga sin autenticación</li>
                        <li>✅ Protección a nivel de servidor</li>
                        <li>✅ No hay contenido visible en código fuente</li>
                        <li>✅ Interfaz de usuario completa</li>
                        <li>✅ Manejo de sesiones persistente</li>
                    </ul>
                    
                    <p>Esta implementación demuestra las mejores prácticas para proteger contenido HTML estático usando tecnologías modernas y seguras.</p>
                </div>
            `;
        };
        
        const protectedHtml = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Contenido Protegido - Mi Aplicación</title>
    <link rel="stylesheet" href="/assets/css/main.css">
    <link rel="stylesheet" href="/assets/css/layout.css">
    <link rel="stylesheet" href="/assets/css/components.css">
    <link rel="stylesheet" href="/assets/css/auth.css">
    
    <style>
        /* Estilos para el dropdown del usuario */
        .user-dropdown {
            display: none;
            position: absolute;
            top: 100%;
            right: 0;
            background: white;
            border: 1px solid #ddd;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            min-width: 200px;
            z-index: 1000;
        }
        
        .user-dropdown.show {
            display: block;
        }
        
        .user-dropdown-item {
            padding: 12px 16px;
            border-bottom: 1px solid #eee;
            display: flex;
            align-items: center;
            gap: 8px;
            cursor: pointer;
            transition: background-color 0.2s;
        }
        
        .user-dropdown-item:hover {
            background-color: #f5f5f5;
        }
        
        .user-dropdown-item:last-child {
            border-bottom: none;
        }
        
        .user-dropdown-item.logout {
            color: #dc3545;
        }
        
        .user-dropdown-item.logout:hover {
            background-color: #dc3545;
            color: white;
        }
        
        .user-button {
            cursor: pointer;
            padding: 8px 12px;
            border-radius: 6px;
            transition: background-color 0.2s;
        }
        
        .user-button:hover {
            background-color: rgba(255,255,255,0.1);
        }
        
        .user-avatar {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            font-weight: bold;
            margin-right: 8px;
        }
        
        .user-avatar img {
            border: 2px solid rgba(255,255,255,0.3);
        }
    </style>
</head>
<body>
    <div class="app-container">
        <aside class="sidebar">
            <div class="sidebar-header">
                <h2>🚀 Mi App</h2>
            </div>
            <nav class="sidebar-nav">
                <ul>
                    <li><a href="/app/" class="nav-link active">🏠 Aplicación</a></li>
                    <li><a href="/app/dashboard.html" class="nav-link">📊 Dashboard</a></li>
                </ul>
            </nav>
        </aside>
        
        <div class="main-content">
            <header class="topbar">
                <div class="topbar-left">
                    <h1>Contenido Protegido</h1>
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
                                <i>👤</i>
                                <span id="userEmail">${userEmail}</span>
                            </div>
                            <div class="user-dropdown-item">
                                <i>🆔</i>
                                <span id="userId">${decoded.sub}</span>
                            </div>
                            <div class="user-dropdown-item">
                                <i>✅</i>
                                <span id="userVerified">Email verificado</span>
                            </div>
                            <div class="user-dropdown-item">
                                <i>⚙️</i>
                                <span>Configuración</span>
                            </div>
                            <a href="#" class="user-dropdown-item logout" id="logoutButton">
                                <i>🚪</i>
                                <span>Cerrar Sesión</span>
                            </a>
                        </div>
                    </div>
                </div>
            </header>
            
            <main class="content-area">
                <div class="content-header">
                    <h2>Bienvenido a tu Aplicación</h2>
                    <p>Aquí puedes gestionar tu contenido y configuraciones.</p>
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
        // ===== INICIALIZACIÓN DE LA INTERFAZ =====
        document.addEventListener('DOMContentLoaded', function() {
            // Obtener referencias a elementos del DOM
            const userButton = document.getElementById('userButton');
            const userDropdown = document.getElementById('userDropdown');
            const logoutButton = document.getElementById('logoutButton');
            
            // Configuración de Auth0
            const auth0Config = window.AUTH0_CONFIG || {
                domain: window.AUTH0_CONFIG?.domain || '',
                client_id: window.AUTH0_CONFIG?.client_id || '',
                redirect_uri: window.location.origin + '/app/',
                cacheLocation: 'localstorage'
            };
            
            // Crear cliente Auth0
            createAuth0Client(auth0Config).then(auth0 => {
                // Toggle del dropdown
                userButton.addEventListener('click', function() {
                    userDropdown.classList.toggle('show');
                });
                
                // Cerrar dropdown al hacer clic fuera
                document.addEventListener('click', function(event) {
                    if (!userButton.contains(event.target)) {
                        userDropdown.classList.remove('show');
                    }
                });
                
                // Logout
                logoutButton.addEventListener('click', function(e) {
                    e.preventDefault();
                    auth0.logout({
                        returnTo: window.location.origin + '/login.html'
                    });
                });
                
                console.log('✅ Interfaz de usuario inicializada correctamente');
            }).catch(error => {
                console.error('❌ Error inicializando Auth0:', error);
            });
        });
    </script>
</body>
</html>`;

        return {
            statusCode: 200,
            headers: {
                ...headers,
                'Content-Type': 'text/html',
                'Cache-Control': 'no-cache, no-store, must-revalidate'
            },
            body: protectedHtml
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
