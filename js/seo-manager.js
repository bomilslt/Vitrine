/**
 * SEO Manager - Gestion dynamique des meta tags
 * Met à jour les balises meta selon la page active
 */

const SEOManager = {
    // Configuration des URLs et images (les textes viennent maintenant de i18n)
    config: {
        baseUrl: 'https://www.bomils.com/',
        paths: {
            '/': 'default',
            '/about': 'about',
            '/services': 'services',
            '/products': 'products',
            '/contact': 'contact',
            '/product-detail': 'productDetail'
        },
        images: {
            'default': 'assets/images/hero-visual.png',
            'about': 'assets/images/team-ceo.png',
            'services': 'assets/images/dashboard-preview.png',
            'products': 'assets/images/product-lucid.png',
            'contact': 'assets/images/logo.png',
            'lucid': 'assets/images/product-lucid.png',
            'logis': 'assets/images/product-logis.png',
            'intercity': 'assets/images/product-intercity.png'
        }
    },

    /**
     * Met à jour les meta tags selon la page
     */
    updateMeta: function (path, productId = null) {
        const pageKey = this.config.paths[path] || 'default';
        let i18nPath = `seo.${pageKey}`;
        let ogImage = this.config.images[pageKey];
        let canonical = this.config.baseUrl + (path === '/' ? '' : path.slice(1));

        // Gestion spéciale pour les pages produits
        if (path === '/product-detail' && productId) {
            i18nPath = `seo.productDetail.${productId}`;
            ogImage = this.config.images[productId] || ogImage;
            canonical += `?id=${productId}`;
        }

        // Récupération des traductions (via window.i18n car SEOManager est importé tôt)
        const i18n = window.i18n;
        if (!i18n) return;

        const title = i18n.t(`${i18nPath}.title`);
        const description = i18n.t(`${i18nPath}.description`);
        const keywords = i18n.t(`${i18nPath}.keywords`);

        // Mise à jour du titre
        document.title = title;

        // Mise à jour des meta tags
        this.setMetaTag('name', 'description', description);
        this.setMetaTag('name', 'keywords', keywords);

        // Open Graph
        this.setMetaTag('property', 'og:title', title);
        this.setMetaTag('property', 'og:description', description);
        this.setMetaTag('property', 'og:image', ogImage);
        this.setMetaTag('property', 'og:url', canonical);

        // Twitter
        this.setMetaTag('property', 'twitter:title', title);
        this.setMetaTag('property', 'twitter:description', description);
        this.setMetaTag('property', 'twitter:image', ogImage);

        // Canonical
        this.setCanonical(canonical);

        // Breadcrumb Schema
        this.updateBreadcrumb(path, title);
    },

    /**
     * Définit ou met à jour une meta tag
     */
    setMetaTag: function (attr, key, content) {
        let element = document.querySelector(`meta[${attr}="${key}"]`);

        if (element) {
            element.setAttribute('content', content);
        } else {
            element = document.createElement('meta');
            element.setAttribute(attr, key);
            element.setAttribute('content', content);
            document.head.appendChild(element);
        }
    },

    /**
     * Met à jour le lien canonical
     */
    setCanonical: function (url) {
        let canonical = document.querySelector('link[rel="canonical"]');

        if (canonical) {
            canonical.setAttribute('href', url);
        } else {
            canonical = document.createElement('link');
            canonical.setAttribute('rel', 'canonical');
            canonical.setAttribute('href', url);
            document.head.appendChild(canonical);
        }
    },

    /**
     * Génère et injecte le breadcrumb Schema.org
     */
    updateBreadcrumb: function (path, pageTitle) {
        // Supprimer l'ancien breadcrumb s'il existe
        const oldBreadcrumb = document.getElementById('breadcrumb-schema');
        if (oldBreadcrumb) {
            oldBreadcrumb.remove();
        }

        const pathParts = path.split('/').filter(p => p);
        if (pathParts.length === 0) return; // Pas de breadcrumb pour la home

        const breadcrumbList = {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
                {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Accueil",
                    "item": "https://www.bomils.com/"
                }
            ]
        };

        // Ajouter la page actuelle
        breadcrumbList.itemListElement.push({
            "@type": "ListItem",
            "position": 2,
            "name": pageTitle.split('|')[0].trim(),
            "item": window.location.href
        });

        // Créer et injecter le script
        const script = document.createElement('script');
        script.id = 'breadcrumb-schema';
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(breadcrumbList);
        document.head.appendChild(script);
    },

    /**
     * Génère un sitemap dynamique (pour debug)
     */
    generateSitemap: function () {
        console.log('=== SITEMAP BOMIL SOLUTIONS ===');
        const i18n = window.i18n;
        if (!i18n) return;

        Object.keys(this.config.paths).forEach(path => {
            const pageKey = this.config.paths[path];
            const title = i18n.t(`seo.${pageKey}.title`);
            const canonical = this.config.baseUrl + (path === '/' ? '' : '#' + path);
            console.log(`${canonical} - ${title}`);
        });
    }
};

// Export pour utilisation dans router.js
export default SEOManager;
