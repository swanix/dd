# 🌐 Páginas HTML Dinámicas con SheetBest

## 📋 Resumen

Ahora puedes crear páginas HTML personalizadas que carguen datos dinámicos de SheetBest de manera flexible y directa, sin las limitaciones del sistema anterior.

---

## 🚀 Nuevas Funcionalidades

### **✅ Datos Crudos Disponibles**
- **API endpoint**: `/.netlify/functions/raw-data`
- **Datos sin procesar**: Acceso directo a los datos originales de SheetBest
- **Flexibilidad total**: Usa los datos como necesites en tu HTML

### **✅ Páginas HTML Personalizadas**
- **Crear cualquier página**: En la carpeta `app/`
- **Diseño libre**: CSS y HTML completamente personalizable
- **Autenticación integrada**: Protección automática con Auth0

### **✅ Fácil Implementación**
- **Solo HTML/CSS/JS**: Sin frameworks complejos
- **Ejemplos incluidos**: Páginas de referencia listas para usar
- **Debugging simple**: Datos disponibles en la consola del navegador

---

## 📁 Estructura de Archivos

```
app/
├── index.html              # Página principal (tabla)
├── dynamic-page.html       # Página dinámica avanzada
├── simple-dynamic.html     # Página simple de ejemplo
└── tu-pagina.html          # ¡Crea tus propias páginas aquí!

netlify/functions/
├── load-content.js         # Datos procesados (tabla)
└── raw-data.js            # Datos crudos (nuevo)

assets/
├── css/main.css           # Estilos principales
└── js/
    ├── app.js             # Lógica principal
    ├── auth-router.js     # Autenticación
    └── env-config.js      # Configuración
```

---

## 🎯 Cómo Crear una Página HTML Dinámica

### **1. Crear el Archivo HTML**

Crea un archivo HTML en la carpeta `app/`:

```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mi Página Dinámica</title>
    <style>
        /* Tus estilos CSS aquí */
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
        }
        
        .data-container {
            max-width: 1200px;
            margin: 0 auto;
        }
        
        .data-item {
            background: #f5f5f5;
            padding: 15px;
            margin-bottom: 10px;
            border-radius: 5px;
        }
    </style>
</head>
<body>
    <div class="data-container">
        <h1>Mi Página con Datos Dinámicos</h1>
        
        <div id="loading">Cargando...</div>
        <div id="error" style="display: none;">Error: <span id="errorMessage"></span></div>
        <div id="content" style="display: none;">
            <div id="dataList"></div>
        </div>
    </div>

    <script>
        // Configuración
        const API_ENDPOINT = '/.netlify/functions/raw-data';
        
        // Clase para manejar datos
        class MyDataManager {
            constructor() {
                this.data = null;
            }
            
            // Verificar autenticación
            checkAuth() {
                const token = localStorage.getItem('auth0_token');
                if (!token) {
                    window.location.href = '/login.html';
                    return false;
                }
                return true;
            }
            
            // Cargar datos
            async loadData() {
                if (!this.checkAuth()) return;
                
                try {
                    const token = localStorage.getItem('auth0_token');
                    const response = await fetch(API_ENDPOINT, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    });
                    
                    if (!response.ok) {
                        throw new Error(`Error HTTP: ${response.status}`);
                    }
                    
                    const result = await response.json();
                    this.data = result.data.items || [];
                    
                    this.renderData();
                    
                } catch (error) {
                    this.showError(error.message);
                }
            }
            
            // Mostrar error
            showError(message) {
                document.getElementById('loading').style.display = 'none';
                document.getElementById('error').style.display = 'block';
                document.getElementById('errorMessage').textContent = message;
            }
            
            // Renderizar datos
            renderData() {
                const container = document.getElementById('dataList');
                
                container.innerHTML = this.data.map(item => `
                    <div class="data-item">
                        <h3>${item.Name || 'Sin nombre'}</h3>
                        <p><strong>ID:</strong> ${item.ID || 'N/A'}</p>
                        <p><strong>Tipo:</strong> ${item.Type || 'N/A'}</p>
                        <p><strong>País:</strong> ${item.Country || 'N/A'}</p>
                        ${item.URL ? `<p><strong>URL:</strong> <a href="${item.URL}" target="_blank">Ver</a></p>` : ''}
                    </div>
                `).join('');
                
                document.getElementById('loading').style.display = 'none';
                document.getElementById('content').style.display = 'block';
            }
        }
        
        // Inicializar
        document.addEventListener('DOMContentLoaded', () => {
            const dataManager = new MyDataManager();
            dataManager.loadData();
            
            // Para debugging
            window.dataManager = dataManager;
        });
    </script>
</body>
</html>
```

