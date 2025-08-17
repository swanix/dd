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
        // 1. Preservar el tema actual antes de limpiar
        const currentTheme = localStorage.getItem('theme');
        
        // 2. Limpiar todos los datos
        localStorage.clear();
        sessionStorage.clear();
        
        // 3. Restaurar el tema
        if (currentTheme) {
            localStorage.setItem('theme', currentTheme);
        }
        
        // 4. Limpiar cookies de Auth0
        const cookies = document.cookie.split(';');
        cookies.forEach(cookie => {
            const eqPos = cookie.indexOf('=');
            const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
            if (name.includes('auth0') || name.includes('auth') || name.includes('token')) {
                document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
                document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;
            }
        });
        
        // 5. Redirigir a la página principal
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
// SISTEMA DE TEMA (DARK/LIGHT MODE)
// =============================================================================

// Función para cambiar el tema
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    // Aplicar nuevo tema
    document.documentElement.setAttribute('data-theme', newTheme);
    
    // Guardar preferencia
    localStorage.setItem('theme', newTheme);
    
    // Actualizar el toggle
    updateThemeToggle(newTheme);
}

// Función para actualizar el estado del toggle
function updateThemeToggle(theme) {
    // Actualizar toggles del user menu (página principal)
    const sunIcon = document.querySelector('.sun-icon');
    const moonIcon = document.querySelector('.moon-icon');
    
    if (sunIcon && moonIcon) {
        if (theme === 'dark') {
            sunIcon.style.display = 'none';
            moonIcon.style.display = 'block';
        } else {
            sunIcon.style.display = 'block';
            moonIcon.style.display = 'none';
        }
    }
    
    // Actualizar toggles de auth pages
    const authSunIcons = document.querySelectorAll('.auth-theme-toggle .sun-icon');
    const authMoonIcons = document.querySelectorAll('.auth-theme-toggle .moon-icon');
    
    authSunIcons.forEach(icon => {
        icon.style.display = theme === 'dark' ? 'none' : 'block';
    });
    
    authMoonIcons.forEach(icon => {
        icon.style.display = theme === 'dark' ? 'block' : 'none';
    });
}

// Función para inicializar el tema
function initializeTheme() {
    // Obtener tema guardado o preferencia del sistema
    const savedTheme = localStorage.getItem('theme');
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const theme = savedTheme || systemTheme;
    
    // Aplicar tema
    document.documentElement.setAttribute('data-theme', theme);
    
    // Actualizar toggle después de que el DOM esté listo
    setTimeout(() => {
        updateThemeToggle(theme);
    }, 100);
    
    console.log(`Tema inicializado: ${theme} (guardado: ${savedTheme}, sistema: ${systemTheme})`);
}

// Inicializar tema inmediatamente (solo aplicar tema, sin toggle en páginas de auth)
const savedTheme = localStorage.getItem('theme');
const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
const theme = savedTheme || systemTheme;

// Aplicar tema inmediatamente para evitar flash
document.documentElement.setAttribute('data-theme', theme);

// Solo inicializar toggle si estamos en la página principal
if (window.location.pathname === '/app/' || window.location.pathname === '/app/index.html') {
    setTimeout(() => {
        updateThemeToggle(theme);
    }, 100);
}

// Escuchar cambios en la preferencia del sistema
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
        const newTheme = e.matches ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        
        // Solo actualizar toggle si estamos en la página principal
        if (window.location.pathname === '/app/' || window.location.pathname === '/app/index.html') {
            updateThemeToggle(newTheme);
        }
    }
});

// Exportar funciones globales
window.toggleTheme = toggleTheme;
window.initializeTheme = initializeTheme;

// =============================================================================
// 2. GENERADOR DE APP BRAND DINÁMICO
// =============================================================================

class AppBrandGenerator {
    constructor() {
        this.appName = 'My App'; // Configuración centralizada del nombre de la app
        this.appLogo = '/assets/img/logo.svg';
    }

