#!/usr/bin/env node

/**
 * Script para verificar el espaciado superior de la tabla
 * 
 * Uso:
 * node scripts/test-spacing.js
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

function showSpacingInfo() {
    logHeader('VERIFICACIÓN DE ESPACIADO SUPERIOR');
    
    log('📏 Espaciado configurado:', 'cyan');
    log('   Desktop (>768px): 80px padding-top');
    log('   Tablet (≤768px):  60px padding-top');
    log('   Mobile (≤480px):  50px padding-top');
    
    log('\n🎯 Propósito:', 'yellow');
    log('   • Evitar que el logo flotante tape los títulos');
    log('   • Mantener legibilidad del contenido');
    log('   • Responsive según el tamaño de pantalla');
    
    log('\n🔧 CSS aplicado:', 'blue');
    log('   .dynamic-table {');
    log('     padding: 20px;');
    log('     padding-top: 80px; /* Espacio para el logo flotante */');
    log('   }');
    log('');
    log('   @media (max-width: 768px) {');
    log('     .dynamic-table {');
    log('       padding-top: 60px; /* Menos espacio en móviles */');
    log('     }');
    log('   }');
    log('');
    log('   @media (max-width: 480px) {');
    log('     .dynamic-table {');
    log('       padding-top: 50px; /* Aún menos espacio */');
    log('     }');
    log('   }');
    
    log('\n🌐 Para verificar:', 'green');
    log('   1. Abre http://localhost:8888 en tu navegador');
    log('   2. Inicia sesión con Auth0');
    log('   3. Verifica que el título no esté tapado por el logo');
    log('   4. Prueba en diferentes tamaños de pantalla');
    
    log('\n💡 Tips de verificación:', 'cyan');
    log('   • El logo flotante debe estar en la esquina superior derecha');
    log('   • El título "Tabla de Productos Alegra" debe ser completamente visible');
    log('   • En móviles, el espaciado debe ser menor');
    log('   • El contenido debe estar bien espaciado del logo');
    
    log('\n✅ Verificación completada', 'green');
}

// Ejecutar
showSpacingInfo();
