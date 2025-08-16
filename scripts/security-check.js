#!/usr/bin/env node

// ===== VERIFICACIÓN DE SEGURIDAD - SWANIX WALL =====

const fs = require('fs');
const path = require('path');

console.log('🔒 Iniciando verificación de seguridad...\n');

let securityScore = 0;
const maxScore = 100;
const checks = [];

// ===== 1. VERIFICAR ARCHIVOS SENSIBLES =====
function checkSensitiveFiles() {
    console.log('📁 Verificando archivos sensibles...');
    
    const sensitiveFiles = [
        '.env',
        '.env.local',
        '.env.production',
        'assets/js/env-config.js'
    ];
    
    let passed = 0;
    sensitiveFiles.forEach(file => {
        if (fs.existsSync(file)) {
            if (file.includes('env-config.js')) {
                // env-config.js puede existir pero debe estar en .gitignore
                console.log(`  ⚠️  ${file} existe (debe estar en .gitignore)`);
            } else {
                console.log(`  ✅ ${file} existe (correcto para desarrollo)`);
            }
            passed++;
        } else {
            console.log(`  ❌ ${file} no existe`);
        }
    });
    
    checks.push({ name: 'Archivos sensibles', passed, total: sensitiveFiles.length });
    return passed === sensitiveFiles.length;
}

// ===== 2. VERIFICAR .GITIGNORE =====
function checkGitignore() {
    console.log('\n📋 Verificando .gitignore...');
    
    if (!fs.existsSync('.gitignore')) {
        console.log('  ❌ .gitignore no existe');
        return false;
    }
    
    const gitignore = fs.readFileSync('.gitignore', 'utf8');
    const requiredPatterns = [
        '.env',
        '.env.local',
        'assets/js/env-config.js',
        'node_modules/',
        '.netlify/'
    ];
    
    let passed = 0;
    requiredPatterns.forEach(pattern => {
        if (gitignore.includes(pattern)) {
            console.log(`  ✅ ${pattern} está en .gitignore`);
            passed++;
        } else {
            console.log(`  ❌ ${pattern} NO está en .gitignore`);
        }
    });
    
    checks.push({ name: '.gitignore', passed, total: requiredPatterns.length });
    return passed === requiredPatterns.length;
}

// ===== 3. VERIFICAR DEPENDENCIAS =====
function checkDependencies() {
    console.log('\n📦 Verificando dependencias...');
    
    if (!fs.existsSync('package.json')) {
        console.log('  ❌ package.json no existe');
        return false;
    }
    
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const dependencies = packageJson.dependencies || {};
    
    // Verificar que solo tenemos dependencias seguras
    const allowedDeps = ['jsonwebtoken', 'jwks-rsa'];
    const foundDeps = Object.keys(dependencies);
    
    let passed = 0;
    foundDeps.forEach(dep => {
        if (allowedDeps.includes(dep)) {
            console.log(`  ✅ ${dep} (dependencia segura)`);
            passed++;
        } else {
            console.log(`  ⚠️  ${dep} (dependencia no verificada)`);
        }
    });
    
    checks.push({ name: 'Dependencias', passed, total: foundDeps.length });
    return foundDeps.length <= allowedDeps.length;
}

// ===== 4. VERIFICAR HEADERS DE SEGURIDAD =====
function checkSecurityHeaders() {
    console.log('\n🛡️ Verificando headers de seguridad...');
    
    if (!fs.existsSync('netlify.toml')) {
        console.log('  ❌ netlify.toml no existe');
        return false;
    }
    
    const netlifyToml = fs.readFileSync('netlify.toml', 'utf8');
    const requiredHeaders = [
        'X-Frame-Options',
        'X-Content-Type-Options',
        'X-XSS-Protection',
        'Content-Security-Policy',
        'Referrer-Policy'
    ];
    
    let passed = 0;
    requiredHeaders.forEach(header => {
        if (netlifyToml.includes(header)) {
            console.log(`  ✅ ${header} configurado`);
            passed++;
        } else {
            console.log(`  ❌ ${header} NO configurado`);
        }
    });
    
    checks.push({ name: 'Headers de seguridad', passed, total: requiredHeaders.length });
    return passed === requiredHeaders.length;
}

