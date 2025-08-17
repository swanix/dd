# 🚀 Integración SheetBest - Guía Rápida

## 🎯 ¿Qué es esto?

Esta integración permite cargar contenido dinámico desde **Google Sheets** usando **SheetBest API** y mostrarlo en un dashboard interactivo dentro de tu aplicación protegida por Auth0.

## ⚡ Configuración Rápida

### 1. Configurar Variables de Entorno

Crea o actualiza tu archivo `.env`:

```bash
# SheetBest API Configuration
SHEETBEST_API_KEY=tu-api-key-aqui
SHEETBEST_SHEET_ID=tu-sheet-id-aqui
```

### 2. Instalar Dependencias

```bash
npm install
```

### 3. Probar la Integración

```bash
npm run test-sheetbest
```

### 4. Ejecutar en Desarrollo

```bash
npm run dev
```

## 📊 Estructura de Datos Requerida

Tu Google Sheet debe tener estas columnas:

| Columna | Tipo | Ejemplo |
|---------|------|---------|
| `id` | Número | 1, 2, 3... |
| `titulo` | Texto | "Proyecto Alpha" |
| `descripcion` | Texto | "Desarrollo de aplicación web" |
| `estado` | Texto | "En Progreso", "Completado", "Pendiente" |
| `prioridad` | Texto | "Alta", "Media", "Baja" |
| `fecha_creacion` | Fecha | "2024-01-15" |
| `responsable` | Texto | "Juan Pérez" |
| `categoria` | Texto | "Desarrollo", "Diseño", "QA" |

## 🎨 Características del Dashboard

### ✅ Estadísticas en Tiempo Real
- Total de proyectos
- Proyectos en progreso
- Proyectos completados
- Proyectos pendientes

### 📈 Actividad Reciente
- Últimos 5 proyectos ordenados por fecha
- Información detallada de cada proyecto

### 🏷️ Organización por Categorías
- Agrupación automática por categoría
- Conteo de proyectos por categoría
- Vista previa de proyectos en cada categoría

### 👥 Gestión por Responsables
- Agrupación por persona responsable
- Seguimiento de carga de trabajo

### 🎨 Diseño Responsive
- Adaptable a desktop, tablet y móvil
- Tema claro/oscuro automático
- Animaciones suaves

## 🔧 Comandos Útiles

```bash
# Probar integración con SheetBest
npm run test-sheetbest

# Ejecutar en desarrollo
npm run dev

# Construir para producción
npm run build

# Desplegar a Netlify
npm run deploy
```

## 🛡️ Seguridad

- ✅ Autenticación requerida con Auth0
- ✅ API Key protegida en variables de entorno
- ✅ Validación de tokens en cada solicitud
- ✅ Fallback a datos de ejemplo si hay errores

## 🐛 Troubleshooting

### Error: "API Key no configurada"
```bash
# Verifica tu archivo .env
cat .env | grep SHEETBEST
```

### Error: "Error HTTP: 401"
- Verifica que la API key sea válida
- Asegúrate de que tenga permisos de lectura

### Error: "Error HTTP: 404"
- Verifica que el SHEETBEST_SHEET_ID sea correcto
- Asegúrate de que la hoja sea pública o tengas acceso

### Dashboard vacío
1. Ejecuta `npm run test-sheetbest` para verificar datos
2. Revisa la estructura de columnas en tu Google Sheet
3. Verifica la consola del navegador para errores

## 📱 Cómo Usar

1. **Inicia sesión** en la aplicación
2. **Navega** a la página principal (`/app/`)
3. **Visualiza** el dashboard dinámico
4. **Explora** las diferentes secciones:
   - Estadísticas principales
   - Actividad reciente
   - Lista de proyectos
   - Organización por categorías

## 🔄 Actualización de Datos

- Los datos se cargan automáticamente en cada visita
- Los cambios en Google Sheets se reflejan inmediatamente
- No hay caché para asegurar datos actualizados

## 📞 Soporte

Si tienes problemas:

1. **Ejecuta** `npm run test-sheetbest` para diagnosticar
2. **Revisa** la documentación completa en `docs/SHEETBEST-INTEGRATION.md`
3. **Verifica** las variables de entorno
4. **Contacta** al equipo de desarrollo

---

**¡Listo!** Tu aplicación ahora carga contenido dinámico desde Google Sheets de forma segura y elegante. 🎉
