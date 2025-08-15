// ===== PLANTILLA PARA ANALIZAR USUARIOS DE AUTH0 =====
// ⚠️  NO INCLUIR DATOS REALES EN ESTE ARCHIVO
// 📝  Copiar este archivo y agregar datos reales localmente

// Lista de emails autorizados (según tu Auth0 Action)
const AUTHORIZED_EMAILS = [
    'ejemplo1@gmail.com',
    'ejemplo2@empresa.com',
    'ejemplo3@dominio.com'
];

const AUTHORIZED_DOMAIN = '@tudominio.com';

// Función para verificar si un email está autorizado
function isEmailAuthorized(email) {
    // Verificar dominio principal
    if (email.endsWith(AUTHORIZED_DOMAIN)) {
        return { authorized: true, reason: 'Dominio principal autorizado' };
    }
    
    // Verificar emails específicos
    if (AUTHORIZED_EMAILS.includes(email)) {
        return { authorized: true, reason: 'Email específico autorizado' };
    }
    
    return { authorized: false, reason: 'Email no autorizado' };
}

// Función para analizar usuarios
function analyzeUsers(users) {
    const analysis = {
        authorized: [],
        unauthorized: [],
        summary: {
            total: users.length,
            authorized: 0,
            unauthorized: 0
        }
    };

    users.forEach(user => {
        const email = user.email;
        const authStatus = isEmailAuthorized(email);
        
        const userInfo = {
            name: user.name,
            email: email,
            user_id: user.user_id,
            logins: user.logins_count,
            last_login: user.last_login,
            authorized: authStatus.authorized,
            reason: authStatus.reason
        };

        if (authStatus.authorized) {
            analysis.authorized.push(userInfo);
            analysis.summary.authorized++;
        } else {
            analysis.unauthorized.push(userInfo);
            analysis.summary.unauthorized++;
        }
    });

    return analysis;
}

// ===== EJEMPLO DE USO =====
// Reemplazar con datos reales de Auth0 (solo para uso local)

const exampleUsers = [
    {
        name: 'Usuario Ejemplo',
        email: 'usuario@ejemplo.com',
        user_id: 'google-oauth2|123456789',
        logins_count: 5,
        last_login: '1 hour ago'
    }
];

// Ejecutar análisis
const analysis = analyzeUsers(exampleUsers);

console.log('🔍 ANÁLISIS DE USUARIOS AUTH0');
console.log('==============================\n');

console.log('📊 RESUMEN:');
console.log(`Total usuarios: ${analysis.summary.total}`);
console.log(`✅ Autorizados: ${analysis.summary.authorized}`);
console.log(`❌ No autorizados: ${analysis.summary.unauthorized}\n`);

console.log('✅ USUARIOS AUTORIZADOS:');
analysis.authorized.forEach(user => {
    console.log(`- ${user.name} (${user.email})`);
    console.log(`  Razón: ${user.reason}`);
    console.log(`  Logins: ${user.logins}, Último: ${user.last_login}\n`);
});

console.log('❌ USUARIOS NO AUTORIZADOS:');
analysis.unauthorized.forEach(user => {
    console.log(`- ${user.name} (${user.email})`);
    console.log(`  Razón: ${user.reason}`);
    console.log(`  Logins: ${user.logins}, Último: ${user.last_login}\n`);
});

console.log('💡 RECOMENDACIONES:');
console.log('1. Los usuarios no autorizados pueden ser eliminados');
console.log('2. Verificar en Auth0 Logs los eventos "Access Denied"');
console.log('3. Considerar bloquear usuarios no autorizados en Auth0');

module.exports = { analyzeUsers, isEmailAuthorized };
