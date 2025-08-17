#!/usr/bin/env node

/**
 * Script para reiniciar el servidor de desarrollo
 * Uso: node scripts/restart-dev-server.js
 */

const { spawn } = require('child_process');
const fs = require('fs');

console.log('🔄 Reiniciando servidor de desarrollo...\n');

// Verificar que .env.local existe
if (!fs.existsSync('.env.local')) {
    console.error('❌ No se encontró .env.local');
    process.exit(1);
}

// Verificar variables de xdiagrams
const envContent = fs.readFileSync('.env.local', 'utf8');
const hasXDiagramsVars = envContent.includes('XDIAGRAMS_SHEET_ID') && envContent.includes('XDIAGRAMS_TAB_NAME');

if (!hasXDiagramsVars) {
    console.error('❌ Variables de XDiagrams no encontradas en .env.local');
    console.log('💡 Asegúrate de que XDIAGRAMS_SHEET_ID y XDIAGRAMS_TAB_NAME estén definidas');
    process.exit(1);
}

console.log('✅ Variables de entorno verificadas');

// Buscar proceso de netlify dev
const findProcess = spawn('lsof', ['-ti:8888']);

findProcess.stdout.on('data', (data) => {
    const pids = data.toString().trim().split('\n').filter(pid => pid);
    
    if (pids.length > 0) {
        console.log(`🔄 Deteniendo procesos en puerto 8888: ${pids.join(', ')}`);
        
        pids.forEach(pid => {
            try {
                process.kill(pid, 'SIGTERM');
                console.log(`✅ Proceso ${pid} terminado`);
            } catch (error) {
                console.log(`⚠️ No se pudo terminar proceso ${pid}: ${error.message}`);
            }
        });
        
        // Esperar un momento y reiniciar
        setTimeout(() => {
            startDevServer();
        }, 2000);
    } else {
        console.log('ℹ️ No hay procesos corriendo en puerto 8888');
        startDevServer();
    }
});

findProcess.stderr.on('data', (data) => {
    console.log('ℹ️ No hay procesos corriendo en puerto 8888');
    startDevServer();
});

function startDevServer() {
    console.log('🚀 Iniciando servidor de desarrollo...');
    
    const devServer = spawn('npx', ['netlify', 'dev'], {
        stdio: 'inherit',
        env: { ...process.env, FORCE_COLOR: '1' }
    });
    
    devServer.on('error', (error) => {
        console.error('❌ Error iniciando servidor:', error.message);
        process.exit(1);
    });
    
    devServer.on('close', (code) => {
        console.log(`\n🔄 Servidor terminado con código: ${code}`);
    });
    
    // Manejar Ctrl+C
    process.on('SIGINT', () => {
        console.log('\n🔄 Deteniendo servidor...');
        devServer.kill('SIGINT');
        process.exit(0);
    });
}

findProcess.on('error', (error) => {
    console.log('ℹ️ No se pudo verificar procesos, iniciando servidor...');
    startDevServer();
});

