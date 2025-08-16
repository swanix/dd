// ===== MANEJADOR DE LOGOUT ROBUSTO =====

class LogoutHandler {
    constructor(auth0) {
        this.auth0 = auth0;
    }

    async performLogout() {
        try {
            console.log('🔄 Iniciando proceso de logout...');
            
            // 1. Limpiar todos los datos locales
            this.clearAllData();
            
            // 2. Intentar logout de Auth0
            await this.auth0Logout();
            
            // 3. Redirigir a la página principal
            this.redirectToHome();
            
        } catch (error) {
            console.error('❌ Error en logout:', error);
            // 4. Fallback: limpiar todo y redirigir de todas formas
            this.forceLogout();
        }
    }

    clearAllData() {
        try {
            // Limpiar localStorage
            localStorage.clear();
            
            // Limpiar sessionStorage
            sessionStorage.clear();
            
            // Limpiar cookies relacionadas con Auth0
            this.clearAuth0Cookies();
            
            console.log('✅ Datos locales limpiados');
        } catch (error) {
            console.error('⚠️ Error limpiando datos locales:', error);
        }
    }

    clearAuth0Cookies() {
        try {
            // Limpiar cookies de Auth0
            const cookies = document.cookie.split(';');
            cookies.forEach(cookie => {
                const eqPos = cookie.indexOf('=');
                const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
                if (name.includes('auth0') || name.includes('auth')) {
                    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
                }
            });
        } catch (error) {
            console.error('⚠️ Error limpiando cookies:', error);
        }
    }

    async auth0Logout() {
        try {
            // Intentar logout sin returnTo para evitar problemas de configuración
            await this.auth0.logout({
                clientId: this.auth0.options.client_id,
                returnTo: window.location.origin
            });
            console.log('✅ Logout de Auth0 completado');
        } catch (error) {
            console.error('⚠️ Error en logout de Auth0:', error);
            // Continuar con el proceso de todas formas
        }
    }

    redirectToHome() {
        try {
            // Redirigir a la página principal
            window.location.replace('/');
            console.log('✅ Redirección iniciada');
        } catch (error) {
            console.error('⚠️ Error en redirección:', error);
            // Fallback: usar location.href
            window.location.href = '/';
        }
    }

    forceLogout() {
        try {
            // Limpiar todo de forma agresiva
            this.clearAllData();
            
            // Redirigir inmediatamente
            window.location.replace('/');
            
            console.log('🔄 Logout forzado completado');
        } catch (error) {
            console.error('❌ Error en logout forzado:', error);
            // Último recurso: recargar la página
            window.location.reload();
        }
    }
}

// Exportar para uso global
window.LogoutHandler = LogoutHandler;
