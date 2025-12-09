# Gestion des Erreurs - Documentation

## Vue d'ensemble

Ce document décrit le système de gestion des erreurs implémenté dans le projet portfolio.

## Frontend - React

### 1. Gestionnaire d'erreurs centralisé (`src/utils/errorHandler.js`)

Fournit des fonctions utilitaires pour normaliser les erreurs API :

```javascript
import { getErrorMessage, isNetworkError, isValidationError } from '../utils/errorHandler';

// Récupérer un message d'erreur lisible
const message = getErrorMessage(error);

// Vérifier le type d'erreur
if (isNetworkError(error)) {
  // Erreur de connexion
}

if (isValidationError(error)) {
  // Erreur de validation (422)
  const errors = getValidationErrors(error);
}
```

### 2. Composant Toast (`src/components/Toast.jsx`)

Affiche les messages d'erreur/succès de manière non-intrusive :

```javascript
import { useToast, Toast } from '../components/Toast';

function MyComponent() {
  const { toasts, addToast, removeToast } = useToast();

  const handleError = (error) => {
    addToast(getErrorMessage(error), 'error');
  };

  const handleSuccess = () => {
    addToast('Opération réussie!', 'success');
  };

  return (
    <>
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </>
  );
}
```

### 3. Hook personnalisé `useApi` (`src/hooks/useApi.js`)

Gère les appels API avec état de chargement et erreurs :

```javascript
import { useApi } from '../hooks/useApi';

function MyComponent() {
  const { execute, loading, error } = useApi();

  const fetchData = async () => {
    try {
      const data = await execute(() => projectService.getAll());
      // Utiliser les données
    } catch (err) {
      // L'erreur est déjà capturée dans le hook
    }
  };

  return (
    <div>
      {loading && <p>Chargement...</p>}
      {error && <p className="error">{error}</p>}
      <button onClick={fetchData}>Charger</button>
    </div>
  );
}
```

### 4. Intercepteur Axios global (`src/api.js`)

Capture toutes les erreurs API :

```javascript
api.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);
```

## Backend - Laravel

### 1. Validation avec messages personnalisés

Tous les contrôleurs incluent des messages de validation en français :

```php
$validated = $request->validate([
    'email' => 'required|email',
    'name' => 'required|string|max:255'
], [
    'email.required' => 'L\'email est requis',
    'email.email' => 'L\'email doit être valide',
    'name.required' => 'Le nom est requis',
    'name.max' => 'Le nom ne doit pas dépasser 255 caractères'
]);
```

### 2. Gestion des exceptions

Chaque contrôleur utilise try-catch pour capturer les erreurs :

```php
try {
    // Logique métier
    return response()->json([
        'success' => true,
        'message' => 'Opération réussie',
        'data' => $data
    ], 201);
} catch (\Illuminate\Validation\ValidationException $e) {
    return response()->json([
        'success' => false,
        'message' => 'Erreur de validation',
        'errors' => $e->errors()
    ], 422);
} catch (\Exception $e) {
    return response()->json([
        'success' => false,
        'message' => 'Erreur serveur'
    ], 500);
}
```

### 3. Codes HTTP appropriés

- `201` : Création réussie
- `400` : Données invalides
- `404` : Ressource non trouvée
- `422` : Erreur de validation
- `500` : Erreur serveur

### 4. Validation des images

Le contrôleur `ImageUploadController` valide :
- Format (jpeg, png, jpg, gif, webp)
- Taille (max 2MB)
- Type de fichier

## Flux d'erreur complet

```
Frontend (React)
    ↓
API Call (Axios)
    ↓
Backend (Laravel)
    ↓
Validation/Exception
    ↓
JSON Response avec code HTTP
    ↓
Frontend Interceptor
    ↓
getErrorMessage() normalise
    ↓
Toast affiche le message
```

## Exemples d'utilisation

### Exemple 1 : Formulaire de contact

```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    await contactService.send(formData);
    addToast('Message envoyé avec succès!', 'success');
    setFormData({ name: '', email: '', subject: '', message: '' });
  } catch (error) {
    addToast(getErrorMessage(error), 'error');
  }
};
```

### Exemple 2 : Upload d'image

```javascript
const handleImageUpload = async (file) => {
  try {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('type', 'project');
    
    const response = await api.post('/upload-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    
    addToast('Image uploadée avec succès!', 'success');
    return response.data.path;
  } catch (error) {
    addToast(getErrorMessage(error), 'error');
  }
};
```

## Bonnes pratiques

1. **Toujours utiliser `getErrorMessage()`** pour afficher les erreurs
2. **Utiliser les Toasts** au lieu des `alert()`
3. **Capturer les erreurs de validation** avec `getValidationErrors()`
4. **Afficher l'état de chargement** pendant les appels API
5. **Désactiver les boutons** pendant le traitement
6. **Valider côté frontend** avant d'envoyer au backend
7. **Valider côté backend** même si le frontend valide

## Tests

Pour tester la gestion d'erreurs :

1. Débrancher le serveur backend → Erreur réseau
2. Envoyer des données invalides → Erreur 422
3. Uploader un fichier trop volumineux → Erreur 413
4. Accéder à une ressource inexistante → Erreur 404
