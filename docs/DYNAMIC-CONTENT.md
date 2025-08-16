# Carga de Contenido Dinámico

## Descripción
Esta guía explica cómo usar la función `load-content.js` para cargar contenido dinámico desde el servidor.

## Función Base: `load-content.js`

### Ubicación
`netlify/functions/load-content.js`

### Funcionalidad
- ✅ Valida tokens de Auth0
- ✅ Devuelve contenido JSON estructurado
- ✅ Maneja errores y CORS
- ✅ Base para contenido dinámico personalizado

## Estructura de Respuesta

### Respuesta Exitosa
```json
{
    "success": true,
    "content": {
        "type": "dashboard",
        "title": "Dashboard Personal",
        "content": {
            "welcome": "Bienvenido Usuario",
            "email": "usuario@email.com",
            "lastLogin": "2024-01-15T10:30:00Z",
            "stats": {
                "totalItems": 42,
                "pendingTasks": 5,
                "completedTasks": 37
            },
            "recentActivity": [
                {
                    "id": 1,
                    "action": "Documento creado",
                    "timestamp": "2024-01-15T10:30:00Z"
                }
            ]
        }
    },
    "user": {
        "name": "Usuario",
        "email": "usuario@email.com",
        "picture": "https://...",
        "sub": "auth0|123456"
    },
    "timestamp": "2024-01-15T10:30:00Z"
}
```

### Respuesta de Error
```json
{
    "error": "invalid_token",
    "message": "Token inválido o expirado"
}
```

## Cómo Usar en el Frontend

### 1. Descomentar el código en `app.js`
```javascript
async loadProtectedContent() {
    try {
        const token = await this.auth0.getIdTokenClaims();
        const response = await fetch('/.netlify/functions/load-content', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token.__raw}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            this.displayDynamicContent(data.content);
        }
    } catch (error) {
        console.error('Error cargando contenido:', error);
    }
}
```

### 2. Personalizar el renderizado
```javascript
displayDynamicContent(content) {
    const container = document.querySelector('.canvas-container');
    
    // Personalizar según el tipo de contenido
    switch(content.type) {
        case 'dashboard':
            container.innerHTML = `
                <div class="dashboard-content">
                    <h2>${content.title}</h2>
                    <p>${content.content.welcome}</p>
                    <!-- Renderizar estadísticas, actividades, etc. -->
                </div>
            `;
            break;
            
        case 'profile':
            // Renderizar perfil de usuario
            break;
            
        default:
            container.innerHTML = '<p>Contenido no disponible</p>';
    }
}
```

## Personalización de la Función

### 1. Cargar desde Base de Datos
```javascript
const loadDynamicContent = async () => {
    // Conectar a base de datos
    const db = await connectToDatabase();
    
    // Obtener datos del usuario
    const userData = await db.collection('users').findOne({ 
        auth0Id: decoded.sub 
    });
    
    return {
        type: 'dashboard',
        content: {
            welcome: `Bienvenido ${userData.name}`,
            stats: userData.stats,
            recentActivity: userData.activities
        }
    };
};
```

### 2. Cargar desde APIs Externas
```javascript
const loadDynamicContent = async () => {
    // Llamar APIs externas
    const weatherData = await fetch('https://api.weather.com/...');
    const newsData = await fetch('https://api.news.com/...');
    
    return {
        type: 'dashboard',
        content: {
            weather: await weatherData.json(),
            news: await newsData.json()
        }
    };
};
```

### 3. Cargar desde Archivos
```javascript
const loadDynamicContent = () => {
    const fs = require('fs');
    
    // Leer archivo de configuración
    const config = JSON.parse(fs.readFileSync('./config/dashboard.json'));
    
    return {
        type: 'dashboard',
        content: config
    };
};
```

## Tipos de Contenido Sugeridos

### Dashboard
```javascript
{
    type: 'dashboard',
    content: {
        stats: { /* estadísticas */ },
        charts: { /* gráficos */ },
        recentActivity: [ /* actividades */ ],
        notifications: [ /* notificaciones */ ]
    }
}
```

### Perfil de Usuario
```javascript
{
    type: 'profile',
    content: {
        personalInfo: { /* información personal */ },
        preferences: { /* preferencias */ },
        security: { /* configuración de seguridad */ }
    }
}
```

### Documentos
```javascript
{
    type: 'documents',
    content: {
        files: [ /* lista de archivos */ ],
        folders: [ /* carpetas */ ],
        recent: [ /* documentos recientes */ ]
    }
}
```

## Seguridad

### Validación de Token
- ✅ Verificación de firma JWT
- ✅ Validación de issuer (Auth0)
- ✅ Verificación de algoritmos (RS256)
- ✅ Cache de claves JWKS

### CORS
- ✅ Headers configurados
- ✅ Manejo de preflight requests
- ✅ Origen configurable

### Logs
- ✅ Logs de autenticación exitosa
- ✅ Logs de errores de token
- ✅ Logs de errores del servidor

## Ejemplos de Uso

### 1. Dashboard Simple
```javascript
// En load-content.js
const loadDynamicContent = () => {
    return {
        type: 'dashboard',
        title: 'Mi Dashboard',
        content: {
            welcome: `Hola ${userName}`,
            stats: {
                totalProjects: 12,
                activeTasks: 5,
                completedToday: 3
            }
        }
    };
};
```

### 2. Dashboard con Actividad
```javascript
const loadDynamicContent = () => {
    return {
        type: 'dashboard',
        title: 'Actividad Reciente',
        content: {
            activities: [
                { type: 'login', message: 'Inicio de sesión', time: '10:30 AM' },
                { type: 'document', message: 'Documento creado', time: '09:15 AM' },
                { type: 'update', message: 'Perfil actualizado', time: '08:45 AM' }
            ]
        }
    };
};
```

## Notas Importantes

1. **Performance**: La función incluye cache de claves JWKS para mejor rendimiento
2. **Escalabilidad**: Diseñada para manejar múltiples tipos de contenido
3. **Mantenibilidad**: Código modular y bien documentado
4. **Flexibilidad**: Fácil de extender para nuevos tipos de contenido
5. **Seguridad**: Validación robusta de autenticación

## Próximos Pasos

1. Descomentar el código en `app.js`
2. Personalizar `loadDynamicContent()` según tus necesidades
3. Implementar `displayDynamicContent()` en el frontend
4. Agregar estilos CSS para el contenido dinámico
5. Probar con diferentes tipos de contenido
