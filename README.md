# 🔐 Template: Contenido HTML Protegido con Auth0 + Netlify

Un template reutilizable para proteger contenido HTML estático usando **Auth0** para autenticación y **Netlify Functions** para autorización.

## ✨ Características

- 🔐 **Autenticación segura** con Auth0
- 🛡️ **Autorización** con Netlify Functions
- 📧 **Restricción por email/dominio**
- ⚡ **Optimizado para velocidad**
- 🔒 **Seguridad robusta** (JWT, rate limiting, headers)
- 📱 **Diseño responsive**
- 🚀 **Deploy automático** a Netlify

## 🚀 Inicio Rápido

### 1. Clonar el template
```bash
git clone <tu-repositorio>
cd template-auth0-netlify-protected-content
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
```bash
cp .env.example .env.local
# Editar .env.local con tus credenciales
```

### 4. Ejecutar en desarrollo
```bash
npm run dev
```

## ⚙️ Configuración

### Auth0 Setup

1. **Crear aplicación SPA** en Auth0 Dashboard
2. **Configurar URLs** de callback y logout
3. **Crear Action** para restricción de emails
4. **Configurar Google OAuth**

### Netlify Setup

1. **Conectar repositorio** a Netlify
2. **Configurar variables** de entorno
3. **Configurar dominio** personalizado (opcional)

## 📁 Estructura del Proyecto

```
├── app/                  # Contenido protegido
│   └── index.html        # Página principal protegida
├── assets/               # Recursos estáticos
│   ├── css/              # Estilos
│   ├── js/               # Scripts
│   └── img/              # Imágenes
├── netlify/              # Funciones serverless
│   └── functions/
├── scripts/              # Utilidades
├── .env.example          # Variables de ejemplo
├── netlify.toml          # Configuración Netlify
└── README.md             # Esta documentación
```

## 🎨 Personalización

### Cambiar contenido protegido
- Editar `app/index.html`
- Agregar más páginas en `app/`

### Personalizar estilos
- Modificar `assets/css/main.css`
- Cambiar variables CSS en `:root`

### Configurar restricciones
- Editar Auth0 Action para emails/dominios
- Modificar lógica en `netlify/functions/auth-protect.js`

## 🔧 Scripts Disponibles

- `npm run dev` - Desarrollo local
- `npm run build` - Build para producción
- `npm run deploy` - Deploy a Netlify

## 📚 Documentación

- [Configuración de Auth0](docs/SETUP.md)
- [Personalización](docs/CUSTOMIZATION.md)
- [Deploy a producción](docs/DEPLOYMENT.md)
- [Solución de problemas](docs/TROUBLESHOOTING.md)

## 🤝 Contribuir

1. Fork el proyecto
2. Crear rama para feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 🙏 Agradecimientos

- [Auth0](https://auth0.com/) por la plataforma de autenticación
- [Netlify](https://netlify.com/) por el hosting y funciones serverless
- [Google OAuth](https://developers.google.com/identity/protocols/oauth2) por la autenticación social
