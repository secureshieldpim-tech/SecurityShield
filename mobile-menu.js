document.addEventListener('DOMContentLoaded', function() {
    const toggle = document.getElementById('menuToggle');
    const menu = document.getElementById('navMenu');
    const overlay = document.getElementById('navOverlay');
    
    if (!toggle || !menu || !overlay) return;
    
    toggle.onclick = function() {
        const isOpen = menu.classList.contains('active');
        
        if (isOpen) {
            menu.classList.remove('active');
            overlay.classList.remove('active');
            toggle.classList.remove('active');
        } else {
            menu.classList.add('active');
            overlay.classList.add('active');
            toggle.classList.add('active');
        }
    };
    
    overlay.onclick = function() {
        menu.classList.remove('active');
        overlay.classList.remove('active');
        toggle.classList.remove('active');
    };
    
    const links = menu.querySelectorAll('a');
    links.forEach(function(link) {
        link.onclick = function() {
            setTimeout(function() {
                menu.classList.remove('active');
                overlay.classList.remove('active');
                toggle.classList.remove('active');
            }, 200);
        };
    });
});