// ===== CONFIGURACIÓN DE AUTH0 =====
// La configuración se carga desde env-config.js generado automáticamente
const auth0Config = window.AUTH0_CONFIG || {
    domain: window.AUTH0_CONFIG?.domain || '',
    client_id: window.AUTH0_CONFIG?.client_id || '',
    redirect_uri: window.location.origin + '/app/',
    cacheLocation: 'localstorage',
    // ⚡ OPTIMIZACIONES DE VELOCIDAD
    useRefreshTokens: true,
    cacheExpirationInSeconds: 3600, // 1 hora
    skipRedirectCallback: false
};

let auth0 = null;
let cachedToken = null; // ⚡ Cache local de token
let tokenExpiry = 0; // ⚡ Control de expiración

// ===== ELEMENTOS DEL DOM =====
let authOverlay, loginButton, userButton, userDropdown, logoutButton;
let userName, userEmail, userId, userVerified, serverData, serverDataContent;

// ===== VERIFICAR ERRORES ANTES DE INICIALIZAR =====
function checkForErrors() {
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get('error');
    
    if (error === 'access_denied') {
        console.log('🚫 Error de acceso denegado detectado ANTES de inicializar, redirigiendo inmediatamente');
        window.location.replace('/forbidden.html');
        return true; // Indica que hay error
    }
    return false; // No hay error
}

// ===== ⚡ OBTENER TOKEN OPTIMIZADO =====
async function getOptimizedToken() {
    const now = Math.floor(Date.now() / 1000);
    
    // ⚡ Usar cache si el token no ha expirado
    if (cachedToken && tokenExpiry > now + 300) { // 5 minutos de margen
        console.log('⚡ [AUTH] Usando token cacheado');
        return cachedToken;
    }
    
    try {
        console.log('🔄 [AUTH] Obteniendo nuevo token...');
        const token = await auth0.getIdTokenClaims();
        cachedToken = token.__raw;
        tokenExpiry = token.exp || (now + 3600); // 1 hora por defecto
        
        console.log('✅ [AUTH] Token obtenido y cacheado');
        return cachedToken;
    } catch (error) {
        console.error('❌ [AUTH] Error obteniendo token:', error);
        throw error;
    }
}

// ===== INICIALIZACIÓN OPTIMIZADA =====
async function initAuth0() {
    try {
        // Verificar errores ANTES de cualquier inicialización
        if (checkForErrors()) {
            return; // Salir si hay error
        }
        
        console.log('🚀 [AUTH] Inicializando Auth0...');
        auth0 = await createAuth0Client(auth0Config);
        
        // Manejar redirección después del login
        if (window.location.search.includes('code=')) {
            console.log('🔍 [AUTH] Detectado código de autorización en URL');
            
            try {
                console.log('🔄 [AUTH] Procesando callback de Auth0...');
                await auth0.handleRedirectCallback();
                console.log('✅ [AUTH] Callback procesado exitosamente');
                window.history.replaceState({}, document.title, window.location.pathname);
                
                // ⚡ Limpiar cache después del login
                cachedToken = null;
                tokenExpiry = 0;
            } catch (error) {
                console.error('❌ [AUTH] Error en callback:', error);
                
                // Verificar si es error de acceso denegado
                if (error.error === 'access_denied') {
                    console.log('🚫 [AUTH] Error de acceso denegado detectado, redirigiendo a /forbidden.html');
                    window.location.replace('/forbidden.html');
                    return;
                }
                
                throw error;
            }
        }
        
        // Configurar event listeners
        setupEventListeners();
        
        // Verificar estado de autenticación
        await checkAuthState();
        
    } catch (error) {
        console.error('❌ [AUTH] Error inicializando Auth0:', error);
        showError('Error al inicializar la autenticación');
    }
}

// ===== CONFIGURAR EVENT LISTENERS =====
function setupEventListeners() {
    if (loginButton) {
        loginButton.onclick = () => auth0.loginWithRedirect({
            connection: 'google-oauth2',
            prompt: 'select_account',
            scope: 'openid profile email'
        });
    }
    
    if (logoutButton) {
        logoutButton.onclick = () => {
            // ⚡ Limpiar cache al logout
            cachedToken = null;
            tokenExpiry = 0;
            auth0.logout({ 
                returnTo: window.location.origin + '/login.html' 
            });
        };
    }
    
    if (userButton) {
        userButton.onclick = () => {
            userDropdown.classList.toggle('show');
        };
    }

    // Cerrar dropdown al hacer clic fuera
    document.addEventListener('click', (e) => {
        if (userButton && userDropdown && 
            !userButton.contains(e.target) && 
            !userDropdown.contains(e.target)) {
            userDropdown.classList.remove('show');
        }
    });
}

// ===== VERIFICAR ESTADO DE AUTENTICACIÓN OPTIMIZADO =====
async function checkAuthState() {
    try {
        const isAuthenticated = await auth0.isAuthenticated();
        
        if (isAuthenticated) {
            console.log('✅ [AUTH] Usuario autenticado, mostrando UI');
            await showAuthenticatedUI();
        } else {
            console.log('❌ [AUTH] Usuario no autenticado, mostrando overlay');
            showUnauthenticatedUI();
        }
    } catch (error) {
        console.error('❌ [AUTH] Error verificando estado de autenticación:', error);
        showUnauthenticatedUI();
    }
}

