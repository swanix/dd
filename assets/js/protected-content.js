// ===== CARGADOR DE CONTENIDO PROTEGIDO =====
// Este script carga contenido HTML protegido desde el servidor

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

            // Cargar contenido protegido
            await this.loadProtectedContent();
            
        } catch (error) {
            console.error('Error inicializando contenido protegido:', error);
            window.location.replace('/login.html');
        }
    }

                    async loadProtectedContent() {
                    try {
                        // Obtener token
                        const token = await this.auth0.getIdTokenClaims();
                        
                        console.log('Token obtenido:', token.__raw ? 'SÍ' : 'NO');
                        
                        // Verificar si hay contenido en caché
                        const cachedContent = this.getCachedContent();
                        if (cachedContent) {
                            console.log('Contenido cargado desde caché local');
                            this.displayContent(cachedContent);
                            return;
                        }
                        
                        // Cargar contenido desde el servidor
                        const response = await fetch('/.netlify/functions/protect-html', {
                            method: 'GET',
                            headers: {
                                'Authorization': `Bearer ${token.__raw}`,
                                'Content-Type': 'application/json'
                            }
                        });

                        console.log('Response status:', response.status);
                        
                        if (response.ok) {
                            const data = await response.json();
                            
                            console.log('Datos recibidos del servidor:', data);
                            
                            // Guardar en caché local
                            this.cacheContent(data);
                            
                            // Mostrar contenido
                            this.displayContent(data);
                            
                            console.log('Contenido protegido cargado exitosamente');
                        } else {
                            const errorData = await response.json();
                            console.error('Error del servidor:', errorData);
                            throw new Error(`Error ${response.status}: ${errorData.message}`);
                        }
                        
                    } catch (error) {
                        console.error('Error cargando contenido protegido:', error);
                        this.showError(`Error cargando contenido: ${error.message}`);
                    }
                }

                // Método para obtener contenido del caché
                getCachedContent() {
                    try {
                        const cached = localStorage.getItem('protected_content_cache');
                        if (!cached) return null;
                        
                        const data = JSON.parse(cached);
                        const cacheTime = data.timestamp || 0;
                        const now = Date.now();
                        const cacheAge = now - cacheTime;
                        
                        // Caché válido por 5 minutos
                        if (cacheAge > 5 * 60 * 1000) {
                            console.log('Caché expirado, cargando desde servidor');
                            localStorage.removeItem('protected_content_cache');
                            return null;
                        }
                        
                        return data;
                    } catch (error) {
                        console.error('Error leyendo caché:', error);
                        localStorage.removeItem('protected_content_cache');
                        return null;
                    }
                }

                // Método para guardar contenido en caché
                cacheContent(data) {
                    try {
                        const cacheData = {
                            ...data,
                            timestamp: Date.now()
                        };
                        localStorage.setItem('protected_content_cache', JSON.stringify(cacheData));
                        console.log('Contenido guardado en caché local');
                    } catch (error) {
                        console.error('Error guardando caché:', error);
                    }
                }

                // Método para mostrar contenido
                displayContent(data) {
                    // Actualizar contenido
                    const contentContainer = document.getElementById('contentContainer');
                    if (contentContainer && data.content) {
                        contentContainer.innerHTML = data.content;
                    }
                    
                    // Actualizar información del usuario
                    this.updateUserInfo(data.user);
                    
                    // Inicializar la interfaz de usuario
                    this.initializeUserInterface();
                }

                // Método para limpiar caché
                clearCache() {
                    try {
                        localStorage.removeItem('protected_content_cache');
                        console.log('Caché local limpiado');
                    } catch (error) {
                        console.error('Error limpiando caché:', error);
                    }
                }

    updateUserInfo(token) {
        // Actualizar información del usuario en la interfaz
        const userInitial = document.getElementById('userInitial');
        const userName = document.getElementById('userName');
        const userEmail = document.getElementById('userEmail');
        const userId = document.getElementById('userId');
        
        if (token.name) {
            userName.textContent = token.name;
            userInitial.textContent = token.name.charAt(0).toUpperCase();
        }
        
        if (token.email) {
            userEmail.textContent = token.email;
        }
        
        if (token.sub) {
            userId.textContent = token.sub;
        }
        
        // Actualizar avatar con foto si está disponible
        const userAvatar = document.querySelector('.user-avatar');
        if (token.picture && userAvatar) {
            userAvatar.innerHTML = `<img src="${token.picture}" alt="${token.name || 'Usuario'}">`;
        }
    }
    
    initializeUserInterface() {
        const userButton = document.getElementById('userButton');
        const userDropdown = document.getElementById('userDropdown');
        const logoutButton = document.getElementById('logoutButton');
        
        if (userButton && userDropdown && logoutButton) {
            // Toggle del dropdown
            userButton.addEventListener('click', function() {
                userDropdown.classList.toggle('show');
            });
            
            // Cerrar dropdown al hacer clic fuera
            document.addEventListener('click', function(event) {
                if (!userButton.contains(event.target)) {
                    userDropdown.classList.remove('show');
                }
            });
            
                                    // Logout
                        logoutButton.addEventListener('click', function(e) {
                            e.preventDefault();
                            // Limpiar caché antes de cerrar sesión
                            this.clearCache();
                            this.auth0.logout({
                                returnTo: window.location.origin + '/login.html'
                            });
                        }.bind(this));
        }
    }

                    showError(message) {
                    const contentContainer = document.getElementById('contentContainer');
                    if (contentContainer) {
                        contentContainer.innerHTML = `
                            <div class="error-container">
                                <div class="error-content">
                                    <div class="error-title">Error</div>
                                    <div class="error-message">${message}</div>
                                    <button id="loginBtn" class="error-button">Volver al Login</button>
                                    <button id="retryBtn" class="error-button">Reintentar</button>
                                    <button id="clearCacheBtn" class="error-button">Limpiar Caché</button>
                                </div>
                            </div>
                        `;
                        
                        document.getElementById('loginBtn').addEventListener('click', () => {
                            window.location.replace('/login.html');
                        });
                        
                        document.getElementById('retryBtn').addEventListener('click', () => {
                            window.location.reload();
                        });
                        
                        document.getElementById('clearCacheBtn').addEventListener('click', () => {
                            this.clearCache();
                            window.location.reload();
                        });
                    }
                }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new ProtectedContentLoader();
});
