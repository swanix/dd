# ⚙️ Guía de Configuración - Swanix Wall

## 📋 Prerrequisitos

- Cuenta en [Auth0](https://auth0.com/)
- Cuenta en [Netlify](https://netlify.com/)
- Cuenta en [Google Cloud Console](https://console.cloud.google.com/) (opcional)
- Node.js instalado

## 🔧 Configuración de Auth0

### 1. Crear Aplicación SPA

1. Ve a [Auth0 Dashboard](https://manage.auth0.com/)
2. **Applications** → **Create Application**
3. **Name**: `Swanix Wall`
4. **Type**: `Single Page Application`
5. **Create**

### 2. Configurar URLs

En **Settings** de tu aplicación:

**Allowed Callback URLs:**
```
http://localhost:8888/,
http://localhost:8888/app/,
http://localhost:8888/forbidden.html
```

**Allowed Logout URLs:**
```
http://localhost:8888/login.html,
http://localhost:8888/forbidden.html
```

**Allowed Web Origins:**
```
http://localhost:8888
```

### 3. Configurar Google OAuth (Opcional)

1. **Authentication** → **Social**
2. **Google** → **Enable**
3. Configurar Client ID y Secret de Google Cloud Console

### 4. Crear Action para Restricción (Opcional)

1. **Auth Pipeline** → **Actions**
2. **Create Action**
3. **Trigger**: `Login`
4. **Template**: `Empty Action`

```javascript
exports.onExecutePostLogin = async (event, api) => {
    // Dominio principal permitido
    const primaryDomain = '@tuempresa.com';
    
    // Lista de emails específicos permitidos
    const allowedSpecificEmails = [
        'usuario1@gmail.com',
        'usuario2@otraempresa.com'
    ];

    const userEmail = event.user.email;

    // Verificar email específico
    if (allowedSpecificEmails.includes(userEmail)) {
        return;
    }

    // Verificar dominio principal
    if (userEmail.endsWith(primaryDomain)) {
        return;
    }

    // Denegar acceso
    api.access.deny('Acceso denegado. Tu correo no está autorizado.');
};
```

5. **Deploy** y agregar al flujo **Post Login**

## 🌐 Configuración de Google Cloud Console (Opcional)

### 1. Crear Proyecto

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. **New Project**
3. **Name**: `Swanix Wall`

### 2. Habilitar APIs

1. **APIs & Services** → **Library**
2. Buscar y habilitar:
   - **Google+ API**
   - **Google Identity Toolkit API**

### 3. Configurar OAuth Consent Screen

1. **APIs & Services** → **OAuth consent screen**
2. **User Type**: `External`
3. **App name**: `Swanix Wall`
4. **User support email**: tu email
5. **Developer contact information**: tu email

### 4. Crear Credenciales OAuth

1. **APIs & Services** → **Credentials**
2. **Create Credentials** → **OAuth 2.0 Client IDs**
3. **Application type**: `Web application`
4. **Name**: `Swanix Wall Web Client`
5. **Authorized redirect URIs**:
   ```
   https://tu-dominio.auth0.com/login/callback
   ```

## 🚀 Configuración de Netlify

### 1. Conectar Repositorio

1. Ve a [Netlify](https://netlify.com/)
2. **New site from Git**
3. Conectar tu repositorio de GitHub
4. **Build command**: `npm run build` (o dejar vacío)
5. **Publish directory**: `.` (raíz del proyecto)

### 2. Configurar Variables de Entorno

En **Site settings** → **Environment variables**:

```env
AUTH0_DOMAIN=tu-dominio.auth0.com
AUTH0_CLIENT_ID=tu-client-id
AUTH0_CLIENT_SECRET=tu-client-secret
AUTH0_AUDIENCE=tu-audience
GOOGLE_CLIENT_ID=tu-google-client-id
GOOGLE_CLIENT_SECRET=tu-google-client-secret
```

### 3. Configurar Dominio Personalizado (Opcional)

1. **Domain management** → **Add custom domain**
2. Configurar DNS según las instrucciones de Netlify

## 📁 Estructura del Proyecto

```
swanix-wall/
├── app/
│   └── index.html          # Página principal protegida
├── assets/
│   ├── css/
│   │   └── main.css        # Estilos base
│   └── js/
│       ├── auth.js         # Configuración Auth0
│       ├── protected-content.js
│       ├── login.js        # Lógica de login
│       ├── index.js        # Lógica principal
│       └── utils.js        # Utilidades
├── netlify/
│   ├── functions/
│   │   ├── auth-protect.js # Protección de rutas
│   │   └── protect-html.js # Middleware HTML
│   └── utils/
│       └── rate-limiter.js # Rate limiting
├── login.html              # Página de login
├── forbidden.html          # Página de acceso denegado
├── netlify.toml           # Configuración Netlify
└── env.example            # Variables de entorno
```

## 🔒 Protección de Contenido

### Páginas HTML Protegidas

Para proteger una página HTML, agregar el atributo `data-protected`:

```html
<!DOCTYPE html>
<html data-protected="true">
<head>
    <title>Página Protegida</title>
</head>
<body>
    <!-- Contenido protegido -->
</body>
</html>
```

### API Protegida

Para proteger rutas de API, usar el middleware:

```javascript
// En Netlify Functions
const { protectRoute } = require('./utils/auth');

exports.handler = async (event, context) => {
    const authResult = await protectRoute(event);
    if (!authResult.authenticated) {
        return {
            statusCode: 401,
            body: JSON.stringify({ error: 'No autorizado' })
        };
    }
    
    // Lógica de la API
};
```

## 🧪 Desarrollo Local

### 1. Instalar Dependencias

```bash
npm install
```

### 2. Configurar Variables de Entorno

```bash
cp env.example .env
# Editar .env con tus credenciales
```

### 3. Ejecutar Servidor Local

```bash
npm run dev
```

### 4. Acceder a la Aplicación

- **URL**: `http://localhost:8888`
- **Login**: `http://localhost:8888/login.html`

## 🔧 Personalización

### Cambiar Estilos

Editar `assets/css/main.css` para personalizar la apariencia:

```css
:root {
    --primary-color: #007bff;
    --secondary-color: #6c757d;
    --background-color: #ffffff;
}
```

### Configurar Restricciones

Editar el Action de Auth0 para cambiar las reglas de acceso:

```javascript
// Ejemplo: Solo permitir emails corporativos
if (!userEmail.endsWith('@tuempresa.com')) {
    api.access.deny('Solo emails corporativos permitidos');
}
```

## 🚨 Solución de Problemas

### Error de CORS

Si tienes errores de CORS, verificar:
- URLs permitidas en Auth0
- Configuración de Netlify
- Variables de entorno

### Error de Autenticación

Si la autenticación falla:
- Verificar credenciales de Auth0
- Revisar configuración de Google OAuth
- Comprobar variables de entorno

### Error de Despliegue

Si el despliegue falla:
- Verificar configuración de Netlify
- Revisar logs de build
- Comprobar estructura de archivos

## 📞 Soporte

- 📧 Email: soporte@swanix.com
- 📖 Documentación: [docs/](docs/)
- 🐛 Issues: [GitHub Issues](https://github.com/tu-usuario/swanix-wall/issues)
