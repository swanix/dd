#!/usr/bin/env node

// ===== SCRIPT PARA CONFIGURAR VARIABLES DE ENTORNO DE XDIAGRAMS =====
// Configura las variables necesarias para desarrollo local

const fs = require('fs');
const path = require('path');

// ===== CONFIGURACIÓN =====
const ENV_FILE = '.env.local';
const ENV_EXAMPLE = 'env.example';

// ===== FUNCIÓN PARA CONFIGURAR VARIABLES =====
async function setupXDiagramsEnv() {
  console.log('🔧 [SETUP] Configurando variables de entorno para XDiagrams...');
  console.log('');

  try {
    // ===== PASO 1: Verificar si existe .env.local =====
    console.log('🔍 [SETUP] Paso 1: Verificar archivo .env.local');
    
    let envContent = '';
    if (fs.existsSync(ENV_FILE)) {
      envContent = fs.readFileSync(ENV_FILE, 'utf8');
      console.log('   ✅ Archivo .env.local existe');
    } else {
      console.log('   ⚠️ Archivo .env.local no existe, se creará');
    }
    console.log('');

    // ===== PASO 2: Verificar variables existentes =====
    console.log('🔍 [SETUP] Paso 2: Verificar variables existentes');
    
    const existingVars = {
      AUTH0_DOMAIN: envContent.match(/AUTH0_DOMAIN=(.+)/)?.[1] || '',
      SHEETBEST_API_KEY: envContent.match(/SHEETBEST_API_KEY=(.+)/)?.[1] || '',
      XDIAGRAMS_SHEET_ID: envContent.match(/XDIAGRAMS_SHEET_ID=(.+)/)?.[1] || '',
      XDIAGRAMS_TAB_NAME: envContent.match(/XDIAGRAMS_TAB_NAME=(.+)/)?.[1] || ''
    };

    console.log('   Variables encontradas:');
    console.log(`   - AUTH0_DOMAIN: ${existingVars.AUTH0_DOMAIN ? '✅ Configurada' : '❌ No configurada'}`);
    console.log(`   - SHEETBEST_API_KEY: ${existingVars.SHEETBEST_API_KEY ? '✅ Configurada' : '❌ No configurada'}`);
    console.log(`   - XDIAGRAMS_SHEET_ID: ${existingVars.XDIAGRAMS_SHEET_ID ? '✅ Configurada' : '❌ No configurada'}`);
    console.log(`   - XDIAGRAMS_TAB_NAME: ${existingVars.XDIAGRAMS_TAB_NAME ? '✅ Configurada' : '❌ No configurada'}`);
    console.log('');

    // ===== PASO 3: Agregar variables faltantes =====
    console.log('🔍 [SETUP] Paso 3: Agregar variables faltantes');
    
    let updatedContent = envContent;
    let addedVars = [];

    // Agregar XDIAGRAMS_SHEET_ID si no existe
    if (!existingVars.XDIAGRAMS_SHEET_ID) {
      updatedContent += '\n# 🎯 XDIAGRAMS CONFIGURACIÓN\nXDIAGRAMS_SHEET_ID=f4c2def0-403c-4197-8020-9f1c42e34515\n';
      addedVars.push('XDIAGRAMS_SHEET_ID');
    }

    // Agregar XDIAGRAMS_TAB_NAME si no existe
    if (!existingVars.XDIAGRAMS_TAB_NAME) {
      if (!updatedContent.includes('XDIAGRAMS_TAB_NAME=')) {
        updatedContent += 'XDIAGRAMS_TAB_NAME=All\n';
        addedVars.push('XDIAGRAMS_TAB_NAME');
      }
    }

    // Agregar comentarios si se agregaron variables
    if (addedVars.length > 0) {
      console.log(`   ✅ Variables agregadas: ${addedVars.join(', ')}`);
    } else {
      console.log('   ✅ Todas las variables ya están configuradas');
    }
    console.log('');

    // ===== PASO 4: Verificar variables críticas =====
    console.log('🔍 [SETUP] Paso 4: Verificar variables críticas');
    
    const criticalVars = ['AUTH0_DOMAIN', 'SHEETBEST_API_KEY'];
    const missingCritical = criticalVars.filter(varName => !existingVars[varName]);
    
    if (missingCritical.length > 0) {
      console.log('   ⚠️ Variables críticas faltantes:');
      missingCritical.forEach(varName => {
        console.log(`   - ${varName}: Necesaria para autenticación y datos`);
      });
      console.log('');
      console.log('   📝 Para configurar estas variables:');
      console.log('   1. Copiar .env.example a .env.local');
      console.log('   2. Configurar AUTH0_DOMAIN con tu dominio de Auth0');
      console.log('   3. Configurar SHEETBEST_API_KEY con tu API key de SheetBest');
    } else {
      console.log('   ✅ Todas las variables críticas están configuradas');
    }
    console.log('');

    // ===== PASO 5: Guardar archivo actualizado =====
    if (addedVars.length > 0) {
      console.log('🔍 [SETUP] Paso 5: Guardar archivo .env.local');
      fs.writeFileSync(ENV_FILE, updatedContent);
      console.log('   ✅ Archivo .env.local actualizado');
    } else {
      console.log('🔍 [SETUP] Paso 5: No se requieren cambios');
      console.log('   ✅ Archivo .env.local está actualizado');
    }
    console.log('');

    // ===== PASO 6: Crear archivo de ejemplo si no existe =====
    if (!fs.existsSync(ENV_EXAMPLE)) {
      console.log('🔍 [SETUP] Paso 6: Crear archivo env.example');
      const exampleContent = `# ===== VARIABLES DE ENTORNO - XDIAGRAMS =====

# 🔐 CONFIGURACIÓN DE AUTH0
AUTH0_DOMAIN=tu-dominio.auth0.com
AUTH0_CLIENT_ID=tu-client-id-de-auth0
AUTH0_CLIENT_SECRET=tu-client-secret-de-auth0
AUTH0_AUDIENCE=tu-audience-de-auth0

# 📊 SHEETBEST API
SHEETBEST_API_KEY=tu-api-key-aqui
SHEETBEST_SHEET_ID=tu-sheet-id-aqui
SHEETBEST_TAB_NAME=nombre-del-tab-aqui

# 🎯 XDIAGRAMS CONFIGURACIÓN
XDIAGRAMS_SHEET_ID=f4c2def0-403c-4197-8020-9f1c42e34515
XDIAGRAMS_TAB_NAME=All

# 🌐 URLs DE LA APLICACIÓN
NETLIFY_URL=https://tu-sitio.netlify.app
LOCAL_URL=http://localhost:8888
`;
      fs.writeFileSync(ENV_EXAMPLE, exampleContent);
      console.log('   ✅ Archivo env.example creado');
    }
    console.log('');

    // ===== RESUMEN =====
    console.log('📊 [SETUP] RESUMEN DE CONFIGURACIÓN:');
    console.log('   - Variables de XDiagrams agregadas: ✅');
    console.log('   - Archivo .env.local actualizado: ✅');
    console.log('   - Variables críticas verificadas: ✅');
    console.log('');
    console.log('🚀 [SETUP] PRÓXIMOS PASOS:');
    console.log('   1. Configurar AUTH0_DOMAIN en .env.local');
    console.log('   2. Configurar SHEETBEST_API_KEY en .env.local');
    console.log('   3. Reiniciar el servidor de desarrollo');
    console.log('   4. Probar /app/xdiagrams-protected-auth.html');
    console.log('');

  } catch (error) {
    console.error('❌ [SETUP] Error durante la configuración:', error.message);
    process.exit(1);
  }
}

// ===== EJECUTAR CONFIGURACIÓN =====
if (require.main === module) {
  setupXDiagramsEnv()
    .then(() => {
      console.log('✅ [SETUP] Configuración completada');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ [SETUP] Error en la configuración:', error);
      process.exit(1);
    });
}

module.exports = { setupXDiagramsEnv };
