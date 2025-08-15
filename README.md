# 🔒 Contenido Protegido con Auth0 y Netlify Functions

Este proyecto demuestra cómo proteger contenido HTML estático usando **Auth0** para autenticación y **Netlify Functions** como middleware de autorización.

## ✅ Funcionalidad Implementada

### 🔐 Autenticación Completa
- **Login/Logout** con Auth0 SPA
- **Redirección automática** después del login
- **Manejo de tokens** (ID tokens para verificación)
- **Persistencia de sesión** con localStorage
- **Manejo de errores** robusto

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

### ⚙️ Backend Serverless
- **Netlify Functions** para verificación de tokens
- **CORS configurado** correctamente
- **Manejo de errores** detallado
- **Respuestas estructuradas** JSON

## 📁 Estructura del Proyecto

```
dd/
├── index.html              # ✅ Página principal con Auth0
├── netlify/
│   └── functions/
│       └── auth-protect.js # ✅ Función para verificar tokens
├── package.json            # ✅ Dependencias del proyecto
├── netlify.toml           # ✅ Configuración de Netlify
├── config.example.js      # ✅ Ejemplo de configuración
├── update-config.js       # ✅ Script para actualizar configuración
├── archive/               # 📦 Proyecto anterior archivado
└── README.md              # 📖 Este archivo
```

## 🚀 Estado Actual: FUNCIONANDO

**✅ PROYECTO COMPLETAMENTE OPERATIVO**

- **Autenticación**: ✅ Funcionando
- **Protección de contenido**: ✅ Implementada
- **Backend**: ✅ Operativo
- **Interfaz**: ✅ Funcional
- **Manejo de errores**: ✅ Robusto

## 🛠️ Configuración Actual

### Auth0 Configurado
- **Domain**: `dev-7kj3jxtxwwirocri.us.auth0.com`
- **Client ID**: `BORj4AB79Rho5yP5uSavuP4sern8pemZ`
- **Tipo**: Single Page Application (SPA)
- **URLs permitidas**: `http://localhost:8888`

### Netlify Functions
- **Función**: `auth-protect.js`
- **Verificación**: JWT tokens de Auth0
- **CORS**: Configurado para desarrollo local

## 🧪 Cómo Probar

### Desarrollo Local
```bash
# Instalar dependencias
npm install

# Configurar variables de entorno (opcional)
cp env.example .env.local
# Editar .env.local con tus valores si es necesario

# Iniciar servidor de desarrollo
npm run dev

# Abrir en navegador
http://localhost:8888
```

### Flujo de Prueba
1. **Abrir** http://localhost:8888
2. **Hacer clic** en "🔑 Iniciar Sesión"
3. **Completar** el flujo de Auth0
4. **Verificar** que aparece el contenido protegido
5. **Revisar** la información del usuario y datos del servidor

## 🔧 Personalización

### Cambiar Configuración de Auth0
```bash
# Usar el script de actualización
node update-config.js TU_DOMINIO TU_CLIENT_ID
```

### Agregar Más Contenido Protegido
1. **Crear nuevas funciones** en `netlify/functions/`
2. **Agregar rutas protegidas** en el frontend
3. **Implementar diferentes niveles de acceso**

### Modificar el Diseño
- **CSS**: Incluido en `index.html`
- **Colores**: Modificar variables CSS
- **Layout**: Ajustar estructura HTML

## 🔒 Seguridad y Variables de Entorno

### Variables de Entorno
- **NUNCA subir** archivos `.env*` al repositorio
- **Usar** `env.example` como plantilla
- **Configurar** variables en Netlify para producción

### Archivos Sensibles
- ✅ `.env.local` - Ignorado por Git
- ✅ `.env` - Ignorado por Git  
- ✅ `config.js` - Contiene configuración actual
- ✅ `node_modules/` - Ignorado por Git

## 🐛 Solución de Problemas

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

- [Documentación de Auth0](https://auth0.com/docs)
- [Netlify Functions](https://docs.netlify.com/functions/overview/)
- [JWT.io](https://jwt.io/) - Para debuggear tokens

## 🚀 Próximos Pasos (Opcionales)

### Despliegue en Producción
1. **Conectar repositorio** a Netlify
2. **Configurar variables de entorno**
3. **Actualizar URLs** en Auth0
4. **Desplegar** con `npm run deploy`

### Mejoras de Seguridad
- **Implementar roles** y permisos específicos
- **Agregar rate limiting**
- **Configurar CSP headers**

### Funcionalidades Adicionales
- **Contenido dinámico** desde APIs externas
- **Almacenamiento** de preferencias de usuario
- **Notificaciones** push
- **Múltiples idiomas**

## 🤝 Contribuir

1. Fork el proyecto
2. Crear una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abrir un Pull Request

## 📄 Licencia

MIT License - ver archivo LICENSE para detalles.

---

**Nota**: El proyecto anterior se encuentra en la carpeta `archive/` con toda la documentación y código de referencia.

## 🎯 Logros del Proyecto

✅ **Autenticación completa con Auth0**  
✅ **Protección de contenido HTML estático**  
✅ **Backend serverless con Netlify Functions**  
✅ **Interfaz moderna y responsive**  
✅ **Manejo robusto de errores**  
✅ **Documentación completa**  
✅ **Scripts de configuración automatizados**  

**¡Proyecto listo para producción! 🚀**
