#!/usr/bin/env node

/**
 * Script para probar las nuevas páginas HTML dinámicas
 * 
 * Uso:
 * node scripts/test-dynamic-pages.js
 */

const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

function logHeader(message) {
    log(`\n${colors.bright}${message}${colors.reset}`);
    log('='.repeat(message.length));
}

function showDynamicPagesInfo() {
    logHeader('PÁGINAS HTML DINÁMICAS DISPONIBLES');
    
    log('🚀 Nuevas Funcionalidades:', 'cyan');
    log('   ✅ Datos crudos disponibles en /.netlify/functions/raw-data');
    log('   ✅ Páginas HTML personalizadas en carpeta app/');
    log('   ✅ Autenticación integrada con Auth0');
    log('   ✅ Flexibilidad total en diseño y estructura');
    
    log('\n📁 Páginas Disponibles:', 'yellow');
    log('   📄 /index.html - Página principal con tabla');
    log('   📄 /dynamic-page.html - Página avanzada con cards');
    log('   📄 /simple-dynamic.html - Página simple de ejemplo');
    
    log('\n🔧 API Endpoints:', 'blue');
    log('   🔗 /.netlify/functions/load-content - Datos procesados (tabla)');
    log('   🔗 /.netlify/functions/raw-data - Datos crudos (nuevo)');
    
    log('\n📊 Estructura de Datos Crudos:', 'cyan');
    log('   {');
    log('     "success": true,');
    log('     "message": "Datos crudos cargados exitosamente",');
    log('     "data": {');
    log('       "items": [...], // Array con todos los datos');
    log('       "total": 609,');
    log('       "source": "SheetBest API",');
    log('       "timestamp": "2024-01-15T10:30:00.000Z",');
    log('       "tab": "All"');
    log('     }');
    log('   }');
    
    log('\n🎯 Campos Disponibles en cada item:', 'yellow');
    log('   • ID - Identificador único');
    log('   • Parent - ID del elemento padre');
    log('   • Name - Nombre del elemento');
    log('   • Type - Tipo (Group, Section, Label)');
    log('   • Layout - Layout específico');
    log('   • URL - URL del elemento');
    log('   • Country - País');
    log('   • Technology - Tecnología utilizada');
    log('   • Responsive - Es responsive (Yes/No)');
    log('   • Description - Descripción');
    log('   • Img - URL de imagen');
    
    log('\n🌐 Para Probar:', 'green');
    log('   1. Abre http://localhost:8888 en tu navegador');
    log('   2. Inicia sesión con Auth0');
    log('   3. Navega a las diferentes páginas:');
    log('      • http://localhost:8888/ (tabla principal)');
    log('      • http://localhost:8888/dynamic-page.html (página avanzada)');
    log('      • http://localhost:8888/simple-dynamic.html (página simple)');
    
    log('\n💡 Cómo Crear tu Propia Página:', 'cyan');
    log('   1. Copia simple-dynamic.html como base');
    log('   2. Modifica el HTML y CSS según tus necesidades');
    log('   3. Personaliza la lógica JavaScript');
    log('   4. Guarda como tu-pagina.html en la carpeta app/');
    log('   5. Accede en http://localhost:8888/tu-pagina.html');
    
    log('\n🔍 Debugging:', 'blue');
    log('   • Abre la consola del navegador (F12)');
    log('   • Los datos están disponibles en window.dataManager');
    log('   • Usa console.log(window.dataManager.data) para ver datos');
    log('   • Usa console.log(window.dataManager.getStats()) para estadísticas');
    
    log('\n📚 Documentación:', 'yellow');
    log('   📖 docs/DYNAMIC-HTML-PAGES.md - Guía completa');
    log('   📖 docs/TABLE-DESIGN.md - Diseño de tabla');
    log('   📖 docs/SCRIPTS-OPTIMIZATION.md - Optimización de scripts');
    
    log('\n✅ Sistema Listo para Uso', 'green');
    log('   ¡Ahora tienes total flexibilidad para crear páginas HTML dinámicas!');
}

// Ejecutar
showDynamicPagesInfo();
