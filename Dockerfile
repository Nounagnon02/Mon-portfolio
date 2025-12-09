FROM php:8.2-fpm

# Installation des dépendances système
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    libpq-dev \
    nginx

# Installation des extensions PHP
RUN docker-php-ext-install pdo_pgsql pdo_mysql mbstring exif pcntl bcmath gd

# Installation de Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Créer le répertoire de travail
WORKDIR /var/www

# Copier SEULEMENT le contenu de bh_backend (pas le dossier lui-même)
COPY MonP_Back-end/ .

# Installer les dépendances PHP
RUN composer install --no-dev --optimize-autoloader --no-interaction

# Permissions
RUN chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache
RUN chmod -R 775 /var/www/storage /var/www/bootstrap/cache

# Configuration Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Exposer le port
EXPOSE 8080

# Script de démarrage
COPY start.sh /start.sh
RUN chmod +x /start.sh

CMD ["/start.sh"]