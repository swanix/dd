// Configuración de Auth0
const AUTH0_CONFIG = {
  domain: "dev-7kj3jxtxwirocri.us.auth0.com",
  clientId: "BORj4AB79Rho5yP5uSavuP4sern8pemZ",
  redirect_uri: window.location.origin,
  audience: "https://dev-7kj3jxtxwirocri.us.auth0.com/api/v2/"
};

let auth0Client = null;

       // Configurar Auth0
       const configureAuth0 = async () => {
         if (auth0Client) return auth0Client;

         // Esperar a que createAuth0Client esté disponible
         if (typeof createAuth0Client === 'undefined') {
           console.log('⏳ createAuth0Client no disponible, esperando...');
           await new Promise(resolve => setTimeout(resolve, 100));
           return configureAuth0();
         }

         try {
           auth0Client = await createAuth0Client(AUTH0_CONFIG);
           console.log('✅ Auth0 configurado correctamente');
           return auth0Client;
         } catch (error) {
           console.error('❌ Error configurando Auth0:', error);
           throw error;
         }
       };

// Obtener token de acceso
const getAccessToken = async () => {
  try {
    const token = await auth0Client.getTokenSilently();
    return token;
  } catch (error) {
    console.error('❌ Error obteniendo token:', error);
    throw error;
  }
};

// Obtener datos protegidos desde Netlify Function
const fetchProtectedData = async () => {
  try {
    const token = await getAccessToken();
    
    const response = await fetch('/.netlify/functions/sheetbest-proxy', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ Datos protegidos obtenidos:', data.length, 'elementos');
    return data;
  } catch (error) {
    console.error('❌ Error obteniendo datos protegidos:', error);
    throw error;
  }
};

// Actualizar xDiagrams con datos seguros
const updateXDiagramsWithSecureData = async () => {
  try {
    console.log('🔄 Actualizando xDiagrams con datos seguros...');
    
    // Obtener datos desde el proxy seguro
    const data = await fetchProtectedData();
    
    // Transformar datos al formato esperado por xDiagrams
    const transformedData = data.map(item => ({
      id: item.ID,
      parent: item.Parent || '',
      name: item.Name,
      type: item.Type,
      layout: item.Layout || '',
      url: item.URL || '',
      country: item.Country || '',
      technology: item.Technology || '',
      responsive: item.Responsive || '',
      description: item.Description || '',
      img: item.Img || ''
    }));

    // Actualizar configuración global de xDiagrams
    window.$xDiagrams = {
      data: transformedData, // Usar datos en lugar de URL
      title: "Inspector",
      clustersPerRow: "6 3 7 6 3",
      showThemeToggle: false
    };

    console.log('✅ xDiagrams actualizado con datos seguros');
    console.log('📊 Datos cargados:', transformedData.length, 'elementos');
    
  } catch (error) {
    console.error('❌ Error actualizando xDiagrams:', error);
    throw error;
  }
};

// Mostrar overlay de autenticación
const showAuthOverlay = () => {
  const overlay = document.getElementById('auth-overlay');
  if (overlay) {
    overlay.style.display = 'flex';
  }
  
  // Configurar botón de login
  const loginBtn = document.getElementById('login-btn');
  if (loginBtn) {
    loginBtn.onclick = login;
  }
};

// Ocultar overlay de autenticación
const hideAuthOverlay = () => {
  const overlay = document.getElementById('auth-overlay');
  if (overlay) {
    overlay.style.display = 'none';
  }
};

// Función de login
const login = async () => {
  try {
    await auth0Client.loginWithRedirect();
  } catch (error) {
    console.error('❌ Error en login:', error);
  }
};

// Función de logout
const logout = async () => {
  try {
    await auth0Client.logout({
      logoutParams: {
        returnTo: window.location.origin
      }
    });
  } catch (error) {
    console.error('❌ Error en logout:', error);
  }
};

// Manejar redirect después del login
const handleRedirect = async () => {
  try {
    if (window.location.search.includes('code=')) {
      await auth0Client.handleRedirectCallback();
      window.history.replaceState({}, document.title, window.location.pathname);
      console.log('✅ Redirect manejado correctamente');
    }
  } catch (error) {
    console.error('❌ Error manejando redirect:', error);
  }
};

// Verificar autenticación
const checkAuth = async () => {
  try {
    const isAuthenticated = await auth0Client.isAuthenticated();
    
    if (isAuthenticated) {
      console.log('✅ Usuario autenticado');
      hideAuthOverlay();
      
      // Actualizar xDiagrams con datos seguros
      await updateXDiagramsWithSecureData();
      
      return true;
    } else {
      console.log('⚠️ Usuario no autenticado');
      return false;
    }
  } catch (error) {
    console.error('❌ Error verificando autenticación:', error);
    return false;
  }
};

// Inicializar autenticación
const initAuth = async () => {
  console.log('🚀 Inicializando Auth0...');
  await configureAuth0();
  await handleRedirect();
  await checkAuth();
};

// Hacer funciones globales
window.configureAuth0 = configureAuth0;
window.getAccessToken = getAccessToken;
window.fetchProtectedData = fetchProtectedData;
window.updateXDiagramsWithSecureData = updateXDiagramsWithSecureData;
window.showAuthOverlay = showAuthOverlay;
window.hideAuthOverlay = hideAuthOverlay;
window.login = login;
window.logout = logout;
window.handleRedirect = handleRedirect;
window.checkAuth = checkAuth;
window.initAuth = initAuth;

// Iniciar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAuth);
} else {
  initAuth();
}
