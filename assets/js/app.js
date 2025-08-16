// =============================================================================
// SWANIX WALL - ARCHIVO JAVASCRIPT CONSOLIDADO
// =============================================================================
// Este archivo contiene toda la funcionalidad principal de la aplicación:
// - Sistema de logout simple
// - Generador de user menu dinámico
// - Cargador de contenido protegido
// =============================================================================

// =============================================================================
// 1. SISTEMA DE LOGOUT SIMPLE
// =============================================================================

function performSimpleLogout() {
    console.log('Iniciando logout simple...');
    
    try {
        // 1. Limpiar todos los datos
        localStorage.clear();
        sessionStorage.clear();
        
        // 2. Limpiar cookies de Auth0
        const cookies = document.cookie.split(';');
        cookies.forEach(cookie => {
            const eqPos = cookie.indexOf('=');
            const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
            if (name.includes('auth0') || name.includes('auth') || name.includes('token')) {
                document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
                document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;
            }
        });
        
        // 3. Redirigir a la página principal
        console.log('Logout simple completado, redirigiendo...');
        window.location.replace('/');
        
    } catch (error) {
        console.error('Error en logout simple:', error);
        // Último recurso: recargar la página
        window.location.reload();
    }
}

// Función global para logout
window.performSimpleLogout = performSimpleLogout;

// =============================================================================
// 2. GENERADOR DE USER MENU DINÁMICO
// =============================================================================

class UserMenuGenerator {
    constructor() {
        this.menuContainer = null;
    }

