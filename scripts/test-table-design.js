#!/usr/bin/env node

/**
 * Script para probar el nuevo diseño minimalista de la tabla
 * 
 * Uso:
 * node scripts/test-table-design.js
 */

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

function logHeader(message) {
    log(`\n${colors.bright}${message}${colors.reset}`);
    log('='.repeat(message.length));
}

// ===== CARGAR DATOS DESDE SHEETBEST =====
async function loadSheetBestData() {
    const SHEETBEST_API_KEY = process.env.SHEETBEST_API_KEY;
    const SHEETBEST_SHEET_ID = process.env.SHEETBEST_SHEET_ID;
    const SHEETBEST_TAB_NAME = process.env.SHEETBEST_TAB_NAME || 'nombre-del-tab-aqui';

    if (!SHEETBEST_API_KEY || !SHEETBEST_SHEET_ID) {
        console.log('⚠️ Usando datos de ejemplo como fallback');
        return getExampleData();
    }

    try {
        let url;
        if (SHEETBEST_TAB_NAME && SHEETBEST_TAB_NAME.trim() !== '') {
            url = `https://api.sheetbest.com/sheets/${SHEETBEST_SHEET_ID}/tabs/${encodeURIComponent(SHEETBEST_TAB_NAME)}`;
            console.log(`🔄 Cargando datos desde tab: ${SHEETBEST_TAB_NAME}`);
        } else {
            url = `https://api.sheetbest.com/sheets/${SHEETBEST_SHEET_ID}`;
            console.log(`🔄 Cargando datos desde tab por defecto`);
        }
        
        const response = await fetch(url, {
            headers: {
                'X-Api-Key': SHEETBEST_API_KEY,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        console.log(`✅ Datos cargados exitosamente: ${data.length} registros`);
        return data;

    } catch (error) {
        console.error(`❌ Error cargando datos desde SheetBest: ${error.message}`);
        console.log('⚠️ Usando datos de ejemplo como fallback');
        return getExampleData();
    }
}

// ===== DATOS DE EJEMPLO =====
function getExampleData() {
    return [
        {
            ID: 'ONB',
            Parent: '',
            Name: 'Onboarding',
            Type: 'Group',
            Layout: '',
            URL: '',
            Country: 'COL',
            Technology: '',
            Responsive: '',
            Description: '',
            Img: 'https://alegra.design/monitor/img/section-home.svg'
        },
        {
            ID: 'ONB-F1',
            Parent: 'ONB',
            Name: 'Iniciar sesión',
            Type: 'Section',
            Layout: 'Form',
            URL: 'https://app.alegra.com/user/login',
            Country: 'COL',
            Technology: '',
            Responsive: 'No',
            Description: null,
            Img: null
        },
        {
            ID: 'ONB-F2',
            Parent: 'ONB',
            Name: 'Registro',
            Type: 'Section',
            Layout: 'Form',
            URL: 'https://app.alegra.com/user/register',
            Country: 'COL',
            Technology: 'React',
            Responsive: 'Sí',
            Description: 'Formulario de registro de usuarios',
            Img: 'https://alegra.design/monitor/img/register.svg'
        }
    ];
}

// ===== PROCESAR DATOS DINÁMICOS =====
function processDynamicContent(rawData) {
    try {
        const validData = rawData.filter(item => 
            item.ID && item.Name && item.ID !== '' && item.Name !== ''
        );

        const mappedData = validData.map(item => ({
            ID: item.ID,
            Parent: item.Parent || '',
            Name: item.Name,
            Type: item.Type || '',
            Layout: item.Layout || '',
            URL: item.URL || '',
            Country: item.Country || '',
            Technology: item.Technology || '',
            Responsive: item.Responsive || '',
            Description: item.Description || '',
            Img: item.Img || ''
        }));

        const stats = {
            totalItems: mappedData.length,
            tipos: [...new Set(mappedData.map(item => item.Type).filter(Boolean))].length,
            layouts: [...new Set(mappedData.map(item => item.Layout).filter(Boolean))].length,
            paises: [...new Set(mappedData.map(item => item.Country).filter(Boolean))].length
        };

        return {
            stats,
            items: mappedData
        };

    } catch (error) {
        console.error('Error procesando datos dinámicos:', error);
        return {
            stats: { totalItems: 0, tipos: 0, layouts: 0, paises: 0 },
            items: []
        };
    }
}

// ===== MOSTRAR PREVIEW DE LA TABLA =====
function showTablePreview(data) {
    logHeader('PREVIEW DEL NUEVO DISEÑO MINIMALISTA');
    
    log('📊 Estadísticas:', 'cyan');
    log(`   Total de registros: ${data.stats.totalItems}`);
    log(`   Tipos únicos: ${data.stats.tipos}`);
    log(`   Layouts únicos: ${data.stats.layouts}`);
    log(`   Países: ${data.stats.paises}`);
    
    log('\n📋 Estructura de la tabla:', 'cyan');
    log('   ┌─────┬────────┬─────────────┬────────┬────────┬─────────────────┬────────┬──────────┬──────────┬─────────────┬─────────────────┐');
    log('   │ ID  │ Parent │ Name        │ Type   │ Layout │ URL             │ Country│ Technology│ Responsive│ Description │ Img             │');
    log('   ├─────┼────────┼─────────────┼────────┼────────┼─────────────────┼────────┼──────────┼──────────┼─────────────┼─────────────────┤');
    
    data.items.slice(0, 3).forEach(item => {
        const id = (item.ID || '').padEnd(4);
        const parent = (item.Parent || '').padEnd(7);
        const name = (item.Name || '').substring(0, 11).padEnd(11);
        const type = (item.Type || '').padEnd(7);
        const layout = (item.Layout || '').padEnd(7);
        const url = (item.URL || '').substring(0, 15).padEnd(15);
        const country = (item.Country || '').padEnd(7);
        const tech = (item.Technology || '').padEnd(9);
        const responsive = (item.Responsive || '').padEnd(9);
        const desc = (item.Description || '').substring(0, 11).padEnd(11);
        const img = (item.Img || '').substring(0, 15).padEnd(15);
        
        log(`   │ ${id} │ ${parent} │ ${name} │ ${type} │ ${layout} │ ${url} │ ${country} │ ${tech} │ ${responsive} │ ${desc} │ ${img} │`);
    });
    
    log('   └─────┴────────┴─────────────┴────────┴────────┴─────────────────┴────────┴──────────┴──────────┴─────────────┴─────────────────┘');
    
    log('\n🎨 Características del nuevo diseño:', 'yellow');
    log('   ✅ Minimalista y compacto');
    log('   ✅ Estilo hoja de cálculo');
    log('   ✅ Blanco y negro neutro');
    log('   ✅ Soporte para dark/light theme');
    log('   ✅ Responsive con scroll horizontal');
    log('   ✅ Filas alternadas para mejor legibilidad');
    log('   ✅ Hover effects sutiles');
    log('   ✅ Tipografía optimizada');
    
    log('\n🌐 Para ver el diseño completo:', 'green');
    log('   1. Abre http://localhost:8888 en tu navegador');
    log('   2. Inicia sesión con Auth0');
    log('   3. Verás la tabla con el nuevo diseño minimalista');
    
    log('\n💡 Tips de uso:', 'blue');
    log('   • La tabla se adapta automáticamente al tema del sistema');
    log('   • En móviles, usa scroll horizontal para ver todas las columnas');
    log('   • Los enlaces son azules y se subrayan al hacer hover');
    log('   • Las filas pares tienen un fondo ligeramente diferente');
}

// ===== FUNCIÓN PRINCIPAL =====
async function main() {
    try {
        logHeader('PRUEBA DEL NUEVO DISEÑO DE TABLA');
        
        const rawData = await loadSheetBestData();
        const processedData = processDynamicContent(rawData);
        
        showTablePreview(processedData);
        
    } catch (error) {
        log(`❌ Error en la prueba: ${error.message}`, 'red');
    }
}

// Ejecutar
main();
