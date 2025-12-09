# Configuration Neon PostgreSQL

## 1. Créer un compte Neon
- Aller sur https://neon.tech
- S'inscrire avec GitHub
- Créer un nouveau projet

## 2. Obtenir la connection string
- Dans Neon Dashboard, copier la connection string
- Format: `postgresql://user:password@host/database`

## 3. Configurer Laravel pour PostgreSQL

### Installer le driver PostgreSQL
```bash
composer require illuminate/database
```

### Mettre à jour config/database.php
```php
'pgsql' => [
    'driver' => 'pgsql',
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

## 4. Variables d'environnement Render

Ajouter sur Render:
```
DB_CONNECTION=pgsql
DB_HOST=your-neon-host.neon.tech
DB_PORT=5432
DB_DATABASE=neondb
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

## 5. Migrer la base de données

```bash
# Localement
php artisan migrate

# Sur Render (via Render Shell ou post-deploy command)
php artisan migrate --force
```

## 6. Backup Neon

Neon offre des backups automatiques. Pour exporter:
```bash
pg_dump postgresql://user:password@host/database > backup.sql
```

## Avantages Neon
- ✅ PostgreSQL gratuit
- ✅ Backups automatiques
- ✅ Scaling automatique
- ✅ Branching pour dev/test
- ✅ Serverless
