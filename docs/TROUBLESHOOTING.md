# 🚨 Solución de Problemas - Swanix Wall

## 📋 Descripción

Esta guía te ayudará a resolver problemas comunes que pueden surgir al usar Swanix Wall.

## 🔐 Problemas de Autenticación

### Error: "Callback URL mismatch"

**Síntomas:**
- Error al intentar hacer login
- Mensaje "Callback URL mismatch" en Auth0

**Solución:**
1. Verificar URLs en Auth0 Dashboard:
   - **Applications** → **Settings** → **Allowed Callback URLs**
   - Asegurar que coincidan exactamente con tu dominio

2. URLs típicas para agregar:
   ```
   http://localhost:8888/,
   http://localhost:8888/app/,
   https://tu-sitio.netlify.app/,
   https://tu-sitio.netlify.app/app/
   ```

3. Verificar que no haya espacios extra o caracteres especiales

### Error: "Invalid client"

**Síntomas:**
- Error "Invalid client" al intentar autenticación
- La aplicación no puede conectarse a Auth0

**Solución:**
1. Verificar variables de entorno:
   ```env
   AUTH0_DOMAIN=tu-dominio.auth0.com
   AUTH0_CLIENT_ID=tu-client-id
   ```

2. Verificar que el Client ID sea correcto en Auth0 Dashboard

3. Asegurar que la aplicación esté configurada como "Single Page Application"

### Error: "Access denied"

**Síntomas:**
- Usuario autenticado pero acceso denegado
- Redirección a página de forbidden

**Solución:**
1. Verificar Action de Auth0:
   - **Auth Pipeline** → **Actions**
   - Revisar reglas de restricción

2. Verificar emails/dominios permitidos:
   ```javascript
   // Ejemplo de Action
   const allowedDomains = ['@tuempresa.com'];
   const userEmail = event.user.email;
   
   if (!allowedDomains.some(domain => userEmail.endsWith(domain))) {
       api.access.deny('Dominio no autorizado');
   }
   ```

3. Verificar logs en Auth0 Dashboard

## 🌐 Problemas de Red y CORS

### Error: "CORS policy"

**Síntomas:**
- Error de CORS en la consola del navegador
- Requests bloqueados por política de CORS

**Solución:**
1. Verificar configuración de CORS en funciones Netlify:
   ```javascript
   return {
       statusCode: 200,
       headers: {
           'Access-Control-Allow-Origin': '*',
           'Access-Control-Allow-Headers': 'Content-Type, Authorization',
           'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
       },
       body: JSON.stringify(data)
   };
   ```

2. Verificar URLs permitidas en Auth0:
   - **Allowed Web Origins**
   - **Allowed Callback URLs**

3. Verificar configuración de Netlify:
   - Headers de seguridad en `netlify.toml`

### Error: "Network error"

**Síntomas:**
- Errores de red al cargar la aplicación
- Timeouts en requests

**Solución:**
1. Verificar conectividad de red
2. Verificar que las funciones Netlify estén funcionando:
   ```bash
   netlify functions:list
   netlify functions:invoke auth-protect
   ```

3. Verificar logs de Netlify:
   ```bash
   netlify logs --site=tu-sitio-id
   ```

## 🔧 Problemas de Configuración

### Error: "Environment variables not found"

**Síntomas:**
- Variables de entorno no disponibles
- Configuración faltante

**Solución:**
1. Verificar archivo `.env` local:
   ```bash
   cp env.example .env
   # Editar .env con tus credenciales
   ```

2. Verificar variables en Netlify:
   - **Site settings** → **Environment variables**
   - Agregar todas las variables necesarias

3. Variables requeridas:
   ```env
   AUTH0_DOMAIN=tu-dominio.auth0.com
   AUTH0_CLIENT_ID=tu-client-id
   AUTH0_CLIENT_SECRET=tu-client-secret
   AUTH0_AUDIENCE=tu-audience
   ```

### Error: "Function not found"

**Síntomas:**
- Error 404 al acceder a funciones Netlify
- Funciones no disponibles

**Solución:**
1. Verificar estructura de archivos:
   ```
   netlify/
   └── functions/
       ├── auth-protect.js
       └── protect-html.js
   ```

2. Verificar que las funciones estén en el directorio correcto

3. Verificar configuración en `netlify.toml`:
   ```toml
   [functions]
     directory = "netlify/functions"
   ```

## 🚀 Problemas de Despliegue

### Error: "Build failed"

**Síntomas:**
- Build fallido en Netlify
- Errores de compilación

**Solución:**
1. Verificar logs de build en Netlify Dashboard

2. Probar build local:
   ```bash
   npm run build
   ```

3. Verificar dependencias:
   ```bash
   npm install
   npm audit fix
   ```

