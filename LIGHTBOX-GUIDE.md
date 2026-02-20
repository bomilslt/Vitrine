# 🖼️ LIGHTBOX - Guide d'Utilisation

## ✨ Fonctionnalités

La lightbox créée pour BOMIL SOLUTIONS offre:

### Navigation
- ✅ **Clic sur image** - Ouvre en plein écran
- ✅ **Boutons ‹ ›** - Navigation entre images
- ✅ **Clavier** - Flèches gauche/droite pour naviguer
- ✅ **Échap** - Ferme la lightbox
- ✅ **Swipe mobile** - Glisser pour naviguer
- ✅ **Clic sur fond** - Ferme la lightbox

### Affichage
- ✅ **Compteur** - "1 / 3" pour savoir où on est
- ✅ **Légende** - Affiche le alt de l'image
- ✅ **Loading** - Spinner pendant le chargement
- ✅ **Responsive** - Adapté mobile et desktop
- ✅ **Animations** - Transitions fluides

### Design
- ✅ **Fond flou** - Backdrop blur pour effet premium
- ✅ **Boutons glassmorphism** - Style moderne
- ✅ **Zoom in animation** - Apparition élégante
- ✅ **Hover effects** - Feedback visuel

## 🎨 Personnalisation

### Couleurs
Modifier dans `css/lightbox.css`:

```css
/* Fond de la lightbox */
.lightbox {
    background: rgba(0, 0, 0, 0.95); /* Noir à 95% */
}

/* Boutons */
.lightbox-close,
.lightbox-nav {
    background: rgba(255, 255, 255, 0.1); /* Blanc transparent */
    border: 2px solid rgba(255, 255, 255, 0.3);
}
```

### Taille des boutons
```css
.lightbox-nav {
    width: 50px;  /* Largeur */
    height: 50px; /* Hauteur */
    font-size: 24px; /* Taille icône */
}
```

### Animation
```css
@keyframes zoomIn {
    from {
        transform: scale(0.8); /* Commence à 80% */
        opacity: 0;
    }
    to {
        transform: scale(1); /* Termine à 100% */
        opacity: 1;
    }
}
```

## 💻 Utilisation dans le Code

### Ouvrir la lightbox manuellement

```javascript
import { openLightbox } from './js/lightbox.js';

// Tableau d'images
const images = [
    { src: 'path/to/image1.jpg', alt: 'Description 1' },
    { src: 'path/to/image2.jpg', alt: 'Description 2' },
    { src: 'path/to/image3.jpg', alt: 'Description 3' }
];

// Ouvrir à l'index 0 (première image)
openLightbox(images, 0);
```

### Ajouter la lightbox à d'autres galeries

```javascript
// Sélectionner toutes les images d'une galerie
const galleryImages = document.querySelectorAll('.ma-galerie img');

// Créer le tableau d'images
const images = Array.from(galleryImages).map(img => ({
    src: img.src,
    alt: img.alt
}));

// Ajouter les événements de clic
galleryImages.forEach((img, index) => {
    img.addEventListener('click', () => {
        import('./js/lightbox.js').then(module => {
            module.openLightbox(images, index);
        });
    });
});
```

## 🎯 Intégration Actuelle

La lightbox est déjà intégrée dans:
- ✅ Pages produits (Lucid, LOGis, Intercity)
- ✅ Galerie de 3 images par produit
- ✅ Navigation automatique entre images

## 📱 Responsive

### Desktop
- Boutons de navigation sur les côtés
- Compteur et légende en bas
- Bouton fermer en haut à droite

### Mobile
- Swipe pour naviguer
- Boutons plus petits
- Compteur et légende empilés
- Optimisé pour le touch

## ⌨️ Raccourcis Clavier

| Touche | Action |
|--------|--------|
| `←` | Image précédente |
| `→` | Image suivante |
| `Échap` | Fermer |

## 🎨 Effets Visuels

### Hover sur images
```css
.gallery-item {
    cursor: zoom-in; /* Curseur loupe */
    transition: transform 0.3s ease;
}

.gallery-item:hover {
    transform: scale(1.05); /* Zoom léger */
}
```

### Animation d'ouverture
- Zoom in depuis 80% à 100%
- Fade in de 0 à 1
- Durée: 0.3s
- Easing: cubic-bezier(0.16, 1, 0.3, 1)

## 🔧 Dépannage

### Les images ne s'ouvrent pas
1. Vérifier que `lightbox.css` est chargé
2. Vérifier que `lightbox.js` est accessible
3. Ouvrir la console (F12) pour voir les erreurs

### Les boutons ne fonctionnent pas
1. Vérifier que les événements sont attachés
2. Vérifier qu'il y a plusieurs images (sinon boutons cachés)

### L'image ne charge pas
1. Vérifier le chemin de l'image
2. Vérifier que l'image existe
3. Un placeholder s'affiche si erreur

## 🚀 Améliorations Futures

### Possibles ajouts:
- [ ] Zoom sur l'image (pinch to zoom)
- [ ] Téléchargement de l'image
- [ ] Partage sur réseaux sociaux
- [ ] Diaporama automatique
- [ ] Miniatures en bas
- [ ] Plein écran natif (Fullscreen API)

## 📞 Support

Questions sur la lightbox ?
- 📧 bomilsolutions@gmail.com
- 📱 +237 691 691 603

---

**Lightbox créée pour BOMIL SOLUTIONS** 🎨
*Version: 1.0*
*Date: 20 Février 2026*
