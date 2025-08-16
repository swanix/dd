// ===== LOGOUT SIMPLE Y DIRECTO =====

function performSimpleLogout() {
    console.log('🔄 Iniciando logout simple...');
    
    try {
        // 1. Limpiar todos los datos
        localStorage.clear();
        sessionStorage.clear();
        
        // 2. Limpiar cookies de Auth0
        const cookies = document.cookie.split(';');
        cookies.forEach(cookie => {
            const eqPos = cookie.indexOf('=');
            const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
            if (name.includes('auth0') || name.includes('auth') || name.includes('token')) {
                document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
                document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;
            }
        });
        
        // 3. Redirigir a la página principal
        console.log('✅ Logout simple completado, redirigiendo...');
        window.location.replace('/');
        
    } catch (error) {
        console.error('❌ Error en logout simple:', error);
        // Último recurso: recargar la página
        window.location.reload();
    }
}

// Función global para logout
window.performSimpleLogout = performSimpleLogout;
