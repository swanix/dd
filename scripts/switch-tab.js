#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

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

// Función para leer el archivo .env.local
function readEnvFile() {
    const envPath = path.join(process.cwd(), '.env.local');
    if (!fs.existsSync(envPath)) {
        log('❌ Archivo .env.local no encontrado', 'red');
        return {};
    }
    
    const content = fs.readFileSync(envPath, 'utf8');
    const env = {};
    
    content.split('\n').forEach(line => {
        const [key, ...valueParts] = line.split('=');
        if (key && valueParts.length > 0) {
            env[key.trim()] = valueParts.join('=').trim();
        }
    });
    
    return env;
}

// Función para escribir el archivo .env.local
function writeEnvFile(env) {
    const envPath = path.join(process.cwd(), '.env.local');
    const content = Object.entries(env)
        .map(([key, value]) => `${key}=${value}`)
        .join('\n');
    
    fs.writeFileSync(envPath, content);
    log('✅ Archivo .env.local actualizado', 'green');
}

// Función para cambiar el tab
function switchTab(tabName) {
    log('🔄 Cambiando tab de Google Sheets...', 'yellow');
    
    const env = readEnvFile();
    
    if (!env.SHEETBEST_API_KEY || !env.SHEETBEST_SHEET_ID) {
        log('❌ SHEETBEST_API_KEY o SHEETBEST_SHEET_ID no configurados', 'red');
        log('💡 Primero configura estas variables en .env.local', 'cyan');
        return;
    }
    
    // Actualizar el nombre del tab
    env.SHEETBEST_TAB_NAME = tabName;
    
    writeEnvFile(env);
    
    log(`✅ Tab cambiado a: ${tabName}`, 'green');
    log('🔄 Reinicia el servidor con: npm run dev', 'yellow');
}

// Función para mostrar el tab actual
function showCurrentTab() {
    const env = readEnvFile();
    const currentTab = env.SHEETBEST_TAB_NAME || 'default';
    
    log('📋 CONFIGURACIÓN ACTUAL', 'bright');
    log('─'.repeat(40), 'cyan');
    log(`📊 Sheet ID: ${env.SHEETBEST_SHEET_ID || 'No configurado'}`, 'cyan');
    log(`🏷️ Tab actual: ${currentTab}`, 'green');
    log(`🔑 API Key: ${env.SHEETBEST_API_KEY ? '✅ Configurada' : '❌ No configurada'}`, 'cyan');
    log('─'.repeat(40), 'cyan');
}

// Función principal
function main() {
    const args = process.argv.slice(2);
    
    if (args.length === 0) {
        log('📋 GESTOR DE TABS DE GOOGLE SHEETS', 'bright');
        log('='.repeat(50), 'cyan');
        log('', 'reset');
        log('💡 Uso:', 'yellow');
        log('  node scripts/switch-tab.js <nombre-del-tab>', 'cyan');
        log('', 'reset');
        log('📝 Ejemplos:', 'yellow');
        log('  node scripts/switch-tab.js "nombre-del-tab-aqui"', 'cyan');
        log('  node scripts/switch-tab.js "Clientes"', 'cyan');
        log('  node scripts/switch-tab.js "Ventas"', 'cyan');
        log('', 'reset');
        log('🔍 Ver configuración actual:', 'yellow');
        log('  node scripts/switch-tab.js --show', 'cyan');
        log('', 'reset');
        
        showCurrentTab();
        return;
    }
    
    if (args[0] === '--show') {
        showCurrentTab();
        return;
    }
    
    const tabName = args[0];
    switchTab(tabName);
}

// Ejecutar
main();
