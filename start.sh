#!/bin/bash

# Démarrer PHP-FPM en arrière-plan
# Cache cleared: 2025-12-09
php-fpm -D

# Migrations désactivées - utiliser la console Render pour les exécuter manuellement
# php artisan migrate --force --no-interaction || true

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