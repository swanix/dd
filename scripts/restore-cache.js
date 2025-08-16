#!/usr/bin/env node

const fs = require('fs');

// ===== SCRIPT PARA RESTAURAR CACHÉ LARGO DESPUÉS DEL DEPLOY =====

function restoreLongCache() {
    console.log('🔄 Restaurando caché largo para producción...');
    
    try {
        let content = fs.readFileSync('netlify.toml', 'utf8');
        
        // Restaurar caché largo para JS
        content = content.replace(
            /Cache-Control = "public, max-age=0, must-revalidate"/g,
            'Cache-Control = "public, max-age=31536000, immutable"'
        );
        
        // Actualizar comentarios
        content = content.replace(
            /# JavaScript - Caché corto para desarrollo \(ACTUALIZAR DESPUÉS\)/g,
            '# JavaScript - Caché largo + compresión (PRODUCCIÓN)'
        );
        
        content = content.replace(
            /# CSS - Caché corto para desarrollo \(ACTUALIZAR DESPUÉS\)/g,
            '# CSS - Caché largo + compresión (PRODUCCIÓN)'
        );
        
        fs.writeFileSync('netlify.toml', content, 'utf8');
        
        console.log('✅ Caché largo restaurado en netlify.toml');
        console.log('💡 Los assets ahora tendrán caché de 1 año');
        
    } catch (error) {
        console.error('❌ Error restaurando caché:', error.message);
    }
}

// Ejecutar si se llama directamente
if (require.main === module) {
    restoreLongCache();
}

module.exports = { restoreLongCache };
