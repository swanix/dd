# 🚀 Guía de Despliegue - Swanix Wall

## 📋 Descripción

Esta guía te ayudará a desplegar Swanix Wall en diferentes entornos, desde desarrollo local hasta producción en Netlify.

## 🏠 Desarrollo Local

### Prerrequisitos

- Node.js 16+ instalado
- Git configurado
- Cuenta en Auth0 configurada

### 1. Clonar el Repositorio

```bash
git clone https://github.com/tu-usuario/swanix-wall.git
cd swanix-wall
```

### 2. Instalar Dependencias

```bash
npm install
```

### 3. Configurar Variables de Entorno

```bash
cp env.example .env
```

Editar `.env` con tus credenciales:

```env
# Auth0 Configuration
AUTH0_DOMAIN=tu-dominio.auth0.com
AUTH0_CLIENT_ID=tu-client-id
AUTH0_CLIENT_SECRET=tu-client-secret
AUTH0_AUDIENCE=tu-audience

# Google OAuth (opcional)
GOOGLE_CLIENT_ID=tu-google-client-id
GOOGLE_CLIENT_SECRET=tu-google-client-secret

# URLs
LOCAL_URL=http://localhost:8888
```

### 4. Ejecutar Servidor Local

```bash
npm run dev
```

### 5. Acceder a la Aplicación

- **URL principal**: `http://localhost:8888`
- **Login**: `http://localhost:8888/login.html`
- **Página protegida**: `http://localhost:8888/app/`

## 🌐 Despliegue en Netlify

### 1. Preparar el Repositorio

Asegúrate de que tu repositorio esté listo:

```bash
# Verificar que todo esté committeado
git status
git add .
git commit -m "Preparar para despliegue"
git push origin main
```

### 2. Conectar a Netlify

1. Ve a [Netlify](https://netlify.com/)
2. **New site from Git**
3. Conectar tu repositorio de GitHub
4. Configurar build settings:
   - **Build command**: `npm run build` (o dejar vacío)
   - **Publish directory**: `.` (raíz del proyecto)

### 3. Configurar Variables de Entorno

En **Site settings** → **Environment variables**:

```env
AUTH0_DOMAIN=tu-dominio.auth0.com
AUTH0_CLIENT_ID=tu-client-id
AUTH0_CLIENT_SECRET=tu-client-secret
AUTH0_AUDIENCE=tu-audience
GOOGLE_CLIENT_ID=tu-google-client-id
GOOGLE_CLIENT_SECRET=tu-google-client-secret
```

### 4. Configurar Auth0

Actualizar URLs en Auth0 Dashboard:

**Allowed Callback URLs:**
```
https://tu-sitio.netlify.app/,
https://tu-sitio.netlify.app/app/,
https://tu-sitio.netlify.app/forbidden.html
```

**Allowed Logout URLs:**
```
https://tu-sitio.netlify.app/login.html,
https://tu-sitio.netlify.app/forbidden.html
```

**Allowed Web Origins:**
```
https://tu-sitio.netlify.app
```

### 5. Verificar Despliegue

1. **Build logs**: Revisar que el build sea exitoso
2. **Funciones**: Verificar que las Netlify Functions estén funcionando
3. **Autenticación**: Probar el flujo de login/logout
4. **Protección**: Verificar que las páginas protegidas funcionen

## 🔧 Configuración de Dominio Personalizado

### 1. Agregar Dominio en Netlify

1. **Domain management** → **Add custom domain**
2. Ingresar tu dominio: `app.tuempresa.com`
3. Configurar DNS según las instrucciones de Netlify

### 2. Configurar SSL

Netlify proporciona SSL automático, pero puedes configurar:

1. **Domain management** → **HTTPS**
2. **Verify DNS configuration**
3. **Force HTTPS** (recomendado)

### 3. Actualizar Auth0

Actualizar URLs en Auth0 con el nuevo dominio:

**Allowed Callback URLs:**
```
https://app.tuempresa.com/,
https://app.tuempresa.com/app/,
https://app.tuempresa.com/forbidden.html
```

**Allowed Logout URLs:**
```
https://app.tuempresa.com/login.html,
https://app.tuempresa.com/forbidden.html
```

**Allowed Web Origins:**
```
https://app.tuempresa.com
```

## 🔒 Configuración de Seguridad

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

### Rate Limiting

Configurar en `netlify/utils/rate-limiter.js`:

```javascript
const rateLimit = {
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // máximo 100 requests por ventana
    message: {
        error: 'Demasiadas requests, intenta más tarde'
    }
};
```

### Logs de Acceso

Habilitar logs en Netlify:

1. **Site settings** → **Functions**
2. **Function logs** → **Enable**
3. Configurar alertas si es necesario

## 📊 Monitoreo y Analytics

### 1. Netlify Analytics

1. **Site settings** → **Analytics**
2. **Enable analytics**
3. Revisar métricas de rendimiento

### 2. Auth0 Logs

1. **Logs** → **Streams**
2. Configurar webhook para logs
3. Monitorear intentos de acceso

### 3. Custom Logging

Agregar logging personalizado en funciones:

```javascript
// En netlify/functions/auth-protect.js
const logAccess = (user, action, success) => {
    console.log(JSON.stringify({
        timestamp: new Date().toISOString(),
        user: user?.email || 'anonymous',
        action: action,
        success: success,
        ip: event.headers['client-ip']
    }));
};
```

## 🔄 Actualizaciones y Mantenimiento

### 1. Actualizar Dependencias

```bash
# Verificar dependencias desactualizadas
npm outdated

# Actualizar dependencias
npm update

# Actualizar dependencias mayores
npm audit fix
```

### 2. Despliegue Automático

Configurar GitHub Actions para despliegue automático:

```yaml
# .github/workflows/deploy.yml
name: Deploy to Netlify
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Netlify
        uses: nwtgck/actions-netlify@v1.2
        with:
          publish-dir: '.'
          production-branch: main
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

### 3. Backup y Recuperación

1. **Backup de configuración**:
   - Variables de entorno
   - Configuración de Auth0
   - Archivos de configuración

2. **Recuperación**:
   - Restaurar variables de entorno
   - Verificar configuración de Auth0
   - Probar funcionalidad

## 🚨 Solución de Problemas

### Error de Build

```bash
# Verificar logs de build
netlify logs --site=tu-sitio-id

# Build local para debug
npm run build
```

### Error de Autenticación

1. Verificar variables de entorno
2. Revisar configuración de Auth0
3. Comprobar URLs de callback
4. Verificar CORS settings

### Error de Funciones Netlify

```bash
# Verificar logs de funciones
netlify functions:list
netlify functions:invoke auth-protect

# Debug local
netlify dev
```

### Error de CORS

1. Verificar URLs permitidas en Auth0
2. Revisar configuración de Netlify
3. Comprobar headers de respuesta

## 📈 Optimización de Rendimiento

### 1. Compresión

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

### 2. Caché

```toml
[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000"
```

### 3. CDN

Netlify proporciona CDN automático, pero puedes configurar:

1. **Site settings** → **Build & deploy**
2. **Asset optimization**
3. **Enable asset optimization**

## 📞 Soporte

Para ayuda con despliegue:
- 📧 Email: soporte@swanix.com
- 📖 Documentación: [docs/](docs/)
- 🐛 Issues: [GitHub Issues](https://github.com/tu-usuario/swanix-wall/issues)
- 💬 Netlify Support: [support.netlify.com](https://support.netlify.com)
