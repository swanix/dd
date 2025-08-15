# 🔒 Contenido Protegido con Auth0 y Netlify Functions

Este proyecto demuestra cómo proteger contenido HTML estático usando **Auth0** para autenticación y **Netlify Functions** como middleware de autorización.

## ✅ Funcionalidad Implementada

### 🔐 Autenticación Completa
- **Login/Logout** con Auth0 SPA
- **Redirección automática** después del login
- **Manejo de tokens** (ID tokens para verificación)
- **Persistencia de sesión** con localStorage
- **Manejo de errores** robusto
- **Página de login dedicada** con UI moderna
- **Sistema de redirección inteligente** basado en estado de autenticación

### 🛡️ Protección de Contenido
- **Contenido dinámico** que solo se muestra a usuarios autenticados
- **Información del usuario** (nombre, email, ID, verificación)
- **Datos del servidor** obtenidos desde Netlify Functions
- **Verificación de JWT** en el backend

### 🎨 Interfaz de Usuario
- **Diseño moderno** y responsive
- **Estados visuales** claros (autenticado/no autenticado)
- **Mensajes de estado** informativos
- **Botones de acción** intuitivos
- **Layout completo** con sidebar, topbar y área de contenido
- **Página de login dedicada** con formulario y características de seguridad
- **Foto de perfil** automática desde Google/Auth0
- **Menú de usuario** con información completa del perfil

### ⚙️ Backend Serverless
- **Netlify Functions** para verificación de tokens
- **CORS configurado** correctamente
- **Manejo de errores** detallado
- **Respuestas estructuradas** JSON

### 🔧 Herramientas de Configuración
- **Script automatizado** para cambiar entre entornos
- **Configuración flexible** para desarrollo y producción
- **Gestión de URLs** automática para Auth0

## 🚀 Estado Actual: FUNCIONANDO EN PRODUCCIÓN

**✅ PROYECTO COMPLETAMENTE OPERATIVO**
- **Autenticación**: ✅ Funcionando (local y producción)
- **Protección de contenido**: ✅ Implementada
- **Backend**: ✅ Operativo
- **Interfaz**: ✅ Funcional
- **Manejo de errores**: ✅ Robusto
- **Despliegue**: ✅ Funcionando en Netlify

## 📁 Estructura de Archivos

```
dd/
├── index.html              # Página de redirección principal
├── login.html              # Página de login (pública)
├── app/                    # Aplicación protegida
│   ├── index.html          # Dashboard principal
│   ├── dashboard.html      # Dashboard de métricas
│   └── README.md           # Guía para agregar nuevas páginas
├── components/             # Componentes reutilizables (futuro)
├── assets/                 # Recursos estáticos (futuro)
│   ├── css/
│   ├── js/
│   └── img/
├── auth-protect.js         # Función de verificación de tokens (Netlify Function)
├── update-urls.js          # Script para cambiar entre entornos
├── package.json            # Dependencias del proyecto
├── netlify.toml           # Configuración de Netlify
├── .gitignore             # Archivos ignorados por Git
└── README.md              # Este archivo
```

## 🛠️ Configuración Actual

### Auth0 Configurado
- **Domain**: `dev-7kj3jxtxwwirocri.us.auth0.com`
- **Client ID**: `BORj4AB79Rho5yP5uSavuP4sern8pemZ`
- **Tipo**: Single Page Application (SPA)
- **URLs permitidas**:
  - **Desarrollo**: `http://localhost:8888`
  - **Producción**: `https://swanixdd.netlify.app`

### Netlify Functions
- **Función**: `auth-protect.js` (en la raíz del proyecto)
- **Verificación**: JWT tokens de Auth0
- **CORS**: Configurado para desarrollo local y producción
- **Estructura**: Función única y limpia en la raíz

### URLs Configuradas en Auth0
```
Allowed Callback URLs:
http://localhost:8888/app/, https://swanixdd.netlify.app/app/

Allowed Logout URLs:
http://localhost:8888/login.html, https://swanixdd.netlify.app/login.html

Allowed Web Origins:
http://localhost:8888, https://swanixdd.netlify.app
```

## 🧪 Cómo Probar

### Desarrollo Local
```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Abrir en navegador
http://localhost:8888
```

### Producción
```bash
# Desplegar a Netlify
git add .
git commit -m "Actualización"
git push

# Acceder a la aplicación
https://swanixdd.netlify.app
```

### Flujo de Prueba
1. **Abrir** la URL correspondiente
2. **Verificar redirección** automática a login o app
3. **Hacer clic** en "🔑 Iniciar Sesión con Auth0"
4. **Completar** el flujo de Auth0
5. **Verificar** que aparece el contenido protegido
6. **Revisar** la información del usuario y datos del servidor

## 🔧 Scripts de Configuración

### Cambiar entre Entornos
```bash
# Para desarrollo local
node update-urls.js development

# Para producción
node update-urls.js production
```

