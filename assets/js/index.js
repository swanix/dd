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
        
        // Manejar redirección después del login
        if (window.location.search.includes('code=')) {
            await auth0.handleRedirectCallback();
            window.location.href = '/app/';
            return;
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
