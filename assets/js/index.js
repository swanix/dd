// ===== LÓGICA ESPECÍFICA PARA INDEX.HTML =====

// ===== CONFIGURACIÓN DE AUTH0 =====
const auth0Config = {
    domain: 'dev-7kj3jxtxwwirocri.us.auth0.com',
    client_id: 'BORj4AB79Rho5yP5uSavuP4sern8pemZ',
    redirect_uri: window.location.origin + '/app/',
    cacheLocation: 'localstorage'
};

let auth0 = null;

// ===== ELEMENTOS DEL DOM =====
let loadingContainer, errorContainer;

// ===== INICIALIZAR AUTH0 Y VERIFICAR AUTENTICACIÓN =====
async function initAuth0() {
    try {
        auth0 = await createAuth0Client(auth0Config);
        
        // Verificar errores de acceso denegado (REDIRECCIÓN INMEDIATA)
        const urlParams = new URLSearchParams(window.location.search);
        const error = urlParams.get('error');
        
        if (error === 'access_denied') {
            console.log('🚫 [INDEX] Error de acceso denegado detectado, redirigiendo inmediatamente');
            window.location.replace('/access-denied.html');
            return;
        }
        
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
                    console.log('🚫 [INDEX] Error de acceso denegado detectado, redirigiendo a /access-denied.html');
                    window.location.replace('/access-denied.html');
                    return;
                }
                
                throw error;
            }
        }

        // Verificar estado de autenticación
        const isAuthenticated = await auth0.isAuthenticated();
        
        if (isAuthenticated) {
            // Usuario autenticado - redirigir a la app
            window.location.href = '/app/';
        } else {
            // Usuario no autenticado - redirigir al login
            window.location.href = '/login.html';
        }
        
    } catch (error) {
        console.error('Error verificando autenticación:', error);
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
