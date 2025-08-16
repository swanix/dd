# Swanix CMX

Sistema de gestión de contenido basado en markdown para Swanix.

## Descripción

Swanix CMX es un sistema de gestión de contenido ligero que permite crear y gestionar contenido en formato markdown. Está diseñado para ser independiente y puede funcionar con o sin autenticación.

## Características

- 📝 **Gestión de contenido markdown**: Carga y renderizado de archivos markdown
- 🧭 **Navegación dinámica**: Menú horizontal para subsecciones
- 🔐 **Autenticación opcional**: Puede funcionar con contenido público o privado
- 📱 **Responsive**: Diseño adaptativo para diferentes dispositivos
- ⚡ **Ligero**: Sin dependencias pesadas, solo HTML, CSS y JavaScript

## Estructura del Proyecto

```
swanix-cmx/
├── app/
│   ├── index.html          # Página principal del CMS
│   ├── content.html        # Visor de contenido
│   └── content/            # Archivos markdown
│       ├── dashboard.md
│       ├── documentos.md
│       └── configuracion.md
├── assets/
│   ├── css/
│   │   ├── main.css        # Estilos base
│   │   └── cms.css         # Estilos específicos del CMS
│   └── js/
│       ├── content-loader.js
│       ├── markdown-renderer.js
│       └── cms-navigation.js
├── netlify/
│   └── functions/
│       └── content-api.js   # API para servir contenido
└── docs/
    ├── SETUP.md
    ├── CONTENT-MANAGEMENT.md
    └── DEPLOYMENT.md
```

## Instalación

1. Clonar el repositorio
2. Configurar variables de entorno (opcional)
3. Desplegar en Netlify

## Uso

### Contenido Público
- El CMS puede funcionar sin autenticación para contenido público
- Ideal para documentación, blogs o sitios informativos

### Contenido Privado
- Integración opcional con Swanix Wall para autenticación
- Protección de contenido sensible

## Desarrollo

Este proyecto está en desarrollo activo. Los archivos principales incluyen:

- `content-loader.js`: Cargador de contenido markdown
- `pages-config.js`: Configuración de páginas y navegación
- `content.html`: Interfaz principal del CMS

## Licencia

MIT License
