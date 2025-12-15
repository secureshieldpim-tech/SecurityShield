// MENÚ MÓVIL - Versión corregida y con debug
(function() {
    'use strict';
    
    console.log('🚀 Iniciando menú móvil...');
    
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    const navOverlay = document.getElementById('navOverlay');

    // Verificación de elementos
    console.log('🔍 DEBUG MENÚ MÓVIL');
    console.log('Toggle existe:', !!menuToggle);
    console.log('Menu existe:', !!navMenu);
    console.log('Overlay existe:', !!navOverlay);

    if (!menuToggle || !navMenu || !navOverlay) {
        console.error('❌ Elementos del menú móvil no encontrados');
        return;
    }

    console.log('✅ Todos los elementos encontrados');
    console.log('📱 Estado inicial:');
    console.log('- menuToggle classes:', menuToggle.classList.toString());
    console.log('- navMenu classes:', navMenu.classList.toString());
    console.log('- navOverlay classes:', navOverlay.classList.toString());

    // Función para cerrar el menú
    function closeMenu() {
        console.log('🔴 Cerrando menú');
        menuToggle.classList.remove('active');
        navMenu.classList.remove('active');
        navOverlay.classList.remove('active');
        document.body.classList.remove('menu-open');
    }

    // Función para abrir el menú
    function openMenu() {
        console.log('🟢 Abriendo menú');
        menuToggle.classList.add('active');
        navMenu.classList.add('active');
        navOverlay.classList.add('active');
        document.body.classList.add('menu-open');
    }

    // Toggle al hacer clic en hamburguesa
    menuToggle.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        console.log('🖱️ CLIC EN HAMBURGUESA DETECTADO');
        console.log('Clases ANTES:', navMenu.classList.toString());
        
        if (navMenu.classList.contains('active')) {
            closeMenu();
        } else {
            openMenu();
        }
        
        // Log después del toggle
        setTimeout(() => {
            console.log('Clases DESPUÉS:', navMenu.classList.toString());
            console.log('Menu right position:', window.getComputedStyle(navMenu).right);
            console.log('Overlay opacity:', window.getComputedStyle(navOverlay).opacity);
            console.log('Overlay visibility:', window.getComputedStyle(navOverlay).visibility);
        }, 100);
    });

    // Cerrar al hacer clic en overlay
    navOverlay.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('🖱️ Clic en overlay');
        closeMenu();
    });

    // Cerrar al hacer clic en un enlace del menú
    const links = navMenu.querySelectorAll('a');
    links.forEach(link => {
        link.addEventListener('click', function() {
            console.log('🖱️ Clic en enlace:', this.textContent);
            // Solo cerramos en móvil
            if (window.innerWidth <= 768) {
                setTimeout(() => closeMenu(), 100);
            }
        });
    });

    // Cerrar con tecla ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            console.log('⌨️ ESC presionado');
            closeMenu();
        }
    });

    // Ajustar al cambiar tamaño de ventana
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
                console.log('📐 Ventana redimensionada - cerrando menú');
                closeMenu();
            }
        }, 250);
    });

    console.log('✅ Menú móvil inicializado correctamente');
})();