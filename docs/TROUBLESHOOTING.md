# 🔧 Solución de Problemas

## 🚨 Errores Comunes

### **1. Error: "Callback URL mismatch"**

**Síntomas:**
- Error después del login con Google
- Redirección fallida
- Mensaje de error en Auth0

**Causas:**
- URLs no configuradas en Auth0 Dashboard
- URLs mal escritas
- Protocolo incorrecto (http vs https)

**Solución:**
1. Ir a [Auth0 Dashboard](https://manage.auth0.com/)
2. **Applications** → **Settings**
3. Verificar **Allowed Callback URLs**:
   ```
   http://localhost:8888/,
   http://localhost:8888/app/,
   https://tu-dominio.com/,
   https://tu-dominio.com/app/
   ```
4. Verificar **Allowed Web Origins**:
   ```
   http://localhost:8888,
   https://tu-dominio.com
   ```

### **2. Error: "jwt malformed"**

**Síntomas:**
- Error 401 en funciones de Netlify
- Token inválido
- Acceso denegado

**Causas:**
- Token expirado
- Token malformado
- Configuración incorrecta de Auth0

**Solución:**
1. Limpiar localStorage del navegador
2. Recargar página
3. Volver a autenticar
4. Verificar configuración de Auth0

### **3. Error: "CORS error"**

**Síntomas:**
- Error en consola del navegador
- Requests bloqueados
- Funciones no responden

**Causas:**
- Configuración CORS incorrecta
- URLs no permitidas
- Headers faltantes

**Solución:**
1. Verificar configuración CORS en `netlify/functions/auth-protect.js`
2. Asegurar que URLs estén en `allowedOrigins`
3. Verificar headers de respuesta

### **4. Error: "Rate limit exceeded"**

**Síntomas:**
- Error 429 (Too Many Requests)
- Funciones no responden
- Performance lenta

**Causas:**
- Demasiados requests simultáneos
- Rate limiting muy restrictivo
- Ataque de spam

**Solución:**
1. Esperar unos minutos
2. Ajustar configuración de rate limiting
3. Verificar logs de requests

## 🔍 Debugging

### **1. Verificar Variables de Entorno**

```bash
# Verificar .env.local
cat .env.local

# Verificar variables en Netlify
netlify env:list
```

### **2. Verificar Logs de Netlify**

```bash
# Ver logs de funciones
netlify functions:invoke auth-protect --no-identity

# Ver logs del sitio
netlify logs
```

### **3. Verificar Configuración de Auth0**

```javascript
// En consola del navegador
console.log('Auth0 Config:', window.AUTH0_CONFIG);
console.log('User:', await auth0.getUser());
```

### **4. Verificar Tokens JWT**

```javascript
// Decodificar token (solo para debug)
const token = await auth0.getIdTokenClaims();
console.log('Token claims:', token);
```

## 🛠️ Herramientas de Debug

### **1. Netlify CLI**

```bash
# Instalar
npm install -g netlify-cli

# Login
netlify login

# Ver información del sitio
netlify status

# Ver logs en tiempo real
netlify logs --tail
```

### **2. Auth0 Debugger**

1. Ir a [Auth0 Debugger](https://jwt.io/)
2. Pegar token JWT
3. Verificar claims y firma

### **3. Browser DevTools**

```javascript
// En consola del navegador
// Verificar localStorage
console.log('localStorage:', localStorage);

// Verificar sessionStorage
console.log('sessionStorage:', sessionStorage);

// Verificar cookies
console.log('cookies:', document.cookie);
```

## 🔧 Problemas de Desarrollo Local

### **1. Puerto ocupado**

**Error:** `EADDRINUSE: address already in use`

**Solución:**
```bash
# Matar proceso en puerto 8888
lsof -ti:8888 | xargs kill -9

# O cambiar puerto en netlify.toml
[dev]
  port = 8889
```

### **2. Variables de entorno no cargan**

**Error:** Variables undefined

**Solución:**
```bash
# Verificar archivo .env.local
ls -la .env.local

# Regenerar configuración
npm run build:dev
```

### **3. Funciones no cargan**

**Error:** Function not found

**Solución:**
```bash
# Reiniciar servidor de desarrollo
npm run dev

# Verificar estructura de archivos
ls -la netlify/functions/
```

## 🌐 Problemas de Producción

### **1. Deploy fallido**

**Síntomas:**
- Build error
- Deploy no completa
- Sitio no funciona

**Solución:**
1. Verificar logs de build en Netlify
2. Verificar variables de entorno
3. Verificar configuración de build

### **2. Dominio no funciona**

**Síntomas:**
- DNS error
- Página no carga
- SSL error

**Solución:**
1. Verificar configuración DNS
2. Verificar certificado SSL
3. Verificar configuración de dominio en Netlify

### **3. Performance lenta**

**Síntomas:**
- Tiempo de carga alto
- Funciones lentas
- Timeout errors

**Solución:**
1. Optimizar imágenes
2. Minificar CSS/JS
3. Implementar caching
4. Optimizar funciones serverless

## 🔒 Problemas de Seguridad

### **1. Headers de seguridad faltantes**

**Verificar:**
```bash
# Verificar headers
curl -I https://tu-dominio.com

# Debería incluir:
# X-Frame-Options: DENY
# X-Content-Type-Options: nosniff
# X-XSS-Protection: 1; mode=block
```

### **2. Rate limiting no funciona**

**Verificar:**
```javascript
// En netlify/functions/auth-protect.js
const { rateLimitMiddleware } = require('./rate-limiter');
exports.handler = rateLimitMiddleware(authHandler);
```

### **3. CORS mal configurado**

**Verificar:**
```javascript
// En funciones de Netlify
const allowedOrigins = [
  'http://localhost:8888',
  'https://tu-dominio.com'
];
```

## 📊 Monitoreo y Alertas

### **1. Configurar Alertas de Auth0**

1. **Logs** → **Streams**
2. **Create Stream**
3. **Configure alerts** para:
   - Failed logins
   - Rate limit exceeded
   - Suspicious activity

### **2. Configurar Alertas de Netlify**

1. **Site settings** → **Notifications**
2. **Configure** para:
   - Deploy failures
   - Function errors
   - Performance issues

### **3. Logs de Error**

```javascript
// Agregar en assets/js/auth.js
window.addEventListener('error', (event) => {
    // Enviar a servicio de logging
    console.error('Error:', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error
    });
});
```

## 🆘 Contacto y Soporte

### **1. Recursos Útiles**

- [Auth0 Documentation](https://auth0.com/docs)
- [Netlify Documentation](https://docs.netlify.com/)
- [JWT.io Debugger](https://jwt.io/)

### **2. Comunidades**

- [Auth0 Community](https://community.auth0.com/)
- [Netlify Community](https://community.netlify.com/)
- [Stack Overflow](https://stackoverflow.com/)

### **3. Logs y Debugging**

```bash
# Comando completo para debugging
npm run dev 2>&1 | tee debug.log
```

## 📋 Checklist de Troubleshooting

- [ ] Verificar variables de entorno
- [ ] Verificar configuración de Auth0
- [ ] Verificar logs de Netlify
- [ ] Verificar CORS
- [ ] Verificar rate limiting
- [ ] Verificar headers de seguridad
- [ ] Verificar DNS y SSL
- [ ] Verificar performance
- [ ] Configurar alertas
- [ ] Documentar solución
