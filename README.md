# Swanix Wall

Template de autenticación y protección de contenido para aplicaciones web.

## Descripción

Swanix Wall es un template completo para implementar autenticación y protección de contenido en aplicaciones web. Proporciona una base sólida con Auth0, Netlify Functions y Google OAuth.

## Características

- 🔐 **Autenticación Auth0**: Integración completa con Auth0
- 🛡️ **Protección de rutas**: Middleware para proteger páginas HTML
- 🌐 **Integración Netlify**: Funciones serverless para autenticación
- 🔑 **Google OAuth**: Soporte para login con Google
- 📱 **Responsive**: Diseño adaptativo para todos los dispositivos
- ⚡ **Ligero**: Sin dependencias pesadas
- 🔒 **Seguro**: Rate limiting y validación de tokens

## Estructura del Proyecto

```
swanix-wall/
├── app/
│   ├── index.html          # Página principal protegida
│   └── protected.html      # Ejemplo de página protegida
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

## Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <repository-url>
   cd swanix-wall
   ```

2. **Configurar variables de entorno**
   ```bash
   cp env.example .env
   # Editar .env con tus credenciales de Auth0
   ```

3. **Configurar Auth0**
   - Crear aplicación en Auth0
   - Configurar URLs de callback
   - Agregar Google OAuth (opcional)

4. **Desplegar en Netlify**
   - Conectar repositorio
   - Configurar variables de entorno
   - Desplegar

## Configuración

### Variables de Entorno

```env
AUTH0_DOMAIN=tu-dominio.auth0.com
AUTH0_CLIENT_ID=tu-client-id
AUTH0_CLIENT_SECRET=tu-client-secret
AUTH0_AUDIENCE=tu-audience
GOOGLE_CLIENT_ID=tu-google-client-id
GOOGLE_CLIENT_SECRET=tu-google-client-secret
```

### Auth0 Setup

1. Crear aplicación Single Page Application
2. Configurar URLs permitidas:
   - `http://localhost:8888`
   - `https://tu-dominio.netlify.app`
3. Configurar URLs de callback:
   - `http://localhost:8888/callback`
   - `https://tu-dominio.netlify.app/callback`

## Uso

### Páginas Protegidas

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

## Integración con Swanix CMX

Swanix Wall puede integrarse con [Swanix CMX](https://github.com/tu-usuario/swanix-cmx) para:

- Proteger contenido del CMS
- Autenticación de usuarios
- Control de acceso por roles
- Logs de actividad

## Desarrollo

### Scripts Disponibles

```bash
# Instalar dependencias
npm install

# Desarrollo local
npm run dev

# Construir para producción
npm run build

# Tests
npm test
```

### Estructura de Archivos

- `app/`: Páginas de la aplicación
- `assets/`: Recursos estáticos (CSS, JS, imágenes)
- `netlify/functions/`: Funciones serverless
- `scripts/`: Scripts de utilidad

## Contribuir

1. Fork el proyecto
2. Crear rama para feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

## Licencia

MIT License - ver [LICENSE](LICENSE) para detalles.

## Soporte

- 📧 Email: soporte@swanix.com
- 📖 Documentación: [docs/](docs/)
- 🐛 Issues: [GitHub Issues](https://github.com/tu-usuario/swanix-wall/issues)
