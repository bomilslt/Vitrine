/**
 * BOMIL SOLUTIONS - Client Router (Hash Mode)
 * Uses #/path to handle navigation, compatible with any static server.
 */

import SEOManager from './seo-manager.js';

// Define updateActiveLink as standalone function first
function updateActiveLink() {
    const currentPath = window.location.pathname || '/';

    const links = document.querySelectorAll('.nav-links a[data-link]');
    links.forEach(link => {
        let linkHref = link.getAttribute('href');

        // Remove trailing slashes for comparison if necessary
        const normalizedLink = linkHref.replace(/\/$/, '') || '/';
        const normalizedCurrent = currentPath.replace(/\/$/, '') || '/';

        // Reset first
        link.classList.remove('active');

        // Check match
        if (normalizedLink === normalizedCurrent) {
            link.classList.add('active');
        }
    });
}

const router = {
    // Map hashes to view files relative to index.html
    routes: {
        '': 'views/home.html',
        '/': 'views/home.html',
        '/about': 'views/about.html',
        '/services': 'views/services.html',
        '/products': 'views/products.html',
        '/contact': 'views/contact.html',
    },

    init: function () {
        // Handle browser back/forward buttons
        window.addEventListener('popstate', this.handleLocation.bind(this));

        // Intercept all internal clicks
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[data-link]');
            if (link) {
                e.preventDefault();
                const path = link.getAttribute('href');
                this.navigate(path);
            }
        });

        // Initial load
        this.handleLocation();

        // Refresh dynamic content and SEO on language change
        window.addEventListener('languageChanged', () => {
            const urlParams = new URLSearchParams(window.location.search);
            const productId = urlParams.get('id');
            const currentPath = window.location.pathname;

            SEOManager.updateMeta(currentPath, productId);

            // Re-load product dynamic data if we are on a detail page
            if (productId) {
                import('./product-loader.js').then(module => {
                    module.loadProduct(productId);
                });
            }
        });
    },

    navigate: function (path) {
        window.history.pushState({}, '', path);
        this.handleLocation();
    },

    handleLocation: async function () {
        // Get path (e.g. /about)
        let path = window.location.pathname || '/';
        const query = window.location.search;

        let viewPath = this.routes[path];

        // Specific handling for product detail
        if (path === '/product-detail') {
            viewPath = 'views/product-detail.html';
        }

        if (!viewPath) {
            viewPath = 'views/home.html';
        }

        try {
            // Fetch the view content
            const response = await fetch(viewPath);
            if (!response.ok) throw new Error(`Could not load view: ${viewPath}`);
            const html = await response.text();

            // Inject into Main App
            const app = document.getElementById('app');

            // Fade effect
            app.style.opacity = '0';
            setTimeout(() => {
                app.innerHTML = html;
                app.style.opacity = '1';
                // Re-run scripts/observers
                this.afterViewLoad(query); // Pass query params to afterViewLoad
            }, 100);

        } catch (error) {
            console.error('Router Error:', error);
            document.getElementById('app').innerHTML = `<h2>Erreur de chargement</h2><p>Impossible d'afficher cette page.</p>`;
        }
    },

    afterViewLoad: function (query) {
        // Re-initialize all premium animations
        if (window.reinitAnimations) {
            window.reinitAnimations();
        }

        // Product Detail Logic
        const urlParams = new URLSearchParams(query);
        const productId = urlParams.get('id');

        if (productId) {
            import('./product-loader.js').then(module => {
                module.loadProduct(productId);
            }).catch(e => console.log('Product loader error:', e));
        }

        // Active Link Handling - use standalone function
        updateActiveLink();

        // SEO: Update meta tags based on current page
        let currentPath = window.location.pathname;
        SEOManager.updateMeta(currentPath, productId);

        // i18n: Reapply translations after view load
        if (window.i18n) {
            setTimeout(() => {
                window.i18n.applyTranslations();
            }, 100);
        }

        // Scroll to top on navigation
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
};

export default router;
