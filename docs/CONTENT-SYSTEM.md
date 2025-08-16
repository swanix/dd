# Sistema de Contenido Protegido

## 📋 Descripción General

Este sistema permite servir archivos markdown desde la carpeta `/app/content/` con autenticación Auth0. Los archivos se convierten automáticamente a HTML y se protegen mediante JWT tokens.

## 🏗️ Arquitectura

### Componentes Principales

1. **`netlify/functions/protect-content.js`** - Función serverless que:
   - Valida tokens JWT de Auth0
   - Lee archivos markdown del sistema de archivos
   - Convierte markdown a HTML usando la librería `marked`
   - Sirve contenido en diferentes formatos (JSON, HTML, Markdown raw)

2. **`assets/js/content-loader.js`** - Cliente JavaScript que:
   - Maneja la autenticación con Auth0
   - Carga contenido protegido via fetch API
   - Renderiza el contenido en el DOM
   - Proporciona funcionalidades de navegación SPA

3. **`app/content/`** - Directorio con archivos markdown:
   - `dashboard.md` - Dashboard principal
   - `documentos.md` - Gestión de documentos
   - `configuracion.md` - Configuración de la aplicación

4. **`app/content.html`** - Página de demostración que:
   - Integra Auth0 para autenticación
   - Usa ContentLoader para cargar contenido
   - Proporciona navegación entre secciones

## 🔧 Configuración

### Dependencias

```json
{
  "dependencies": {
    "marked": "^9.1.6",
    "jsonwebtoken": "^9.0.2",
    "jwks-rsa": "^3.0.1"
  }
}
```

### Variables de Entorno

```bash
AUTH0_DOMAIN=tu-dominio.auth0.com
AUTH0_CLIENT_ID=tu-client-id
```

### Reglas de Redirección (netlify.toml)

```toml
# Proteger archivos markdown en /app/content/
[[redirects]]
  from = "/app/content/*.md"
  to = "/.netlify/functions/protect-content"
  status = 200
  force = true

# Proteger también archivos markdown sin extensión
[[redirects]]
  from = "/app/content/*"
  to = "/.netlify/functions/protect-content"
  status = 200
  force = true
```

## 🚀 Uso

### Carga Básica de Contenido

```javascript
// Inicializar ContentLoader
const contentLoader = new ContentLoader();
await contentLoader.init(auth0Client);

// Cargar contenido
await contentLoader.loadContent('dashboard', {
    targetElement: document.getElementById('content'),
    format: 'json'
});
```

### Navegación SPA

```javascript
// Navegar a contenido específico
await contentLoader.navigateTo('documentos', contentElement);

// El contenido se carga y la URL se actualiza automáticamente
```

### Diferentes Formatos de Respuesta

```javascript
// JSON (incluye markdown, HTML y metadatos)
await contentLoader.loadContent('dashboard', { format: 'json' });

// HTML directo
await contentLoader.loadContent('dashboard', { format: 'html' });

// Markdown raw
await contentLoader.loadContent('dashboard', { format: 'markdown' });
```

## 🔒 Seguridad

### Autenticación
- Todos los requests requieren un token JWT válido de Auth0
- Los tokens se validan usando el endpoint JWKS de Auth0
- Solo usuarios autenticados pueden acceder al contenido

### Validación de Rutas
- Las rutas se normalizan para prevenir directory traversal
- Solo se permite acceso a archivos dentro de `/app/content/`
- Se valida que las rutas no salgan del directorio permitido

### Sanitización
- El HTML generado se puede sanitizar usando DOMPurify
- Los archivos markdown se procesan de forma segura
- Se aplican headers de seguridad apropiados

## 📁 Estructura de Archivos

```
app/
├── content/
│   ├── dashboard.md
│   ├── documentos.md
│   └── configuracion.md
├── content.html
assets/
├── js/
│   └── content-loader.js
└── css/
    └── main.css (incluye estilos markdown)
netlify/
└── functions/
    └── protect-content.js
```

## 🎨 Estilos CSS

El sistema incluye estilos CSS completos para renderizar contenido markdown:

- **Encabezados**: H1-H4 con estilos jerárquicos
- **Listas**: UL/OL con indentación apropiada
- **Código**: Bloques de código y código inline
- **Tablas**: Estilos para tablas HTML
- **Blockquotes**: Citas con borde izquierdo
- **Imágenes**: Responsive con bordes redondeados

## 🔍 Debugging

### Logs del Servidor
La función `protect-content.js` incluye logs detallados:
- Validación de tokens
- Rutas de archivos procesadas
- Errores de autenticación y archivos

### Logs del Cliente
El `ContentLoader` incluye logs para:
- Inicialización de Auth0
- Requests de contenido
- Errores de carga

## 🐛 Troubleshooting

### Error 401: Unauthorized
- Verificar que el token JWT sea válido
- Comprobar que AUTH0_DOMAIN esté configurado
- Revisar que el usuario esté autenticado

### Error 404: Not Found
- Verificar que el archivo markdown existe en `/app/content/`
- Comprobar que la ruta no tenga caracteres especiales
- Revisar los logs de debug para la ruta procesada

### Error de Renderizado
- Verificar que los estilos CSS estén cargados
- Comprobar que el elemento target exista en el DOM
- Revisar la consola del navegador para errores JavaScript

## 📈 Características Avanzadas

### Metadatos
Cada respuesta JSON incluye metadatos del archivo:
- Nombre del archivo
- Extensión
- Tamaño en caracteres
- Fecha de última modificación

### Búsqueda
El ContentLoader incluye funcionalidad de búsqueda en el contenido actual:
```javascript
const result = contentLoader.searchInContent('término de búsqueda');
```

### Navegación SPA
- Actualización de URL sin recargar la página
- Historial de navegación funcional
- Estados activos en el menú de navegación

## 🔄 Mantenimiento

### Agregar Nuevo Contenido
1. Crear archivo markdown en `/app/content/`
2. Agregar enlace en la navegación de `content-example.html`
3. El sistema automáticamente lo hará disponible

### Actualizar Dependencias
```bash
npm update marked jsonwebtoken jwks-rsa
```

### Monitoreo
- Revisar logs de Netlify Functions
- Monitorear errores 401/404
- Verificar rendimiento de conversión markdown

---

*Este sistema proporciona una base sólida para aplicaciones que requieren contenido dinámico protegido con autenticación.*
