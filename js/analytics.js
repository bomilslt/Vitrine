/**
 * Analytics & Tracking Manager
 * Gestion centralisée du tracking (Google Analytics, Facebook Pixel, etc.)
 */

const AnalyticsManager = {
    // Configuration
    config: {
        googleAnalyticsId: 'G-XXXXXXXXXX', // À remplacer par votre ID
        facebookPixelId: 'XXXXXXXXXX', // À remplacer par votre ID
        enabled: true
    },

    /**
     * Initialise tous les trackers
     */
    init: function() {
        if (!this.config.enabled) return;

        this.initGoogleAnalytics();
        this.initFacebookPixel();
        this.trackPageView();
        this.setupEventListeners();
    },

    /**
     * Initialise Google Analytics 4
     */
    initGoogleAnalytics: function() {
        if (!this.config.googleAnalyticsId || this.config.googleAnalyticsId === 'G-XXXXXXXXXX') {
            console.log('⚠️ Google Analytics non configuré');
            return;
        }

        // Charger le script GA4
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${this.config.googleAnalyticsId}`;
        document.head.appendChild(script);

        // Initialiser gtag
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        window.gtag = gtag;
        gtag('js', new Date());
        gtag('config', this.config.googleAnalyticsId, {
            'send_page_view': false // On gère manuellement
        });

        console.log('✅ Google Analytics initialisé');
    },

    /**
     * Initialise Facebook Pixel
     */
    initFacebookPixel: function() {
        if (!this.config.facebookPixelId || this.config.facebookPixelId === 'XXXXXXXXXX') {
            console.log('⚠️ Facebook Pixel non configuré');
            return;
        }

        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        
        fbq('init', this.config.facebookPixelId);
        fbq('track', 'PageView');

        console.log('✅ Facebook Pixel initialisé');
    },

    /**
     * Track une page vue
     */
    trackPageView: function(path = null) {
        const currentPath = path || window.location.hash || '#/';
        const pageTitle = document.title;

        // Google Analytics
        if (window.gtag) {
            gtag('event', 'page_view', {
                page_title: pageTitle,
                page_location: window.location.href,
                page_path: currentPath
            });
        }

        // Facebook Pixel
        if (window.fbq) {
            fbq('track', 'PageView');
        }

        console.log(`📊 Page vue trackée: ${currentPath}`);
    },

    /**
     * Track un événement personnalisé
     */
    trackEvent: function(category, action, label = null, value = null) {
        // Google Analytics
        if (window.gtag) {
            gtag('event', action, {
                'event_category': category,
                'event_label': label,
                'value': value
            });
        }

        // Facebook Pixel
        if (window.fbq) {
            fbq('trackCustom', action, {
                category: category,
                label: label,
                value: value
            });
        }

        console.log(`📊 Événement tracké: ${category} > ${action}`);
    },

    /**
     * Track une conversion (formulaire soumis, etc.)
     */
    trackConversion: function(type, value = null) {
        // Google Analytics
        if (window.gtag) {
            gtag('event', 'conversion', {
                'send_to': this.config.googleAnalyticsId,
                'value': value,
                'currency': 'XAF',
                'transaction_id': Date.now()
            });
        }

        // Facebook Pixel
        if (window.fbq) {
            fbq('track', 'Lead', {
                content_name: type,
                value: value,
                currency: 'XAF'
            });
        }

        console.log(`💰 Conversion trackée: ${type}`);
    },

    /**
     * Configure les listeners d'événements automatiques
     */
    setupEventListeners: function() {
        // Track clics sur liens externes
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (link && link.href && !link.href.includes(window.location.hostname)) {
                this.trackEvent('Outbound Link', 'Click', link.href);
            }
        });

        // Track clics sur boutons CTA
        document.addEventListener('click', (e) => {
            const button = e.target.closest('.btn-primary, .cta-btn, .product-btn');
            if (button) {
                const buttonText = button.textContent.trim();
                this.trackEvent('CTA', 'Click', buttonText);
            }
        });

        // Track soumissions de formulaires
        document.addEventListener('submit', (e) => {
            const form = e.target;
            if (form.tagName === 'FORM') {
                const formName = form.id || form.className || 'Unknown Form';
                this.trackConversion('Form Submission', formName);
            }
        });

        // Track clics sur téléphone
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href^="tel:"]');
            if (link) {
                this.trackEvent('Contact', 'Phone Click', link.href);
            }
        });

        // Track clics sur email
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href^="mailto:"]');
            if (link) {
                this.trackEvent('Contact', 'Email Click', link.href);
            }
        });

        // Track scroll depth
        let scrollTracked = {
            '25': false,
            '50': false,
            '75': false,
            '100': false
        };

        window.addEventListener('scroll', () => {
            const scrollPercent = Math.round((window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100);
            
            for (const [threshold, tracked] of Object.entries(scrollTracked)) {
                if (scrollPercent >= parseInt(threshold) && !tracked) {
                    this.trackEvent('Scroll Depth', `${threshold}%`, window.location.hash);
                    scrollTracked[threshold] = true;
                }
            }
        });

        console.log('✅ Event listeners configurés');
    },

    /**
     * Track temps passé sur la page
     */
    trackTimeOnPage: function() {
        const startTime = Date.now();
        
        window.addEventListener('beforeunload', () => {
            const timeSpent = Math.round((Date.now() - startTime) / 1000); // en secondes
            this.trackEvent('Engagement', 'Time on Page', window.location.hash, timeSpent);
        });
    },

    /**
     * Track produit vu
     */
    trackProductView: function(productId, productName) {
        // Google Analytics
        if (window.gtag) {
            gtag('event', 'view_item', {
                'items': [{
                    'item_id': productId,
                    'item_name': productName
                }]
            });
        }

        // Facebook Pixel
        if (window.fbq) {
            fbq('track', 'ViewContent', {
                content_ids: [productId],
                content_name: productName,
                content_type: 'product'
            });
        }

        console.log(`👁️ Produit vu: ${productName}`);
    },

    /**
     * Désactive le tracking (RGPD)
     */
    disableTracking: function() {
        this.config.enabled = false;
        
        // Désactiver GA
        if (window.gtag) {
            gtag('consent', 'update', {
                'analytics_storage': 'denied'
            });
        }

        console.log('🔒 Tracking désactivé');
    },

    /**
     * Active le tracking (après consentement)
     */
    enableTracking: function() {
        this.config.enabled = true;
        
        // Activer GA
        if (window.gtag) {
            gtag('consent', 'update', {
                'analytics_storage': 'granted'
            });
        }

        console.log('✅ Tracking activé');
    }
};

// Export
export default AnalyticsManager;

// Auto-init si pas en mode module
if (typeof module === 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        AnalyticsManager.init();
    });
}
