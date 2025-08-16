#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// ===== SCRIPT PARA CORREGIR CONFIGURACIÓN DE ENTORNO =====

function fixEnvConfig() {
    console.log('🔧 Corrigiendo configuración de entorno...');
    
    try {
        // Verificar si estamos en desarrollo
        const envLocalPath = path.join(__dirname, '..', '.env.local');
        
        if (!fs.existsSync(envLocalPath)) {
            console.log('⚠️  Archivo .env.local no encontrado');
            console.log('💡 Ejecuta: cp env.example .env.local');
            return;
        }
        
        // Ejecutar el script de inyección en modo development
        const { execSync } = require('child_process');
        execSync('node scripts/inject-env.js development', { 
            stdio: 'inherit',
            cwd: path.join(__dirname, '..')
        });
        
        console.log('✅ Configuración corregida para desarrollo local');
        console.log('🔄 Reinicia el servidor de desarrollo si es necesario');
        
    } catch (error) {
        console.error('❌ Error corrigiendo configuración:', error.message);
    }
}

// Ejecutar si se llama directamente
if (require.main === module) {
    fixEnvConfig();
}

module.exports = { fixEnvConfig };