4. Verificar configuración de build en Netlify:
   - **Build command**: `npm run build` (o vacío)
   - **Publish directory**: `.`

### Error: "Page not found"

**Síntomas:**
- Páginas no encontradas después del despliegue
- Rutas que no funcionan

**Solución:**
1. Verificar configuración de redirecciones en `netlify.toml`:
   ```toml
   [[redirects]]
     from = "/app/*"
     to = "/.netlify/functions/protect-html"
     status = 200
     force = true
   ```

2. Verificar que los archivos estén en el directorio correcto

3. Verificar configuración de publish directory en Netlify

## 🔒 Problemas de Seguridad

### Error: "Rate limit exceeded"

**Síntomas:**
- Demasiadas requests en poco tiempo
- Usuario bloqueado temporalmente

**Solución:**
1. Verificar configuración de rate limiting:
   ```javascript
   const rateLimit = {
       windowMs: 15 * 60 * 1000, // 15 minutos
       max: 100 // máximo 100 requests por ventana
   };
   ```

2. Ajustar límites según necesidades:
   - Aumentar `max` para más requests
   - Aumentar `windowMs` para ventana más larga

3. Verificar si hay bots o scripts haciendo requests excesivos

### Error: "Invalid token"

**Síntomas:**
- Tokens JWT inválidos
- Sesiones expiradas

**Solución:**
1. Verificar configuración de Auth0:
   - **Applications** → **Settings** → **Token Endpoint Authentication Method**
   - Asegurar que sea "Post"

2. Verificar expiración de tokens:
   ```javascript
   const config = {
       cacheExpirationInSeconds: 3600, // 1 hora
       useRefreshTokens: true
   };
   ```

3. Verificar que el usuario esté autenticado:
   ```javascript
   const isAuthenticated = await auth0.isAuthenticated();
   if (!isAuthenticated) {
       // Redirigir a login
   }
   ```

## 📱 Problemas de Responsive

### Error: "Layout broken on mobile"

**Síntomas:**
- Layout roto en dispositivos móviles
- Elementos fuera de lugar

**Solución:**
1. Verificar CSS responsive en `assets/css/main.css`:
   ```css
   @media (max-width: 768px) {
       .app-container {
           flex-direction: column;
       }
       
       .sidebar {
           width: 100%;
           height: auto;
       }
   }
   ```

2. Verificar viewport meta tag:
   ```html
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   ```

3. Probar en diferentes dispositivos y navegadores

## 🔍 Debugging

### Habilitar Logs Detallados

1. En desarrollo local:
   ```javascript
   // En assets/js/auth.js
   const config = {
       domain: process.env.AUTH0_DOMAIN,
       clientId: process.env.AUTH0_CLIENT_ID,
       debug: true // Habilitar logs detallados
   };
   ```

2. En Netlify Functions:
   ```javascript
   console.log('Debug info:', {
       event: event,
       user: user,
       timestamp: new Date().toISOString()
   });
   ```

### Verificar Estado de la Aplicación

1. Verificar autenticación:
   ```javascript
   console.log('Auth state:', await auth0.isAuthenticated());
   console.log('User:', await auth0.getUser());
   ```

2. Verificar tokens:
   ```javascript
   const token = await auth0.getTokenSilently();
   console.log('Token valid:', !!token);
   ```

### Herramientas de Debug

1. **Netlify CLI**:
   ```bash
   npm install -g netlify-cli
   netlify dev
   ```

2. **Auth0 Debug**:
   - Habilitar debug en configuración de Auth0
   - Revisar logs en Auth0 Dashboard

3. **Browser DevTools**:
   - Console para errores JavaScript
   - Network para requests HTTP
   - Application para localStorage/sessionStorage

## 📞 Obtener Ayuda

### Información Necesaria

Al reportar un problema, incluir:

1. **Descripción del problema**
2. **Pasos para reproducir**
3. **Configuración actual**:
   - Variables de entorno (sin valores sensibles)
   - Configuración de Auth0
   - Versión de Node.js
   - Navegador y versión

4. **Logs de error**:
   - Console del navegador
   - Logs de Netlify
   - Logs de Auth0

### Canales de Soporte

- 📧 **Email**: soporte@swanix.com
- 📖 **Documentación**: [docs/](docs/)
- 🐛 **GitHub Issues**: [Issues](https://github.com/tu-usuario/swanix-wall/issues)
- 💬 **Auth0 Support**: [support.auth0.com](https://support.auth0.com)
- 💬 **Netlify Support**: [support.netlify.com](https://support.netlify.com)

### Recursos Adicionales

- [Auth0 Documentation](https://auth0.com/docs)
- [Netlify Documentation](https://docs.netlify.com)
- [Swanix Wall Documentation](docs/)