    // Generar el HTML del app brand
    generateAppBrandHTML() {
        return `
            <div class="app-brand">
                <img src="${this.appLogo}" alt="Logo de la aplicación" class="app-brand-logo">
                <span class="app-brand-name">${this.appName}</span>
            </div>
        `;
    }

    // Insertar el app brand en el DOM
    insertAppBrand() {
        try {
            // Verificar si ya existe
            if (document.querySelector('.app-brand')) {
                return;
            }

            // Crear el elemento
            const appBrandHTML = this.generateAppBrandHTML();
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = appBrandHTML;
            const appBrandElement = tempDiv.firstElementChild;

            // Insertar al inicio del body
            document.body.insertBefore(appBrandElement, document.body.firstChild);

        } catch (error) {
            console.error('Error insertando app brand:', error);
        }
    }

    // Inicializar el app brand
    init() {
        try {
            this.insertAppBrand();
            this.updatePageTitles();
        } catch (error) {
            console.error('Error inicializando app brand:', error);
        }
    }

    // Actualizar títulos en páginas de auth
    updatePageTitles() {
        try {
            // Actualizar título en login.html
            const appTitle = document.getElementById('appTitle');
            if (appTitle) {
                appTitle.textContent = this.appName;
            }

            // Actualizar título de la página
            if (document.title === 'Login - Aplicación' || document.title === 'Loading...') {
                document.title = `${this.appName} - Login`;
            } else if (document.title === 'Aplicación') {
                document.title = this.appName;
            }
        } catch (error) {
            console.error('Error actualizando títulos:', error);
        }
    }
}

// =============================================================================
// 3. GENERADOR DE AUTH THEME TOGGLE DINÁMICO
// =============================================================================

class AuthThemeToggleGenerator {
    constructor() {
        this.toggleContainer = null;
    }

    // Generar el HTML del theme toggle para auth pages
    generateAuthThemeToggleHTML() {
        return `
            <button class="auth-theme-toggle" onclick="toggleTheme()">
                <svg class="auth-theme-icon sun-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="5"></circle>
                    <line x1="12" y1="1" x2="12" y2="3"></line>
                    <line x1="12" y1="21" x2="12" y2="23"></line>
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                    <line x1="1" y1="12" x2="3" y2="12"></line>
                    <line x1="21" y1="12" x2="23" y2="12"></line>
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                </svg>
                <svg class="auth-theme-icon moon-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                </svg>
            </button>
        `;
    }

    // Insertar el theme toggle en el DOM
    insertAuthThemeToggle() {
        try {
            // Verificar si ya existe
            if (document.querySelector('.auth-theme-toggle')) {
                return;
            }

            // Crear el elemento
            const toggleHTML = this.generateAuthThemeToggleHTML();
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = toggleHTML;
            const toggleElement = tempDiv.firstElementChild;

            // Insertar al inicio del body
            document.body.insertBefore(toggleElement, document.body.firstChild);

        } catch (error) {
            console.error('Error insertando auth theme toggle:', error);
        }
    }

    // Inicializar el auth theme toggle
    init() {
        try {
            this.insertAuthThemeToggle();
        } catch (error) {
            console.error('Error inicializando auth theme toggle:', error);
        }
    }
}

