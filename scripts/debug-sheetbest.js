#!/usr/bin/env node

require('dotenv').config({ path: '.env.local' });
const fetch = require('node-fetch');

// Colores para la consola
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

async function debugSheetBest() {
    const SHEETBEST_API_KEY = process.env.SHEETBEST_API_KEY;
    const SHEETBEST_SHEET_ID = process.env.SHEETBEST_SHEET_ID;

    if (!SHEETBEST_API_KEY || !SHEETBEST_SHEET_ID) {
        log('❌ SHEETBEST_API_KEY o SHEETBEST_SHEET_ID no configurados', 'red');
        return;
    }

    try {
        log('🔍 DEBUGGEANDO SHEETBEST API', 'bright');
        log('='.repeat(50), 'cyan');
        
        // Probar sin parámetros
        const url = `https://api.sheetbest.com/sheets/${SHEETBEST_SHEET_ID}`;
        log(`📡 URL: ${url}`, 'cyan');
        
        const response = await fetch(url, {
            headers: {
                'X-Api-Key': SHEETBEST_API_KEY,
                'Content-Type': 'application/json'
            }
        });

        log(`📊 Status: ${response.status}`, 'yellow');
        log(`📋 Headers:`, 'yellow');
        
        // Mostrar headers importantes
        const headers = response.headers;
        for (const [key, value] of headers.entries()) {
            if (key.toLowerCase().includes('limit') || 
                key.toLowerCase().includes('count') || 
                key.toLowerCase().includes('total') ||
                key.toLowerCase().includes('content')) {
                log(`   ${key}: ${value}`, 'cyan');
            }
        }

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        
        log(`\n📊 DATOS RECIBIDOS:`, 'bright');
        log(`📦 Total de registros: ${data.length}`, 'green');
        
        if (data.length > 0) {
            log(`\n🔍 PRIMER REGISTRO:`, 'bright');
            log(JSON.stringify(data[0], null, 2), 'cyan');
            
            log(`\n🔍 ÚLTIMO REGISTRO:`, 'bright');
            log(JSON.stringify(data[data.length - 1], null, 2), 'cyan');
        }
        
        // Verificar si hay patrones en los IDs
        const ids = data.map(item => item.ID || item.id).filter(Boolean);
        const uniqueIds = [...new Set(ids)];
        
        log(`\n🔍 ANÁLISIS DE IDs:`, 'bright');
        log(`📊 Total IDs: ${ids.length}`, 'cyan');
        log(`🏷️ IDs únicos: ${uniqueIds.length}`, 'cyan');
        
        if (ids.length > 0) {
            log(`📋 Primeros 10 IDs:`, 'yellow');
            ids.slice(0, 10).forEach((id, index) => {
                log(`   ${index + 1}. ${id}`, 'reset');
            });
        }
        
        // Verificar si hay algún patrón de límite
        if (data.length === 304) {
            log(`\n⚠️ POSIBLE LÍMITE DETECTADO`, 'bright');
            log(`🔍 El número 304 podría ser un límite de la API`, 'yellow');
            log(`💡 Sugerencia: Verificar documentación de SheetBest para límites`, 'cyan');
        }

    } catch (error) {
        log(`❌ Error: ${error.message}`, 'red');
    }
}

debugSheetBest();
