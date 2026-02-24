import router from './router.js';
import AnalyticsManager from './analytics.js';
import i18n from './i18n.js';

document.addEventListener('DOMContentLoaded', async () => {

    // Initialize i18n first
    await i18n.init();

    // Initialize Router
    router.init();

    // Initialize Analytics
    AnalyticsManager.init();

    // Language Switcher
    const langOptions = document.querySelectorAll('.lang-option');
    langOptions.forEach(option => {
        option.addEventListener('click', async () => {
            const lang = option.getAttribute('data-lang');
            await i18n.changeLanguage(lang);

            // Réappliquer les traductions après changement de vue
            if (window.reinitAnimations) {
                setTimeout(() => i18n.applyTranslations(), 200);
            }
        });
    });

    // Écouter les changements de langue
    window.addEventListener('languageChanged', (e) => {
        console.log('Language changed to:', e.detail.lang);

        // Mettre à jour le SEO Manager avec la nouvelle langue
        const currentPath = window.location.hash.slice(1).split('?')[0] || '/';
        if (window.SEOManager) {
            window.SEOManager.updateMeta(currentPath);
        }
    });

    // Mobile Menu Logic
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (menuBtn) {
        menuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('mobile-active');
            menuBtn.classList.toggle('active');
        });

        navLinks.addEventListener('click', (e) => {
            if (e.target.tagName === 'A') {
                navLinks.classList.remove('mobile-active');
                menuBtn.classList.remove('active');
            }
        });
    }

    // Splash Screen Logic with enhanced animation
    const splash = document.getElementById('splash-screen');
    if (splash) {
        setTimeout(() => {
            splash.classList.add('splash-exit');
            setTimeout(() => {
                splash.style.display = 'none';
            }, 800);
        }, 2000);
    }

    // Initialize Premium Animations
    initScrollAnimations();
    initCounterAnimations();
    initParallaxEffects();
    initTiltEffects();
    initNavbarEffects();

    // ============================================
    // EMAILJS CONTACT FORM HANDLING (Event Delegation)
    // ============================================
    document.body.addEventListener('submit', function (event) {
        if (event.target && event.target.id === 'contact-form') {
            event.preventDefault(); // Prevent default form submission

            const form = event.target;
            const submitBtn = document.getElementById('contact-submit-btn');
            const originalBtnText = submitBtn.innerHTML;

            // Show loading state
            submitBtn.innerHTML = 'Envoi en cours... <span class="loader-spinner"></span>';
            submitBtn.disabled = true;

            // Replace these with your actual EmailJS Service ID and Template ID
            const serviceID = 'service_aub89kh';
            const templateID = 'template_0gn7sg9';

            emailjs.sendForm(serviceID, templateID, form)
                .then(() => {
                    showNotification(
                        'Succès !',
                        'Message envoyé avec succès. Nous vous répondrons rapidement.',
                        'success'
                    );
                    form.reset(); // Clear the form
                }, (error) => {
                    showNotification(
                        'Erreur d\'envoi',
                        'Une erreur s\'est produite. Veuillez réessayer plus tard.',
                        'error'
                    );
                    console.error('EmailJS Error:', error);
                })
                .finally(() => {
                    // Restore button state
                    submitBtn.innerHTML = originalBtnText;
                    submitBtn.disabled = false;
                });
        }
    });

});

// ============================================
// SCROLL-TRIGGERED ANIMATIONS
// ============================================
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -80px 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                // Optional: unobserve after animation
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all animated elements
    const animatedElements = document.querySelectorAll(
        '.animate-on-scroll, .animate-left, .animate-right, .animate-scale'
    );
    animatedElements.forEach(el => observer.observe(el));
}

// ============================================
// ANIMATED COUNTERS
// ============================================
function initCounterAnimations() {
    const counters = document.querySelectorAll('[data-counter]');

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                entry.target.classList.add('counted');
                animateCounter(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));
}

function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-counter'));
    const duration = 2000;
    const startTime = performance.now();
    const suffix = element.getAttribute('data-suffix') || '';
    const prefix = element.getAttribute('data-prefix') || '';

    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function (ease-out)
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentValue = Math.floor(target * easeOut);

        element.textContent = prefix + currentValue.toLocaleString() + suffix;

        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = prefix + target.toLocaleString() + suffix;
        }
    }

    requestAnimationFrame(updateCounter);
}