// =============================================================================
// 4. GENERADOR DE USER MENU DINÁMICO
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
                            <button class="theme-toggle-btn" onclick="toggleTheme()">
                                <svg class="theme-icon sun-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <circle cx="12" cy="12" r="5"></circle>
                                    <line x1="12" y1="1" x2="12" y2="3"></line>
                                    <line x1="12" y1="21" x2="12" y2="23"></line>
                                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                                    <line x1="1" y1="12" x2="3" y2="12"></line>
                                    <line x1="21" y1="12" x2="23" y2="12"></line>
                                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                                </svg>
                                <svg class="theme-icon moon-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                                </svg>
                            </button>
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
            
            // Cargar contenido dinámico desde SheetBest
            await this.loadProtectedContent();
            
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
            console.log('🔄 Cargando contenido dinámico desde SheetBest...');
            
            // Obtener token de Auth0
            const token = await this.auth0.getIdTokenClaims();
            
            // Cargar contenido desde la función de Netlify
            const response = await fetch('/.netlify/functions/load-content', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token.__raw}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                console.log('✅ Contenido cargado exitosamente:', data);
                this.displayDynamicContent(data.content);
            } else {
                throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
            }
            
        } catch (error) {
            console.error('❌ Error cargando contenido protegido:', error);
            this.showError(`Error cargando contenido: ${error.message}`);
        }
    }

    // Método para mostrar contenido dinámico desde SheetBest
    displayDynamicContent(content) {
        try {
            const container = document.querySelector('.canvas-container');
            if (!container) {
                console.error('Contenedor de contenido no encontrado');
                return;
            }

            container.innerHTML = '';

            if (content.type === 'table') {
                container.innerHTML = `
                    <div class="dynamic-table">
                        <!-- Header de la Tabla -->
                        <div class="table-header">
                            <div class="table-title">
                                <h1>${content.title}</h1>
                                <p class="welcome-message">${content.content.welcome}</p>
                                <p class="data-source">📊 Fuente de datos: ${content.content.dataSource}</p>
                            </div>
                        </div>

                        <!-- Estadísticas Simples -->
                        <div class="stats-simple">
                            <div class="stat-item">
                                <span class="stat-number">${content.content.stats.totalItems}</span>
                                <span class="stat-label">Total Registros</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-number">${content.content.stats.tipos}</span>
                                <span class="stat-label">Tipos Únicos</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-number">${content.content.stats.layouts}</span>
                                <span class="stat-label">Layouts Únicos</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-number">${content.content.stats.paises}</span>
                                <span class="stat-label">Países</span>
                            </div>
                        </div>

                        <!-- Tabla de Datos -->
                        <div class="table-container">
                            <table class="data-table">
                                <thead>
                                    <tr>
                                        ${content.content.headers.map(header => `<th>${header}</th>`).join('')}
                                    </tr>
                                </thead>
                                <tbody>
                                    ${content.content.data.map(row => `
                                        <tr>
                                            <td>${row.ID || ''}</td>
                                            <td>${row.Parent || ''}</td>
                                            <td>${row.Name || ''}</td>
                                            <td>${row.Type || ''}</td>
                                            <td>${row.Layout || ''}</td>
                                            <td>${row.URL ? `<a href="${row.URL}" target="_blank">${row.URL}</a>` : ''}</td>
                                            <td>${row.Country || ''}</td>
                                            <td>${row.Technology || ''}</td>
                                            <td>${row.Responsive || ''}</td>
                                            <td>${row.Description || ''}</td>
                                            <td>${row.Img ? `<a href="${row.Img}" target="_blank">Ver Imagen</a>` : ''}</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>
                `;
            } else {
                // Mantener el dashboard original como fallback
                container.innerHTML = `
                    <div class="dynamic-dashboard">
                        <h1>${content.title}</h1>
                        <p>${content.content.welcome}</p>
                        <p>📊 Fuente de datos: ${content.content.dataSource}</p>
                    </div>
                `;
            }

        } catch (error) {
            console.error('❌ Error mostrando contenido dinámico:', error);
            this.showError('Error mostrando contenido dinámico');
        }
    }

    // Renderizar actividad reciente
    renderRecentActivity(actividad) {
        if (!actividad || actividad.length === 0) {
            return '<p class="no-data">No hay actividad reciente</p>';
        }

        return actividad.map(item => `
            <div class="activity-item">
                <div class="activity-icon ${this.getStatusIcon(item.estado)}">${this.getStatusEmoji(item.estado)}</div>
                <div class="activity-content">
                    <div class="activity-title">${item.titulo}</div>
                    <div class="activity-meta">
                        <span class="activity-responsible">👤 ${item.responsable}</span>
                        <span class="activity-date">📅 ${new Date(item.fecha_creacion).toLocaleDateString('es-ES')}</span>
                    </div>
                </div>
                <div class="activity-status ${this.getStatusClass(item.estado)}">${item.estado}</div>
            </div>
        `).join('');
    }

    // Renderizar lista de clientes
    renderProjectsList(items) {
        if (!items || items.length === 0) {
            return '<p class="no-data">No hay clientes disponibles</p>';
        }

        return items.map(item => `
            <div class="project-card">
                <div class="project-header">
                    <h3 class="project-title">${item.titulo}</h3>
                    <div class="project-status ${this.getStatusClass(item.estado)}">${item.estado}</div>
                </div>
                <p class="project-description">${item.descripcion}</p>
                <div class="project-meta">
                    <span class="project-category">🏷️ ${item.categoria}</span>
                    <span class="project-priority ${this.getPriorityClass(item.prioridad)}">${item.prioridad}</span>
                </div>
                <div class="project-footer">
                    <span class="project-responsible">📧 ${item.responsable}</span>
                    <span class="project-date">📅 ${new Date(item.fecha_creacion).toLocaleDateString('es-ES')}</span>
                </div>
            </div>
        `).join('');
    }

    // Renderizar estadísticas por categoría
    renderCategoriesStats(categorias) {
        if (!categorias || Object.keys(categorias).length === 0) {
            return '<p class="no-data">No hay categorías disponibles</p>';
        }

        return Object.entries(categorias).map(([categoria, items]) => `
            <div class="category-card">
                <div class="category-header">
                    <h3 class="category-name">${categoria}</h3>
                    <div class="category-count">${items.length} proyectos</div>
                </div>
                <div class="category-projects">
                    ${items.slice(0, 3).map(item => `
                        <div class="category-project">
                            <span class="project-name">${item.titulo}</span>
                            <span class="project-status ${this.getStatusClass(item.estado)}">${item.estado}</span>
                        </div>
                    `).join('')}
                    ${items.length > 3 ? `<div class="more-projects">+${items.length - 3} más...</div>` : ''}
                </div>
            </div>
        `).join('');
    }

    // Utilidades para estados y prioridades
    getStatusEmoji(estado) {
        const emojis = {
            'Con Transacción': '💳',
            'Sin Transacción': '⏳',
            'Con Email': '📧',
            'Sin Email': '❌'
        };
        return emojis[estado] || '👤';
    }

    getStatusIcon(estado) {
        const icons = {
            'Con Transacción': 'status-completed',
            'Sin Transacción': 'status-pending',
            'Con Email': 'status-completed',
            'Sin Email': 'status-default'
        };
        return icons[estado] || 'status-default';
    }

    getStatusClass(estado) {
        const classes = {
            'Con Transacción': 'status-completed',
            'Sin Transacción': 'status-pending',
            'Con Email': 'status-completed',
            'Sin Email': 'status-default'
        };
        return classes[estado] || 'status-default';
    }

    getPriorityClass(prioridad) {
        const classes = {
            'Alta': 'priority-high',
            'Media': 'priority-medium',
            'Baja': 'priority-low'
        };
        return classes[prioridad] || 'priority-default';
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
    // Inicializar app brand en todas las páginas
    const appBrand = new AppBrandGenerator();
    appBrand.init();
    
    // Inicializar auth theme toggle en páginas de auth (login.html y forbidden.html)
    if (window.location.pathname === '/login.html' || window.location.pathname === '/forbidden.html') {
        const authThemeToggle = new AuthThemeToggleGenerator();
        authThemeToggle.init();
    }
    
    // Solo inicializar ProtectedContentLoader en la página principal (app/index.html)
    if (window.location.pathname === '/app/' || window.location.pathname === '/app/index.html') {
        new ProtectedContentLoader();
    }
});

// =============================================================================
// FIN DEL ARCHIVO CONSOLIDADO
// =============================================================================
