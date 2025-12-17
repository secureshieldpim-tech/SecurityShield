// ==========================================
// CONFIGURACIÓN DE AUTH0
// ==========================================
const AUTH0_CONFIG = {
    domain: 'dev-h2ejq43vrbo7ej3o.us.auth0.com',
    clientId: '3PFB0yf1HGUbB7gLksQmu7jtdf4ubj6P',
    authorizationParams: {
        redirect_uri: window.location.origin + '/callback.html'
    }
};

let auth0Client = null;

// ==========================================
// FUNCIONES DEL SISTEMA
// ==========================================

async function initAuth0() {
    try {
        auth0Client = await auth0.createAuth0Client({
            domain: AUTH0_CONFIG.domain,
            clientId: AUTH0_CONFIG.clientId,
            authorizationParams: {
                redirect_uri: AUTH0_CONFIG.authorizationParams.redirect_uri
            },
            cacheLocation: 'localstorage'
        });
        return true;
    } catch (error) {
        console.error("Error crítico Auth0:", error);
        return false;
    }
}

async function login() {
    try {
        await auth0Client.loginWithRedirect({
            authorizationParams: {
                redirect_uri: window.location.origin + '/callback.html'
            }
        });
    } catch (error) {
        console.error("Login error:", error);
        alert("No se pudo conectar con el servidor de autenticación.");
    }
}

async function signup() {
    try {
        await auth0Client.loginWithRedirect({
            authorizationParams: {
                redirect_uri: window.location.origin + '/callback.html',
                screen_hint: 'signup'
            }
        });
    } catch (error) {
        console.error("Signup error:", error);
    }
}

async function logout() {
    try {
        await auth0Client.logout({
            logoutParams: {
                returnTo: window.location.origin + '/index.html'
            }
        });
        localStorage.removeItem('secureshield_user');
    } catch (error) {
        console.error("Logout error:", error);
        localStorage.removeItem('secureshield_user');
        window.location.href = 'index.html';
    }
}

async function getUser() {
    try {
        if (!auth0Client) return null;
        const isAuthenticated = await auth0Client.isAuthenticated();
        if (isAuthenticated) {
            return await auth0Client.getUser();
        }
        return null;
    } catch (error) {
        return null;
    }
}

// Función principal que controla qué se muestra en la pantalla
async function updateUI() {
    const loading = document.getElementById('loading');
    const loginView = document.getElementById('loginView');
    const userView = document.getElementById('userView');
    const logoutLinkNav = document.getElementById('logoutLink');
    const loginLinkNav = document.getElementById('loginLink'); // Referencia al link "Iniciar Sesión" del menú
    
    // 1. Intentamos obtener usuario (puede ser null si no está logueado)
    let user = null;
    try {
        user = await getUser();
    } catch (e) { console.error(e); }

    // 2. Quitamos el cargando siempre
    if (loading) {
        loading.style.display = 'none'; 
        loading.classList.remove('active');
    }
    
    // 3. Lógica de visualización
    if (user) {
        // --- USUARIO LOGUEADO ---
        console.log("Usuario detectado:", user.email);
        
        // Si estamos en la página de login, ocultamos el formulario y mostramos el panel de usuario
        if (loginView) loginView.style.display = 'none';
        if (userView) userView.style.display = 'block';
        
        // Actualizamos datos en la interfaz
        const userEmailEl = document.getElementById('userEmail');
        if (userEmailEl) userEmailEl.textContent = user.email;
        
        // Actualizamos el menú de navegación (Navbar)
        if (logoutLinkNav) {
            logoutLinkNav.style.display = 'block';
            const displayName = user.name || user.email.split('@')[0];
            logoutLinkNav.textContent = `Cerrar Sesión (${displayName})`;
        }
        if (loginLinkNav) loginLinkNav.style.display = 'none'; // Ocultar "Iniciar Sesión" en el menú
        
        // Guardamos copia local de seguridad
        const userData = {
            email: user.email,
            nombre: user.name || user.email.split('@')[0],
            id: user.sub,
            picture: user.picture
        };
        localStorage.setItem('secureshield_user', JSON.stringify(userData));

        // Redirección post-login si hay plan pendiente
        const selectedPlan = sessionStorage.getItem('selected_plan');
        if (selectedPlan && loginView) { // Solo redirigir si estábamos en la página de login
            setTimeout(() => {
                sessionStorage.removeItem('selected_plan');
                window.location.href = 'confirmacion.html?plan=' + selectedPlan;
            }, 500);
        }

    } else {
        // --- USUARIO NO LOGUEADO (Visitante) ---
        console.log("No hay usuario activo");
        
        // Si estamos en la página de login, mostramos el formulario
        if (loginView) loginView.style.display = 'block';
        if (userView) userView.style.display = 'none';
        
        // Menú de navegación
        if (logoutLinkNav) logoutLinkNav.style.display = 'none';
        if (loginLinkNav) loginLinkNav.style.display = 'block';
        
        localStorage.removeItem('secureshield_user');
    }
}

// ==========================================
// INICIALIZACIÓN
// ==========================================

document.addEventListener('DOMContentLoaded', async function() {
    // 1. Inicializar Auth0
    const initialized = await initAuth0();

    // 2. Comprobar si estamos en la página de LOGIN mirando si existen sus elementos
    // (Esto arregla el error de que no funcione en URLs sin .html)
    const isLoginPage = document.getElementById('loginView') !== null;

    if (isLoginPage) {
        // Estamos en login.html (o /login)
        
        // Manejo de parámetros URL (planes)
        const urlParams = new URLSearchParams(window.location.search);
        const plan = urlParams.get('plan');
        if (plan) {
            const planNotice = document.getElementById('planNotice');
            const selectedPlanEl = document.getElementById('selectedPlan');
            if (planNotice) planNotice.style.display = 'block';
            if (selectedPlanEl) selectedPlanEl.textContent = plan;
            sessionStorage.setItem('selected_plan', plan);
        }
        
        // Listeners de botones
        const loginButton = document.getElementById('loginButton');
        const signupButton = document.getElementById('signupButton');
        const logoutButton = document.getElementById('logoutButton');
        
        if (loginButton) loginButton.addEventListener('click', login);
        if (signupButton) signupButton.addEventListener('click', signup);
        if (logoutButton) {
            logoutButton.addEventListener('click', () => {
                if (confirm('¿Estás seguro que deseas cerrar sesión?')) logout();
            });
        }

        // Si falló la inicialización de Auth0, forzamos mostrar la interfaz
        // para que no se quede la pantalla en blanco
        if (!initialized) {
            console.warn("Forzando UI por fallo de inicialización");
            const loading = document.getElementById('loading');
            const loginView = document.getElementById('loginView');
            if (loading) loading.style.display = 'none';
            if (loginView) loginView.style.display = 'block';
            return; // Salimos para no intentar llamar a Auth0
        }
    }

    // 3. Listener global para el botón de logout del menú (existe en todas las páginas)
    const logoutLinkNav = document.getElementById('logoutLink');
    if (logoutLinkNav) {
        logoutLinkNav.addEventListener('click', async function(e) {
            e.preventDefault();
            if (confirm('¿Estás seguro que deseas cerrar sesión?')) await logout();
        });
    }

    // 4. Finalmente, actualizamos la interfaz
    if (initialized) {
        await updateUI();
    }
});