### **2. Acceder a la Página**

Una vez creada, accede a tu página en:
```
http://localhost:8888/tu-pagina.html
```

---

## 📊 Estructura de Datos Disponibles

### **Datos Crudos de SheetBest:**

```javascript
{
    "success": true,
    "message": "Datos crudos cargados exitosamente",
    "data": {
        "items": [
            {
                "ID": "WEB",
                "Parent": "",
                "Name": "Website",
                "Type": "Group",
                "Layout": "",
                "URL": "",
                "Country": "COL",
                "Technology": "React",
                "Responsive": "Yes",
                "Description": "Sitio web principal",
                "Img": "https://alegra.design/monitor/img/section-home.svg"
            },
            // ... más elementos
        ],
        "total": 609,
        "source": "SheetBest API",
        "timestamp": "2024-01-15T10:30:00.000Z",
        "tab": "All"
    }
}
```

### **Campos Disponibles:**

| Campo | Descripción | Ejemplo |
|-------|-------------|---------|
| `ID` | Identificador único | "WEB" |
| `Parent` | ID del elemento padre | "WEB" |
| `Name` | Nombre del elemento | "Website" |
| `Type` | Tipo de elemento | "Group", "Section", "Label" |
| `Layout` | Layout específico | "Home", "Form", "Detail" |
| `URL` | URL del elemento | "https://www.alegra.com" |
| `Country` | País | "COL" |
| `Technology` | Tecnología utilizada | "React", "Vue", "Angular" |
| `Responsive` | Es responsive | "Yes", "No" |
| `Description` | Descripción | "Sitio web principal" |
| `Img` | URL de imagen | "https://..." |

---

## 🎨 Ejemplos de Uso

### **1. Lista Simple**

```javascript
// Renderizar como lista simple
renderSimpleList() {
    const container = document.getElementById('dataList');
    
    container.innerHTML = `
        <ul>
            ${this.data.map(item => `
                <li>
                    <strong>${item.Name}</strong> (${item.Type})
                    ${item.URL ? ` - <a href="${item.URL}">Ver</a>` : ''}
                </li>
            `).join('')}
        </ul>
    `;
}
```

### **2. Grid de Cards**

```javascript
// Renderizar como grid de cards
renderCardGrid() {
    const container = document.getElementById('dataList');
    
    container.innerHTML = `
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px;">
            ${this.data.map(item => `
                <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <h3>${item.Name}</h3>
                    <p><strong>Tipo:</strong> ${item.Type}</p>
                    <p><strong>País:</strong> ${item.Country}</p>
                    ${item.URL ? `<a href="${item.URL}" target="_blank">Ver más</a>` : ''}
                </div>
            `).join('')}
        </div>
    `;
}
```

### **3. Tabla Personalizada**

