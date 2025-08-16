// ===== GENERADOR DE USER MENU FLOTANTE =====

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
                            <span id="userInitial" class="user-initial">U</span>
                        </div>
                    </button>
                    
                    <div class="user-dropdown" id="userDropdown">
                        <div class="user-dropdown-header">
                            <div class="user-info">
                                <img id="userPictureDropdown" src="" alt="Foto de perfil" class="user-picture-small">
                                <span id="userInitialDropdown" class="user-initial-small">U</span>
                                <div class="user-details">
                                    <div class="user-name" id="userName">Usuario</div>
                                    <div class="user-email" id="userEmail">usuario@email.com</div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="user-dropdown-divider"></div>
                        
                        <div class="user-dropdown-content">
                            <div class="user-dropdown-item">
                                <span class="user-dropdown-label">ID:</span>
                                <span class="user-dropdown-value" id="userId">-</span>
                            </div>
                            <div class="user-dropdown-item">
                                <span class="user-dropdown-label">Estado:</span>
                                <span class="user-dropdown-value verified">Verificado</span>
                            </div>
                        </div>
                        
                        <div class="user-dropdown-divider"></div>
                        
                        <div class="user-dropdown-actions">
                            <button class="user-dropdown-action logout-button" onclick="performSimpleLogout()">
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
        
        console.log('✅ User menu insertado dinámicamente');
        
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
            userEmail: document.getElementById('userEmail'),
            userId: document.getElementById('userId')
        };
    }

    // Configurar eventos del menu
    setupMenuEvents() {
        const elements = this.getMenuElements();
        
        if (!elements.userButton || !elements.userDropdown) {
            console.warn('⚠️ Elementos del user menu no encontrados');
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

        console.log('✅ Eventos del user menu configurados');
    }

    // Inicializar el user menu completo
    init() {
        try {
            this.insertUserMenu();
            this.setupMenuEvents();
            console.log('✅ User menu inicializado correctamente');
        } catch (error) {
            console.error('❌ Error inicializando user menu:', error);
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
