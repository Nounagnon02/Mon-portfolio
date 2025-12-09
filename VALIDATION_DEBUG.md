# Débogage - Erreur 422 sur /api/experiences

## 🔴 Problème

Erreur 422 (Unprocessable Content) lors de l'envoi de données à `/api/experiences`

## 🔍 Cause Probable

Les données envoyées ne respectent pas la validation :

### Validation Requise
```php
'title' => 'required|string|max:255',
'company' => 'required|string|max:255',
'position' => 'required|string|max:255',
'description' => 'nullable|string|max:2000',
'start_date' => 'required|date_format:Y-m-d',
'end_date' => 'nullable|date_format:Y-m-d',
'order' => 'nullable|integer|min:0'
```

## ✅ Format Correct

### Exemple de Payload Valide
```json
{
  "title": "Senior Developer",
  "company": "Tech Corp",
  "position": "Lead Developer",
  "description": "Managed team of 5 developers",
  "start_date": "2020-01-01",
  "end_date": "2023-12-31",
  "order": 1
}
```

### Champs Obligatoires
- `title` : string (max 255)
- `company` : string (max 255)
- `position` : string (max 255)
- `start_date` : date au format YYYY-MM-DD

### Champs Optionnels
- `description` : string (max 2000)
- `end_date` : date au format YYYY-MM-DD
- `order` : integer

## 🛠️ Comment Déboguer

### 1. Vérifier la Console du Navigateur
```javascript
// Voir l'erreur complète
console.log(error.response.data);
```

### 2. Vérifier les Logs Laravel
```bash
tail -f storage/logs/laravel.log
```

### 3. Tester avec cURL
```bash
curl -X POST http://localhost:8000/api/experiences \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Senior Developer",
    "company": "Tech Corp",
    "position": "Lead Developer",
    "start_date": "2020-01-01"
  }'
```

## 📋 Checklist

- [ ] Tous les champs obligatoires sont présents
- [ ] Les dates sont au format YYYY-MM-DD
- [ ] Les strings ne dépassent pas les limites
- [ ] Les données sont en JSON valide
- [ ] Le Content-Type est application/json

## 🚀 Solution

Si vous recevez une erreur 422, vérifiez :

1. **Les champs obligatoires**
   - title ✓
   - company ✓
   - position ✓
   - start_date ✓

2. **Le format des dates**
   - Doit être YYYY-MM-DD
   - Pas de timestamp
   - Pas de format personnalisé

3. **Les limites de caractères**
   - title : max 255
   - company : max 255
   - position : max 255
   - description : max 2000

## 💡 Exemple Frontend

```javascript
const experienceData = {
  title: 'Senior Developer',
  company: 'Tech Corp',
  position: 'Lead Developer',
  description: 'Managed team of 5 developers',
  start_date: '2020-01-01',
  end_date: '2023-12-31'
};

try {
  const response = await experienceService.create(experienceData);
  console.log('Succès:', response);
} catch (error) {
  console.log('Erreur:', error.response.data.errors);
}
```

## 📝 Notes

- Les dates doivent être au format ISO (YYYY-MM-DD)
- Les champs optionnels peuvent être omis
- La validation est stricte pour la sécurité
