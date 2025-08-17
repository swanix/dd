#!/usr/bin/env node

// ===== SCRIPT PARA CONFIGURAR XDIAGRAMS COMO PÁGINA PRINCIPAL =====
// Convierte xdiagrams en la página principal protegida de la aplicación

const fs = require('fs');
const path = require('path');

// ===== CONFIGURACIÓN =====
const BACKUP_DIR = 'backups';
const TIMESTAMP = new Date().toISOString().replace(/[:.]/g, '-');

// ===== FUNCIÓN PARA CREAR BACKUP =====
function createBackup() {
  console.log('💾 [SETUP] Creando backup de archivos existentes...');
  
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  }

  const backupPath = path.join(BACKUP_DIR, `index-backup-${TIMESTAMP}`);
  fs.mkdirSync(backupPath, { recursive: true });

  // Backup del index.html actual
  if (fs.existsSync('index.html')) {
    fs.copyFileSync('index.html', path.join(backupPath, 'index.html'));
    console.log('   ✅ Backup de index.html creado');
  }

  // Backup del login.html actual
  if (fs.existsSync('login.html')) {
    fs.copyFileSync('login.html', path.join(backupPath, 'login.html'));
    console.log('   ✅ Backup de login.html creado');
  }

  console.log(`   📁 Backup guardado en: ${backupPath}`);
  return backupPath;
}

