/**
 * Lightbox - Simple & Elegant
 * Affichage plein écran des images avec navigation
 */

class Lightbox {
    constructor() {
        this.currentIndex = 0;
        this.images = [];
        this.lightboxElement = null;
        this.init();
    }

    init() {
        // Créer l'élément lightbox
        this.createLightbox();
        
        // Écouter les événements
        this.attachEvents();
    }

    createLightbox() {
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.id = 'lightbox';
        lightbox.innerHTML = `
            <div class="lightbox-content">
                <button class="lightbox-close" aria-label="Fermer">×</button>
                <button class="lightbox-nav lightbox-prev" aria-label="Image précédente">‹</button>
                <button class="lightbox-nav lightbox-next" aria-label="Image suivante">›</button>
                <div class="lightbox-loading"></div>
                <img class="lightbox-image" src="" alt="" style="display:none;">
                <div class="lightbox-counter"></div>
                <div class="lightbox-caption"></div>
            </div>
        `;
        document.body.appendChild(lightbox);
        this.lightboxElement = lightbox;
    }

    attachEvents() {
        // Fermer la lightbox
        const closeBtn = this.lightboxElement.querySelector('.lightbox-close');
        closeBtn.addEventListener('click', () => this.close());

        // Clic sur le fond pour fermer
        this.lightboxElement.addEventListener('click', (e) => {
            if (e.target === this.lightboxElement) {
                this.close();
            }
        });

        // Navigation
        const prevBtn = this.lightboxElement.querySelector('.lightbox-prev');
        const nextBtn = this.lightboxElement.querySelector('.lightbox-next');
        
        prevBtn.addEventListener('click', () => this.prev());
        nextBtn.addEventListener('click', () => this.next());

        // Clavier
        document.addEventListener('keydown', (e) => {
            if (!this.lightboxElement.classList.contains('active')) return;
            
            switch(e.key) {
                case 'Escape':
                    this.close();
                    break;
                case 'ArrowLeft':
                    this.prev();
                    break;
                case 'ArrowRight':
                    this.next();
                    break;
            }
        });

        // Swipe sur mobile
        let touchStartX = 0;
        let touchEndX = 0;

        this.lightboxElement.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });

        this.lightboxElement.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe();
        });

        const handleSwipe = () => {
            if (touchEndX < touchStartX - 50) {
                this.next();
            }
            if (touchEndX > touchStartX + 50) {
                this.prev();
            }
        };
        this.handleSwipe = handleSwipe;
    }

    open(images, index = 0) {
        this.images = images;
        this.currentIndex = index;
        
        // Afficher la lightbox
        this.lightboxElement.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Charger l'image
        this.loadImage();
    }

    close() {
        this.lightboxElement.classList.remove('active');
        document.body.style.overflow = '';
        
        // Réinitialiser
        const img = this.lightboxElement.querySelector('.lightbox-image');
        img.style.display = 'none';
        img.src = '';
    }

    loadImage() {
        const img = this.lightboxElement.querySelector('.lightbox-image');
        const loading = this.lightboxElement.querySelector('.lightbox-loading');
        const counter = this.lightboxElement.querySelector('.lightbox-counter');
        const caption = this.lightboxElement.querySelector('.lightbox-caption');
        const prevBtn = this.lightboxElement.querySelector('.lightbox-prev');
        const nextBtn = this.lightboxElement.querySelector('.lightbox-next');

        // Afficher le loading
        loading.style.display = 'block';
        img.style.display = 'none';

        // Charger l'image
        const currentImage = this.images[this.currentIndex];
        const newImg = new Image();
        
        newImg.onload = () => {
            img.src = newImg.src;
            img.alt = currentImage.alt;
            img.style.display = 'block';
            loading.style.display = 'none';
        };

        newImg.onerror = () => {
            loading.style.display = 'none';
            img.style.display = 'block';
            img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" fill="%23999"%3EImage non disponible%3C/text%3E%3C/svg%3E';
        };

        newImg.src = currentImage.src;

        // Mettre à jour le compteur
        counter.textContent = `${this.currentIndex + 1} / ${this.images.length}`;

        // Mettre à jour la légende
        caption.textContent = currentImage.alt;

        // Gérer les boutons de navigation
        prevBtn.style.display = this.images.length > 1 ? 'flex' : 'none';
        nextBtn.style.display = this.images.length > 1 ? 'flex' : 'none';
    }

    prev() {
        this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
        this.loadImage();
    }

    next() {
        this.currentIndex = (this.currentIndex + 1) % this.images.length;
        this.loadImage();
    }
}

// Initialiser la lightbox
let lightboxInstance = null;

function initLightbox() {
    if (!lightboxInstance) {
        lightboxInstance = new Lightbox();
    }
}

// Fonction pour ouvrir la lightbox (utilisée par product-loader.js)
function openLightbox(images, index = 0) {
    if (!lightboxInstance) {
        initLightbox();
    }
    lightboxInstance.open(images, index);
}

// Export pour utilisation dans d'autres modules
export { initLightbox, openLightbox };

// Auto-init si pas en mode module
if (typeof module === 'undefined') {
    document.addEventListener('DOMContentLoaded', initLightbox);
}
