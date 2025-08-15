// ===== CONFIGURACIÓN DE AUTH0 =====
const auth0Config = {
    domain: 'dev-7kj3jxtxwwirocri.us.auth0.com',
    client_id: 'BORj4AB79Rho5yP5uSavuP4sern8pemZ',
    redirect_uri: window.location.origin + '/app/',
    cacheLocation: 'localstorage'
};

let auth0 = null;

// ===== ELEMENTOS DEL DOM =====
let authOverlay, loginButton, userButton, userDropdown, logoutButton;
let userName, userEmail, userId, userVerified, serverData, serverDataContent;

// ===== INICIALIZACIÓN =====
async function initAuth0() {
    try {
        auth0 = await createAuth0Client(auth0Config);
        
        // Configurar event listeners
        setupEventListeners();
        
        // Verificar estado de autenticación
        await checkAuthState();
        
    } catch (error) {
        console.error('Error inicializando Auth0:', error);
        showError('Error al inicializar la autenticación');
    }
}

// ===== CONFIGURAR EVENT LISTENERS =====
function setupEventListeners() {
    if (loginButton) {
        loginButton.onclick = () => auth0.loginWithRedirect();
    }
    
    if (logoutButton) {
        logoutButton.onclick = () => auth0.logout({ 
            returnTo: window.location.origin + '/login.html' 
        });
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

// ===== VERIFICAR ESTADO DE AUTENTICACIÓN =====
async function checkAuthState() {
    const isAuthenticated = await auth0.isAuthenticated();
    
    if (isAuthenticated) {
        showAuthenticatedUI();
        await fetchProtectedData();
    } else {
        showUnauthenticatedUI();
    }
}

// ===== MOSTRAR UI AUTENTICADA =====
async function showAuthenticatedUI() {
    const user = await auth0.getUser();
    
    // Ocultar overlay de auth si existe
    if (authOverlay) {
        authOverlay.style.display = 'none';
    }
    
    // Mostrar información del usuario
    if (userButton) {
        userButton.style.display = 'flex';
    }
    
    // Manejar foto de perfil
    const userInitial = document.getElementById('userInitial');
    const userPicture = document.getElementById('userPicture');
    
    if (userInitial && userPicture) {
        if (user.picture) {
            // Si hay foto de perfil, mostrarla
            userPicture.src = user.picture;
            userPicture.style.display = 'block';
            userInitial.style.display = 'none';
        } else {
            // Si no hay foto, mostrar inicial
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

// ===== OBTENER DATOS PROTEGIDOS DEL SERVIDOR =====
async function fetchProtectedData() {
    try {
        const token = await auth0.getIdTokenClaims();
        const idToken = token.__raw;
        
        const response = await fetch('/.netlify/functions/auth-protect', {
            headers: {
                'Authorization': `Bearer ${idToken}`
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
        } else {
            throw new Error('Error en la respuesta del servidor');
        }
    } catch (error) {
        console.error('Error obteniendo datos protegidos:', error);
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
    
    console.error('Error:', message);
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
    showError,
    showMessage
};
