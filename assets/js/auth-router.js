// =============================================================================
// SWANIX WALL - ROUTER DE AUTENTICACIÓN CONSOLIDADO
// =============================================================================
// Este archivo maneja la lógica de autenticación para:
// - index.html (página de redirección/loading)
// - login.html (página de login específica)
// =============================================================================

// =============================================================================
// CONFIGURACIÓN Y VARIABLES GLOBALES
// =============================================================================

const auth0Config = window.AUTH0_CONFIG || {
    domain: window.AUTH0_CONFIG?.domain || '',
    client_id: window.AUTH0_CONFIG?.client_id || '',
    redirect_uri: window.location.origin + '/',
    cacheLocation: 'localstorage'
};

let auth0 = null;

// =============================================================================
// DETECCIÓN DE PÁGINA ACTUAL
// =============================================================================

function getCurrentPage() {
    const path = window.location.pathname;
    
    if (path === '/' || path === '/index.html') {
        return 'index';
    } else if (path === '/login.html') {
        return 'login';
    } else {
        return 'unknown';
    }
}

// =============================================================================
// MANEJO DE ERRORES
// =============================================================================

function checkForErrors() {
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get('error');
    
    if (error === 'access_denied') {
        console.log('🚫 Error de acceso denegado detectado, redirigiendo a /forbidden.html');
        window.location.replace('/forbidden.html');
        return true;
    }
    return false;
}

function showError(message = 'Error de autenticación') {
    console.error('❌ Error:', message);
    
    // Mostrar error en la UI si existe
    const errorContainer = document.getElementById('errorContainer');
    if (errorContainer) {
        errorContainer.classList.add('show');
        errorContainer.textContent = message;
    } else {
        // Fallback: alert si no hay contenedor de error
        alert(message);
    }
}

// =============================================================================
// LÓGICA ESPECÍFICA PARA INDEX.HTML
// =============================================================================

async function handleIndexPage() {
    console.log('🚀 [INDEX] Iniciando verificación de autenticación...');
    
    try {
        // Verificar errores primero
        if (checkForErrors()) {
            return;
        }
        
        // Crear cliente Auth0
        console.log('🔄 [INDEX] Creando cliente Auth0...');
        auth0 = await createAuth0Client(auth0Config);
        console.log('✅ [INDEX] Cliente Auth0 creado exitosamente');
        
        // Manejar callback de Auth0
        if (window.location.search.includes('code=')) {
            console.log('🔍 [INDEX] Detectado código de autorización en URL');
            
            try {
                console.log('🔄 [INDEX] Procesando callback de Auth0...');
                await auth0.handleRedirectCallback();
                console.log('✅ [INDEX] Callback procesado exitosamente');
                window.location.href = '/app/';
                return;
            } catch (error) {
                console.error('❌ [INDEX] Error en callback:', error);
                
                if (error.error === 'access_denied') {
                    console.log('🚫 [INDEX] Error de acceso denegado detectado');
                    window.location.replace('/forbidden.html');
                    return;
                }
                
                throw error;
            }
        }

        // Verificar estado de autenticación
        console.log('🔍 [INDEX] Verificando estado de autenticación...');
        const isAuthenticated = await auth0.isAuthenticated();
        console.log('📊 [INDEX] Estado de autenticación:', isAuthenticated);
        
        if (isAuthenticated) {
            // Usuario autenticado - redirigir a la app
            console.log('✅ [INDEX] Usuario autenticado, redirigiendo a /app/');
            window.location.href = '/app/';
        } else {
            // Usuario no autenticado - redirigir al login
            console.log('🔐 [INDEX] Usuario no autenticado, redirigiendo a /login.html');
            window.location.href = '/login.html';
        }
        
    } catch (error) {
        console.error('❌ [INDEX] Error verificando autenticación:', error);
        showError('Error al verificar autenticación');
    }
}

// =============================================================================
// LÓGICA ESPECÍFICA PARA LOGIN.HTML
// =============================================================================

