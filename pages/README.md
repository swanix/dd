# 📁 Páginas de la Aplicación

Esta carpeta contiene todas las páginas HTML de la aplicación. Cada página es independiente y puede ser accedida directamente.

## 📋 Páginas Actuales

### `login.html` (en la raíz)
- **Propósito**: Página de autenticación dedicada
- **URL**: `/login.html`
- **Características**: 
  - Formulario de login con Auth0
  - Redirección automática si ya autenticado
  - UI moderna y responsive

### `app.html`
- **Propósito**: Aplicación principal con contenido protegido
- **URL**: `/pages/app.html`
- **Características**:
  - Layout completo con sidebar y topbar
  - Información del usuario autenticado
  - Contenido protegido de ejemplo
  - Datos del servidor via Netlify Functions

### `dashboard.html`
- **Propósito**: Dashboard de métricas y estadísticas
- **URL**: `/pages/dashboard.html`
- **Características**:
  - Métricas visuales con cards
  - Estado de autenticación detallado
  - Navegación entre páginas
  - Datos de ejemplo para demostración

## 🚀 Cómo Agregar Nuevas Páginas

### 1. Crear el archivo HTML
```bash
# Crear nueva página
touch pages/nueva-pagina.html
```

### 2. Estructura básica recomendada
```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nueva Página - Mi Aplicación</title>
    <style>
        /* Copiar estilos de app.html o dashboard.html */
    </style>
</head>
<body>
    <div class="app-container">
        <!-- Sidebar (copiar de app.html) -->
        <aside class="sidebar">
            <!-- Navegación -->
        </aside>

        <!-- Main Content -->
        <main class="main-content">
            <!-- Topbar (copiar de app.html) -->
            <header class="topbar">
                <!-- Header content -->
            </header>

            <!-- Content Area -->
            <main class="content-area">
                <!-- Tu contenido aquí -->
            </main>
        </main>
    </div>

    <script src="https://cdn.auth0.com/js/auth0-spa-js/1.13/auth0-spa-js.production.js"></script>
    <script>
        // Configuración de Auth0 (copiar de app.html)
        const auth0Config = {
            domain: 'dev-7kj3jxtxwwirocri.us.auth0.com',
            client_id: 'BORj4AB79Rho5yP5uSavuP4sern8pemZ',
            redirect_uri: window.location.origin + '/pages/app.html',
            cacheLocation: 'localstorage'
        };

        // Lógica de autenticación (copiar de app.html)
        async function initAuth0() {
            // Verificar autenticación
            // Cargar datos del usuario
            // Configurar event listeners
        }

        document.addEventListener('DOMContentLoaded', initAuth0);
    </script>
</body>
</html>
```

### 3. Actualizar navegación
Agregar el enlace en el sidebar de todas las páginas:
```html
<li><a href="/pages/nueva-pagina.html"><i>🔗</i> Nueva Página</a></li>
```

### 4. Actualizar script de configuración
Agregar la nueva página al script `update-urls.js`:
```javascript
const files = [
    'index.html',
    'pages/login.html',
    'pages/app.html',
    'pages/dashboard.html',
    'pages/nueva-pagina.html'  // ← Agregar aquí
];
```

## 🎯 Mejores Prácticas

### Estructura de Archivos
- **Nombres**: Usar kebab-case (ej: `mi-pagina.html`)
- **Títulos**: Ser descriptivos y claros
- **Organización**: Mantener páginas relacionadas juntas

### Autenticación
- **Verificar autenticación** en cada página
- **Redirigir a login** si no autenticado
- **Mantener consistencia** en la configuración de Auth0

### Navegación
- **Sidebar consistente** en todas las páginas
- **Enlaces relativos** desde `/pages/`
- **Indicador de página activa** en el sidebar

### Estilos
- **Reutilizar estilos** de páginas existentes
- **Mantener consistencia** visual
- **Responsive design** para móviles

## 📝 Ejemplos de Páginas Futuras

- `users.html` - Gestión de usuarios
- `settings.html` - Configuración de la aplicación
- `profile.html` - Perfil del usuario
- `reports.html` - Reportes y analytics
- `help.html` - Documentación y ayuda

## 🔧 Configuración

### URLs en Auth0
Cuando agregues nuevas páginas que requieran autenticación, actualiza las URLs en Auth0:

```
Allowed Callback URLs:
http://localhost:8888/pages/app.html, https://swanixdd.netlify.app/pages/app.html

Allowed Logout URLs:
http://localhost:8888/login.html, https://swanixdd.netlify.app/login.html
```

### Script de Actualización
Usar el script para cambiar entre entornos:
```bash
# Desarrollo
node update-urls.js development

# Producción
node update-urls.js production
```

---

**Nota**: Todas las páginas deben mantener la consistencia en autenticación, navegación y diseño para una experiencia de usuario coherente.
