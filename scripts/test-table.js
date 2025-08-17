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
        // Construir URL con el nombre del tab usando /tabs/
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
        }
    ];
}

// ===== PROCESAR DATOS DINÁMICOS =====
function processDynamicContent(rawData) {
    try {
        // Filtrar datos válidos (con ID y Name)
        const validData = rawData.filter(item => 
            item.ID && item.Name && item.ID !== '' && item.Name !== ''
        );

        // Mantener la estructura original de los datos de Google Sheets
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

        // Estadísticas simples
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

// ===== FUNCIÓN PRINCIPAL =====
async function main() {
    log('🚀 INICIANDO PRUEBA DE TABLA SIMPLE', 'bright');
    log('='.repeat(60), 'cyan');
    
    // Verificar configuración
    log('ℹ️ Verificando configuración...', 'yellow');
    const SHEETBEST_API_KEY = process.env.SHEETBEST_API_KEY;
    const SHEETBEST_SHEET_ID = process.env.SHEETBEST_SHEET_ID;
    
    if (SHEETBEST_API_KEY) {
        log('✅ API Key configurada', 'green');
    } else {
        log('❌ API Key no configurada', 'red');
    }
    
    if (SHEETBEST_SHEET_ID) {
        log(`Sheet ID: ${SHEETBEST_SHEET_ID}`, 'cyan');
    } else {
        log('❌ Sheet ID no configurado', 'red');
    }
    
    // Cargar datos
    log('ℹ️ Cargando datos desde SheetBest...', 'yellow');
    const rawData = await loadSheetBestData();
    
    // Procesar datos
    log('ℹ️ Procesando datos...', 'yellow');
    const processedData = processDynamicContent(rawData);
    
    // Mostrar estadísticas
    log('\n📊 ESTADÍSTICAS DE LA TABLA', 'bright');
    log('─'.repeat(50), 'cyan');
    log(`📦 Total de Registros: ${processedData.stats.totalItems}`, 'green');
    log(`🏷️ Tipos Únicos: ${processedData.stats.tipos}`, 'yellow');
    log(`📐 Layouts Únicos: ${processedData.stats.layouts}`, 'green');
    log(`🌍 Países: ${processedData.stats.paises}`, 'blue');
    log('─'.repeat(50), 'cyan');
    
    // Mostrar primeros 5 registros como ejemplo
    log('\n📋 MUESTRA DE DATOS (primeros 5 registros)', 'bright');
    log('─'.repeat(50), 'cyan');
    
    processedData.items.slice(0, 5).forEach((item, index) => {
        log(`${index + 1}. ${item.Name}`, 'magenta');
        log(`   ID: ${item.ID} | Type: ${item.Type} | Layout: ${item.Layout}`, 'reset');
        if (item.URL) {
            log(`   URL: ${item.URL}`, 'cyan');
        }
        if (item.Description) {
            log(`   Desc: ${item.Description}`, 'reset');
        }
        log('');
    });
    
    // Resumen final
    log('🎯 RESUMEN DE LA PRUEBA', 'bright');
    log('='.repeat(60), 'cyan');
    log('✅ Prueba completada exitosamente', 'green');
    log(`📊 Total de registros procesados: ${processedData.items.length}`, 'cyan');
    log(`🏷️ Tipos únicos encontrados: ${processedData.stats.tipos}`, 'cyan');
    log(`📐 Layouts únicos encontrados: ${processedData.stats.layouts}`, 'cyan');
    log(`🌍 Países únicos encontrados: ${processedData.stats.paises}`, 'cyan');
    log('\n✨ La tabla está lista para mostrar en la aplicación', 'green');
}

// Ejecutar
main().catch(error => {
    console.error('❌ Error en la prueba:', error);
    process.exit(1);
});
