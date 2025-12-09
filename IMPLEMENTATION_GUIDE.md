# Guide d'Implémentation - Validation, Performance et Accessibilité

## 1. Validation des Données

### Utiliser les validateurs
```javascript
import { validators, validateForm, sanitize } from '../utils/validation';

// Valider un seul champ
const emailError = validators.email('user@example.com');

// Valider plusieurs champs
const errors = validateForm(formData, ['name', 'email', 'message']);

// Sanitizer les données
const safe = sanitize(userInput);
```

### Ajouter la validation à un formulaire
```javascript
const [errors, setErrors] = useState({});

const handleSubmit = (e) => {
  e.preventDefault();
  
  const validationErrors = validateForm(formData, ['name', 'email']);
  if (Object.keys(validationErrors).length > 0) {
    setErrors(validationErrors);
    return;
  }
  
  // Envoyer les données
};
```

## 2. Performance - Cache

### Utiliser le cache
```javascript
import { cacheManager } from '../utils/cache';

// Mettre en cache
cacheManager.set('projects', data, 5 * 60 * 1000); // 5 minutes

// Récupérer du cache
const cached = cacheManager.get('projects');

// Vérifier si en cache
if (cacheManager.has('projects')) {
  // Utiliser le cache
}

// Effacer le cache
cacheManager.clear('projects'); // Clé spécifique
cacheManager.clear(); // Tout le cache
```

### Exemple avec API
```javascript
const loadProjects = async () => {
  // Vérifier le cache
  const cached = cacheManager.get('projects');
  if (cached) {
    setProjects(cached);
    return;
  }
  
  // Charger depuis l'API
  const data = await projectService.getAll();
  
  // Mettre en cache
  cacheManager.set('projects', data);
  setProjects(data);
};
```

## 3. Performance - Pagination

### Utiliser le hook usePagination
```javascript
import { usePagination } from '../hooks/usePagination';
import { Pagination } from '../components/Pagination';

function ProjectsList() {
  const [projects, setProjects] = useState([]);
  const pagination = usePagination(projects, 10); // 10 par page

  return (
    <>
      <div className="projects-grid">
        {pagination.currentItems.map(project => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
      
      <Pagination
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        hasNextPage={pagination.hasNextPage}
        hasPrevPage={pagination.hasPrevPage}
        onPageChange={pagination.goToPage}
      />
    </>
  );
}
```

## 4. Performance - Images Optimisées

### Utiliser OptimizedImage
```javascript
import { OptimizedImage } from '../components/OptimizedImage';

// Lazy loading par défaut
<OptimizedImage 
  src="image.jpg" 
  alt="Description"
  width={300}
  height={200}
/>

// Eager loading si nécessaire
<OptimizedImage 
  src="hero.jpg" 
  alt="Hero"
  loading="eager"
/>
```

## 5. Accessibilité - Focus Visible

### Ajouter le CSS d'accessibilité
```javascript
// Dans votre fichier CSS principal
import '../styles/accessibility.css';
```

### Vérifier le focus
```css
/* Tous les éléments interactifs doivent avoir un focus visible */
button:focus-visible,
a:focus-visible,
input:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}
```

## 6. Accessibilité - Attributs ARIA

### Ajouter aria-label
```javascript
<button aria-label="Envoyer le formulaire">
  Envoyer
</button>

<a href="/projects" aria-label="Voir tous les projets">
  Projets
</a>
```

### Ajouter aria-invalid et aria-describedby
```javascript
<input
  id="email"
  type="email"
  aria-invalid={!!error}
  aria-describedby={error ? "email-error" : undefined}
/>
{error && <span id="email-error">{error}</span>}
```

## 7. Accessibilité - Taille Minimale

### Assurer 44x44px minimum
```css
button,
a[role="button"],
.btn {
  min-height: 44px;
  min-width: 44px;
}
```

## 8. Accessibilité - Contraste

### Vérifier le contraste
```css
/* Bon contraste */
color: #1f2937; /* Texte sombre */
background-color: #ffffff; /* Fond clair */
/* Ratio : 12:1 ✓ */

/* Erreurs */
color: #dc2626; /* Rouge */
background-color: #ffffff; /* Blanc */
/* Ratio : 5.5:1 ✓ */
```

## 9. Sanitization - Protection XSS

### Sanitizer les données utilisateur
```javascript
import { sanitize } from '../utils/validation';

// Avant
const message = "<script>alert('xss')</script>";

// Après
const safe = sanitize(message);
// Résultat: "&lt;script&gt;alert(&#x27;xss&#x27;)&lt;/script&gt;"
```

## 10. Exemple Complet - Formulaire Sécurisé

```javascript
import React, { useState } from 'react';
import { validators, validateForm, sanitize } from '../utils/validation';
import { useToast } from '../components/Toast';

function SecureForm() {
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [errors, setErrors] = useState({});
  const { addToast } = useToast();

  const handleChange = (field) => (e) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Valider
    const validationErrors = validateForm(formData, ['name', 'email']);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      addToast('Veuillez corriger les erreurs', 'error');
      return;
    }
    
    // Sanitizer
    const sanitized = {
      name: sanitize(formData.name),
      email: sanitize(formData.email)
    };
    
    // Envoyer
    try {
      await api.post('/submit', sanitized);
      addToast('Succès!', 'success');
    } catch (error) {
      addToast('Erreur', 'error');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={formData.name}
        onChange={handleChange('name')}
        aria-invalid={!!errors.name}
        aria-describedby={errors.name ? "name-error" : undefined}
      />
      {errors.name && <span id="name-error">{errors.name}</span>}
      
      <input
        type="email"
        value={formData.email}
        onChange={handleChange('email')}
        aria-invalid={!!errors.email}
        aria-describedby={errors.email ? "email-error" : undefined}
      />
      {errors.email && <span id="email-error">{errors.email}</span>}
      
      <button type="submit" aria-label="Envoyer le formulaire">
        Envoyer
      </button>
    </form>
  );
}
```

## 11. Checklist d'Implémentation

- [ ] Importer les validateurs
- [ ] Ajouter la validation au formulaire
- [ ] Ajouter la sanitization avant d'envoyer
- [ ] Afficher les erreurs de validation
- [ ] Importer le CSS d'accessibilité
- [ ] Ajouter aria-label aux boutons
- [ ] Ajouter aria-invalid aux inputs
- [ ] Vérifier le focus visible
- [ ] Vérifier le contraste
- [ ] Tester avec le clavier
- [ ] Tester avec un lecteur d'écran
- [ ] Implémenter le cache
- [ ] Implémenter la pagination
- [ ] Optimiser les images

## 12. Tests

### Test de validation
```javascript
// Email invalide
validators.email('invalid') // "Email invalide"

// Message trop long
validators.message('x'.repeat(5001)) // "Le message ne doit pas dépasser 5000 caractères"
```

### Test de sanitization
```javascript
sanitize('<script>alert("xss")</script>')
// "&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;"
```

### Test d'accessibilité
1. Naviguer au clavier (Tab)
2. Vérifier le focus visible
3. Tester avec NVDA ou JAWS
4. Vérifier le contraste avec WebAIM

## 13. Ressources

- [WCAG 2.1](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
