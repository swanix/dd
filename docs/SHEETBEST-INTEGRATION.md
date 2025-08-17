# 📊 Integración con SheetBest

Esta documentación explica cómo funciona la integración con SheetBest para cargar contenido dinámico desde Google Sheets.

## 🎯 Descripción General

La integración con SheetBest permite cargar datos dinámicos desde Google Sheets y mostrarlos en un dashboard interactivo dentro de la aplicación protegida por Auth0.

## 🔧 Configuración

### 1. Variables de Entorno

Agrega las siguientes variables a tu archivo `.env`:

```bash
# SheetBest API Configuration
SHEETBEST_API_KEY=tu-api-key-aqui
SHEETBEST_SHEET_ID=tu-sheet-id-aqui
```

### 2. Configuración en Netlify

Para producción, configura las mismas variables en el dashboard de Netlify:

1. Ve a tu sitio en Netlify
2. Navega a **Site settings** > **Environment variables**
3. Agrega las variables `SHEETBEST_API_KEY` y `SHEETBEST_SHEET_ID`

## 📋 Estructura de Datos Esperada

La aplicación espera que tu Google Sheet tenga las siguientes columnas:

| Columna | Tipo | Descripción | Ejemplo |
|---------|------|-------------|---------|
| `id` | Número | ID único del proyecto | 1, 2, 3... |
| `titulo` | Texto | Título del proyecto | "Proyecto Alpha" |
| `descripcion` | Texto | Descripción del proyecto | "Desarrollo de aplicación web" |
| `estado` | Texto | Estado del proyecto | "En Progreso", "Completado", "Pendiente" |
| `prioridad` | Texto | Prioridad del proyecto | "Alta", "Media", "Baja" |
| `fecha_creacion` | Fecha | Fecha de creación | "2024-01-15" |
| `responsable` | Texto | Persona responsable | "Juan Pérez" |
| `categoria` | Texto | Categoría del proyecto | "Desarrollo", "Diseño", "QA" |

### Ejemplo de Datos

```csv
id,titulo,descripcion,estado,prioridad,fecha_creacion,responsable,categoria
1,Proyecto Alpha,Desarrollo de aplicación web moderna,En Progreso,Alta,2024-01-15,Juan Pérez,Desarrollo
2,Diseño de UI/UX,Creación de interfaces de usuario,Completado,Media,2024-01-10,María García,Diseño
3,Testing de Calidad,Pruebas de funcionalidad y rendimiento,Pendiente,Alta,2024-01-20,Carlos López,QA
```

## 🚀 Funcionalidades

### 1. Dashboard Dinámico

El dashboard muestra:

- **Estadísticas principales**: Total de proyectos, en progreso, completados, pendientes
- **Actividad reciente**: Los últimos 5 proyectos ordenados por fecha
- **Lista completa de proyectos**: Todos los proyectos con detalles
- **Estadísticas por categoría**: Agrupación de proyectos por categoría

### 2. Estados y Prioridades

#### Estados Soportados:
- 🔄 **En Progreso** (amarillo)
- ✅ **Completado** (verde)
- ⏳ **Pendiente** (azul)

#### Prioridades Soportadas:
- 🔴 **Alta** (rojo)
- 🟡 **Media** (amarillo)
- 🟢 **Baja** (verde)

### 3. Filtros y Agrupaciones

Los datos se procesan automáticamente para mostrar:

- Conteo por estado
- Conteo por prioridad
- Agrupación por categoría
- Agrupación por responsable
- Ordenamiento por fecha de creación

## 🔄 Flujo de Datos

1. **Autenticación**: El usuario debe estar autenticado con Auth0
2. **Solicitud**: El frontend solicita datos a la función de Netlify
3. **Validación**: Se valida el token de Auth0
4. **Carga**: Se cargan los datos desde SheetBest API
5. **Procesamiento**: Los datos se procesan y agrupan
6. **Respuesta**: Se devuelven los datos procesados al frontend
7. **Renderizado**: El frontend renderiza el dashboard dinámico

## 🛡️ Seguridad

### Autenticación Requerida
- Todos los datos requieren autenticación válida con Auth0
- Los tokens se validan en cada solicitud
- Sin autenticación, se redirige al login

### API Key Protegida
- La API key de SheetBest se almacena en variables de entorno
- Nunca se expone en el frontend
- Solo se usa en el servidor (Netlify Functions)

### Fallback de Datos
- Si SheetBest no está disponible, se usan datos de ejemplo
- El sistema continúa funcionando sin interrupciones
- Se muestra claramente la fuente de datos

## 🐛 Troubleshooting

### Error: "SHEETBEST_API_KEY no configurada"
**Solución**: Verifica que la variable de entorno esté configurada correctamente.

### Error: "Error HTTP: 401"
**Solución**: Verifica que la API key sea válida y tenga permisos de lectura.

### Error: "Error HTTP: 404"
**Solución**: Verifica que el SHEETBEST_SHEET_ID sea correcto.

### Los datos no se actualizan
**Solución**: 
1. Verifica que los cambios en Google Sheets se hayan guardado
2. SheetBest puede tener un pequeño delay en la sincronización
3. Refresca la página para cargar datos actualizados

### Dashboard vacío
**Solución**:
1. Verifica que la estructura de columnas sea correcta
2. Asegúrate de que haya datos en la hoja
3. Revisa la consola del navegador para errores

## 📱 Responsive Design

El dashboard es completamente responsive:

- **Desktop**: Grid de 4 columnas para estadísticas
- **Tablet**: Grid de 2 columnas
- **Mobile**: Grid de 1 columna

## 🎨 Personalización

### Colores y Temas
Los colores se adaptan automáticamente al tema (claro/oscuro) usando las variables CSS.

### Estructura de Datos
Puedes modificar la estructura de datos en `netlify/functions/load-content.js` en la función `processDynamicContent()`.

### Diseño del Dashboard
Los estilos están en `assets/css/main.css` en la sección "DASHBOARD DINÁMICO".

## 🔄 Actualizaciones

### Datos en Tiempo Real
- Los datos se cargan en cada visita a la página
- No hay caché para asegurar datos actualizados
- Los cambios en Google Sheets se reflejan automáticamente

### Mejoras Futuras
- [ ] Caché inteligente con invalidación
- [ ] Filtros avanzados
- [ ] Búsqueda en tiempo real
- [ ] Exportación de datos
- [ ] Gráficos y visualizaciones

## 📞 Soporte

Si tienes problemas con la integración:

1. Revisa esta documentación
2. Verifica las variables de entorno
3. Revisa los logs de Netlify Functions
4. Contacta al equipo de desarrollo

---

**Nota**: Esta integración está diseñada para ser robusta y manejar errores graciosamente. Si SheetBest no está disponible, el sistema continuará funcionando con datos de ejemplo.
