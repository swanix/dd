// ===== AUTH0 ACTION: RESTRICCIÓN DE EMAILS + REDIRECCIÓN DIRECTA =====

/**
 * Trigger: Post Login
 * 
 * Esta Action restringe el acceso basado en dominio y emails específicos.
 * Si el acceso es denegado, redirige directamente a la página de acceso denegado.
 */

exports.onExecutePostLogin = async (event, api) => {
    // Dominio principal permitido (todos los empleados)
    const primaryDomain = '@sebastianserna.com';
    
    // Lista de emails específicos permitidos (partners externos)
    const allowedSpecificEmails = [
        'jsebastianserna@gmail.com',
        'sebastian@alegra.com',
        'marcfond@gmail.com'
        // Agrega aquí más emails de partners
    ];
    
    const userEmail = event.user.email;
    
    // Verificar si el email está en la lista específica
    if (allowedSpecificEmails.includes(userEmail)) {
        console.log('✅ Acceso permitido: Email específico autorizado');
        return;
    }
    
    // Verificar si pertenece al dominio principal
    if (userEmail.endsWith(primaryDomain)) {
        console.log('✅ Acceso permitido: Dominio principal autorizado');
        return;
    }
    
    // Si no cumple ninguna condición, denegar acceso y redirigir directo
    console.log('❌ Acceso denegado: Email no autorizado');
    
    // Redirigir directamente a la página de acceso denegado
    api.redirect.sendUserTo('/access-denied.html');
};

// ===== INSTRUCCIONES DE USO =====
/*
Para usar esta Action en Auth0:

1. Ve a Auth0 Dashboard → Actions → Auth Pipeline
2. Selecciona "Triggers" → "Login" → "Post Login"
3. Crea una nueva Action
4. Copia y pega este código
5. Personaliza:
   - primaryDomain: Cambia '@sebastianserna.com' por tu dominio
   - allowedSpecificEmails: Agrega/quita emails de partners
6. Guarda la Action con un nombre descriptivo
7. Agrega la Action al flujo de Login
8. Deploy la Action

IMPORTANTE: Agrega /access-denied.html a las URLs permitidas en Auth0:
- Allowed Callback URLs: https://swanixdd.netlify.app/access-denied.html
- Allowed Logout URLs: https://swanixdd.netlify.app/access-denied.html

Esta Action permite:
✅ Todos los emails de @sebastianserna.com
✅ Emails específicos de partners externos
❌ Cualquier otro email → Redirige directo a /access-denied.html
*/