async function handleLoginPage() {
    console.log('🔐 [LOGIN] Iniciando página de login...');
    
    try {
        // Verificar errores primero
        if (checkForErrors()) {
            return;
        }
        
        // Crear cliente Auth0
        console.log('🔄 [LOGIN] Creando cliente Auth0...');
        auth0 = await createAuth0Client(auth0Config);
        
        // Manejar callback de Auth0
        if (window.location.search.includes('code=')) {
            console.log('🔍 [LOGIN] Detectado código de autorización en URL');
            
            try {
                console.log('🔄 [LOGIN] Procesando callback de Auth0...');
                await auth0.handleRedirectCallback();
                console.log('✅ [LOGIN] Callback procesado exitosamente');
                window.location.replace('/app/');
                return;
            } catch (error) {
                console.error('❌ [LOGIN] Error en callback:', error);
                
                if (error.error === 'access_denied' || 
                    (error.message && error.message.includes('access_denied'))) {
                    console.log('🚫 [LOGIN] Error de acceso denegado detectado');
                    window.location.replace('/forbidden.html');
                    return;
                }
                
                throw error;
            }
        }

        // Verificar si ya está autenticado
        const isAuthenticated = await auth0.isAuthenticated();
        if (isAuthenticated) {
            console.log('✅ [LOGIN] Usuario ya autenticado, redirigiendo a /app/');
            window.location.replace('/app/');
            return;
        }

        // Configurar eventos de login
        setupLoginEvents();
        console.log('✅ [LOGIN] Página de login configurada correctamente');
        
    } catch (error) {
        console.error('❌ [LOGIN] Error inicializando Auth0:', error);
        showError('Error al inicializar la autenticación');
    }
}

// =============================================================================
// CONFIGURACIÓN DE EVENTOS DE LOGIN
// =============================================================================

function setupLoginEvents() {
    const loginButton = document.getElementById('loginButton');
    
    if (loginButton) {
        loginButton.addEventListener('click', async () => {
            try {
                console.log('🔄 [LOGIN] Iniciando proceso de login...');
                await auth0.loginWithRedirect({
                    connection: 'google-oauth2',
                    prompt: 'select_account',
                    scope: 'openid profile email'
                });
            } catch (error) {
                console.error('❌ [LOGIN] Error en login:', error);
                showError('Error al iniciar sesión');
            }
        });
        
        console.log('✅ [LOGIN] Eventos de login configurados');
    } else {
        console.warn('⚠️ [LOGIN] Botón de login no encontrado');
    }
}

// =============================================================================
// ROUTER PRINCIPAL
// =============================================================================

async function initAuthRouter() {
    const currentPage = getCurrentPage();
    console.log(`🚀 Inicializando Auth Router para página: ${currentPage}`);
    
    switch (currentPage) {
        case 'index':
            await handleIndexPage();
            break;
        case 'login':
            await handleLoginPage();
            break;
        default:
            console.warn(`⚠️ Página desconocida: ${currentPage}`);
            break;
    }
}

// =============================================================================
// INICIALIZACIÓN AUTOMÁTICA
// =============================================================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Auth Router - DOM listo, iniciando...');
    
    // Timeout de seguridad para index.html
    if (getCurrentPage() === 'index') {
        setTimeout(() => {
            const loadingContainer = document.getElementById('loadingContainer');
            if (loadingContainer && loadingContainer.style.display !== 'none') {
                showError('Timeout: La carga está tardando demasiado');
            }
        }, 10000); // 10 segundos
    }
    
    // Inicializar router
    initAuthRouter();
});

// =============================================================================
// EXPORTACIONES PARA USO GLOBAL
// =============================================================================

window.AuthRouter = {
    init: initAuthRouter,
    getCurrentPage: getCurrentPage,
    checkForErrors: checkForErrors,
    showError: showError
};

// =============================================================================
// FIN DEL ROUTER DE AUTENTICACIÓN
// =============================================================================
