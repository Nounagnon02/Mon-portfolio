# Déploiement sur Render avec Neon

## 1. Sur Render Dashboard

### Créer un Web Service
- Aller sur https://render.com
- Créer un nouveau Web Service
- Connecter votre repository GitHub
- Sélectionner la branche `main`

### Configuration de base
- **Name**: portfolio-api
- **Runtime**: Docker
- **Build Command**: `composer install && php artisan migrate --force`
- **Start Command**: `php artisan serve --host=0.0.0.0 --port=8000`

### Environment Variables
Ajouter ces variables dans Render:

```
APP_ENV=production
APP_DEBUG=false
APP_KEY=base64:gAiKE+2oOjyvy1G3oIv5qltyomCPoK8wq7aU2FXrXQM=
DATABASE_URL=postgresql://neondb_owner:npg_Nu4TEHKyC0YU@ep-gentle-leaf-adb175uq-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
REDIS_URL=redis://default:password@redis-host:6379
FRONTEND_URL=https://mon-portfolio-five-alpha.vercel.app
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_BUCKET=your_bucket
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=your_username
MAIL_PASSWORD=your_password
```

## 2. Configuration Laravel

### config/database.php
```php
'pgsql' => [
    'driver' => 'pgsql',
    'url' => env('DATABASE_URL'),
    'host' => env('DB_HOST', '127.0.0.1'),
    'port' => env('DB_PORT', '5432'),
    'database' => env('DB_DATABASE', 'forge'),
    'username' => env('DB_USERNAME', 'forge'),
    'password' => env('DB_PASSWORD', ''),
    'charset' => 'utf8',
    'prefix' => '',
    'prefix_indexes' => true,
    'schema' => 'public',
    'sslmode' => 'require',
],
```

## 3. Déployer

```bash
git add .
git commit -m "Production deployment with Neon"
git push origin main
```

Render déploiera automatiquement et exécutera les migrations.

## 4. Vérifier

```bash
# Vérifier les logs
curl https://your-render-app.onrender.com/health

# Vérifier la base de données
psql 'postgresql://neondb_owner:npg_Nu4TEHKyC0YU@ep-gentle-leaf-adb175uq-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
```

## Notes
- Neon offre des backups automatiques
- La connection string inclut déjà le SSL
- Redis peut être optionnel pour le plan free
