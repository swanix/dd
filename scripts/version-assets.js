#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// ===== SCRIPT PARA VERSIONAR ASSETS Y FORZAR ACTUALIZACIÓN DE CACHÉ =====

function addVersionToAssets() {
    console.log('🔄 Agregando versiones a assets para forzar actualización de caché...');
    
    const timestamp = Date.now();
    const version = `?v=${timestamp}`;
    
    // Archivos HTML a procesar
    const htmlFiles = [
        'app/index.html',
        'index.html',
        'login.html'
    ];
    
    htmlFiles.forEach(filePath => {
        if (fs.existsSync(filePath)) {
            try {
                let content = fs.readFileSync(filePath, 'utf8');
                
                // Agregar versión a archivos CSS
                content = content.replace(
                    /href="([^"]*\.css)"/g,
                    `href="$1${version}"`
                );
                
                // Agregar versión a archivos JS (excepto CDN)
                content = content.replace(
                    /src="(\/[^"]*\.js)"/g,
                    `src="$1${version}"`
                );
                
                fs.writeFileSync(filePath, content, 'utf8');
                console.log(`✅ ${filePath} actualizado con versiones`);
                
            } catch (error) {
                console.error(`❌ Error procesando ${filePath}:`, error.message);
            }
        } else {
            console.log(`⚠️ Archivo no encontrado: ${filePath}`);
        }
    });
    
    console.log('🎉 Assets versionados correctamente');
    console.log(`📝 Timestamp usado: ${timestamp}`);
    console.log('💡 Después del deploy, puedes revertir el caché a largo plazo');
}

// Ejecutar si se llama directamente
if (require.main === module) {
    addVersionToAssets();
}

module.exports = { addVersionToAssets };
