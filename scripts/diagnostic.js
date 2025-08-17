#!/usr/bin/env node

/**
 * Script de diagnóstico para mostrar el estado actual de scripts y archivos JS
 * 
 * Uso:
 * node scripts/diagnostic.js
 */

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

function logHeader(message) {
    log(`\n${colors.bright}${message}${colors.reset}`);
    log('='.repeat(message.length));
}

function logSection(message) {
    log(`\n${colors.cyan}${message}${colors.reset}`);
    log('-'.repeat(message.length));
}

function getFileSize(filePath) {
    try {
        const stats = fs.statSync(filePath);
        return (stats.size / 1024).toFixed(1) + ' KB';
    } catch (error) {
        return 'No existe';
    }
}

function analyzeScripts() {
    logHeader('DIAGNÓSTICO DE SCRIPTS Y ARCHIVOS JS');
    
    // Scripts en /scripts
    logSection('SCRIPTS (scripts/)');
    const scriptsDir = path.join(__dirname);
    const scripts = fs.readdirSync(scriptsDir)
        .filter(file => file.endsWith('.js'))
        .sort();
    
    const scriptCategories = {
        '🔥 ESENCIALES': [],
        '⚡ ÚTILES': [],
        '🔄 OPCIONALES': [],
        '🗑️ ELIMINABLES': []
    };
    
    scripts.forEach(script => {
        const filePath = path.join(scriptsDir, script);
        const size = getFileSize(filePath);
        
        // Clasificar scripts
        if (['inject-env.js', 'setup.js'].includes(script)) {
            scriptCategories['🔥 ESENCIALES'].push({ name: script, size });
        } else if (['test-table.js', 'switch-tab.js', 'debug-sheetbest.js', 'security-check.js', 'fix-env-config.js'].includes(script)) {
            scriptCategories['⚡ ÚTILES'].push({ name: script, size });
        } else if (['version-assets.js', 'restore-cache.js', 'update-urls.js', 'cleanup-docs.js'].includes(script)) {
            scriptCategories['🔄 OPCIONALES'].push({ name: script, size });
        } else {
            scriptCategories['🗑️ ELIMINABLES'].push({ name: script, size });
        }
    });
    
    Object.entries(scriptCategories).forEach(([category, files]) => {
        if (files.length > 0) {
            log(`\n${category}:`, 'yellow');
            files.forEach(file => {
                log(`  📄 ${file.name} (${file.size})`);
            });
        }
    });
    
    // Archivos JS en /assets/js
    logSection('ARCHIVOS JS FRONTEND (assets/js/)');
    const jsDir = path.join(__dirname, '..', 'assets', 'js');
    if (fs.existsSync(jsDir)) {
        const jsFiles = fs.readdirSync(jsDir)
            .filter(file => file.endsWith('.js'))
            .sort();
        
        jsFiles.forEach(file => {
            const filePath = path.join(jsDir, file);
            const size = getFileSize(filePath);
            log(`  📄 ${file} (${size}) - ${colors.green}CRÍTICO${colors.reset}`);
        });
    }
    
    // Netlify Functions
    logSection('NETLIFY FUNCTIONS (netlify/functions/)');
    const functionsDir = path.join(__dirname, '..', 'netlify', 'functions');
    if (fs.existsSync(functionsDir)) {
        const functionFiles = fs.readdirSync(functionsDir)
            .filter(file => file.endsWith('.js'))
            .sort();
        
        functionFiles.forEach(file => {
            const filePath = path.join(functionsDir, file);
            const size = getFileSize(filePath);
            log(`  📄 ${file} (${size}) - ${colors.green}CRÍTICO${colors.reset}`);
        });
    }
    
    // Scripts en package.json
    logSection('SCRIPTS EN PACKAGE.JSON');
    try {
        const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8'));
        const scripts = Object.keys(packageJson.scripts).sort();
        
        scripts.forEach(script => {
            const scriptFile = packageJson.scripts[script].split(' ')[1];
            const exists = fs.existsSync(path.join(__dirname, '..', scriptFile));
            const status = exists ? '✅' : '❌';
            log(`  ${status} ${script} -> ${scriptFile}`);
        });
    } catch (error) {
        log('❌ Error leyendo package.json', 'red');
    }
    
    // Resumen
    logHeader('RESUMEN');
    const totalScripts = scripts.length;
    const essentialScripts = scriptCategories['🔥 ESENCIALES'].length;
    const usefulScripts = scriptCategories['⚡ ÚTILES'].length;
    const optionalScripts = scriptCategories['🔄 OPCIONALES'].length;
    const eliminableScripts = scriptCategories['🗑️ ELIMINABLES'].length;
    
    log(`📊 Total de scripts: ${totalScripts}`);
    log(`🔥 Esenciales: ${essentialScripts}`, 'green');
    log(`⚡ Útiles: ${usefulScripts}`, 'blue');
    log(`🔄 Opcionales: ${optionalScripts}`, 'yellow');
    log(`🗑️ Eliminables: ${eliminableScripts}`, 'red');
    
    if (eliminableScripts > 0) {
        log(`\n💡 Recomendación: Eliminar ${eliminableScripts} script(s) innecesario(s)`, 'yellow');
    }
    
    log(`\n✅ Diagnóstico completado`, 'green');
}

// Ejecutar diagnóstico
analyzeScripts();
