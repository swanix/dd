#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Actualizando configuración de Auth0...\n');

// Función para actualizar archivo
function updateFile(filePath, replacements) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        let updated = false;
        
        for (const [oldValue, newValue] of Object.entries(replacements)) {
            if (content.includes(oldValue)) {
                content = content.replace(new RegExp(oldValue.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newValue);
                updated = true;
                console.log(`✅ Actualizado en ${filePath}: ${oldValue} → ${newValue}`);
            }
        }
        
        if (updated) {
            fs.writeFileSync(filePath, content);
        }
        
        return updated;
    } catch (error) {
        console.error(`❌ Error actualizando ${filePath}:`, error.message);
        return false;
    }
}

// Función principal
function updateConfig() {
    const args = process.argv.slice(2);
    
    if (args.length < 2) {
        console.log('📝 Uso: node update-config.js <DOMAIN> <CLIENT_ID> [AUDIENCE]');
        console.log('');
        console.log('Ejemplo:');
        console.log('  node update-config.js mi-app.auth0.com abc123def456 https://api.mi-app.com');
        console.log('');
        console.log('Donde:');
        console.log('  DOMAIN: Tu dominio de Auth0 (ej: mi-app.auth0.com)');
        console.log('  CLIENT_ID: Tu Client ID de Auth0');
        console.log('  AUDIENCE: Tu Audience (opcional)');
        return;
    }
    
    const domain = args[0];
    const clientId = args[1];
    const audience = args[2] || 'https://api.example.com';
    
    console.log(`📋 Configuración a aplicar:`);
    console.log(`   Domain: ${domain}`);
    console.log(`   Client ID: ${clientId}`);
    console.log(`   Audience: ${audience}`);
    console.log('');
    
    // Actualizar index.html
    const indexReplacements = {
        'dev-example.auth0.com': domain,
        'temp-client-id': clientId,
        'https://api.example.com': audience
    };
    
    updateFile('index.html', indexReplacements);
    
    // Actualizar auth-protect.js
    const functionReplacements = {
        'dev-example.auth0.com': domain,
        'https://api.example.com': audience
    };
    
    updateFile('netlify/functions/auth-protect.js', functionReplacements);
    
    // Actualizar config.js
    const configReplacements = {
        'dev-example.auth0.com': domain,
        'temp-client-id': clientId,
        'https://api.example.com': audience
    };
    
    updateFile('config.js', configReplacements);
    
    console.log('\n🎉 ¡Configuración actualizada!');
    console.log('📝 Recuerda configurar las URLs permitidas en Auth0:');
    console.log('   - Allowed Callback URLs: http://localhost:8888, https://tu-sitio.netlify.app');
    console.log('   - Allowed Logout URLs: http://localhost:8888, https://tu-sitio.netlify.app');
    console.log('   - Allowed Web Origins: http://localhost:8888, https://tu-sitio.netlify.app');
}

updateConfig();
