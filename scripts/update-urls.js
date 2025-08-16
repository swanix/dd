#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Configuración
const config = {
    development: {
        domain: process.env.AUTH0_DOMAIN || '',
        client_id: process.env.AUTH0_CLIENT_ID || '',
        base_url: process.env.LOCAL_URL || 'http://localhost:8888'
    },
    production: {
        domain: process.env.AUTH0_DOMAIN || '',
        client_id: process.env.AUTH0_CLIENT_ID || '',
        base_url: process.env.NETLIFY_URL || ''
    }
};

function updateFile(filePath, env) {
    if (!fs.existsSync(filePath)) {
        console.log(`⚠️  Archivo no encontrado: ${filePath}`);
        return;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    const envConfig = config[env];
    
    // Actualizar configuración de Auth0
    content = content.replace(
        /domain:\s*['"][^'"]*['"]/g,
        `domain: '${envConfig.domain}'`
    );
    
    content = content.replace(
        /client_id:\s*['"][^'"]*['"]/g,
        `client_id: '${envConfig.client_id}'`
    );
    
    content = content.replace(
        /redirect_uri:\s*window\.location\.origin\s*\+\s*['"][^'"]*['"]/g,
        `redirect_uri: window.location.origin + '/app/'`
    );
    
    fs.writeFileSync(filePath, content);
    console.log(`✅ Actualizado: ${filePath} (${env})`);
}

function main() {
    const env = process.argv[2] || 'development';
    
    if (!config[env]) {
        console.error('❌ Entorno no válido. Usa: development o production');
        process.exit(1);
    }
    
    console.log(`🔄 Actualizando archivos para entorno: ${env}`);
    console.log(`📍 URL base: ${config[env].base_url}`);
    
    // Archivos a actualizar
                    const files = [
                    'index.html',
                    'login.html',
                    'app/index.html',
                    'forbidden.html'
                ];
    
    files.forEach(file => updateFile(file, env));
    
    console.log('\n📋 URLs para configurar en Auth0:');
    console.log(`\n🔗 Allowed Callback URLs:`);
    console.log(`${config[env].base_url}/`);
    console.log(`${config[env].base_url}/app/`);
    console.log(`${config[env].base_url}/forbidden.html`);
    
    console.log(`\n🔗 Allowed Logout URLs:`);
    console.log(`${config[env].base_url}/login.html`);
    console.log(`${config[env].base_url}/forbidden.html`);
    
    console.log(`\n🔗 Allowed Web Origins:`);
    console.log(`${config[env].base_url}`);
    
    if (env === 'production') {
        console.log('\n✅ Dominio de producción configurado:', config[env].base_url);
    }
}

main();