### Actualizar Configuración de Auth0
```bash
# Usar el script de actualización de URLs
node update-urls.js production
```

## 🎯 Funcionalidades por Página

### `index.html` - Página de Redirección
- **Propósito**: Verificar estado de autenticación y redirigir
- **Comportamiento**: 
  - Si autenticado → redirige a `/app/`
  - Si no autenticado → redirige a `/login.html`
- **Características**: Loading spinner y manejo de errores

### `login.html` - Página de Login (Pública)
- **Propósito**: Interfaz de autenticación dedicada
- **Características**:
  - Formulario de login (deshabilitado, solo Auth0)
  - Botón prominente de Auth0
  - Lista de características de seguridad
  - Redirección automática si ya autenticado

### `app/index.html` - Dashboard Principal
- **Propósito**: Contenido protegido y funcionalidad principal
- **Características**:
  - Layout completo con sidebar y topbar
  - Información del usuario autenticado
  - Datos del servidor obtenidos via Netlify Functions
  - Botón de logout funcional

### `app/dashboard.html` - Dashboard de Métricas
- **Propósito**: Vista de estadísticas y métricas
- **Características**:
  - Cards con métricas visuales
  - Estado detallado de autenticación
  - Navegación entre páginas
  - Datos de ejemplo para demostración

## 🔒 Seguridad y Variables de Entorno

### Variables de Entorno
- **NUNCA subir** archivos `.env*` al repositorio
- **Usar** `env.example` como plantilla
- **Configurar** variables en Netlify para producción

### Archivos Sensibles
- ✅ `.env.local` - Ignorado por Git
- ✅ `.env` - Ignorado por Git
- ✅ `node_modules/` - Ignorado por Git
- ✅ `.netlify/` - Ignorado por Git

## 🐛 Solución de Problemas

### Error: "Callback URL mismatch"
- **Causa**: URLs no configuradas en Auth0
- **Solución**: Verificar configuración de URLs en dashboard de Auth0

### Error: "jwt malformed"
- **Causa**: Token incorrecto o expirado
- **Solución**: Recargar página y volver a autenticar

### Error: "Service not found"
- **Causa**: Audience configurado incorrectamente
- **Solución**: Remover audience o configurar API en Auth0

### Error: "CORS error"
- **Causa**: URLs no permitidas en Auth0
- **Solución**: Verificar configuración de URLs en dashboard

## 📚 Recursos Adicionales

- [Auth0 SPA SDK Documentation](https://auth0.com/docs/libraries/auth0-spa-js)
- [Netlify Functions Documentation](https://docs.netlify.com/functions/overview/)
- [JWT.io](https://jwt.io/) - Para debuggear tokens JWT
- [Auth0 Dashboard](https://manage.auth0.com/) - Configuración de aplicación

## 🚀 Próximos Pasos (Opcionales)

### Mejoras de Seguridad
- **Implementar roles** y permisos específicos
- **Agregar rate limiting**
- **Configurar CSP headers**
- **Implementar refresh tokens**

### Funcionalidades Adicionales
- **Contenido dinámico** desde APIs externas
- **Almacenamiento** de preferencias de usuario
- **Notificaciones** push
- **Múltiples idiomas**
- **Temas personalizables**

### Optimizaciones
- **Lazy loading** de componentes
- **Caching** de datos del usuario
- **Progressive Web App** (PWA)
- **Analytics** de uso

## 🤝 Contribuir

1. **Fork** el repositorio
2. **Crear** una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. **Commit** tus cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. **Push** a la rama (`git push origin feature/nueva-funcionalidad`)
5. **Crear** un Pull Request

## 📝 Historial de Cambios

### v2.0.0 - Estructura de Páginas Dedicadas
- ✅ Renombrado `dashboard.html` → `app.html` (más genérico)
- ✅ Creado `login.html` como página de login dedicada
- ✅ Creado `index.html` como página de redirección
- ✅ Script `update-urls.js` para gestión de entornos
- ✅ Configuración completa para producción

### v1.0.0 - Implementación Base
- ✅ Autenticación con Auth0 SPA
- ✅ Protección de contenido con Netlify Functions
- ✅ Interfaz moderna con sidebar y topbar
- ✅ Manejo robusto de errores

## 🎯 Logros del Proyecto

✅ **Autenticación completa con Auth0**
✅ **Protección de contenido HTML estático**
✅ **Backend serverless con Netlify Functions**
✅ **Interfaz moderna y responsive**
✅ **Manejo robusto de errores**
✅ **Documentación completa**
✅ **Scripts de configuración automatizados**
✅ **Funcionamiento en desarrollo y producción**
✅ **Estructura reutilizable para otros proyectos**

**¡Proyecto listo para producción y reutilización! 🚀**

---

**Nota**: El proyecto anterior se encuentra en la carpeta `archive/` con toda la documentación y código de referencia.