// ============================================
// PARALLAX EFFECTS
// ============================================
function initParallaxEffects() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');

    if (parallaxElements.length === 0) return;

    window.addEventListener('scroll', () => {
        requestAnimationFrame(() => {
            const scrollY = window.scrollY;

            parallaxElements.forEach(element => {
                const speed = parseFloat(element.getAttribute('data-parallax')) || 0.5;
                const rect = element.getBoundingClientRect();
                const elementTop = rect.top + scrollY;
                const offset = (scrollY - elementTop) * speed;

                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    element.style.transform = `translateY(${offset}px)`;
                }
            });
        });
    }, { passive: true });
}

// ============================================
// 3D TILT EFFECTS
// ============================================
function initTiltEffects() {
    const tiltElements = document.querySelectorAll('.tilt-card');

    tiltElements.forEach(element => {
        element.addEventListener('mousemove', (e) => {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 15;
            const rotateY = (centerX - x) / 15;

            element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
        });

        element.addEventListener('mouseleave', () => {
            element.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });
}

// ============================================
// NAVBAR EFFECTS
// ============================================
function initNavbarEffects() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    let lastScroll = 0;
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const currentScroll = window.scrollY;

                // Add shadow on scroll
                if (currentScroll > 50) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }

                // Hide/show navbar on scroll direction
                if (currentScroll > lastScroll && currentScroll > 300) {
                    navbar.style.transform = 'translateY(-100%)';
                } else {
                    navbar.style.transform = 'translateY(0)';
                }

                lastScroll = currentScroll;
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
}

// ============================================
// MAGNETIC BUTTONS
// ============================================
export function initMagneticButtons() {
    const magneticBtns = document.querySelectorAll('.btn-magnetic');

    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0)';
        });
    });
}

// ============================================
// TEXT TYPING EFFECT
// ============================================
export function typeText(element, text, speed = 50) {
    let index = 0;
    element.textContent = '';

    function type() {
        if (index < text.length) {
            element.textContent += text.charAt(index);
            index++;
            setTimeout(type, speed);
        }
    }

    type();
}

// ============================================
// SMOOTH SCROLL TO ELEMENT
// ============================================
export function smoothScrollTo(target) {
    const element = document.querySelector(target);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// ============================================
// STAGGER ANIMATION HELPER
// ============================================
export function staggerAnimate(container, childSelector, baseDelay = 100) {
    const children = container.querySelectorAll(childSelector);
    children.forEach((child, index) => {
        child.style.transitionDelay = `${index * baseDelay}ms`;
    });
}

// ============================================
// RE-INITIALIZE ANIMATIONS (for SPA navigation)
// ============================================
export function reinitAnimations() {
    // Reset all animated elements
    document.querySelectorAll('.animate-on-scroll, .animate-left, .animate-right, .animate-scale').forEach(el => {
        el.classList.remove('show');
    });

    // Reset counters
    document.querySelectorAll('[data-counter]').forEach(el => {
        el.classList.remove('counted');
    });

    // Re-observe elements
    setTimeout(() => {
        initScrollAnimations();
        initCounterAnimations();
        initTiltEffects();
    }, 100);
}

// Make reinit available globally for router
window.reinitAnimations = reinitAnimations;

// ============================================
// CUSTOM NOTIFICATION SYSTEM
// ============================================
export function showNotification(title, message, type = 'success') {
    // Icons SVG
    const icons = {
        success: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`,
        error: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`
    };

    // Create notification container
    const notification = document.createElement('div');
    notification.className = `custom-notification ${type}`;

    // Build HTML content
    notification.innerHTML = `
        <div class="icon">
            ${icons[type] || icons.success}
        </div>
        <div class="content">
            <h4>${title}</h4>
            <p>${message}</p>
        </div>
        <button class="close-btn" aria-label="Fermer">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
    `;

    // Append to body
    document.body.appendChild(notification);

    // Trigger animation (small delay for DOM rendering)
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            notification.classList.add('show');
        });
    });

    // Handle close button
    const closeBtn = notification.querySelector('.close-btn');
    const closeNotification = () => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 400); // Wait for transition
    };

    closeBtn.addEventListener('click', closeNotification);

    // Auto-remove after 5 seconds
    setTimeout(closeNotification, 5000);
}

// Make notification available globally for elements outside JS modules (like old onclicks)
window.showNotification = showNotification;
