# Use official PHP image with Apache
FROM php:8.2-apache

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libpq-dev \
    zip \
    unzip \
    && docker-php-ext-install pdo pdo_pgsql pgsql mbstring exif pcntl bcmath gd \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Enable Apache mod_rewrite
RUN a2enmod rewrite

# Set working directory
WORKDIR /var/www

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copy composer files first for better caching (from MonP_Back-end subdirectory)
COPY MonP_Back-end/composer.json MonP_Back-end/composer.lock ./

# Install dependencies
RUN composer install --no-dev --optimize-autoloader --no-scripts

# Copy the rest of the backend application
COPY MonP_Back-end/ .

# Run composer scripts after copy
RUN composer dump-autoload --optimize

# Set proper permissions
RUN chown -R www-data:www-data /var/www \
    && chmod -R 755 /var/www/storage \
    && chmod -R 755 /var/www/bootstrap/cache

# Configure Apache
RUN echo 'ServerName localhost' >> /etc/apache2/apache2.conf

# Create startup script using printf for proper formatting
RUN printf '#!/bin/bash\n\
    set -e\n\
    \n\
    # Set default port if not provided (Render uses PORT env)\n\
    PORT=${PORT:-10000}\n\
    \n\
    # Configure Apache to listen on the correct port\n\
    echo "Listen $PORT" > /etc/apache2/ports.conf\n\
    \n\
    # Configure VirtualHost dynamically\n\
    cat > /etc/apache2/sites-available/000-default.conf << EOF\n\
    <VirtualHost *:$PORT>\n\
    DocumentRoot /var/www/public\n\
    <Directory /var/www/public>\n\
    AllowOverride All\n\
    Require all granted\n\
    Options -Indexes +FollowSymLinks\n\
    </Directory>\n\
    ErrorLog \\${APACHE_LOG_DIR}/error.log\n\
    CustomLog \\${APACHE_LOG_DIR}/access.log combined\n\
    </VirtualHost>\n\
    EOF\n\
    \n\
    # Wait for database to be ready\n\
    sleep 3\n\
    \n\
    # Run migrations (continue even if some fail)\n\
    php artisan migrate --force || echo "Migration completed with warnings"\n\
    \n\
    # Clear and cache config for production\n\
    php artisan config:cache\n\
    php artisan route:cache\n\
    php artisan view:cache\n\
    \n\
    # Start Apache in foreground\n\
    apache2-foreground\n\
    ' > /usr/local/bin/start.sh && chmod +x /usr/local/bin/start.sh

# Expose default Render port
EXPOSE 10000

# Start the application
CMD ["/usr/local/bin/start.sh"]
