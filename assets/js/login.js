// ===== LÓGICA ESPECÍFICA PARA LOGIN.HTML =====

// ===== CONFIGURACIÓN DE AUTH0 =====
// La configuración se carga desde env-config.js generado automáticamente
const auth0Config = window.AUTH0_CONFIG || {
    domain: 'dev-7kj3jxtxwwirocri.us.auth0.com',
    client_id: 'BORj4AB79Rho5yP5uSavuP4sern8pemZ',
    redirect_uri: window.location.origin + '/',
    cacheLocation: 'localstorage'
};

let auth0 = null;

// ===== ELEMENTOS DEL DOM =====
let auth0Login, loading, errorMessage;

// ===== VERIFICAR ERRORES ANTES DE INICIALIZAR =====
function checkForErrors() {
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get('error');
    
    if (error === 'access_denied') {
        console.log('🚫 [LOGIN] Error de acceso denegado detectado ANTES de inicializar, redirigiendo inmediatamente');
        window.location.replace('/access-denied.html');
        return true; // Indica que hay error
    }
    return false; // No hay error
}

// ===== INICIALIZAR AUTH0 =====
async function initAuth0() {
    try {
        // Verificar errores ANTES de cualquier inicialización
        if (checkForErrors()) {
            return; // Salir si hay error
        }
        
        console.log('🔍 [LOGIN] Inicializando Auth0...');
        auth0 = await createAuth0Client(auth0Config);
        
        // Manejar redirección después del login
        if (window.location.search.includes('code=')) {
            console.log('🔍 [LOGIN] Detectado código de autorización en URL');
            console.log('📍 [LOGIN] URL actual:', window.location.href);
            console.log('🔍 [LOGIN] Parámetros de URL:', window.location.search);
            
            showLoading();
            try {
                console.log('🔄 [LOGIN] Procesando callback de Auth0...');
                await auth0.handleRedirectCallback();
                console.log('✅ [LOGIN] Callback procesado exitosamente');
                window.location.href = '/app/';
                return;
            } catch (error) {
                console.error('❌ [LOGIN] Error en callback:', error);
                console.log('🔍 [LOGIN] Tipo de error:', typeof error);
                console.log('🔍 [LOGIN] Propiedades del error:', Object.keys(error));
                
                // Verificar si es error de acceso denegado
                if (error.error === 'access_denied') {
                    console.log('🚫 [LOGIN] Error de acceso denegado detectado, redirigiendo a /access-denied.html');
                    window.location.href = '/access-denied.html';
                    return;
                }
                
                // Verificar otros tipos de errores
                if (error.message && error.message.includes('access_denied')) {
                    console.log('🚫 [LOGIN] Error de acceso denegado en mensaje, redirigiendo a /access-denied.html');
                    window.location.href = '/access-denied.html';
                    return;
                }
                
                console.log('❌ [LOGIN] Error no reconocido, lanzando error original');
                throw error;
            }
        }

        // Verificar si ya está autenticado
        const isAuthenticated = await auth0.isAuthenticated();
        if (isAuthenticated) {
            window.location.href = '/app/';
            return;
        }

        // Configurar eventos
        setupEventListeners();
        
    } catch (error) {
        console.error('Error inicializando Auth0:', error);
        showError('Error al inicializar la autenticación');
    }
}

// ===== CONFIGURAR EVENT LISTENERS =====
function setupEventListeners() {
    auth0Login.onclick = async () => {
        try {
            showLoading();
            await auth0.loginWithRedirect({
                connection: 'google-oauth2',
                prompt: 'select_account',
                scope: 'openid profile email'
            });
        } catch (error) {
            console.error('Error en login:', error);
            hideLoading();
            showError('Error al iniciar sesión');
        }
    };

    // El formulario ya no existe, solo el botón directo
}

// ===== MOSTRAR LOADING =====
function showLoading() {
    loading.classList.add('show');
    auth0Login.disabled = true;
}

// ===== OCULTAR LOADING =====
function hideLoading() {
    loading.classList.remove('show');
    auth0Login.disabled = false;
}

// ===== MOSTRAR ERROR =====
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.add('show');
    setTimeout(() => {
        errorMessage.classList.remove('show');
    }, 5000);
}

// ===== INICIALIZAR CUANDO EL DOM ESTÉ LISTO =====
document.addEventListener('DOMContentLoaded', function() {
    // Obtener referencias a elementos del DOM
    auth0Login = document.getElementById('auth0Login');
    loading = document.getElementById('loading');
    errorMessage = document.getElementById('errorMessage');
    
    // Inicializar Auth0
    initAuth0();
});
