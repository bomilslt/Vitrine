/**
 * BOMIL SOLUTIONS - Client Router (Hash Mode)
 * Uses #/path to handle navigation, compatible with any static server.
 */

import SEOManager from './seo-manager.js';

// Define updateActiveLink as standalone function first
function updateActiveLink() {
    // Current hash without query params
    let currentHash = window.location.hash || '#/';
    let currentPath = currentHash.split('?')[0];

    // Normalize: '#' alone or empty should be '#/'
    if (currentPath === '#' || currentPath === '') {
        currentPath = '#/';
    }

    const links = document.querySelectorAll('.nav-links a[data-link]');
    links.forEach(link => {
        const linkHref = link.getAttribute('href');

        // Reset first
        link.classList.remove('active');

        // Check match
        if (linkHref === currentPath) {
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
        // Handle hash changes
        window.addEventListener('hashchange', this.handleLocation.bind(this));

        // Initial load
        this.handleLocation();

        // Refresh dynamic content and SEO on language change
        window.addEventListener('languageChanged', () => {
            const hashParts = window.location.hash.split('?');
            const urlParams = new URLSearchParams(hashParts[1] || '');
            const productId = urlParams.get('id');
            const currentPath = window.location.hash.slice(1).split('?')[0] || '/';

            SEOManager.updateMeta(currentPath, productId);

            // Re-load product dynamic data if we are on a detail page
            if (productId) {
                import('./product-loader.js').then(module => {
                    module.loadProduct(productId);
                });
            }
        });
    },

    handleLocation: async function () {
        // Get hash (e.g. #/about) -> /about
        let path = window.location.hash.slice(1) || '/';

        // Helper to parse query params from hash if needed (e.g. #/product-detail?id=123)
        // Simple extraction: separate path and query
        let query = '';
        const queryIndex = path.indexOf('?');
        if (queryIndex !== -1) {
            query = path.slice(queryIndex);
            path = path.slice(0, queryIndex);
        }

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
        let currentPath = window.location.hash.slice(1).split('?')[0] || '/';
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
