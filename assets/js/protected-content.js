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
                console.log('🚫 Usuario no autenticado, redirigiendo a login');
                window.location.replace('/login.html');
                return;
            }

            // Cargar contenido protegido
            await this.loadProtectedContent();
            
        } catch (error) {
            console.error('❌ Error inicializando contenido protegido:', error);
            window.location.replace('/login.html');
        }
    }

    async loadProtectedContent() {
        try {
            // Obtener token
            const token = await this.auth0.getIdTokenClaims();
            
            console.log('🔑 Token obtenido:', token.__raw ? 'SÍ' : 'NO');
            
            // Cargar contenido desde el servidor
            const response = await fetch('/.netlify/functions/protect-html', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token.__raw}`,
                    'Content-Type': 'application/json'
                }
            });

            console.log('📡 Response status:', response.status);
            
            if (response.ok) {
                const html = await response.text();
                
                console.log('📄 HTML recibido:', html.substring(0, 200) + '...');
                
                // Reemplazar el contenido del body
                document.body.innerHTML = html;
                
                // Ejecutar scripts si los hay
                this.executeScripts();
                
                // Inicializar manualmente la interfaz de usuario después de cargar el contenido
                this.initializeUserInterface();
                
                console.log('✅ Contenido protegido cargado exitosamente');
            } else {
                const errorData = await response.json();
                console.error('❌ Error del servidor:', errorData);
                throw new Error(`Error ${response.status}: ${errorData.message}`);
            }
            
        } catch (error) {
            console.error('❌ Error cargando contenido protegido:', error);
            this.showError(`Error cargando contenido protegido: ${error.message}`);
        }
    }

    executeScripts() {
        // Buscar y ejecutar scripts en el contenido cargado
        const scripts = document.querySelectorAll('script');
        scripts.forEach(script => {
            if (script.textContent) {
                // Crear un nuevo script element en lugar de usar eval()
                const newScript = document.createElement('script');
                newScript.textContent = script.textContent;
                document.head.appendChild(newScript);
                // Remover el script original para evitar duplicados
                script.remove();
            }
        });
    }
    
    async initializeUserInterface() {
        try {
            // Esperar un poco para que los scripts se carguen
            await new Promise(resolve => setTimeout(resolve, 100));
            
            // Obtener referencias a elementos del DOM
            const userButton = document.getElementById('userButton');
            const userDropdown = document.getElementById('userDropdown');
            const logoutButton = document.getElementById('logoutButton');
            
            if (!userButton || !userDropdown || !logoutButton) {
                console.error('❌ Elementos del menú de usuario no encontrados');
                return;
            }
            
            // Configuración de Auth0
            const auth0Config = window.AUTH0_CONFIG || {
                domain: window.AUTH0_CONFIG?.domain || '',
                client_id: window.AUTH0_CONFIG?.client_id || '',
                redirect_uri: window.location.origin + '/app/',
                cacheLocation: 'localstorage'
            };
            
            // Crear cliente Auth0
            const auth0 = await createAuth0Client(auth0Config);
            
            // Toggle del dropdown
            userButton.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                userDropdown.classList.toggle('show');
                console.log('🔄 Toggle dropdown');
            });
            
            // Cerrar dropdown al hacer clic fuera
            document.addEventListener('click', function(event) {
                if (!userButton.contains(event.target) && !userDropdown.contains(event.target)) {
                    userDropdown.classList.remove('show');
                }
            });
            
            // Logout
            logoutButton.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('🚪 Iniciando logout...');
                auth0.logout({
                    returnTo: window.location.origin + '/login.html'
                });
            });
            
            console.log('✅ Interfaz de usuario inicializada correctamente');
            
        } catch (error) {
            console.error('❌ Error inicializando interfaz de usuario:', error);
        }
    }

    showError(message) {
        document.body.innerHTML = `
            <div style="display: flex; justify-content: center; align-items: center; height: 100vh; font-family: Arial, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                <div style="text-align: center; padding: 2rem; border: 1px solid #ccc; border-radius: 8px; background: white; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                    <h2 style="color: #dc3545;">❌ Error</h2>
                    <p style="margin: 1rem 0; color: #666;">${message}</p>
                    <div style="margin-top: 1.5rem;">
                        <button id="loginBtn" style="padding: 0.5rem 1rem; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; margin-right: 0.5rem;">
                            🔑 Volver al Login
                        </button>
                        <button id="retryBtn" style="padding: 0.5rem 1rem; background: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer;">
                            🔄 Reintentar
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        // Agregar event listeners para evitar problemas con CSP
        document.getElementById('loginBtn').addEventListener('click', () => {
            window.location.replace('/login.html');
        });
        
        document.getElementById('retryBtn').addEventListener('click', () => {
            window.location.reload();
        });
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new ProtectedContentLoader();
});
