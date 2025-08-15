#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Configuración
const config = {
    development: {
        domain: 'dev-7kj3jxtxwwirocri.us.auth0.com',
        client_id: 'BORj4AB79Rho5yP5uSavuP4sern8pemZ',
        base_url: 'http://localhost:8888'
    },
    production: {
        domain: 'dev-7kj3jxtxwwirocri.us.auth0.com',
        client_id: 'BORj4AB79Rho5yP5uSavuP4sern8pemZ',
        base_url: 'https://swanixdd.netlify.app'
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
                    'access-denied.html'
                ];
    
    files.forEach(file => updateFile(file, env));
    
    console.log('\n📋 URLs para configurar en Auth0:');
    console.log(`\n🔗 Allowed Callback URLs:`);
    console.log(`${config[env].base_url}/app/`);
    console.log(`${config[env].base_url}/access-denied.html`);
    
    console.log(`\n🔗 Allowed Logout URLs:`);
    console.log(`${config[env].base_url}/login.html`);
    console.log(`${config[env].base_url}/access-denied.html`);
    
    console.log(`\n🔗 Allowed Web Origins:`);
    console.log(`${config[env].base_url}`);
    
    if (env === 'production') {
        console.log('\n✅ Dominio de producción configurado: https://swanixdd.netlify.app');
    }
}

main();
