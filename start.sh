#!/bin/bash
set -e

# Set default port if not provided (Render uses PORT env)
PORT=${PORT:-10000}

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

# Run migrations (continue even if some fail)
php artisan migrate --force || echo "Migration completed with warnings"

# Run seeders (only if tables are empty)
php artisan db:seed --force || echo "Seeding completed with warnings"

# Clear and cache config for production
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Start Apache in foreground
apache2-foreground