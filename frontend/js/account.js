// account.js
document.addEventListener('DOMContentLoaded', function() {
    const accountBtn = document.getElementById('accountLink');
    const userMenu = document.getElementById('userMenu');
    const loginLink = document.getElementById('loginLink');
    const registerLink = document.getElementById('registerLink');
    const logoutLink = document.getElementById('logoutLink');
    const userGreeting = document.getElementById('userGreeting');
    const userEmail = document.getElementById('userEmail');

    // Empêcher le comportement par défaut des liens
    function preventDefaultLinks(e) {
        if (e.target.closest('.user-menu-links a')) {
            e.preventDefault();
            const href = e.target.closest('a').getAttribute('href');
            if (href === '#') {
                // Gérer la déconnexion
                if (window.Auth && typeof window.Auth.logout === 'function') {
                    window.Auth.logout();
                }
                window.location.href = 'index.html';
            } else if (href) {
                window.location.href = href;
            }
        }
    }

    // Vérifier si l'utilisateur est connecté
    function checkAuth() {
        const user = JSON.parse(localStorage.getItem('bds_user') || 'null');
        const token = localStorage.getItem('bds_token');
        
        if (user && token) {
            // Utilisateur connecté
            userGreeting.textContent = `Bonjour, ${user.name || user.email.split('@')[0]}`;
            if (user.email) {
                userEmail.textContent = user.email;
                userEmail.classList.remove('hidden');
            }
            loginLink.classList.add('hidden');
            registerLink.classList.add('hidden');
            logoutLink.classList.remove('hidden');
        }
    }

    // Afficher/masquer le menu
    function toggleMenu(e) {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        userMenu.classList.toggle('active');
    }

    // Fermer le menu
    function closeMenu() {
        userMenu.classList.remove('active');
    }

    // Gestion des événements
    if (accountBtn && userMenu) {
        accountBtn.addEventListener('click', toggleMenu);
        document.addEventListener('click', closeMenu);
        userMenu.addEventListener('click', function(e) {
            e.stopPropagation();
            // Gérer les clics sur les liens
            if (e.target.closest('a')) {
                const link = e.target.closest('a');
                if (link.id === 'logoutLink') {
                    e.preventDefault();
                    if (window.Auth && typeof window.Auth.logout === 'function') {
                        window.Auth.logout();
                    }
                    window.location.href = 'index.html';
                }
            }
        });
    }

    // Vérifier l'état d'authentification au chargement
    checkAuth();
});