// ===== FUNCIÓN PARA CREAR INDEX PROTEGIDO =====
function createProtectedIndex() {
  console.log('🔐 [SETUP] Creando index.html protegido con xdiagrams...');
  
  const protectedIndexContent = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="robots" content="noindex, nofollow, noarchive">
  <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
  <title>Inspector - Aplicación Principal</title>
  <link rel="shortcut icon" href="img/favicon.ico">
  <link href="https://cdn.jsdelivr.net/gh/swanix/diagrams@v0.9.1/dist/xdiagrams.min.css" rel="stylesheet" />
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #f5f5f5;
    }
    .loading {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      flex-direction: column;
    }
    .spinner {
      border: 4px solid #f3f3f3;
      border-top: 4px solid #3498db;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      animation: spin 1s linear infinite;
      margin-bottom: 20px;
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    .error {
      color: #e74c3c;
      text-align: center;
      padding: 20px;
    }
  </style>
</head>
<body class="custom-theme">

<div id="app">
  <div class="loading">
    <div class="spinner"></div>
    <p>Cargando Inspector...</p>
  </div>
</div>

<script>
// ===== VERIFICACIÓN DE AUTENTICACIÓN =====
async function checkAuth() {
  try {
    // Obtener token del localStorage
    const token = localStorage.getItem('auth_token');
    
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    // Verificar token con el servidor
    const response = await fetch('/.netlify/functions/auth-protect', {
      method: 'GET',
      headers: {
        'Authorization': \`Bearer \${token}\`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Token inválido o expirado');
    }

    // Token válido, cargar xdiagrams
    loadXDiagrams(token);
    
  } catch (error) {
    console.error('Error de autenticación:', error);
    redirectToLogin();
  }
}

// ===== CARGAR XDIAGRAMS =====
function loadXDiagrams(token) {
  // Configurar xdiagrams con autenticación
  window.$xDiagrams = {
    url: "/.netlify/functions/xdiagrams-proxy",
    title: "Inspector - Aplicación Principal",
    clustersPerRow: "6 3 7 6 3",
    showThemeToggle: false,
    // Configuración adicional para autenticación
    headers: {
      'Authorization': \`Bearer \${token}\`
    }
  };

  // Cargar la librería xdiagrams
  const script = document.createElement('script');
  script.type = 'module';
  script.src = 'https://cdn.jsdelivr.net/gh/swanix/diagrams@v0.9.1/dist/xdiagrams.min.js';
  script.onload = () => {
    console.log('✅ XDiagrams cargado correctamente');
  };
  script.onerror = () => {
    showError('Error cargando XDiagrams');
  };
  document.head.appendChild(script);
}

// ===== REDIRIGIR A LOGIN =====
function redirectToLogin() {
  window.location.href = '/login.html';
}

// ===== MOSTRAR ERROR =====
function showError(message) {
  const app = document.getElementById('app');
  app.innerHTML = \`
    <div class="error">
      <h2>Error</h2>
      <p>\${message}</p>
      <button onclick="redirectToLogin()">Ir al Login</button>
    </div>
  \`;
}

// ===== INICIAR VERIFICACIÓN =====
document.addEventListener('DOMContentLoaded', checkAuth);
</script>

</body>
</html>`;

  fs.writeFileSync('index.html', protectedIndexContent);
  console.log('   ✅ index.html protegido creado');
}

// ===== FUNCIÓN PARA ACTUALIZAR NETLIFY.TOML =====
function updateNetlifyConfig() {
  console.log('⚙️ [SETUP] Actualizando configuración de Netlify...');
  
  const netlifyConfig = `[build]
  publish = "."
  functions = "netlify/functions"

[[redirects]]
  from = "/"
  to = "/index.html"
  status = 200

[[redirects]]
  from = "/login"
  to = "/login.html"
  status = 200

[[redirects]]
  from = "/app/*"
  to = "/app/:splat"
  status = 200

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200

[functions]
  node_bundler = "esbuild"

[functions."auth-protect"]
  included_files = ["netlify/utils/*"]

[functions."xdiagrams-proxy"]
  included_files = ["netlify/utils/*"]

[functions."load-content"]
  included_files = ["netlify/utils/*"]

[functions."raw-data"]
  included_files = ["netlify/utils/*"]
`;

  fs.writeFileSync('netlify.toml', netlifyConfig);
  console.log('   ✅ netlify.toml actualizado');
}

// ===== FUNCIÓN PARA CREAR DOCUMENTACIÓN =====
function createDocumentation() {
  console.log('📚 [SETUP] Creando documentación...');
  
  const docsContent = `# XDiagrams como Página Principal

## Configuración Implementada

### Archivos Creados/Modificados:
- \`index.html\` - Página principal protegida con xdiagrams
- \`netlify/functions/xdiagrams-proxy.js\` - Proxy para datos protegidos
- \`app/xdiagrams-protected.html\` - Versión alternativa protegida
- \`netlify.toml\` - Configuración actualizada

### Variables de Entorno Requeridas:
\`\`\`env
AUTH0_DOMAIN=tu-dominio.auth0.com
SHEETBEST_API_KEY=tu-api-key-aqui
XDIAGRAMS_SHEET_ID=f4c2def0-403c-4197-8020-9f1c42e34515
XDIAGRAMS_TAB_NAME=All
\`\`\`

### Flujo de Autenticación:
1. Usuario accede a \`/\`
2. Se verifica token en localStorage
3. Si válido, carga xdiagrams con datos protegidos
4. Si inválido, redirige a \`/login.html\`

### Endpoints:
- \`/.netlify/functions/xdiagrams-proxy\` - Datos protegidos para xdiagrams
- \`/.netlify/functions/auth-protect\` - Verificación de autenticación

### Características:
- ✅ Autenticación requerida
- ✅ Datos desde SheetBest con API key
- ✅ Rate limiting
- ✅ CORS configurado
- ✅ Cache de 5 minutos
- ✅ Logging detallado

## Uso

1. Configurar variables de entorno en Netlify
2. Desplegar la aplicación
3. Acceder a \`/\` - redirigirá a login si no está autenticado
4. Después del login, mostrará el diagrama interactivo

## Backup

Los archivos originales se guardaron en: \`backups/index-backup-${TIMESTAMP}/\`
`;

  fs.writeFileSync('docs/XDIAGRAMS-MAIN-SETUP.md', docsContent);
  console.log('   ✅ Documentación creada en docs/XDIAGRAMS-MAIN-SETUP.md');
}

// ===== FUNCIÓN PRINCIPAL =====
async function setupXDiagramsMain() {
  console.log('🚀 [SETUP] Configurando XDiagrams como página principal...');
  console.log('');

  try {
    // 1. Crear backup
    const backupPath = createBackup();
    console.log('');

    // 2. Crear index protegido
    createProtectedIndex();
    console.log('');

    // 3. Actualizar configuración
    updateNetlifyConfig();
    console.log('');

    // 4. Crear documentación
    createDocumentation();
    console.log('');

    // 5. Resumen
    console.log('✅ [SETUP] Configuración completada exitosamente!');
    console.log('');
    console.log('📋 RESUMEN:');
    console.log('   - Backup creado en:', backupPath);
    console.log('   - index.html protegido creado');
    console.log('   - netlify.toml actualizado');
    console.log('   - Documentación creada');
    console.log('');
    console.log('🚀 PRÓXIMOS PASOS:');
    console.log('   1. Configurar variables de entorno en Netlify');
    console.log('   2. Desplegar la aplicación');
    console.log('   3. Probar el flujo de autenticación');
    console.log('   4. Verificar que xdiagrams cargue correctamente');
    console.log('');

  } catch (error) {
    console.error('❌ [SETUP] Error durante la configuración:', error);
    process.exit(1);
  }
}

// ===== EJECUTAR SETUP =====
if (require.main === module) {
  setupXDiagramsMain()
    .then(() => {
      console.log('✅ [SETUP] Proceso completado');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ [SETUP] Error en el proceso:', error);
      process.exit(1);
    });
}

module.exports = { setupXDiagramsMain };
