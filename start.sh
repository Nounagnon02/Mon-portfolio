#!/bin/bash
set -e

# Set default port if not provided (Render uses PORT env)
PORT=${PORT:-10000}

# Create custom PHP configuration for uploads
echo "upload_max_filesize = 20M" > /usr/local/etc/php/conf.d/custom.ini
echo "post_max_size = 20M" >> /usr/local/etc/php/conf.d/custom.ini
echo "memory_limit = 256M" >> /usr/local/etc/php/conf.d/custom.ini
echo "max_execution_time = 300" >> /usr/local/etc/php/conf.d/custom.ini

# Enable Apache modules
a2enmod rewrite
# Configure Apache to listen on the correct port
echo "Listen $PORT" > /etc/apache2/ports.conf

# Configure VirtualHost
cat > /etc/apache2/sites-available/000-default.conf << 'VHOST'
<VirtualHost *:PORT_PLACEHOLDER>
    DocumentRoot /var/www/public
    <Directory /var/www/public>
        AllowOverride All
        Require all granted
        Options -Indexes +FollowSymLinks
    </Directory>
    ErrorLog ${APACHE_LOG_DIR}/error.log
    CustomLog ${APACHE_LOG_DIR}/access.log combined
</VirtualHost>
VHOST

# Replace placeholder with actual port
sed -i "s/PORT_PLACEHOLDER/$PORT/g" /etc/apache2/sites-available/000-default.conf

# Wait for database to be ready
sleep 3

# Check if migrations should be forced (default: false after first deployment)
FORCE_MIGRATIONS=${FORCE_MIGRATIONS:-false}

if [ "$FORCE_MIGRATIONS" = "true" ]; then
  # Force reset and re-run all migrations
  #php artisan migrate:reset --force || true
  php artisan migrate --force
else
  # Run migrations with verification (skip if already migrated)
  php artisan migrate --force
fi

FORCE_SEEDS=${FORCE_SEEDS:-false}
if [ "$FORCE_SEEDS" = "true" ]; then
  # Force reset and re-run all migrations
  #php artisan migrate:reset --force || true
  php artisan db:seed --force || echo "Seeding completed with warnings"   
else
  # Run seeders (skip if already seeded)
  echo "Seeds already applied or skipped"
fi


# Clear and cache config for production
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Start Apache in foreground
apache2-foreground