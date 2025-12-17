document.addEventListener('DOMContentLoaded', function() {
    const toggle = document.getElementById('menuToggle');
    const menu = document.getElementById('navMenu');
    const overlay = document.getElementById('navOverlay');
    const body = document.body;
    
    // Verificar que existen los elementos
    if (!toggle || !menu || !overlay) {
        console.error('Elementos del menú no encontrados');
        return;
    }
    
    // Función para abrir menú
    function openMenu() {
        menu.classList.add('active');
        overlay.classList.add('active');
        toggle.classList.add('active');
        body.classList.add('menu-open');
    }
    
    // Función para cerrar menú
    function closeMenu() {
        menu.classList.remove('active');
        overlay.classList.remove('active');
        toggle.classList.remove('active');
        body.classList.remove('menu-open');
    }
    
    // Toggle al hacer clic en hamburguesa
    toggle.addEventListener('click', function(e) {
        e.stopPropagation();
        const isOpen = menu.classList.contains('active');
        
        if (isOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    });
    
    // Cerrar al hacer clic en overlay
    overlay.addEventListener('click', function() {
        closeMenu();
    });
    
    // Cerrar al hacer clic en un enlace
    const links = menu.querySelectorAll('a');
    links.forEach(function(link) {
        link.addEventListener('click', function() {
            // Pequeño delay para que se vea el clic
            setTimeout(function() {
                closeMenu();
            }, 200);
        });
    });
    
    // Cerrar con tecla Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && menu.classList.contains('active')) {
            closeMenu();
        }
    });
    
    // Cerrar si se redimensiona a desktop
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && menu.classList.contains('active')) {
            closeMenu();
        }
    });
});