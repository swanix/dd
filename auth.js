// Configuración de Auth0
const AUTH0_CONFIG = {
  domain: 'dev-7kj3jxtxwwirocri.us.auth0.com',
  client_id: 'BORj4AB79Rho5yP5uSavuP4sern8pemZ',
  redirect_uri: window.location.origin
};

let auth0 = null;

// Configurar Auth0
const configureAuth0 = async () => {
  auth0 = await createAuth0Client(AUTH0_CONFIG);
};

// Mostrar overlay de autenticación
const showAuthOverlay = () => {
  const overlay = document.createElement('div');
  overlay.className = 'auth-overlay';
  overlay.id = 'auth-overlay';
  overlay.innerHTML = `
    <div class="login-container">
      <h2>Acceso requerido</h2>
      <p>Necesitas iniciar sesión para ver este contenido</p>
      <button class="login-btn" onclick="login()">Iniciar sesión</button>
    </div>
  `;
  document.body.appendChild(overlay);
};

// Ocultar overlay de autenticación
const hideAuthOverlay = () => {
  const overlay = document.getElementById('auth-overlay');
  if (overlay) {
    overlay.remove();
  }
};

// Mostrar información del usuario
const showUserInfo = (user) => {
  const userInfo = document.createElement('div');
  userInfo.className = 'user-info';
  userInfo.id = 'user-info';
  userInfo.innerHTML = `
    <span>Bienvenido, ${user.name || user.email}</span>
    <button class="logout-btn" onclick="logout()">Cerrar sesión</button>
  `;
  document.body.appendChild(userInfo);
};

// Ocultar información del usuario
const hideUserInfo = () => {
  const userInfo = document.getElementById('user-info');
  if (userInfo) {
    userInfo.remove();
  }
};

// Login
const login = async () => {
  await auth0.loginWithRedirect();
};

// Logout
const logout = async () => {
  await auth0.logout({
    returnTo: window.location.origin
  });
};

// Manejar redirección de Auth0
const handleRedirect = async () => {
  const query = window.location.search;
  if (query.includes("code=") && query.includes("state=")) {
    await auth0.handleRedirectCallback();
    window.history.replaceState({}, document.title, "/");
  }
};

// Verificar autenticación
const checkAuth = async () => {
  const isAuthenticated = await auth0.isAuthenticated();
  
  if (isAuthenticated) {
    const user = await auth0.getUser();
    hideAuthOverlay();
    showUserInfo(user);
    return true;
  } else {
    showAuthOverlay();
    hideUserInfo();
    return false;
  }
};

// Inicializar autenticación
const initAuth = async () => {
  await configureAuth0();
  await handleRedirect();
  await checkAuth();
};

// Hacer funciones globales
window.login = login;
window.logout = logout;
window.checkAuth = checkAuth;

// Iniciar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAuth);
} else {
  initAuth();
}
