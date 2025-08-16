# 🎨 Personalización - Swanix Wall

## 📋 Descripción

Esta guía te ayudará a personalizar Swanix Wall para adaptarlo a tus necesidades específicas de autenticación y protección de contenido.

## 🎨 Personalización Visual

### Cambiar Colores

Editar las variables CSS en `assets/css/main.css`:

```css
:root {
    /* Colores principales */
    --primary-color: #007bff;
    --secondary-color: #6c757d;
    --success-color: #28a745;
    --danger-color: #dc3545;
    --warning-color: #ffc107;
    --info-color: #17a2b8;
    
    /* Colores de fondo */
    --background-color: #ffffff;
    --sidebar-bg: #f8f9fa;
    --topbar-bg: #ffffff;
    
    /* Colores de texto */
    --text-color: #000000;
    --text-muted: #6c757d;
    --link-color: #007bff;
    
    /* Bordes */
    --border-color: #e9ecef;
    --border-radius: 6px;
    
    /* Sombras */
    --shadow: 0 2px 4px rgba(0,0,0,0.1);
    --shadow-lg: 0 4px 8px rgba(0,0,0,0.15);
}
```

### Cambiar Tipografía

```css
:root {
    /* Fuente principal */
    --font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    
    /* Tamaños de fuente */
    --font-size-sm: 12px;
    --font-size-base: 14px;
    --font-size-lg: 16px;
    --font-size-xl: 18px;
    --font-size-2xl: 24px;
    
    /* Pesos de fuente */
    --font-weight-normal: 400;
    --font-weight-medium: 500;
    --font-weight-semibold: 600;
    --font-weight-bold: 700;
}
```

### Personalizar Layout

```css
:root {
    /* Dimensiones del sidebar */
    --sidebar-width: 250px;
    --sidebar-padding: 20px;
    
    /* Dimensiones del topbar */
    --topbar-height: 80px;
    --topbar-padding: 20px;
    
    /* Espaciado general */
    --spacing-xs: 4px;
    --spacing-sm: 8px;
    --spacing-md: 16px;
    --spacing-lg: 24px;
    --spacing-xl: 32px;
}
```

## 🔒 Configuración de Seguridad

### Restricciones por Email

Editar el Action de Auth0 para configurar restricciones:

```javascript
exports.onExecutePostLogin = async (event, api) => {
    const userEmail = event.user.email;
    
    // Solo emails corporativos
    if (!userEmail.endsWith('@tuempresa.com')) {
        api.access.deny('Solo emails corporativos permitidos');
        return;
    }
    
    // Lista específica de emails
    const allowedEmails = [
        'admin@tuempresa.com',
        'usuario1@tuempresa.com',
        'usuario2@tuempresa.com'
    ];
    
    if (!allowedEmails.includes(userEmail)) {
        api.access.deny('Email no autorizado');
        return;
    }
};
```

### Restricciones por Dominio

```javascript
exports.onExecutePostLogin = async (event, api) => {
    const userEmail = event.user.email;
    
    // Múltiples dominios permitidos
    const allowedDomains = [
        '@tuempresa.com',
        '@sucursal.com',
        '@partner.com'
    ];
    
    const isAllowed = allowedDomains.some(domain => 
        userEmail.endsWith(domain)
    );
    
    if (!isAllowed) {
        api.access.deny('Dominio no autorizado');
        return;
    }
};
```

### Restricciones por Rol

```javascript
exports.onExecutePostLogin = async (event, api) => {
    const userEmail = event.user.email;
    
    // Asignar roles basados en email
    if (userEmail.endsWith('@admin.tuempresa.com')) {
        api.accessToken.setCustomClaim('role', 'admin');
    } else if (userEmail.endsWith('@tuempresa.com')) {
        api.accessToken.setCustomClaim('role', 'user');
    } else {
        api.access.deny('Rol no autorizado');
        return;
    }
};
```

## 🏗️ Estructura de Archivos

### Agregar Nuevas Páginas Protegidas

1. Crear archivo HTML en `app/`:

