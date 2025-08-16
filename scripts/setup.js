#!/usr/bin/env node

/**
 * 🚀 Script de Setup para Template Auth0 + Netlify
 * 
 * Este script ayuda a configurar el template para un nuevo proyecto
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Colores para consola
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

function question(prompt) {
    return new Promise((resolve) => {
        rl.question(prompt, resolve);
    });
}

async function setupTemplate() {
    log('\n🚀 Configuración del Template Auth0 + Netlify', 'cyan');
    log('================================================\n', 'cyan');

    try {
        // 1. Verificar archivos necesarios
        log('📋 Verificando archivos necesarios...', 'blue');
        
        const requiredFiles = [
            '.env.example',
            'package.json',
            'netlify.toml',
            'assets/js/env-config.js'
        ];

        for (const file of requiredFiles) {
            if (fs.existsSync(file)) {
                log(`✅ ${file}`, 'green');
            } else {
                log(`❌ ${file} - NO ENCONTRADO`, 'red');
            }
        }

        // 2. Solicitar información del proyecto
        log('\n🔧 Configuración del Proyecto', 'yellow');
        log('----------------------------', 'yellow');

        const projectName = await question('Nombre del proyecto: ');
        const auth0Domain = await question('Dominio de Auth0 (ej: dev-xxx.auth0.com): ');
        const auth0ClientId = await question('Client ID de Auth0: ');
        const netlifyUrl = await question('URL de Netlify (ej: https://mi-app.netlify.app): ');

        // 3. Crear .env.local
        log('\n📝 Creando archivo .env.local...', 'blue');
        
        const envContent = `# ===== CONFIGURACIÓN DEL PROYECTO: ${projectName} =====

# 🔐 CONFIGURACIÓN DE AUTH0
AUTH0_DOMAIN=${auth0Domain}
AUTH0_CLIENT_ID=${auth0ClientId}

# 🌐 URLs DE LA APLICACIÓN
NETLIFY_URL=${netlifyUrl}
LOCAL_URL=http://localhost:8888

# 📊 APIs EXTERNAS (OPCIONAL)
SHEETBEST_API_KEY=tu-api-key-opcional

# ===== GENERADO AUTOMÁTICAMENTE =====
# Fecha: ${new Date().toISOString()}
# Proyecto: ${projectName}
`;

        fs.writeFileSync('.env.local', envContent);
        log('✅ Archivo .env.local creado', 'green');

        // 4. Actualizar package.json
        log('\n📦 Actualizando package.json...', 'blue');
        
        const packagePath = path.join(process.cwd(), 'package.json');
        const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
        
        packageJson.name = projectName.toLowerCase().replace(/\s+/g, '-');
        packageJson.description = `Aplicación protegida: ${projectName}`;
        packageJson.author = 'Tu Nombre';
        
        fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));
        log('✅ package.json actualizado', 'green');

        // 5. Generar configuración de entorno
        log('\n⚙️ Generando configuración de entorno...', 'blue');
        
        const { execSync } = require('child_process');
        execSync('npm run build:dev', { stdio: 'inherit' });
        log('✅ Configuración de entorno generada', 'green');

        // 6. Instalar dependencias
        log('\n📚 Instalando dependencias...', 'blue');
        
        execSync('npm install', { stdio: 'inherit' });
        log('✅ Dependencias instaladas', 'green');

        // 7. Mostrar URLs para configurar en Auth0
        log('\n🔗 URLs para configurar en Auth0 Dashboard', 'yellow');
        log('==========================================', 'yellow');
        log(`\nAllowed Callback URLs:`);
        log(`${netlifyUrl}/`);
        log(`${netlifyUrl}/app/`);
        log(`${netlifyUrl}/forbidden.html`);
        log(`http://localhost:8888/`);
        log(`http://localhost:8888/app/`);
        log(`http://localhost:8888/forbidden.html`);

        log(`\nAllowed Logout URLs:`);
        log(`${netlifyUrl}/login.html`);
        log(`${netlifyUrl}/forbidden.html`);
        log(`http://localhost:8888/login.html`);
        log(`http://localhost:8888/forbidden.html`);

        log(`\nAllowed Web Origins:`);
        log(`${netlifyUrl}`);
        log(`http://localhost:8888`);

        // 8. Mostrar próximos pasos
        log('\n🎯 Próximos Pasos', 'magenta');
        log('================', 'magenta');
        log('1. Configurar URLs en Auth0 Dashboard');
        log('2. Crear Action de restricción en Auth0');
        log('3. Configurar Google OAuth');
        log('4. Ejecutar: npm run dev');
        log('5. Probar autenticación');
        log('6. Deploy a Netlify');

        log('\n✅ Configuración completada exitosamente!', 'green');
        log('🚀 Tu template está listo para usar.', 'green');

    } catch (error) {
        log(`\n❌ Error durante la configuración: ${error.message}`, 'red');
        process.exit(1);
    } finally {
        rl.close();
    }
}

// Ejecutar setup
if (require.main === module) {
    setupTemplate();
}

module.exports = { setupTemplate };