    // Generar el HTML del user menu
    generateUserMenuHTML() {
        return `
            <div class="floating-user-menu">
                <div class="user-menu-container">
                    <button id="userButton" class="user-avatar-button" aria-label="Menú de usuario">
                        <div class="user-avatar">
                            <img id="userPicture" src="" alt="Foto de perfil" class="user-picture">
                        </div>
                    </button>
                    
                    <div class="user-dropdown" id="userDropdown">
                        <div class="user-dropdown-header">
                            <div class="user-info">
                                <img id="userPictureDropdown" src="" alt="Foto de perfil" class="user-picture-small">
                                <div class="user-details">
                                    <div class="user-name" id="userName">Usuario</div>
                                    <div class="user-email" id="userEmail">usuario@email.com</div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="user-dropdown-divider"></div>
                        
                        <!-- Información del usuario simplificada - sin ID por seguridad -->
                        
                        <div class="user-dropdown-divider"></div>
                        
                        <div class="user-dropdown-actions">
                            <button class="user-dropdown-action logout-button neutral" onclick="performSimpleLogout()">
                                <svg class="logout-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                                    <polyline points="16,17 21,12 16,7"></polyline>
                                    <line x1="21" y1="12" x2="9" y2="12"></line>
                                </svg>
                                <span>Cerrar Sesión</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Insertar el user menu en el DOM
    insertUserMenu() {
        // Crear el HTML del menu
        const menuHTML = this.generateUserMenuHTML();
        
        // Crear un elemento temporal para parsear el HTML
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = menuHTML;
        
        // Obtener el elemento del menu
        this.menuContainer = tempDiv.firstElementChild;
        
        // Insertar al inicio del body
        document.body.insertBefore(this.menuContainer, document.body.firstChild);
        
        return this.menuContainer;
    }

    // Obtener referencias a los elementos del menu
    getMenuElements() {
        return {
            userButton: document.getElementById('userButton'),
            userDropdown: document.getElementById('userDropdown'),
            userPicture: document.getElementById('userPicture'),
            userInitial: document.getElementById('userInitial'),
            userPictureDropdown: document.getElementById('userPictureDropdown'),
            userInitialDropdown: document.getElementById('userInitialDropdown'),
            userName: document.getElementById('userName'),
            userEmail: document.getElementById('userEmail')
        };
    }

    // Configurar eventos del menu
    setupMenuEvents() {
        const elements = this.getMenuElements();
        
        if (!elements.userButton || !elements.userDropdown) {
            console.warn('Elementos del user menu no encontrados');
            return;
        }

        // Toggle del dropdown
        elements.userButton.addEventListener('click', (e) => {
            e.stopPropagation();
            elements.userDropdown.classList.toggle('show');
        });

        // Cerrar al hacer clic fuera
        document.addEventListener('click', (e) => {
            if (!elements.userButton.contains(e.target) && !elements.userDropdown.contains(e.target)) {
                elements.userDropdown.classList.remove('show');
            }
        });

        // Cerrar con Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                elements.userDropdown.classList.remove('show');
            }
        });

    }

    // Inicializar el user menu completo
    init() {
        try {
            this.insertUserMenu();
            this.setupMenuEvents();
        } catch (error) {
            console.error('Error inicializando user menu:', error);
        }
    }
}

// Exportar para uso global
window.UserMenuGenerator = UserMenuGenerator;

// Función de conveniencia para inicializar
window.initUserMenu = function() {
    const userMenu = new UserMenuGenerator();
    userMenu.init();
    return userMenu;
};

// =============================================================================
// 3. CARGADOR DE CONTENIDO PROTEGIDO
// =============================================================================

class ProtectedContentLoader {
    constructor() {
        this.auth0 = null;
        this.init();
    }

    async init() {
        try {
            // Configuración de Auth0
            const auth0Config = window.AUTH0_CONFIG || {
                domain: window.AUTH0_CONFIG?.domain || '',
                client_id: window.AUTH0_CONFIG?.client_id || '',
                redirect_uri: window.location.origin + '/app/',
                cacheLocation: 'localstorage'
            };

            // Crear cliente Auth0
            this.auth0 = await createAuth0Client(auth0Config);
            
            // Verificar autenticación
            const isAuthenticated = await this.auth0.isAuthenticated();
            
            if (!isAuthenticated) {
                console.log('Usuario no autenticado, redirigiendo a login');
                window.location.replace('/login.html');
                return;
            }

            // Configurar user menu
            this.setupUserMenu();
            
            // El contenido se cargará dinámicamente según la aplicación
            console.log('Usuario autenticado, canvas listo para contenido');
            
        } catch (error) {
            console.error('Error inicializando contenido protegido:', error);
            window.location.replace('/login.html');
        }
    }

    // Configurar el user menu flotante
    setupUserMenu() {
        try {
            // Inicializar el user menu dinámicamente
            const userMenu = window.initUserMenu();
            
            // Cargar información del usuario después de que el menu esté listo
            setTimeout(() => {
                this.loadUserInfo();
            }, 100);
        } catch (error) {
            console.error('Error configurando user menu:', error);
        }
    }

    // Cargar información del usuario
    async loadUserInfo() {
        try {
            const user = await this.auth0.getUser();
            
            // Elementos del avatar principal
            const userPicture = document.getElementById('userPicture');
            const userAvatar = document.querySelector('.user-avatar');
            
            // Elementos del dropdown
            const userPictureDropdown = document.getElementById('userPictureDropdown');
            const userInfo = document.querySelector('.user-info');
            const userName = document.getElementById('userName');
            const userEmail = document.getElementById('userEmail');
            
            if (user.picture) {
                // Mostrar foto de perfil con fade-in
                if (userPicture) {
                    userPicture.onload = () => {
                        userPicture.classList.add('show');
                    };
                    userPicture.src = user.picture;
                }
                if (userPictureDropdown) {
                    userPictureDropdown.onload = () => {
                        userPictureDropdown.classList.add('show');
                    };
                    userPictureDropdown.src = user.picture;
                }
            } else {
                // Crear y mostrar inicial solo si no hay foto
                if (userAvatar && !document.getElementById('userInitial')) {
                    const userInitial = document.createElement('span');
                    userInitial.id = 'userInitial';
                    userInitial.className = 'user-initial show';
                    userInitial.textContent = user.name ? user.name.charAt(0).toUpperCase() : 'U';
                    userAvatar.appendChild(userInitial);
                }
                
                if (userInfo && !document.getElementById('userInitialDropdown')) {
                    const userInitialDropdown = document.createElement('span');
                    userInitialDropdown.id = 'userInitialDropdown';
                    userInitialDropdown.className = 'user-initial-small show';
                    userInitialDropdown.textContent = user.name ? user.name.charAt(0).toUpperCase() : 'U';
                    userInfo.insertBefore(userInitialDropdown, userInfo.firstChild);
                }
            }
            
            // Información del usuario
            if (userName) userName.textContent = user.name || 'Usuario';
            if (userEmail) userEmail.textContent = user.email || 'usuario@email.com';
            
        } catch (error) {
            console.error('Error cargando información del usuario:', error);
        }
    }

    // El logout se maneja directamente con performSimpleLogout() desde el user menu

    async loadProtectedContent() {
        try {
            // Por ahora, solo mostrar el canvas vacío
            // En el futuro, aquí se puede cargar contenido dinámico desde load-content.js
            console.log('Canvas listo para contenido dinámico');
            
            // Ejemplo de cómo cargar contenido dinámico en el futuro:
            // const token = await this.auth0.getIdTokenClaims();
            // const response = await fetch('/.netlify/functions/load-content', {
            //     method: 'GET',
            //     headers: {
            //         'Authorization': `Bearer ${token.__raw}`,
            //         'Content-Type': 'application/json'
            //     }
            // });
            // 
            // if (response.ok) {
            //     const data = await response.json();
            //     this.displayDynamicContent(data.content);
            // }
            
        } catch (error) {
            console.error('Error cargando contenido protegido:', error);
            this.showError(`Error cargando contenido: ${error.message}`);
        }
    }

    // Método para mostrar contenido dinámico (para uso futuro)
    displayDynamicContent(content) {
        try {
            const container = document.querySelector('.canvas-container');
            if (!container) {
                console.error('Contenedor de contenido no encontrado');
                return;
            }

            // Limpiar contenido existente
            container.innerHTML = '';

            // Aquí puedes renderizar el contenido dinámico
            // Ejemplo básico:
            container.innerHTML = `
                <div class="dynamic-content">
                    <h2>${content.title}</h2>
                    <p>${content.content.welcome}</p>
                    <div class="stats">
                        <div class="stat-item">
                            <span class="stat-number">${content.content.stats.totalItems}</span>
                            <span class="stat-label">Total Items</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-number">${content.content.stats.pendingTasks}</span>
                            <span class="stat-label">Pendientes</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-number">${content.content.stats.completedTasks}</span>
                            <span class="stat-label">Completadas</span>
                        </div>
                    </div>
                </div>
            `;

        } catch (error) {
            console.error('Error mostrando contenido dinámico:', error);
            this.showError('Error mostrando contenido dinámico');
        }
    }



    // Método para mostrar errores
    showError(message) {
        try {
            const container = document.querySelector('.canvas-container');
            if (container) {
                container.innerHTML = `
                    <div class="error-container">
                        <div class="error-message">
                            <h3>Error</h3>
                            <p>${message}</p>
                            <button onclick="location.reload()" class="retry-button">Reintentar</button>
                        </div>
                    </div>
                `;
            }
        } catch (error) {
            console.error('Error mostrando mensaje de error:', error);
        }
    }
}

// =============================================================================
// 4. INICIALIZACIÓN AUTOMÁTICA
// =============================================================================

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar el cargador de contenido protegido
    new ProtectedContentLoader();
});

// =============================================================================
// FIN DEL ARCHIVO CONSOLIDADO
// =============================================================================
