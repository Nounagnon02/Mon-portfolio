#!/bin/bash

# Démarrer PHP-FPM en arrière-plan
php-fpm -D

# Créer le fichier SQLite s'il n'existe pas
touch /var/www/database/database.sqlite

# Exécuter les migrations avec SQLite
php artisan migrate --force --no-interaction || true

# Exécuter les seeders SEULEMENT si c'est le premier déploiement
# ou si la variable FORCE_SEED est définie
#if [ "$FORCE_SEED" = "true" ] || [ ! -f /var/www/storage/.seeded ]; then
    #echo "Exécution des seeders..."
    #php artisan db:seed --force
    # Créer un fichier marqueur pour ne pas réexécuter
    #touch /var/www/storage/.seeded
#else
    #echo "✅ Seeders déjà exécutés, skip..."
#fi

# Optimiser l'application
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Créer le lien symbolique pour le storage
php artisan storage:link || true

# Démarrer Nginx au premier plan
nginx -g 'daemon off;'