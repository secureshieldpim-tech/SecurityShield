// MENÚ MÓVIL - Script centralizado y optimizado
(function() {
    'use strict';
    
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    const navOverlay = document.getElementById('navOverlay');

    if (!menuToggle || !navMenu || !navOverlay) {
        console.warn('⚠️ Elementos del menú móvil no encontrados');
        return;
    }

    // Función para cerrar el menú
    function closeMenu() {
        menuToggle.classList.remove('active');
        navMenu.classList.remove('active');
        navOverlay.classList.remove('active');
        document.body.classList.remove('menu-open');
    }

    // Función para abrir el menú
    function openMenu() {
        menuToggle.classList.add('active');
        navMenu.classList.add('active');
        navOverlay.classList.add('active');
        document.body.classList.add('menu-open');
    }

    // Toggle al hacer clic en hamburguesa
    menuToggle.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        if (navMenu.classList.contains('active')) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    // Cerrar al hacer clic en overlay
    navOverlay.addEventListener('click', function(e) {
        e.preventDefault();
        closeMenu();
    });

    // Cerrar al hacer clic en un enlace del menú
    const links = navMenu.querySelectorAll('a');
    links.forEach(link => {
        link.addEventListener('click', function() {
            // Solo cerramos en móvil
            if (window.innerWidth <= 768) {
                closeMenu();
            }
        });
    });

    // Cerrar con tecla ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            closeMenu();
        }
    });

    // Ajustar al cambiar tamaño de ventana
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
                closeMenu();
            }
        }, 250);
    });

    console.log('✅ Menú móvil inicializado correctamente');
})();