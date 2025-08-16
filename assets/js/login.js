// ===== LÓGICA ESPECÍFICA PARA LOGIN.HTML =====

// ===== CONFIGURACIÓN DE AUTH0 =====
const auth0Config = window.AUTH0_CONFIG || {
    domain: window.AUTH0_CONFIG?.domain || '',
    client_id: window.AUTH0_CONFIG?.client_id || '',
    redirect_uri: window.location.origin + '/',
    cacheLocation: 'localstorage'
};

let auth0 = null;

// ===== ELEMENTOS DEL DOM =====
let loginButton;

// ===== VERIFICAR ERRORES ANTES DE INICIALIZAR =====
function checkForErrors() {
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get('error');
    
    if (error === 'access_denied') {
        console.log('Error de acceso denegado detectado, redirigiendo');
        window.location.replace('/forbidden.html');
        return true;
    }
    return false;
}

// ===== INICIALIZAR AUTH0 =====
async function initAuth0() {
    try {
        if (checkForErrors()) {
            return;
        }
        
        console.log('Inicializando Auth0...');
        auth0 = await createAuth0Client(auth0Config);
        
        // Manejar redirección después del login
        if (window.location.search.includes('code=')) {
            console.log('Detectado código de autorización en URL');
            
            try {
                console.log('Procesando callback de Auth0...');
                await auth0.handleRedirectCallback();
                console.log('Callback procesado exitosamente');
                // Redirigir directamente a la aplicación
                window.location.replace('/app/');
                return;
            } catch (error) {
                console.error('Error en callback:', error);
                
                if (error.error === 'access_denied') {
                    console.log('Error de acceso denegado detectado, redirigiendo');
                    window.location.replace('/forbidden.html');
                    return;
                }
                
                if (error.message && error.message.includes('access_denied')) {
                    console.log('Error de acceso denegado en mensaje, redirigiendo');
                    window.location.replace('/forbidden.html');
                    return;
                }
                
                throw error;
            }
        }

        // Verificar si ya está autenticado
        const isAuthenticated = await auth0.isAuthenticated();
        if (isAuthenticated) {
            window.location.replace('/app/');
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
    if (loginButton) {
        loginButton.addEventListener('click', async () => {
            try {
                await auth0.loginWithRedirect({
                    connection: 'google-oauth2',
                    prompt: 'select_account',
                    scope: 'openid profile email'
                });
            } catch (error) {
                console.error('Error en login:', error);
                showError('Error al iniciar sesión');
            }
        });
    }
}

// ===== MOSTRAR ERROR =====
function showError(message) {
    console.error('Error:', message);
    alert(message);
}

// ===== INICIALIZAR CUANDO EL DOM ESTÉ LISTO =====
document.addEventListener('DOMContentLoaded', function() {
    // Obtener referencias a elementos del DOM
    loginButton = document.getElementById('loginButton');
    
    // Inicializar Auth0
    initAuth0();
});
