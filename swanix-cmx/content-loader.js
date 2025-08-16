// ===== CARGADOR DE CONTENIDO PROTEGIDO =====
// Módulo para cargar y mostrar contenido markdown desde /app/content/

class ContentLoader {
    constructor() {
        this.baseUrl = '/app/content/';
        this.auth0 = null;
        this.currentContent = null;
    }

    // ===== INICIALIZAR CON AUTH0 =====
    async init(auth0Client) {
        this.auth0 = auth0Client;
        console.log('📚 ContentLoader inicializado');
    }

    // ===== OBTENER TOKEN =====
    async getToken() {
        if (!this.auth0) {
            throw new Error('Auth0 no inicializado');
        }
        
        try {
            // Usar el mismo método que funciona en auth.js
            const tokenClaims = await this.auth0.getIdTokenClaims();
            return tokenClaims.__raw;
        } catch (error) {
            console.error('❌ Error obteniendo token:', error);
            throw error;
        }
    }

    // ===== CARGAR CONTENIDO MARKDOWN =====
    async loadContent(contentPath, options = {}) {
        const {
            format = 'json', // 'json', 'html', 'markdown'
            targetElement = null,
            showLoading = true
        } = options;

        try {
            // Mostrar loading si se especifica
            if (showLoading && targetElement) {
                targetElement.innerHTML = '<div class="loading">Cargando contenido...</div>';
            }

            // Obtener token
            const token = await this.getToken();

            // Construir URL
            const url = this.baseUrl + contentPath;
            
            // Configurar headers
            const headers = {
                'Authorization': `Bearer ${token}`,
                'Accept': format === 'json' ? 'application/json' : 
                         format === 'markdown' ? 'text/markdown' : 'text/html'
            };

            // Hacer request
            const response = await fetch(url, { headers });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            // Procesar respuesta
            let content;
            if (format === 'json') {
                content = await response.json();
                this.currentContent = content;
            } else {
                content = await response.text();
            }

            // Renderizar en elemento si se especifica
            if (targetElement) {
                if (format === 'json') {
                    this.renderContent(targetElement, content);
                } else {
                    targetElement.innerHTML = content;
                }
            }

            return content;

        } catch (error) {
            console.error('❌ Error cargando contenido:', error);
            
            if (targetElement) {
                targetElement.innerHTML = `
                    <div class="error-message">
                        <h3>Error cargando contenido</h3>
                        <p>${error.message}</p>
                        <button onclick="location.reload()">Reintentar</button>
                    </div>
                `;
            }
            
            throw error;
        }
    }

    // ===== RENDERIZAR CONTENIDO JSON =====
    renderContent(targetElement, content) {
        if (!content.html) {
            targetElement.innerHTML = '<p>Contenido no disponible</p>';
            return;
        }

        // Sanitizar HTML (usar DOMPurify si está disponible)
        let sanitizedHtml = content.html;
        if (window.DOMPurify) {
            sanitizedHtml = DOMPurify.sanitize(content.html);
        }

        // Aplicar estilos específicos para markdown
        const styledHtml = `
            <div class="markdown-content">
                ${sanitizedHtml}
            </div>
        `;

        targetElement.innerHTML = styledHtml;

        // Agregar metadatos si están disponibles
        if (content.metadata) {
            const metadataDiv = document.createElement('div');
            metadataDiv.className = 'content-metadata';
            metadataDiv.innerHTML = `
                <small>
                    Archivo: ${content.metadata.filename} | 
                    Tamaño: ${content.metadata.size} caracteres | 
                    Última modificación: ${new Date(content.metadata.lastModified).toLocaleString()}
                </small>
            `;
            targetElement.appendChild(metadataDiv);
        }
    }

    // ===== LISTAR CONTENIDO DISPONIBLE =====
    async listContent() {
        try {
            const token = await this.getToken();
            const response = await fetch(this.baseUrl, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('❌ Error listando contenido:', error);
            throw error;
        }
    }

    // ===== NAVEGAR A CONTENIDO =====
    async navigateTo(contentPath, targetElement) {
        try {
            await this.loadContent(contentPath, {
                targetElement,
                format: 'json',
                showLoading: true
            });

            // Actualizar URL sin recargar la página
            const newUrl = new URL(window.location);
            newUrl.searchParams.set('content', contentPath);
            window.history.pushState({ contentPath }, '', newUrl);

        } catch (error) {
            console.error('❌ Error navegando a contenido:', error);
            throw error;
        }
    }

    // ===== BUSCAR EN CONTENIDO =====
    searchInContent(searchTerm) {
        if (!this.currentContent || !this.currentContent.markdown) {
            return null;
        }

        const content = this.currentContent.markdown.toLowerCase();
        const term = searchTerm.toLowerCase();
        
        if (content.includes(term)) {
            // Encontrar posición aproximada
            const index = content.indexOf(term);
            const start = Math.max(0, index - 50);
            const end = Math.min(content.length, index + term.length + 50);
            
            return {
                found: true,
                snippet: '...' + content.substring(start, end) + '...',
                position: index
            };
        }

        return { found: false };
    }
}

// ===== EXPORTAR PARA USO GLOBAL =====
window.ContentLoader = ContentLoader;

// ===== FUNCIÓN DE CONVENIENCIA =====
window.loadProtectedContent = async (contentPath, targetElement, options = {}) => {
    if (!window.contentLoader) {
        window.contentLoader = new ContentLoader();
        
        // Inicializar con Auth0 si está disponible
        if (window.auth0) {
            await window.contentLoader.init(window.auth0);
        }
    }
    
    return await window.contentLoader.loadContent(contentPath, {
        targetElement,
        ...options
    });
};
