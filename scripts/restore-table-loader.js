#!/usr/bin/env node

/**
 * Script para restaurar el ProtectedContentLoader en app.js
 * Uso: node scripts/restore-table-loader.js
 */

const fs = require('fs');
const path = require('path');

console.log('🔄 Restaurando ProtectedContentLoader en app.js...\n');

const appJsPath = 'assets/js/app.js';

if (!fs.existsSync(appJsPath)) {
    console.error('❌ No se encontró assets/js/app.js');
    process.exit(1);
}

try {
    // Leer el archivo
    let content = fs.readFileSync(appJsPath, 'utf8');
    
    // Buscar y restaurar las líneas modificadas
    const searchPattern = /\/\/ MODIFICADO PARA XDIAGRAMS - Solo generar menú de usuario\n    if \(window\.location\.pathname === '\/app\/' \|\| window\.location\.pathname === '\/app\/index\.html'\) \{\n        \/\/ Inicializar solo el user menu sin cargar contenido\n        initUserMenuOnly\(\);\n    \}/;
    const replacePattern = 'new ProtectedContentLoader();';
    
    if (content.includes('// MODIFICADO PARA XDIAGRAMS - Solo generar menú de usuario')) {
        content = content.replace(searchPattern, replacePattern);
        fs.writeFileSync(appJsPath, content, 'utf8');
        console.log('✅ ProtectedContentLoader restaurado correctamente');
        console.log('📝 La tabla se cargará nuevamente en /app/index.html');
    } else {
        console.log('ℹ️  El ProtectedContentLoader ya está activo o no se encontró la modificación');
    }

} catch (error) {
    console.error('❌ Error durante la restauración:', error.message);
    process.exit(1);
}

console.log('\n🎉 ¡Restauración completada!');
console.log('💡 Para volver a comentar el loader, edita manualmente assets/js/app.js');
