# 🔐 Aplicación Segura con Auth0, Netlify y SheetBest

Una aplicación web que muestra un diagrama interactivo de la estructura de Alegra, protegida con autenticación Auth0 y datos seguros de SheetBest.

## 📋 Tabla de Contenidos

- [Descripción](#-descripción)
- [Arquitectura](#-arquitectura)
- [Tecnologías Utilizadas](#-tecnologías-utilizadas)
- [Configuración](#-configuración)
- [Instalación](#-instalación)
- [Desarrollo Local](#-desarrollo-local)
- [Despliegue](#-despliegue)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [API y Endpoints](#-api-y-endpoints)
- [Seguridad](#-seguridad)
- [Solución de Problemas](#-solución-de-problemas)
- [Contribución](#-contribución)

## 🎯 Descripción

Esta aplicación implementa una solución completa de seguridad para mostrar datos protegidos de SheetBest a través de un diagrama interactivo. La aplicación utiliza:

- **Auth0** para autenticación de usuarios
- **Netlify Functions** como proxy backend seguro
- **SheetBest** como fuente de datos protegida
- **xDiagrams** para visualización interactiva

### Características Principales

- ✅ Autenticación segura con Auth0
- ✅ Proxy backend con Netlify Functions
- ✅ API key protegida en el servidor
- ✅ Interfaz moderna y responsive
- ✅ Diagrama interactivo con xDiagrams
- ✅ Manejo robusto de errores
- ✅ Configuración modular y reutilizable

## 🏗️ Arquitectura

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │  Netlify        │    │   SheetBest     │
│   (HTML/JS)     │───▶│  Functions      │───▶│   API           │
│                 │    │  (Proxy)        │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │
         │                       │
         ▼                       ▼
┌─────────────────┐    ┌─────────────────┐
│   Auth0         │    │   Environment   │
│   (Auth)        │    │   Variables     │
└─────────────────┘    └─────────────────┘
```

### Flujo de Autenticación

1. **Usuario accede** a la aplicación
2. **Auth0 verifica** si está autenticado
3. **Si no autenticado**: muestra overlay de login
4. **Si autenticado**: obtiene token JWT
5. **Frontend envía** token al proxy de Netlify
6. **Proxy valida** token y obtiene datos de SheetBest
7. **Datos se muestran** en el diagrama interactivo

## 🛠️ Tecnologías Utilizadas

### Frontend
- **HTML5** - Estructura de la página
- **CSS3** - Estilos y animaciones
- **JavaScript (ES6+)** - Lógica de la aplicación
- **xDiagrams** - Biblioteca para diagramas interactivos

### Backend
- **Netlify Functions** - Serverless functions (Node.js)
- **Axios** - Cliente HTTP para peticiones
- **Auth0 SPA SDK** - Autenticación del lado cliente

### Servicios Externos
- **Auth0** - Proveedor de identidad (IDP)
- **SheetBest** - API para datos de Google Sheets
- **Netlify** - Hosting y serverless functions

## ⚙️ Configuración

### 1. Auth0

#### Crear Aplicación en Auth0
1. Ve a [Auth0 Dashboard](https://manage.auth0.com/)
2. Crea una nueva aplicación
3. Selecciona **Single Page Application (SPA)**
4. Configura las URLs:

```javascript
// URLs de desarrollo
Allowed Callback URLs: http://localhost:8888, http://localhost:8888/test-auth.html
Allowed Logout URLs: http://localhost:8888, http://localhost:8888/test-auth.html
Allowed Web Origins: http://localhost:8888

// URLs de producción
Allowed Callback URLs: https://tu-dominio.netlify.app
Allowed Logout URLs: https://tu-dominio.netlify.app
Allowed Web Origins: https://tu-dominio.netlify.app
```

#### Configuración en `auth.js`
```javascript
const AUTH0_CONFIG = {
  domain: 'tu-tenant.auth0.com',
  client_id: 'tu-client-id',
  redirect_uri: window.location.origin,
  audience: 'https://tu-api.com', // Opcional
  scope: 'openid profile email'
};
```

### 2. SheetBest

#### Activar API Key
1. Ve a tu dashboard de SheetBest
2. Activa la **API Key** en la sección de Seguridad
3. Copia la API key generada

#### Configurar Variables de Entorno
```bash
# Desarrollo local (.env.local)
SHEETBEST_API_KEY=tu-api-key-real-aqui

# Producción (Netlify Dashboard)
SHEETBEST_API_KEY=tu-api-key-real-aqui
```

### 3. Netlify

#### Configuración del Sitio
1. Conecta tu repositorio a Netlify
2. Configura las variables de entorno en el dashboard
3. Asegúrate de que las funciones estén en `netlify/functions/`

## 🚀 Instalación

### Prerrequisitos
- Node.js 18+ 
- npm o yarn
- Cuenta de Auth0
- Cuenta de SheetBest
- Cuenta de Netlify

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone <tu-repositorio>
cd dd
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
# Crear archivo .env.local
echo "SHEETBEST_API_KEY=tu-api-key-real-aqui" > .env.local
```

4. **Configurar Auth0**
   - Actualiza `auth.js` con tus credenciales de Auth0
   - Agrega las URLs de localhost en tu aplicación Auth0

5. **Iniciar desarrollo local**
```bash
npm run dev
```

## 💻 Desarrollo Local

### Comandos Disponibles

```bash
# Iniciar servidor de desarrollo
npm run dev

# Construir para producción
npm run build

# Desplegar a producción
npm run deploy
```

### Estructura de Desarrollo

```
dd/
├── index.html              # Página principal
├── auth.js                 # Lógica de Auth0
├── netlify.toml           # Configuración de Netlify
├── package.json           # Dependencias y scripts
├── .env.local             # Variables de entorno local
├── .gitignore             # Archivos ignorados
└── netlify/
    └── functions/
        └── sheetbest-proxy.js  # Función proxy
```

### Debugging

#### Logs de Desarrollo
- **Frontend**: Abre DevTools del navegador
- **Backend**: Los logs aparecen en la terminal donde ejecutas `netlify dev`

#### Verificar Configuración
```bash
# Verificar API key
curl -X GET "http://localhost:8888/.netlify/functions/sheetbest-proxy" \
  -H "Authorization: Bearer test-token"

# Verificar Auth0
curl -X GET "http://localhost:8888/test-auth.html"
```

## 🌐 Despliegue

### 1. Preparar para Producción

```bash
# Asegúrate de que todos los archivos estén commitados
git add .
git commit -m "Preparar para producción"
git push origin main
```

### 2. Configurar Netlify

1. **Conectar repositorio** en Netlify Dashboard
2. **Configurar variables de entorno**:
   - `SHEETBEST_API_KEY`: Tu API key de SheetBest
3. **Configurar dominio** personalizado (opcional)

### 3. Configurar Auth0 para Producción

1. **Actualizar URLs** en tu aplicación Auth0:
   - Callback URLs: `https://tu-dominio.netlify.app`
   - Logout URLs: `https://tu-dominio.netlify.app`
   - Web Origins: `https://tu-dominio.netlify.app`

2. **Actualizar `auth.js`** con la URL de producción

### 4. Desplegar

```bash
# Despliegue automático (si está conectado a Git)
git push origin main

# Despliegue manual
npm run deploy
```

## 📁 Estructura del Proyecto

```
dd/
├── 📄 index.html                    # Página principal con diagrama
├── 📄 auth.js                       # Lógica de autenticación Auth0
├── 📄 test-auth.html               # Página de prueba de Auth0
├── 📄 README.md                    # Documentación (este archivo)
├── 📄 package.json                 # Configuración del proyecto
├── 📄 netlify.toml                 # Configuración de Netlify
├── 📄 .gitignore                   # Archivos ignorados por Git
├── 📄 .env.local                   # Variables de entorno local
├── 📁 netlify/
│   └── 📁 functions/
│       └── 📄 sheetbest-proxy.js   # Función proxy para SheetBest
└── 📁 img/
    ├── 📄 favicon.ico              # Icono del sitio
    └── 📄 logo.svg                 # Logo de la aplicación
```

## 🔌 API y Endpoints

### Netlify Functions

#### `/.netlify/functions/sheetbest-proxy`

**Método:** `GET`

**Headers requeridos:**
```http
Authorization: Bearer <jwt-token>
```

**Respuesta exitosa:**
```json
{
  "statusCode": 200,
  "headers": {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json"
  },
  "body": "[datos-de-sheetbest]"
}
```

**Respuesta de error:**
```json
{
  "statusCode": 401,
  "body": {
    "error": "Token de autorización requerido"
  }
}
```

### Funciones JavaScript Globales

#### `login()`
Inicia el proceso de autenticación con Auth0.

#### `logout()`
Cierra la sesión del usuario.

#### `checkAuth()`
Verifica el estado de autenticación y actualiza la UI.

## 🔒 Seguridad

### Medidas Implementadas

1. **Autenticación JWT**
   - Tokens de Auth0 para verificar identidad
   - Validación en el servidor (Netlify Functions)

2. **API Key Protegida**
   - API key de SheetBest solo en el servidor
   - Nunca expuesta en el frontend

3. **Proxy Backend**
   - Todas las peticiones a SheetBest pasan por Netlify Functions
   - Validación de tokens antes de acceder a datos

4. **CORS Configurado**
   - Headers de seguridad apropiados
   - Control de orígenes permitidos

5. **Variables de Entorno**
   - Configuración sensible en archivos `.env`
   - Archivos `.env` en `.gitignore`

### Headers de Seguridad

```javascript
// Headers implementados en Netlify Functions
const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
};
```

## 🐛 Solución de Problemas

### Problemas Comunes

#### 1. Error "Invalid state" en Auth0
**Síntomas:** Error al hacer login en localhost
**Solución:** Agregar `http://localhost:8888` a las URLs permitidas en Auth0

#### 2. Error 401 de SheetBest
**Síntomas:** "Authentication credentials were not provided"
**Solución:** 
- Verificar que la API key esté configurada en `.env.local`
- Asegurarse de usar el header `X-Api-Key` (no `Authorization`)

#### 3. API Key no se detecta
**Síntomas:** "API Key de SheetBest no configurada"
**Solución:**
```bash
# Verificar archivo .env.local
cat .env.local

# Reiniciar servidor
pkill -f "netlify dev" && npx netlify dev
```

#### 4. Diagrama no se muestra
**Síntomas:** xDiagrams no carga o no renderiza
**Solución:**
- Verificar que el script de xDiagrams se cargue correctamente
- Revisar la consola del navegador para errores
- Verificar que los datos de SheetBest lleguen correctamente

### Debugging Avanzado

#### Verificar Configuración de Auth0
```javascript
// En la consola del navegador
console.log('Auth0 Config:', AUTH0_CONFIG);
console.log('Auth0 Client:', auth0Client);
```

#### Verificar Variables de Entorno
```bash
# En la terminal
echo $SHEETBEST_API_KEY
cat .env.local
```

#### Probar Función de Netlify
```bash
curl -X GET "http://localhost:8888/.netlify/functions/sheetbest-proxy" \
  -H "Authorization: Bearer test-token" \
  -v
```

## 🤝 Contribución

### Cómo Contribuir

1. **Fork** el repositorio
2. **Crea** una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. **Commit** tus cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. **Push** a la rama (`git push origin feature/nueva-funcionalidad`)
5. **Crea** un Pull Request

### Estándares de Código

- **JavaScript**: ES6+ con funciones arrow y async/await
- **CSS**: BEM methodology para clases
- **HTML**: Semántico y accesible
- **Comentarios**: En español, claros y concisos

### Testing

```bash
# Probar autenticación
npm run test:auth

# Probar función de Netlify
npm run test:function

# Probar aplicación completa
npm run test:e2e
```

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Soporte

### Recursos Útiles

- [Documentación de Auth0](https://auth0.com/docs)
- [Documentación de Netlify Functions](https://docs.netlify.com/functions/overview/)
- [Documentación de SheetBest](https://sheetbest.com/docs)
- [Documentación de xDiagrams](https://xdiagrams.com/docs)

### Contacto

Para soporte técnico o preguntas sobre la implementación:

- **Issues**: Crear un issue en GitHub
- **Email**: [tu-email@ejemplo.com]
- **Documentación**: Este README

---

**Nota:** Este proyecto es una implementación de referencia para mostrar cómo integrar Auth0, Netlify Functions y SheetBest de manera segura. Asegúrate de adaptar la configuración según tus necesidades específicas.