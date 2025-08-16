/**
 * Configuración de Páginas Generada Automáticamente
 * Generado el: 2025-08-16T13:39:49.980Z
 */

window.PAGES_CONFIG = {
  "pages": [
    {
      "file": "index.html",
      "path": "/app/index.html",
      "title": "Aplicación",
      "icon": "🏠",
      "lastModified": "2025-08-16T13:39:20.766Z",
      "size": 1607
    },
    {
      "file": "content.html",
      "path": "/app/content.html",
      "title": "Contenido Protegido",
      "icon": "📄",
      "lastModified": "2025-08-16T13:39:28.267Z",
      "size": 9651
    }
  ],
  "menuConfig": {
    "mainMenu": {
      "selector": ".sidebar-nav ul",
      "items": [
        {
          "href": "/app/index.html",
          "text": "Aplicación",
          "icon": "🏠"
        },
        {
          "href": "/app/content.html",
          "text": "Contenido Protegido",
          "icon": "📄"
        }
      ]
    }
  }
};

// Función para obtener la configuración del menú
window.getMenuConfig = function() {
    return window.PAGES_CONFIG.menuConfig;
};

// Función para obtener todas las páginas
window.getAllPages = function() {
    return window.PAGES_CONFIG.pages;
};

// Función para obtener una página específica
window.getPage = function(path) {
    return window.PAGES_CONFIG.pages.find(page => page.path === path);
};
