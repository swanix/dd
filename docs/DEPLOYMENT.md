# 🚀 Guía de Deploy a Producción

## 📋 Prerrequisitos

- Repositorio configurado en GitHub/GitLab
- Cuenta en Netlify
- Configuración de Auth0 completada
- Variables de entorno preparadas

## 🌐 Deploy a Netlify

### **1. Conectar Repositorio**

1. Ve a [Netlify Dashboard](https://app.netlify.com/)
2. **New site from Git**
3. **Choose your Git provider** (GitHub, GitLab, Bitbucket)
4. **Select repository** (tu template)
5. **Configure build settings**:
   - **Build command**: `npm run build`
   - **Publish directory**: `.` (raíz del proyecto)
6. **Deploy site**

### **2. Configurar Variables de Entorno**

En **Site settings** → **Environment variables**:

```bash
# Auth0 Configuration
AUTH0_DOMAIN=tu-dominio.auth0.com
AUTH0_CLIENT_ID=tu-client-id

# URLs
NETLIFY_URL=https://tu-sitio.netlify.app
LOCAL_URL=http://localhost:8888

# APIs (opcional)
SHEETBEST_API_KEY=tu-api-key
```

### **3. Configurar Dominio Personalizado**

1. **Domain settings** → **Custom domains**
2. **Add custom domain**
3. **Enter domain**: `tu-dominio.com`
4. **Configure DNS** según instrucciones de Netlify

## 🔧 Configuración de Auth0 para Producción

### **1. Actualizar URLs en Auth0**

En **Applications** → **Settings**:

**Allowed Callback URLs:**
```
https://tu-dominio.com/,
https://tu-dominio.com/app/,
https://tu-dominio.com/forbidden.html
```

**Allowed Logout URLs:**
```
https://tu-dominio.com/login.html,
https://tu-dominio.com/forbidden.html
```

**Allowed Web Origins:**
```
https://tu-dominio.com
```

### **2. Configurar Google OAuth**

1. **Authentication** → **Social** → **Google**
2. **Authorized redirect URIs**:
   ```
   https://tu-dominio.auth0.com/login/callback
   ```

## 🔄 Deploy Automático

### **1. Configurar Webhooks**

Netlify se conecta automáticamente a tu repositorio y hace deploy en cada push.

### **2. Branch Deploy**

Para testing antes de producción:

1. **Site settings** → **Build & deploy**
2. **Branch deploy**: `develop` o `staging`
3. **Preview URLs** automáticas

### **3. Deploy Manual**

```bash
# Build local
npm run build

# Deploy a Netlify
npm run deploy
```

## 🔒 Configuración de Seguridad

### **1. Headers de Seguridad**

Verificar que `netlify.toml` incluya:

```toml
[[headers]]
  for = "/*"
  [headers.values]
    Content-Security-Policy = "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.auth0.com;"
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    X-XSS-Protection = "1; mode=block"
```

### **2. Rate Limiting**

Verificar que las funciones incluyan rate limiting:

```javascript
// netlify/functions/auth-protect.js
const { rateLimitMiddleware } = require('./rate-limiter');
exports.handler = rateLimitMiddleware(authHandler);
```

## 📊 Monitoreo y Analytics

### **1. Netlify Analytics**

1. **Site settings** → **Analytics**
2. **Enable analytics**
3. **View metrics** en dashboard

### **2. Auth0 Logs**

1. **Logs** → **Streams**
2. **Configure** para monitorear autenticación
3. **Set up alerts** para eventos críticos

### **3. Error Tracking**

```javascript
// Agregar en assets/js/auth.js
window.addEventListener('error', (event) => {
    // Enviar a servicio de tracking
    console.error('Error:', event.error);
});
```

## 🧪 Testing en Producción

### **1. Verificar Funcionalidad**

- [ ] Login con Google funciona
- [ ] Redirección después del login
- [ ] Contenido protegido se muestra
- [ ] Logout funciona correctamente
- [ ] Acceso denegado para usuarios no autorizados

### **2. Verificar Seguridad**

- [ ] Headers de seguridad presentes
- [ ] Rate limiting activo
- [ ] CORS configurado correctamente
- [ ] JWT tokens válidos

### **3. Verificar Performance**

- [ ] Tiempo de carga < 3 segundos
- [ ] Funciones serverless responden rápido
- [ ] Assets optimizados

## 🔄 Rollback y Recuperación

### **1. Deploy Anterior**

1. **Deploys** → **Select deploy**
2. **Publish deploy** para rollback

### **2. Variables de Entorno**

1. **Environment variables** → **Edit**
2. **Restore** valores anteriores

### **3. Auth0 Rollback**

1. **Actions** → **Select action**
2. **Deploy** versión anterior

## 📈 Optimización Post-Deploy

### **1. Performance**

```bash
# Verificar Lighthouse score
npm install -g lighthouse
lighthouse https://tu-dominio.com
```

### **2. SEO**

```html
<!-- Agregar meta tags -->
<meta name="description" content="Descripción de tu aplicación">
<meta name="keywords" content="palabras, clave, relevantes">
<meta property="og:title" content="Título de tu aplicación">
```

### **3. PWA (Progressive Web App)**

```json
// public/manifest.json
{
  "name": "Mi Aplicación",
  "short_name": "App",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#667eea"
}
```

## 🚨 Troubleshooting

### **Error: "Callback URL mismatch"**
- Verificar URLs en Auth0 Dashboard
- Asegurar que coincidan exactamente

### **Error: "Function not found"**
- Verificar que funciones estén en `netlify/functions/`
- Revisar logs en Netlify Functions

### **Error: "CORS error"**
- Verificar configuración de CORS en funciones
- Revisar headers de respuesta

### **Error: "Rate limit exceeded"**
- Ajustar configuración de rate limiting
- Revisar logs de requests

## 📋 Checklist de Deploy

- [ ] Repositorio conectado a Netlify
- [ ] Variables de entorno configuradas
- [ ] URLs de Auth0 actualizadas
- [ ] Dominio personalizado configurado
- [ ] Headers de seguridad verificados
- [ ] Rate limiting activo
- [ ] Testing completo realizado
- [ ] Analytics configurado
- [ ] Monitoreo activo
- [ ] Documentación actualizada
