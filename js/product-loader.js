// Configuration des produits (URLs, images, etc.)
const productsConfig = {
    'lucid': {
        demoUrl: '',
        gallery: [
            { src: 'assets/images/lucid/dashboard.png', altKey: 'products.lucidGallery1' },
            { src: 'assets/images/lucid/facturation.png', altKey: 'products.lucidGallery2' },
            { src: 'assets/images/lucid/stock.png', altKey: 'products.lucidGallery3' }
        ]
    },
    'logis': {
        demoUrl: '',
        gallery: [
            { src: 'assets/images/LOGis/tracking.png', altKey: 'products.logisGallery1' },
            { src: 'assets/images/LOGis/expeditions.png', altKey: 'products.logisGallery2' },
            { src: 'assets/images/LOGis/app_client.png', altKey: 'products.logisGallery3' }
        ]
    },
    'intercity': {
        demoUrl: '',
        gallery: [
            { src: 'assets/images/TRAV/carte.png', altKey: 'products.intercityGallery1' },
            { src: 'assets/images/TRAV/app_chauffeur.png', altKey: 'products.intercityGallery2' },
            { src: 'assets/images/TRAV/app_clients.png', altKey: 'products.intercityGallery3' }
        ]
    }
};

export function loadProduct(productId) {
    const config = productsConfig[productId];
    const i18n = window.i18n;

    if (!config || !i18n) {
        document.getElementById('pd-title').innerText = i18n ? i18n.t('common.error') : 'Error';
        return;
    }

    // Récupération des données traduites
    const title = i18n.t(`products.${productId}Title`);
    const description = i18n.t(`products.${productId}Desc`);
    const features = i18n.t(`products.${productId}Features`); // Ceci devrait être un tableau

    // Remplissage du texte
    document.getElementById('pd-title').innerText = title;
    document.getElementById('pd-description').innerText = description;
    
    const nameSpan = document.getElementById('pd-name-span');
    if (nameSpan) nameSpan.innerText = title;

    // CTA Buttons
    const ctaContainer = document.getElementById('pd-cta-container');
    if (ctaContainer) {
        let ctaHTML = `
            <a href="#/contact" data-link class="btn-primary">${i18n.t('products.ctaQuote')} ${title}</a>
        `;

        if (config.demoUrl && config.demoUrl.trim() !== '') {
            ctaHTML += `
                <a href="${config.demoUrl}" target="_blank" rel="noopener noreferrer" class="btn-demo">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polygon points="5 3 19 12 5 21 5 3"></polygon>
                    </svg>
                    ${i18n.t('products.viewDemo')}
                </a>
            `;
        }
        ctaContainer.innerHTML = ctaHTML;
    }

    // Features (on s'assure que c'est un tableau)
    const featuresContainer = document.getElementById('pd-features');
    if (Array.isArray(features)) {
        featuresContainer.innerHTML = features.map(feat => `
            <div class="pd-feature-item">
                <h4>${feat}</h4>
            </div>
        `).join('');
    }

    // Gallery
    const galleryContainer = document.getElementById('pd-gallery');
    galleryContainer.innerHTML = config.gallery.map((img, index) => {
        const alt = i18n.t(img.altKey);
        return `
            <div class="gallery-item img-zoom-container glass-card" data-index="${index}">
                <img src="${img.src}" alt="${alt}" loading="lazy" style="width:100%; height:100%; object-fit:cover; border-radius:8px;">
            </div>
        `;
    }).join('');

    // Lightbox events
    setTimeout(() => {
        const galleryItems = document.querySelectorAll('.gallery-item');
        galleryItems.forEach((item, index) => {
            item.addEventListener('click', () => {
                import('./lightbox.js').then(module => {
                    // On passe aussi les alts traduits pour la lightbox si elle les utilise
                    const galleryWithAlts = config.gallery.map(g => ({
                        ...g,
                        alt: i18n.t(g.altKey)
                    }));
                    module.openLightbox(galleryWithAlts, index);
                });
            });
        });
    }, 100);
}
