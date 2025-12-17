const AUTH0_CONFIG = {
    domain: 'dev-h2ejq43vrbo7ej3o.us.auth0.com',
    clientId: 'oHKhxOc6G1CxVPV0QYnROzxoY4ppZUQS',
    authorizationParams: {
        redirect_uri: window.location.origin + '/callback.html'
    }
};

let auth0Client = null;

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
        console.error(error);
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
        console.error(error);
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
        console.error(error);
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
        console.error(error);
    }
}

async function getUser() {
    try {
        const isAuthenticated = await auth0Client.isAuthenticated();
        if (isAuthenticated) {
            return await auth0Client.getUser();
        }
        return null;
    } catch (error) {
        console.error(error);
        return null;
    }
}

async function updateUI() {
    const loading = document.getElementById('loading');
    const loginView = document.getElementById('loginView');
    const userView = document.getElementById('userView');
    const logoutLinkNav = document.getElementById('logoutLink');
    
    if (loading) loading.classList.add('active');
    
    try {
        const user = await getUser();
        
        if (user) {
            if (loginView) loginView.style.display = 'none';
            if (userView) userView.style.display = 'block';
            if (loading) loading.classList.remove('active');
            
            const userEmailEl = document.getElementById('userEmail');
            if (userEmailEl) userEmailEl.textContent = user.email;
            
            if (logoutLinkNav) {
                logoutLinkNav.style.display = 'block';
                logoutLinkNav.textContent = 'Cerrar Sesion (' + (user.name || user.email.split('@')[0]) + ')';
            }
            
            const userData = {
                email: user.email,
                nombre: user.name || user.email.split('@')[0],
                id: user.sub,
                picture: user.picture
            };
            localStorage.setItem('secureshield_user', JSON.stringify(userData));
            
            const selectedPlan = sessionStorage.getItem('selected_plan');
            if (selectedPlan && window.location.pathname.includes('login.html')) {
                setTimeout(() => {
                    sessionStorage.removeItem('selected_plan');
                    window.location.href = 'confirmacion.html?plan=' + selectedPlan;
                }, 1000);
            }
        } else {
            if (loginView) loginView.style.display = 'block';
            if (userView) userView.style.display = 'none';
            if (loading) loading.classList.remove('active');
            
            if (logoutLinkNav) logoutLinkNav.style.display = 'none';
            localStorage.removeItem('secureshield_user');
        }
    } catch (error) {
        if (loading) loading.classList.remove('active');
        if (loginView) loginView.style.display = 'block';
    }
}

// REEMPLAZA DESDE "document.addEventListener..." HASTA EL FINAL DEL ARCHIVO auth-config.js

document.addEventListener('DOMContentLoaded', async function() {
    // Intentamos iniciar Auth0
    const initialized = await initAuth0();
    
    // CORRECCIÓN: Si falla la conexión (por dominios no permitidos, etc.),
    // forzamos que se muestre la vista de login para que la web no quede en blanco.
    if (!initialized) {
        console.warn('No se pudo conectar con Auth0. Mostrando vista offline/login.');
        const loading = document.getElementById('loading');
        const loginView = document.getElementById('loginView');
        if (loading) loading.style.display = 'none'; // Quitar cargando
        if (loginView) loginView.style.display = 'block'; // Mostrar login
        // No hacemos return para permitir que el resto de botones funcionen (aunque den error al clicar)
    }
    
    // Lógica para detectar si venimos redirigidos (callback) o si es una carga normal
    if (window.location.pathname.includes('login.html')) {
        const urlParams = new URLSearchParams(window.location.search);
        const plan = urlParams.get('plan');
        
        if (plan) {
            const planNotice = document.getElementById('planNotice');
            const selectedPlanEl = document.getElementById('selectedPlan');
            if (planNotice) planNotice.style.display = 'block';
            if (selectedPlanEl) selectedPlanEl.textContent = plan;
            sessionStorage.setItem('selected_plan', plan);
        }
        
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
        
        // Solo intentamos actualizar la UI si la inicialización fue correcta o si queremos comprobar estado
        await updateUI();
    }
    
    // Lógica para el botón de cerrar sesión del menú de navegación
    const logoutLinkNav = document.getElementById('logoutLink');
    if (logoutLinkNav) {
        logoutLinkNav.addEventListener('click', async function(e) {
            e.preventDefault();
            if (confirm('¿Estás seguro que deseas cerrar sesión?')) await logout();
        });
    }
    
    // Chequeo de sesión para otras páginas que no son login.html
    if (!window.location.pathname.includes('login.html')) {
        try {
            const user = await getUser();
            if (user && logoutLinkNav) {
                logoutLinkNav.style.display = 'block';
                const nombreMostrar = user.name || user.email.split('@')[0];
                logoutLinkNav.textContent = 'Cerrar Sesión (' + nombreMostrar + ')';
            }
        } catch (error) {
            console.error(error);
        }
    }
});