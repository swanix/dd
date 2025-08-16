// ===== LÓGICA ESPECÍFICA PARA INDEX.HTML =====

// ===== CONFIGURACIÓN DE AUTH0 =====
// La configuración se carga desde env-config.js generado automáticamente
const auth0Config = window.AUTH0_CONFIG || {
    domain: window.AUTH0_CONFIG?.domain || '',
    client_id: window.AUTH0_CONFIG?.client_id || '',
    redirect_uri: window.location.origin + '/',
    cacheLocation: 'localstorage'
};

let auth0 = null;

// ===== ELEMENTOS DEL DOM =====
let loadingContainer, errorContainer;

// ===== VERIFICAR ERRORES ANTES DE INICIALIZAR =====
function checkForErrors() {
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get('error');
    
    if (error === 'access_denied') {
        console.log('🚫 [INDEX] Error de acceso denegado detectado ANTES de inicializar, redirigiendo inmediatamente');
        window.location.replace('/forbidden.html');
        return true; // Indica que hay error
    }
    return false; // No hay error
}

// ===== INICIALIZAR AUTH0 Y VERIFICAR AUTENTICACIÓN =====
async function initAuth0() {
    try {
        console.log('🚀 [INDEX] Iniciando verificación de autenticación...');
        console.log('🔧 [INDEX] Configuración Auth0:', auth0Config);
        
        // Verificar errores ANTES de cualquier inicialización
        if (checkForErrors()) {
            return; // Salir si hay error
        }
        
        console.log('🔄 [INDEX] Creando cliente Auth0...');
        auth0 = await createAuth0Client(auth0Config);
        console.log('✅ [INDEX] Cliente Auth0 creado exitosamente');
        
        // Manejar redirección después del login
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
                
                // Verificar si es error de acceso denegado
                if (error.error === 'access_denied') {
                    console.log('🚫 [INDEX] Error de acceso denegado detectado, redirigiendo a /forbidden.html');
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
        console.error('🔧 [INDEX] Configuración actual:', auth0Config);
        showError();
    }
}

// ===== MOSTRAR ERROR =====
function showError() {
    if (loadingContainer) {
        loadingContainer.style.display = 'none';
    }
    if (errorContainer) {
        errorContainer.classList.add('show');
    }
}

// ===== INICIALIZAR CUANDO EL DOM ESTÉ LISTO =====
document.addEventListener('DOMContentLoaded', function() {
    // Obtener referencias a elementos del DOM
    loadingContainer = document.getElementById('loadingContainer');
    errorContainer = document.getElementById('errorContainer');
    
    // Inicializar Auth0
    initAuth0();
    
    // Timeout de seguridad
    setTimeout(() => {
        if (loadingContainer && loadingContainer.style.display !== 'none') {
            showError();
        }
    }, 10000); // 10 segundos
});
