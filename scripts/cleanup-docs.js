#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// ===== SCRIPT PARA LIMPIAR DOCUMENTACIÓN TEMPORAL =====

function cleanupTemporaryDocs() {
    console.log('🧹 Limpiando documentación temporal...');
    
    const tempDir = 'docs/temporary';
    const filesToRemove = [
        'CACHE-FIX-GUIDE.md'
        // NETLIFY-ENV-SETUP.md se mantiene como referencia útil
    ];
    
    let removedCount = 0;
    
    filesToRemove.forEach(fileName => {
        const filePath = path.join(tempDir, fileName);
        
        if (fs.existsSync(filePath)) {
            try {
                fs.unlinkSync(filePath);
                console.log(`✅ Eliminado: ${fileName}`);
                removedCount++;
            } catch (error) {
                console.error(`❌ Error eliminando ${fileName}:`, error.message);
            }
        } else {
            console.log(`⚠️ No encontrado: ${fileName}`);
        }
    });
    
    // Verificar si la carpeta temporal está vacía
    try {
        const remainingFiles = fs.readdirSync(tempDir);
        if (remainingFiles.length === 0) {
            fs.rmdirSync(tempDir);
            console.log('✅ Carpeta temporal eliminada (vacía)');
        } else {
            console.log(`📁 Carpeta temporal contiene ${remainingFiles.length} archivos restantes`);
        }
    } catch (error) {
        console.error('❌ Error verificando carpeta temporal:', error.message);
    }
    
    console.log(`🎉 Limpieza completada. ${removedCount} archivos eliminados`);
}

// Función para listar documentación temporal
function listTemporaryDocs() {
    console.log('📋 Listando documentación temporal...');
    
    const tempDir = 'docs/temporary';
    
    if (fs.existsSync(tempDir)) {
        try {
            const files = fs.readdirSync(tempDir);
            
            if (files.length === 0) {
                console.log('✅ No hay documentación temporal');
            } else {
                console.log('📁 Documentación temporal encontrada:');
                files.forEach(file => {
                    console.log(`  - ${file}`);
                });
            }
        } catch (error) {
            console.error('❌ Error listando documentación temporal:', error.message);
        }
    } else {
        console.log('✅ No existe carpeta de documentación temporal');
    }
}

// Ejecutar según el argumento
const command = process.argv[2];

switch (command) {
    case 'clean':
        cleanupTemporaryDocs();
        break;
    case 'list':
        listTemporaryDocs();
        break;
    default:
        console.log('📚 Script de limpieza de documentación');
        console.log('');
        console.log('Uso:');
        console.log('  node scripts/cleanup-docs.js clean  - Limpiar documentación temporal');
        console.log('  node scripts/cleanup-docs.js list   - Listar documentación temporal');
        break;
}

module.exports = { cleanupTemporaryDocs, listTemporaryDocs };
