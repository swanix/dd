# 🎨 Guía de Personalización

## 🎯 Personalización Básica

### **1. Cambiar Títulos y Contenido**

#### **Página Principal (`index.html`)**
```html
<title>Mi Aplicación Protegida</title>
<h1>Bienvenido a Mi Aplicación</h1>
```

#### **Página de Login (`login.html`)**
```html
<title>Iniciar Sesión - Mi Aplicación</title>
<h1>Acceso a Mi Aplicación</h1>
```

#### **Aplicación Protegida (`app/index.html`)**
```html
<title>Dashboard - Mi Aplicación</title>
<h1>Panel de Control</h1>
```

**Nota**: Todas las páginas en `/app/` incluyen protección automática que redirige al login si el usuario no está autenticado.

### **2. Personalizar Colores y Estilos**

#### **Variables CSS (`assets/css/main.css`)**
```css
:root {
  /* Colores principales */
  --primary-color: #667eea;
  --secondary-color: #764ba2;
  --accent-color: #f093fb;
  
  /* Colores de estado */
  --success-color: #4ade80;
  --error-color: #f87171;
  --warning-color: #fbbf24;
  
  /* Colores de fondo */
  --bg-primary: #ffffff;
  --bg-secondary: #f8fafc;
  --bg-dark: #1e293b;
  
  /* Tipografía */
  --font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-size-base: 16px;
  --font-size-lg: 18px;
  --font-size-xl: 24px;
  
  /* Espaciado */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  
  /* Bordes */
  --border-radius: 8px;
  --border-radius-lg: 12px;
  --border-width: 1px;
  
  /* Sombras */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
}
```

### **3. Cambiar Logo e Imágenes**

#### **Logo Principal**
```html
<!-- En header o sidebar -->
<img src="/assets/img/logo.svg" alt="Mi Aplicación" class="logo">
```

#### **Favicon**
```html
<link rel="icon" type="image/x-icon" href="/assets/img/favicon.ico">
```

## 🔧 Personalización Avanzada

### **1. Modificar Restricciones de Acceso**

#### **Auth0 Action Personalizado**
```javascript
exports.onExecutePostLogin = async (event, api) => {
    // Tu lógica personalizada aquí
    const userEmail = event.user.email;
    
    // Ejemplo: Solo emails corporativos
    if (!userEmail.endsWith('@miempresa.com')) {
        api.access.deny('Solo empleados autorizados');
    }
    
    // Ejemplo: Lista específica de usuarios
    const allowedUsers = [
        'admin@miempresa.com',
        'usuario1@miempresa.com'
    ];
    
    if (!allowedUsers.includes(userEmail)) {
        api.access.deny('Usuario no autorizado');
    }
};
```

### **2. Agregar Funcionalidades**

#### **Nuevas Páginas Protegidas**
```html
<!-- app/dashboard.html -->
<!DOCTYPE html>
<html lang="es">
<head>
    <title>Dashboard - Mi Aplicación</title>
    <link rel="stylesheet" href="/assets/css/main.css">
</head>
<body>
    <!-- Contenido del dashboard -->
</body>
</html>
```

#### **Nuevos Scripts**
```javascript
// assets/js/dashboard.js
document.addEventListener('DOMContentLoaded', () => {
    // Lógica específica del dashboard
});
```

### **3. Personalizar Netlify Functions**

#### **Nueva Función de Autorización**
```javascript
// netlify/functions/custom-auth.js
exports.handler = async (event, context) => {
    // Tu lógica personalizada de autorización
    return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Autorizado' })
    };
};
```

## 🎨 Temas y Variantes

### **1. Tema Oscuro**
```css
/* assets/css/dark-theme.css */
[data-theme="dark"] {
    --bg-primary: #1e293b;
    --bg-secondary: #334155;
    --text-primary: #f1f5f9;
    --text-secondary: #cbd5e1;
}
```

### **2. Tema Corporativo**
```css
/* assets/css/corporate-theme.css */
:root {
    --primary-color: #1e40af;
    --secondary-color: #1e3a8a;
    --accent-color: #3b82f6;
}
```

## 📱 Responsive Design

### **Breakpoints Personalizados**
```css
/* assets/css/responsive.css */
@media (max-width: 768px) {
    /* Estilos para móviles */
}

@media (max-width: 1024px) {
    /* Estilos para tablets */
}

@media (min-width: 1025px) {
    /* Estilos para desktop */
}
```

## 🔒 Seguridad Personalizada

### **1. Headers de Seguridad**
```toml
# netlify.toml
[[headers]]
  for = "/*"
  [headers.values]
    Content-Security-Policy = "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.auth0.com;"
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
```

### **2. Rate Limiting Personalizado**
```javascript
// netlify/functions/rate-limiter.js
const rateLimit = {
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100 // máximo 100 requests por ventana
};
```

## 🚀 Optimización

### **1. Lazy Loading**
```javascript
// Cargar componentes bajo demanda
const loadComponent = async (componentName) => {
    const module = await import(`/assets/js/components/${componentName}.js`);
    return module.default;
};
```

### **2. Caching**
```javascript
// Cache de datos del usuario
const userCache = new Map();
const cacheUserData = (userId, data) => {
    userCache.set(userId, {
        data,
        timestamp: Date.now()
    });
};
```

## 📋 Checklist de Personalización

- [ ] Cambiar títulos y contenido
- [ ] Personalizar colores y estilos
- [ ] Reemplazar logo e imágenes
- [ ] Configurar restricciones de acceso
- [ ] Agregar nuevas páginas
- [ ] Personalizar funciones de Netlify
- [ ] Implementar temas
- [ ] Optimizar para móviles
- [ ] Configurar seguridad
- [ ] Implementar caching
