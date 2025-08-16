// ===== PROTECCIÓN INMEDIATA PARA PÁGINAS DE /APP/ =====
// Este script se ejecuta inmediatamente para proteger todas las páginas de la carpeta app

(async function() {
    try {
        // Configuración de Auth0
        const auth0Config = window.AUTH0_CONFIG || {
                domain: window.AUTH0_CONFIG?.domain || '',
    client_id: window.AUTH0_CONFIG?.client_id || '',
            redirect_uri: window.location.origin + '/app/',
            cacheLocation: 'localstorage'
        };

        // Crear cliente Auth0
        const auth0 = await createAuth0Client(auth0Config);
        
        // Verificar autenticación inmediatamente
        const isAuthenticated = await auth0.isAuthenticated();
        
        if (!isAuthenticated) {
            console.log('🚫 [APP-PROTECTION] Usuario no autenticado, redirigiendo a login');
            window.location.replace('/login.html');
            return;
        }
        
        console.log('✅ [APP-PROTECTION] Usuario autenticado, página protegida');
        
        // Marcar que la validación pasó
        window.APP_PROTECTION_PASSED = true;
        
    } catch (error) {
        console.error('❌ [APP-PROTECTION] Error en validación inmediata:', error);
        // En caso de error, redirigir al login
        window.location.replace('/login.html');
    }
})();
