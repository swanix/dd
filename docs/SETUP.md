# ⚙️ Guía de Configuración

## 📋 Prerrequisitos

- Cuenta en [Auth0](https://auth0.com/)
- Cuenta en [Netlify](https://netlify.com/)
- Cuenta en [Google Cloud Console](https://console.cloud.google.com/)
- Node.js instalado

## 🔧 Configuración de Auth0

### 1. Crear Aplicación SPA

1. Ve a [Auth0 Dashboard](https://manage.auth0.com/)
2. **Applications** → **Create Application**
3. **Name**: `Mi Aplicación Protegida`
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

### 3. Configurar Google OAuth

1. **Authentication** → **Social**
2. **Google** → **Enable**
3. Configurar Client ID y Secret de Google Cloud Console

### 4. Crear Action para Restricción

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

## 🌐 Configuración de Google Cloud Console

### 1. Crear Proyecto

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. **New Project**
3. **Name**: `Mi Aplicación Auth0`

### 2. Habilitar APIs

1. **APIs & Services** → **Library**
2. Buscar y habilitar:
   - **Google+ API**
   - **Google Identity Toolkit API**

### 3. Configurar OAuth Consent Screen

1. **APIs & Services** → **OAuth consent screen**
2. **User Type**: `External`
3. **App name**: `Mi Aplicación`
4. **User support email**: Tu email
5. **Developer contact information**: Tu email

### 4. Crear Credenciales

1. **APIs & Services** → **Credentials**
2. **Create Credentials** → **OAuth 2.0 Client IDs**
3. **Application type**: `Web application`
4. **Name**: `Auth0 Google OAuth`
5. **Authorized redirect URIs**:
   ```
   https://tu-dominio.auth0.com/login/callback
   ```

## 🚀 Configuración de Netlify

### 1. Conectar Repositorio

1. Ve a [Netlify Dashboard](https://app.netlify.com/)
2. **New site from Git**
3. Conectar tu repositorio
4. **Build command**: `npm run build`
5. **Publish directory**: `.` (raíz)

### 2. Configurar Variables de Entorno

En **Site settings** → **Environment variables**:

```
AUTH0_DOMAIN=tu-dominio.auth0.com
AUTH0_CLIENT_ID=tu-client-id
NETLIFY_URL=https://tu-sitio.netlify.app
LOCAL_URL=http://localhost:8888
```

### 3. Configurar Dominio Personalizado (Opcional)

1. **Domain settings** → **Custom domains**
2. **Add custom domain**
3. Configurar DNS según instrucciones

## 📝 Variables de Entorno Locales

Crear archivo `.env.local`:

```bash
# Auth0 Configuration
AUTH0_DOMAIN=tu-dominio.auth0.com
AUTH0_CLIENT_ID=tu-client-id

# URLs
NETLIFY_URL=https://tu-sitio.netlify.app
LOCAL_URL=http://localhost:8888
```

## ✅ Verificación

### 1. Desarrollo Local
```bash
npm run dev
# Abrir http://localhost:8888
```

### 2. Producción
```bash
npm run build
npm run deploy
```

## 🐛 Solución de Problemas

### Error: "Callback URL mismatch"
- Verificar URLs en Auth0 Dashboard
- Asegurar que coincidan exactamente

### Error: "Google OAuth not configured"
- Verificar credenciales en Google Cloud Console
- Asegurar que las APIs estén habilitadas

### Error: "Access denied"
- Verificar Action de Auth0
- Revisar emails/dominios permitidos
