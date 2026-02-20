/**
 * i18n - Internationalization System
 * Simple translation system for BOMIL SOLUTIONS
 * Supports: French (fr) and English (en)
 */

class I18n {
    constructor() {
        this.currentLang = this.getStoredLanguage() || this.detectLanguage();
        this.translations = {};
        this.fallbackLang = 'fr';
    }

    /**
     * Détecte la langue du navigateur
     */
    detectLanguage() {
        const browserLang = navigator.language || navigator.userLanguage;
        const lang = browserLang.split('-')[0]; // 'en-US' -> 'en'
        return ['fr', 'en'].includes(lang) ? lang : 'fr';
    }

    /**
     * Récupère la langue stockée
     */
    getStoredLanguage() {
        return localStorage.getItem('bomil_language');
    }

    /**
     * Stocke la langue
     */
    setStoredLanguage(lang) {
        localStorage.setItem('bomil_language', lang);
    }

    /**
     * Charge les traductions
     */
    async loadTranslations(lang) {
        try {
            const response = await fetch(`./i18n/${lang}.json`);
            if (!response.ok) throw new Error(`Failed to load ${lang}.json`);
            this.translations[lang] = await response.json();
            return true;
        } catch (error) {
            console.error(`Error loading translations for ${lang}:`, error);
            return false;
        }
    }

    /**
     * Initialise i18n
     */
    async init() {
        // Charger les traductions de la langue actuelle
        await this.loadTranslations(this.currentLang);
        
        // Charger aussi la langue de fallback si différente
        if (this.currentLang !== this.fallbackLang) {
            await this.loadTranslations(this.fallbackLang);
        }

        // Appliquer les traductions
        this.applyTranslations();
        
        // Mettre à jour l'attribut lang du HTML
        document.documentElement.lang = this.currentLang;
        
        // Mettre à jour le toggle
        this.updateToggle();

    }

    /**
     * Obtient une traduction
     */
    t(key, params = {}) {
        const keys = key.split('.');
        let value = this.translations[this.currentLang];

        // Naviguer dans l'objet de traductions
        for (const k of keys) {
            if (value && typeof value === 'object') {
                value = value[k];
            } else {
                value = undefined;
                break;
            }
        }

        // Fallback si traduction non trouvée
        if (value === undefined) {
            value = this.getFallbackTranslation(key);
        }

        // Si toujours pas trouvé, retourner la clé
        if (value === undefined) {
            console.warn(`Translation missing: ${key}`);
            return key;
        }

        // Remplacer les paramètres {param}
        if (typeof value === 'string') {
            Object.keys(params).forEach(param => {
                value = value.replace(new RegExp(`{${param}}`, 'g'), params[param]);
            });
        }

        return value;
    }

    /**
     * Obtient la traduction de fallback
     */
    getFallbackTranslation(key) {
        const keys = key.split('.');
        let value = this.translations[this.fallbackLang];

        for (const k of keys) {
            if (value && typeof value === 'object') {
                value = value[k];
            } else {
                return undefined;
            }
        }

        return value;
    }

    /**
     * Change la langue
     */
    async changeLanguage(lang) {
        if (!['fr', 'en'].includes(lang)) {
            console.error(`Language ${lang} not supported`);
            return;
        }

        // Charger les traductions si pas encore chargées
        if (!this.translations[lang]) {
            await this.loadTranslations(lang);
        }

        this.currentLang = lang;
        this.setStoredLanguage(lang);
        document.documentElement.lang = lang;

        // Appliquer les traductions
        this.applyTranslations();
        
        // Mettre à jour le toggle
        this.updateToggle();

        // Émettre un événement
        window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));

    }

    /**
     * Applique les traductions aux éléments avec data-i18n
     */
    applyTranslations() {
        // Traduire les éléments avec data-i18n
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.t(key);
            
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = translation;
            } else {
                element.textContent = translation;
            }
        });

        // Traduire les attributs avec data-i18n-attr
        document.querySelectorAll('[data-i18n-attr]').forEach(element => {
            const attrs = element.getAttribute('data-i18n-attr').split(',');
            attrs.forEach(attr => {
                const [attrName, key] = attr.split(':');
                const translation = this.t(key.trim());
                element.setAttribute(attrName.trim(), translation);
            });
        });

        // Traduire les placeholders avec data-i18n-placeholder
        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            element.placeholder = this.t(key);
        });
    }

    /**
     * Met à jour le toggle de langue
     */
    updateToggle() {
        const toggle = document.getElementById('lang-toggle');
        if (toggle) {
            const currentLangSpan = toggle.querySelector('.current-lang');
            if (currentLangSpan) {
                currentLangSpan.textContent = this.currentLang.toUpperCase();
            }
        }

        // Mettre à jour les boutons actifs
        document.querySelectorAll('.lang-option').forEach(btn => {
            const lang = btn.getAttribute('data-lang');
            if (lang === this.currentLang) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    /**
     * Obtient la langue actuelle
     */
    getCurrentLanguage() {
        return this.currentLang;
    }
}

// Instance globale
const i18n = new I18n();

// Export
export default i18n;

// Rendre disponible globalement
window.i18n = i18n;