// ===== MOSTRAR UI AUTENTICADA OPTIMIZADA =====
async function showAuthenticatedUI() {
    try {
        const user = await auth0.getUser();
        
        // ⚡ Log seguro - solo información no sensible
        console.log('🔍 [AUTH] Usuario autenticado:', {
            hasName: !!user.name,
            hasEmail: !!user.email,
            hasPicture: !!user.picture,
            isVerified: user.email_verified
        });
        
        // Ocultar overlay de autenticación
        if (authOverlay) {
            authOverlay.style.display = 'none';
        }
        
        // Mostrar botón de usuario
        if (userButton) {
            userButton.style.display = 'flex';
        }
        
        // Configurar imagen de perfil
        const userPicture = document.getElementById('userPicture');
        const userInitial = document.getElementById('userInitial');
        
        if (userPicture && userInitial) {
            if (user.picture) {
                // Si hay foto de perfil, mostrarla
                console.log('🖼️ [AUTH] Mostrando foto de perfil');
                userPicture.src = user.picture;
                userPicture.style.display = 'block';
                userInitial.style.display = 'none';
            } else {
                // Si no hay foto, mostrar inicial
                console.log('🔤 [AUTH] No hay foto, mostrando inicial:', user.name ? user.name.charAt(0).toUpperCase() : 'U');
                userInitial.textContent = user.name ? user.name.charAt(0).toUpperCase() : 'U';
                userPicture.style.display = 'none';
                userInitial.style.display = 'flex';
            }
        }
        
        // Actualizar información del usuario
        if (userName) userName.textContent = user.name || user.email;
        if (userEmail) userEmail.textContent = user.email || 'N/A';
        if (userId) userId.textContent = user.sub || 'N/A';
        if (userVerified) userVerified.textContent = user.email_verified ? 'Sí' : 'No';
        
        // ⚡ Obtener datos del servidor de forma asíncrona (no bloquear UI)
        setTimeout(() => {
            fetchProtectedData();
        }, 100);
        
    } catch (error) {
        console.error('❌ [AUTH] Error mostrando UI autenticada:', error);
        showUnauthenticatedUI();
    }
}

// ===== MOSTRAR UI NO AUTENTICADA =====
function showUnauthenticatedUI() {
    if (authOverlay) {
        authOverlay.style.display = 'flex';
    }
    if (userButton) {
        userButton.style.display = 'none';
    }
    if (serverData) {
        serverData.style.display = 'none';
    }
}

// ===== ⚡ OBTENER DATOS PROTEGIDOS OPTIMIZADO =====
async function fetchProtectedData() {
    try {
        const idToken = await getOptimizedToken();
        
        console.log('🔄 [AUTH] Obteniendo datos protegidos...');
        const response = await fetch('/.netlify/functions/auth-protect', {
            headers: {
                'Authorization': `Bearer ${idToken}`,
                'X-Requested-With': 'XMLHttpRequest' // ⚡ Optimización para Netlify
            }
        });

        if (response.ok) {
            const data = await response.json();
            if (serverData) {
                serverData.style.display = 'block';
            }
            if (serverDataContent) {
                serverDataContent.innerHTML = `
                    <p><strong>✅ Respuesta del servidor:</strong> ${data.message}</p>
                    <p><strong>⏰ Timestamp:</strong> ${new Date().toLocaleString()}</p>
                    <p><strong>👤 Usuario del servidor:</strong> ${data.user?.name || 'N/A'}</p>
                    <p><strong>🔑 Permisos:</strong> ${data.permissions?.length || 0} permisos disponibles</p>
                `;
            }
            console.log('✅ [AUTH] Datos protegidos obtenidos exitosamente');
        } else {
            throw new Error('Error en la respuesta del servidor');
        }
    } catch (error) {
        console.error('❌ [AUTH] Error obteniendo datos protegidos:', error);
        if (serverData) {
            serverData.style.display = 'block';
        }
        if (serverDataContent) {
            serverDataContent.innerHTML = `
                <p class="message error">Error al obtener datos del servidor: ${error.message}</p>
            `;
        }
    }
}

// ===== MOSTRAR ERROR =====
function showError(message) {
    const loadingContainer = document.getElementById('loadingContainer');
    const errorContainer = document.getElementById('errorContainer');
    
    if (loadingContainer) {
        loadingContainer.style.display = 'none';
    }
    if (errorContainer) {
        errorContainer.classList.add('show');
    }
    
    console.error('❌ [AUTH] Error:', message);
}

// ===== MOSTRAR MENSAJES =====
function showMessage(message, type = 'info') {
    console.log(`[${type.toUpperCase()}] ${message}`);
}

// ===== EXPORTAR FUNCIONES =====
window.AuthManager = {
    initAuth0,
    setupEventListeners,
    checkAuthState,
    showAuthenticatedUI,
    showUnauthenticatedUI,
    fetchProtectedData,
    getOptimizedToken
};

// ===== INICIALIZAR CUANDO EL DOM ESTÉ LISTO =====
document.addEventListener('DOMContentLoaded', () => {
    // Obtener referencias a elementos del DOM
    authOverlay = document.getElementById('authOverlay');
    loginButton = document.getElementById('loginButton');
    userButton = document.getElementById('userButton');
    userDropdown = document.getElementById('userDropdown');
    logoutButton = document.getElementById('logoutButton');
    userName = document.getElementById('userName');
    userEmail = document.getElementById('userEmail');
    userId = document.getElementById('userId');
    userVerified = document.getElementById('userVerified');
    serverData = document.getElementById('serverData');
    serverDataContent = document.getElementById('serverDataContent');
    
    // Inicializar Auth0
    initAuth0();
});
