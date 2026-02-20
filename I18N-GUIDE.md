# 🌍 GUIDE i18n - BOMIL SOLUTIONS

## Système d'Internationalisation Français/Anglais

### ✨ Fonctionnalités

- ✅ **2 langues** : Français (FR) et Anglais (EN)
- ✅ **Détection automatique** : Langue du navigateur
- ✅ **Persistance** : Sauvegarde dans localStorage
- ✅ **Sélecteur élégant** : Dans la navbar avec drapeaux
- ✅ **Traduction dynamique** : Changement sans rechargement
- ✅ **Fallback** : Français par défaut si traduction manquante

### 📁 Structure des Fichiers

```
i18n/
├── fr.json     # Traductions françaises
└── en.json     # Traductions anglaises

js/
└── i18n.js     # Système i18n
```

### 🎯 Utilisation dans le HTML

#### 1. Traduire du texte

```html
<!-- Texte simple -->
<h1 data-i18n="nav.home">Accueil</h1>

<!-- Résultat en FR : Accueil -->
<!-- Résultat en EN : Home -->
```

#### 2. Traduire un placeholder

```html
<input type="email" 
       data-i18n-placeholder="footer.emailPlaceholder" 
       placeholder="votre@email.com">

<!-- Résultat en FR : votre@email.com -->
<!-- Résultat en EN : your@email.com -->
```

#### 3. Traduire des attributs

```html
<a href="#" 
   data-i18n-attr="aria-label:nav.home,title:nav.home">
   Lien
</a>

<!-- Traduit aria-label et title -->
```

### 💻 Utilisation en JavaScript

#### Obtenir une traduction

```javascript
// Simple
const text = i18n.t('nav.home');
// Résultat : "Accueil" ou "Home"

// Avec paramètres
const text = i18n.t('welcome', { name: 'John' });
// Si traduction : "Bienvenue {name}"
// Résultat : "Bienvenue John"
```

#### Changer de langue

```javascript
// Changer en anglais
await i18n.changeLanguage('en');

// Changer en français
await i18n.changeLanguage('fr');
```

#### Obtenir la langue actuelle

```javascript
const currentLang = i18n.getCurrentLanguage();
// Résultat : 'fr' ou 'en'
```

#### Écouter les changements de langue

```javascript
window.addEventListener('languageChanged', (e) => {
    console.log('Nouvelle langue:', e.detail.lang);
    // Faire quelque chose après le changement
});
```

### 📝 Structure des Fichiers JSON

```json
{
  "nav": {
    "home": "Accueil",
    "about": "À Propos"
  },
  "common": {
    "readMore": "En savoir plus",
    "getQuote": "Demander un devis"
  }
}
```

**Accès :**
- `i18n.t('nav.home')` → "Accueil"
- `i18n.t('common.readMore')` → "En savoir plus"

### 🎨 Sélecteur de Langue

Le sélecteur est déjà intégré dans la navbar :

```html
<div class="lang-switcher">
    <button class="lang-toggle">
        🌐 <span class="current-lang">FR</span>
    </button>
    <div class="lang-dropdown">
        <button class="lang-option active" data-lang="fr">
            🇫🇷 Français
        </button>
        <button class="lang-option" data-lang="en">
            🇬🇧 English
        </button>
    </div>
</div>
```

### 🔧 Ajouter une Nouvelle Traduction

#### 1. Dans fr.json

```json
{
  "products": {
    "title": "Nos Produits",
    "subtitle": "Solutions innovantes"
  }
}
```

#### 2. Dans en.json

```json
{
  "products": {
    "title": "Our Products",
    "subtitle": "Innovative solutions"
  }
}
```

#### 3. Dans le HTML

```html
<h1 data-i18n="products.title">Nos Produits</h1>
<p data-i18n="products.subtitle">Solutions innovantes</p>
```

### 🌐 Ajouter une Nouvelle Langue

#### 1. Créer le fichier de traduction

```bash
# Créer i18n/es.json pour l'espagnol
```

#### 2. Modifier i18n.js

```javascript
// Ligne 11
detectLanguage() {
    const browserLang = navigator.language || navigator.userLanguage;
    const lang = browserLang.split('-')[0];
    return ['fr', 'en', 'es'].includes(lang) ? lang : 'fr';
    //                    ^^^ Ajouter 'es'
}

// Ligne 67
async changeLanguage(lang) {
    if (!['fr', 'en', 'es'].includes(lang)) {
    //                ^^^ Ajouter 'es'
        console.error(`Language ${lang} not supported`);
        return;
    }
    // ...
}
```

#### 3. Ajouter dans le sélecteur

```html
<button class="lang-option" data-lang="es">
    🇪🇸 Español
</button>
```

### 📊 Traductions Actuelles

#### Navigation (nav)
- home, about, services, products, contact

#### Commun (common)
- readMore, getQuote, contactUs, learnMore, viewDemo
- close, next, previous, loading, error, success

#### Footer (footer)
- description, company, solutions, newsletter
- emailPlaceholder, subscribe, location
- allProducts, webDev, mobileDev, itConsulting
- careers, privacy, terms, legal, rights

#### Page d'accueil (home)
- badge, title, subtitle, ctaPrimary, ctaSecondary
- trustedBy, stats, features, process, cta

#### Produits (products)
- title, subtitle, descriptions des produits
- tags, CTA buttons

#### Contact (contact)
- title, form fields, info

### 🎯 Bonnes Pratiques

#### 1. Clés descriptives

```json
// ❌ Mauvais
{
  "btn1": "Cliquez ici",
  "txt2": "Bienvenue"
}

// ✅ Bon
{
  "common": {
    "clickHere": "Cliquez ici",
    "welcome": "Bienvenue"
  }
}
```

#### 2. Grouper par contexte

```json
{
  "nav": { ... },
  "footer": { ... },
  "home": { ... },
  "products": { ... }
}
```

#### 3. Utiliser des paramètres

```json
{
  "welcome": "Bienvenue {name} !",
  "itemsCount": "Vous avez {count} articles"
}
```

```javascript
i18n.t('welcome', { name: 'John' });
// → "Bienvenue John !"

i18n.t('itemsCount', { count: 5 });
// → "Vous avez 5 articles"
```

### 🔍 Débogage

#### Voir les traductions manquantes

Ouvrir la console (F12) :

```
Translation missing: products.newKey
```

#### Vérifier la langue actuelle

```javascript
console.log(i18n.getCurrentLanguage());
// → 'fr' ou 'en'
```

#### Forcer une langue

```javascript
// Dans la console
await i18n.changeLanguage('en');
```

### 📱 SEO Multilingue

Le système met à jour automatiquement :

```html
<!-- Attribut lang du HTML -->
<html lang="fr">  <!-- ou lang="en" -->

<!-- Meta tags -->
<link rel="alternate" hreflang="fr" href="...">
<link rel="alternate" hreflang="en" href="...">
```

### 🚀 Performance

- ✅ **Chargement lazy** : Traductions chargées à la demande
- ✅ **Cache** : Traductions en mémoire après chargement
- ✅ **Persistance** : Langue sauvegardée (pas de rechargement)
- ✅ **Léger** : ~2KB par fichier de traduction

### 📞 Support

Questions sur i18n ?
- 📧 contact@bomils.com
- 📱 +237 688 090 632

---

**Système i18n créé pour BOMIL SOLUTIONS** 🌍
*Version: 1.0*
*Langues: Français, English*
*Date: 20 Février 2026*