```html
<!DOCTYPE html>
<html lang="es" data-protected="true">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nueva Página Protegida</title>
    <link rel="stylesheet" href="/assets/css/main.css">
</head>
<body>
    <div class="app-container">
        <!-- Sidebar -->
        <aside class="sidebar">
            <div class="sidebar-header">
                <h2>Mi Aplicación</h2>
            </div>
            <nav class="sidebar-nav">
                <ul>
                    <li><a href="/app/" class="nav-link">Inicio</a></li>
                    <li><a href="/app/nueva-pagina.html" class="nav-link active">Nueva Página</a></li>
                </ul>
            </nav>
        </aside>
        
        <!-- Contenido principal -->
        <div class="main-content">
            <header class="topbar">
                <div class="topbar-left">
                    <h1>Nueva Página</h1>
                </div>
                <div class="topbar-right">
                    <!-- Menú de usuario -->
                </div>
            </header>
            
            <main class="content-area">
                <div class="content-header">
                    <h2>Bienvenido</h2>
                    <p>Contenido de la nueva página protegida</p>
                </div>
                
                <div id="contentContainer">
                    <!-- Contenido dinámico -->
                </div>
            </main>
        </div>
    </div>
    
    <script src="https://cdn.auth0.com/js/auth0-spa-js/1.13/auth0-spa-js.production.js"></script>
    <script src="/assets/js/env-config.js"></script>
    <script src="/assets/js/protected-content.js"></script>
</body>
</html>
```

2. Configurar redirección en `netlify.toml`:

```toml
[[redirects]]
  from = "/app/nueva-pagina.html"
  to = "/.netlify/functions/protect-html"
  status = 200
  force = true
```

### Agregar Nuevas Funciones Netlify

1. Crear archivo en `netlify/functions/`:

```javascript
const { protectRoute } = require('../utils/auth');

exports.handler = async (event, context) => {
    // Verificar autenticación
    const authResult = await protectRoute(event);
    if (!authResult.authenticated) {
        return {
            statusCode: 401,
            body: JSON.stringify({ error: 'No autorizado' })
        };
    }
    
    // Lógica de la función
    const user = authResult.user;
    
    return {
        statusCode: 200,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        },
        body: JSON.stringify({
            message: 'Función protegida ejecutada',
            user: user.email
        })
    };
};
```

## 🔧 Configuración Avanzada

### Rate Limiting Personalizado

Editar `netlify/utils/rate-limiter.js`:

```javascript
const rateLimit = {
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // máximo 100 requests por ventana
    message: {
        error: 'Demasiadas requests, intenta más tarde'
    },
    standardHeaders: true,
    legacyHeaders: false
};
```

### Headers de Seguridad

Agregar en `netlify.toml`:

```toml
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    X-XSS-Protection = "1; mode=block"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Content-Security-Policy = "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.auth0.com; style-src 'self' 'unsafe-inline';"
```

### Logging Personalizado

```javascript
// En funciones Netlify
const logActivity = (user, action, details) => {
    console.log(JSON.stringify({
        timestamp: new Date().toISOString(),
        user: user.email,
        action: action,
        details: details,
        ip: event.headers['client-ip']
    }));
};

// Usar en funciones
logActivity(user, 'page_access', { page: 'dashboard' });
```

## 🎯 Casos de Uso Comunes

### Aplicación Corporativa

```javascript
// Configuración para empresa
const config = {
    allowedDomains: ['@tuempresa.com', '@sucursal.com'],
    adminEmails: ['admin@tuempresa.com'],
    sessionTimeout: 8 * 60 * 60 * 1000, // 8 horas
    requireMFA: true
};
```

### Portal de Clientes

```javascript
// Configuración para clientes
const config = {
    allowedEmails: [
        'cliente1@empresa.com',
        'cliente2@empresa.com'
    ],
    sessionTimeout: 24 * 60 * 60 * 1000, // 24 horas
    requireMFA: false
};
```

### Aplicación Interna

```javascript
// Configuración interna
const config = {
    allowedDomains: ['@tuempresa.com'],
    sessionTimeout: 4 * 60 * 60 * 1000, // 4 horas
    requireMFA: true,
    logAllActivity: true
};
```

## 🚀 Optimización

### Caché de Tokens

```javascript
// En auth.js
const cacheConfig = {
    cacheLocation: 'localstorage',
    cacheExpirationInSeconds: 3600, // 1 hora
    useRefreshTokens: true
};
```

### Lazy Loading

```javascript
// Cargar componentes solo cuando se necesiten
const loadComponent = async (componentName) => {
    const module = await import(`./components/${componentName}.js`);
    return module.default;
};
```

### Compresión

Agregar en `netlify.toml`:

```toml
[[headers]]
  for = "*.js"
  [headers.values]
    Content-Encoding = "gzip"
    
[[headers]]
  for = "*.css"
  [headers.values]
    Content-Encoding = "gzip"
```

## 📞 Soporte

Para ayuda con personalización:
- 📧 Email: desarrollo@swanix.com
- 📖 Documentación: [docs/](docs/)
- 🐛 Issues: [GitHub Issues](https://github.com/tu-usuario/swanix-wall/issues)
