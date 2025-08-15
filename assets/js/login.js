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
let loginForm, auth0Login, loading, errorMessage;

// ===== INICIALIZAR AUTH0 =====
async function initAuth0() {
    try {
        auth0 = await createAuth0Client(auth0Config);
        
        // Manejar redirección después del login
        if (window.location.search.includes('code=')) {
            showLoading();
            await auth0.handleRedirectCallback();
            window.location.href = '/app/';
            return;
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
            await auth0.loginWithRedirect();
        } catch (error) {
            console.error('Error en login:', error);
            hideLoading();
            showError('Error al iniciar sesión');
        }
    };

    // Prevenir envío del formulario (solo para mostrar)
    loginForm.onsubmit = (e) => {
        e.preventDefault();
        auth0Login.click();
    };
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
    loginForm = document.getElementById('loginForm');
    auth0Login = document.getElementById('auth0Login');
    loading = document.getElementById('loading');
    errorMessage = document.getElementById('errorMessage');
    
    // Inicializar Auth0
    initAuth0();
});
