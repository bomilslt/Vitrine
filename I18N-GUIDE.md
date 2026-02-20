# 🌍 GUIDE i18n - BOMIL SOLUTIONS

## Système d'Internationalisation Français/Anglais


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