```javascript
// Renderizar como tabla personalizada
renderCustomTable() {
    const container = document.getElementById('dataList');
    
    container.innerHTML = `
        <table style="width: 100%; border-collapse: collapse;">
            <thead>
                <tr style="background: #f5f5f5;">
                    <th style="padding: 10px; text-align: left;">Nombre</th>
                    <th style="padding: 10px; text-align: left;">Tipo</th>
                    <th style="padding: 10px; text-align: left;">País</th>
                    <th style="padding: 10px; text-align: left;">Acciones</th>
                </tr>
            </thead>
            <tbody>
                ${this.data.map(item => `
                    <tr style="border-bottom: 1px solid #eee;">
                        <td style="padding: 10px;">${item.Name}</td>
                        <td style="padding: 10px;">${item.Type}</td>
                        <td style="padding: 10px;">${item.Country}</td>
                        <td style="padding: 10px;">
                            ${item.URL ? `<a href="${item.URL}" target="_blank">Ver</a>` : '-'}
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}
```

---

## 🔧 Funciones Útiles

### **Filtrar Datos:**

```javascript
// Filtrar por tipo
getItemsByType(type) {
    return this.data.filter(item => item.Type === type);
}

// Filtrar por país
getItemsByCountry(country) {
    return this.data.filter(item => item.Country === country);
}

// Buscar por nombre
searchByName(searchTerm) {
    return this.data.filter(item => 
        item.Name && item.Name.toLowerCase().includes(searchTerm.toLowerCase())
    );
}
```

### **Obtener Estadísticas:**

```javascript
getStats() {
    return {
        total: this.data.length,
        types: [...new Set(this.data.map(item => item.Type).filter(Boolean))].length,
        countries: [...new Set(this.data.map(item => item.Country).filter(Boolean))].length,
        withUrls: this.data.filter(item => item.URL).length,
        responsive: this.data.filter(item => item.Responsive === 'Yes').length
    };
}
```

---

## 🚀 Páginas de Ejemplo Incluidas

### **1. `dynamic-page.html`**
- **Características**: Página avanzada con cards y funcionalidades completas
- **Uso**: Para proyectos complejos con muchas funcionalidades
- **URL**: `http://localhost:8888/dynamic-page.html`

### **2. `simple-dynamic.html`**
- **Características**: Página simple con lista y estadísticas
- **Uso**: Para proyectos básicos o como punto de partida
- **URL**: `http://localhost:8888/simple-dynamic.html`

---

## 🔍 Debugging

### **Acceso a Datos en Consola:**

```javascript
// En cualquier página, los datos están disponibles globalmente
console.log(window.dataManager.data); // Ver todos los datos
console.log(window.dataManager.getStats()); // Ver estadísticas
console.log(window.dataManager.getItemsByType('Section')); // Filtrar por tipo
```

### **Verificar Autenticación:**

```javascript
// Verificar si el usuario está autenticado
const token = localStorage.getItem('auth0_token');
if (token) {
    console.log('Usuario autenticado');
} else {
    console.log('Usuario no autenticado');
}
```

---

## ⚠️ Limitaciones y Consideraciones

### **✅ Lo que Puedes Hacer:**
- Crear cualquier diseño HTML/CSS
- Usar todos los campos de datos disponibles
- Filtrar y procesar datos como necesites
- Crear múltiples páginas con diferentes diseños

### **❌ Limitaciones:**
- **Autenticación requerida**: Todas las páginas necesitan login
- **Datos del tab actual**: Solo accedes al tab configurado en `.env.local`
- **Sin paginación**: Todos los datos se cargan de una vez
- **Sin cache**: Los datos se cargan en cada visita

---

## 🎯 Próximos Pasos

### **Mejoras Futuras:**
- **Paginación**: Cargar datos por lotes
- **Filtros dinámicos**: Filtros en tiempo real
- **Múltiples tabs**: Acceso a diferentes tabs desde la misma página
- **Cache**: Cachear datos para mejor rendimiento

### **Para Empezar:**
1. **Copia** `simple-dynamic.html` como base
2. **Modifica** el HTML y CSS según tus necesidades
3. **Personaliza** la lógica JavaScript
4. **Prueba** tu página en `http://localhost:8888/tu-pagina.html`

---

*¡Ahora tienes total flexibilidad para crear páginas HTML dinámicas con datos de SheetBest!* 🚀
