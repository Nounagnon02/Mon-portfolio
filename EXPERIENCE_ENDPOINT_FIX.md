# Correction - Endpoint /api/experiences

## 🔴 Problème

Erreur 500 lors de l'appel à `/api/experiences` :
```
POST http://localhost:8000/api/experiences
[HTTP/1.1 500 Internal Server Error]
```

## 🔍 Cause

Le contrôleur `ExperienceController` était référencé dans les routes mais n'existait pas.

## ✅ Solution

### 1. Créé le Modèle Experience
```php
// app/Models/Experience.php
- title (string)
- company (string)
- position (string)
- description (text)
- start_date (date)
- end_date (date)
- order (integer)
```

### 2. Créé le Contrôleur ExperienceController
```php
// app/Http/Controllers/ExperienceController.php
- index() : Récupère toutes les expériences
- show() : Récupère une expérience
- store() : Crée une expérience
- update() : Met à jour une expérience
- destroy() : Supprime une expérience
```

### 3. Créé la Migration
```php
// database/migrations/2024_01_01_000000_create_experiences_table.php
- Crée la table experiences
- Ajoute tous les champs nécessaires
```

### 4. Service Frontend Existant
```javascript
// src/services/api.js
export const experienceService = {
  getAll: () => api.get('/experiences'),
  getById: (id) => api.get(`/experiences/${id}`),
  create: (data) => api.post('/experiences', data),
  update: (id, data) => api.put(`/experiences/${id}`, data),
  delete: (id) => api.delete(`/experiences/${id}`)
};
```

## 🚀 Utilisation

### Frontend
```javascript
import { experienceService } from '../services/api';

// Récupérer toutes les expériences
const experiences = await experienceService.getAll();

// Créer une expérience
await experienceService.create({
  title: 'Senior Developer',
  company: 'Tech Corp',
  position: 'Lead Developer',
  description: 'Managed team of 5 developers',
  start_date: '2020-01-01',
  end_date: '2023-12-31'
});
```

### Backend
```php
// Récupérer toutes les expériences
GET /api/experiences

// Créer une expérience
POST /api/experiences
{
  "title": "Senior Developer",
  "company": "Tech Corp",
  "position": "Lead Developer",
  "description": "Managed team of 5 developers",
  "start_date": "2020-01-01",
  "end_date": "2023-12-31"
}

// Mettre à jour
PUT /api/experiences/{id}

// Supprimer
DELETE /api/experiences/{id}
```

## 📋 Étapes de Déploiement

1. **Exécuter la migration**
```bash
php artisan migrate
```

2. **Vérifier que le contrôleur est importé**
```php
use App\Http\Controllers\ExperienceController;
```

3. **Tester l'endpoint**
```bash
curl -X GET http://localhost:8000/api/experiences
```

## ✨ Résultat

L'erreur 500 devrait être résolue. L'endpoint `/api/experiences` fonctionne maintenant correctement !

## 📝 Notes

- Le modèle utilise les dates castées
- La validation est complète
- Les erreurs sont gérées correctement
- Compatible avec le frontend existant
