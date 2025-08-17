#!/usr/bin/env node

/**
 * Script para restaurar los backups de index.html
 * Uso: node scripts/restore-backups.js
 */

const fs = require('fs');
const path = require('path');

console.log('🔄 Restaurando backups de index.html...\n');

// Verificar si existen los backups
const indexBackup = 'index.html.backup';
const appIndexBackup = 'app/index.html.backup';

if (!fs.existsSync(indexBackup)) {
    console.error('❌ No se encontró el backup de index.html');
    process.exit(1);
}

if (!fs.existsSync(appIndexBackup)) {
    console.error('❌ No se encontró el backup de app/index.html');
    process.exit(1);
}

try {
    // Restaurar index.html
    fs.copyFileSync(indexBackup, 'index.html');
    console.log('✅ index.html restaurado correctamente');

    // Restaurar app/index.html
    fs.copyFileSync(appIndexBackup, 'app/index.html');
    console.log('✅ app/index.html restaurado correctamente');

    console.log('\n🎉 ¡Restauración completada!');
    console.log('📝 Los archivos han sido restaurados a su estado original');
    console.log('💡 Si quieres volver a usar xdiagrams, ejecuta: node scripts/setup-xdiagrams-main.js');

} catch (error) {
    console.error('❌ Error durante la restauración:', error.message);
    process.exit(1);
}
