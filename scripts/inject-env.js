// ===== SCRIPT PARA INYECTAR VARIABLES DE ENTORNO =====

const fs = require('fs');
const path = require('path');

// Función para leer variables de entorno
function loadEnvFile(filePath) {
    if (!fs.existsSync(filePath)) {
        console.log(`⚠️  Archivo ${filePath} no encontrado`);
        return {};
    }
    
    const envContent = fs.readFileSync(filePath, 'utf8');
    const envVars = {};
    
    envContent.split('\n').forEach(line => {
        const trimmedLine = line.trim();
        if (trimmedLine && !trimmedLine.startsWith('#')) {
            const [key, ...valueParts] = trimmedLine.split('=');
            if (key && valueParts.length > 0) {
                envVars[key.trim()] = valueParts.join('=').trim();
            }
        }
    });
    
    return envVars;
}

// Función para crear archivo de configuración
function createConfigFile(envVars, environment) {
    const config = {
        AUTH0_DOMAIN: envVars.AUTH0_DOMAIN || '',
        AUTH0_CLIENT_ID: envVars.AUTH0_CLIENT_ID || '',
        BASE_URL: environment === 'production' 
            ? (envVars.NETLIFY_URL || envVars.URL || '')
            : (envVars.LOCAL_URL || 'http://localhost:8888')
    };
    
    // Verificar que las variables requeridas estén presentes
    const requiredVars = ['AUTH0_DOMAIN', 'AUTH0_CLIENT_ID'];
    const missingVars = requiredVars.filter(varName => !config[varName]);
    
    if (missingVars.length > 0) {
        console.warn(`⚠️  Variables faltantes: ${missingVars.join(', ')}`);
        console.warn('💡 Asegúrate de configurar las variables de entorno en Netlify');
    }
    
    const configContent = `// ===== CONFIGURACIÓN GENERADA AUTOMÁTICAMENTE =====
// NO EDITAR MANUALMENTE - Se genera desde variables de entorno

window.ENV_CONFIG = {
  "AUTH0_DOMAIN": "${config.AUTH0_DOMAIN || 'CONFIGURAR_EN_NETLIFY'}",
  "AUTH0_CLIENT_ID": "${config.AUTH0_CLIENT_ID || 'CONFIGURAR_EN_NETLIFY'}",
  "BASE_URL": "${config.BASE_URL || ''}"
};

// ===== CONFIGURACIÓN DE AUTH0 =====
window.AUTH0_CONFIG = {
    domain: window.ENV_CONFIG.AUTH0_DOMAIN,
    client_id: window.ENV_CONFIG.AUTH0_CLIENT_ID,
    redirect_uri: window.ENV_CONFIG.BASE_URL || window.location.origin + '/',
    cacheLocation: 'localstorage'
};
`;
    
    const outputPath = path.join(__dirname, '..', 'assets', 'js', 'env-config.js');
    fs.writeFileSync(outputPath, configContent);
    
    console.log(`✅ Configuración generada para entorno: ${environment}`);
    console.log(`📍 Archivo: ${outputPath}`);
    console.log(`🔧 Variables cargadas:`, Object.keys(config));
    
    return config;
}

// Función principal
function main() {
    try {
        const environment = process.argv[2] || 'development';
        console.log(`🔄 Generando configuración para entorno: ${environment}`);
        
        // Cargar variables de entorno
        let envVars = {};
        
        if (environment === 'production') {
            // En producción, usar variables de entorno del sistema
            console.log('📋 Cargando variables de entorno de producción...');
            envVars = {
                AUTH0_DOMAIN: process.env.AUTH0_DOMAIN,
                AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
                NETLIFY_URL: process.env.NETLIFY_URL || process.env.URL
            };
            
            console.log('🔍 Variables de entorno disponibles:');
            console.log(`  - AUTH0_DOMAIN: ${envVars.AUTH0_DOMAIN ? '✅ Configurada' : '❌ No configurada'}`);
            console.log(`  - AUTH0_CLIENT_ID: ${envVars.AUTH0_CLIENT_ID ? '✅ Configurada' : '❌ No configurada'}`);
            console.log(`  - NETLIFY_URL: ${envVars.NETLIFY_URL ? '✅ Configurada' : '❌ No configurada'}`);
        } else {
            // En desarrollo, cargar desde archivo .env.local
            console.log('📋 Cargando variables de entorno de desarrollo...');
            envVars = loadEnvFile(path.join(__dirname, '..', '.env.local'));
        }
        
        // Crear archivo de configuración
        const config = createConfigFile(envVars, environment);
        
        console.log('✅ Configuración completada exitosamente');
        process.exit(0); // Asegurar que el script termine exitosamente
        
    } catch (error) {
        console.error('❌ Error en el script de configuración:', error.message);
        console.error('📋 Stack trace:', error.stack);
        process.exit(1); // Terminar con error
    }
}

// Ejecutar si se llama directamente
if (require.main === module) {
    main();
}

module.exports = { loadEnvFile, createConfigFile };
