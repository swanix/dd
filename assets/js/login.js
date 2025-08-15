// ===== LÓGICA ESPECÍFICA PARA LOGIN.HTML =====

// ===== CONFIGURACIÓN DE AUTH0 =====
const auth0Config = {
    domain: 'dev-7kj3jxtxwwirocri.us.auth0.com',
    client_id: 'BORj4AB79Rho5yP5uSavuP4sern8pemZ',
    redirect_uri: window.location.origin + '/app/',
    cacheLocation: 'localstorage'
};

let auth0 = null;

// ===== ELEMENTOS DEL DOM =====
let auth0Login, loading, errorMessage;

// ===== INICIALIZAR AUTH0 =====
async function initAuth0() {
    try {
        auth0 = await createAuth0Client(auth0Config);
        
        // Manejar redirección después del login
        if (window.location.search.includes('code=')) {
            showLoading();
            try {
                await auth0.handleRedirectCallback();
                window.location.href = '/app/';
                return;
            } catch (error) {
                console.error('Error en callback:', error);
                // Verificar si es error de acceso denegado
                if (error.error === 'access_denied') {
                    window.location.href = '/access-denied.html';
                    return;
                }
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
                prompt: 'select_account'
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