// ===== 5. VERIFICAR FUNCIONES NETLIFY =====
function checkNetlifyFunctions() {
    console.log('\n⚡ Verificando funciones Netlify...');
    
    const functionsDir = 'netlify/functions';
    if (!fs.existsSync(functionsDir)) {
        console.log('  ❌ Directorio de funciones no existe');
        return false;
    }
    
    const functions = fs.readdirSync(functionsDir).filter(f => f.endsWith('.js'));
    const requiredFunctions = ['auth-protect.js', 'protect-html.js'];
    
    let passed = 0;
    requiredFunctions.forEach(func => {
        if (functions.includes(func)) {
            console.log(`  ✅ ${func} existe`);
            passed++;
        } else {
            console.log(`  ❌ ${func} NO existe`);
        }
    });
    
    checks.push({ name: 'Funciones Netlify', passed, total: requiredFunctions.length });
    return passed === requiredFunctions.length;
}

// ===== 6. VERIFICAR VALIDACIÓN DE TOKENS =====
function checkTokenValidation() {
    console.log('\n🔑 Verificando validación de tokens...');
    
    const protectHtmlPath = 'netlify/functions/protect-html.js';
    if (!fs.existsSync(protectHtmlPath)) {
        console.log('  ❌ protect-html.js no existe');
        return false;
    }
    
    const content = fs.readFileSync(protectHtmlPath, 'utf8');
    const requiredValidations = [
        'jwt.verify',
        'algorithms',
        'issuer',
        'Bearer'
    ];
    
    let passed = 0;
    requiredValidations.forEach(validation => {
        if (content.includes(validation)) {
            console.log(`  ✅ ${validation} implementado`);
            passed++;
        } else {
            console.log(`  ❌ ${validation} NO implementado`);
        }
    });
    
    checks.push({ name: 'Validación de tokens', passed, total: requiredValidations.length });
    return passed === requiredValidations.length;
}

// ===== 7. VERIFICAR RATE LIMITING =====
function checkRateLimiting() {
    console.log('\n🚫 Verificando rate limiting...');
    
    const rateLimiterPath = 'netlify/utils/rate-limiter.js';
    if (!fs.existsSync(rateLimiterPath)) {
        console.log('  ❌ rate-limiter.js no existe');
        return false;
    }
    
    const content = fs.readFileSync(rateLimiterPath, 'utf8');
    const requiredFeatures = [
        'rateLimitMiddleware',
        'maxRequests',
        'windowMs',
        'checkRateLimit'
    ];
    
    let passed = 0;
    requiredFeatures.forEach(feature => {
        if (content.includes(feature)) {
            console.log(`  ✅ ${feature} implementado`);
            passed++;
        } else {
            console.log(`  ❌ ${feature} NO implementado`);
        }
    });
    
    checks.push({ name: 'Rate limiting', passed, total: requiredFeatures.length });
    return passed === requiredFeatures.length;
}

// ===== EJECUTAR VERIFICACIONES =====
const results = [
    checkSensitiveFiles(),
    checkGitignore(),
    checkDependencies(),
    checkSecurityHeaders(),
    checkNetlifyFunctions(),
    checkTokenValidation(),
    checkRateLimiting()
];

// ===== CALCULAR PUNTAJE =====
const passedChecks = results.filter(r => r).length;
const totalChecks = results.length;

checks.forEach(check => {
    securityScore += (check.passed / check.total) * (100 / checks.length);
});

// ===== MOSTRAR RESULTADOS =====
console.log('\n' + '='.repeat(50));
console.log('📊 RESULTADOS DE VERIFICACIÓN DE SEGURIDAD');
console.log('='.repeat(50));

console.log(`\n🎯 Puntaje de seguridad: ${Math.round(securityScore)}/${maxScore}`);

if (securityScore >= 90) {
    console.log('🟢 EXCELENTE - El proyecto cumple con altos estándares de seguridad');
} else if (securityScore >= 70) {
    console.log('🟡 BUENO - El proyecto tiene una seguridad adecuada');
} else if (securityScore >= 50) {
    console.log('🟠 REGULAR - Se recomiendan mejoras de seguridad');
} else {
    console.log('🔴 CRÍTICO - Se requieren mejoras urgentes de seguridad');
}

console.log(`\n✅ Verificaciones pasadas: ${passedChecks}/${totalChecks}`);

// ===== RECOMENDACIONES =====
console.log('\n💡 RECOMENDACIONES:');

if (securityScore < 100) {
    console.log('• Revisar las verificaciones que fallaron');
    console.log('• Asegurar que todos los archivos sensibles estén en .gitignore');
    console.log('• Verificar que las funciones Netlify implementen validación completa');
    console.log('• Confirmar que los headers de seguridad estén configurados correctamente');
} else {
    console.log('• ¡Excelente trabajo! El proyecto está bien protegido');
    console.log('• Mantener las buenas prácticas de seguridad');
    console.log('• Realizar auditorías periódicas');
}

console.log('\n🔒 Verificación de seguridad completada.\n');

// Exit code basado en el puntaje
process.exit(securityScore >= 70 ? 0 : 1);
