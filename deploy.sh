#!/bin/bash

# ERP Application Deployment Script
# This script handles automated deployment on EC2

set -e  # Exit on any error

echo "🚀 Starting deployment..."

# Navigate to project directory
cd /var/www/erp || exit 1

# Enable maintenance mode
echo "🔧 Enabling maintenance mode..."
php artisan down || true

# Pull latest changes from git
echo "📥 Pulling latest changes..."
git fetch origin
git reset --hard origin/main

# Install/update Composer dependencies
echo "📦 Installing Composer dependencies..."
composer install --no-interaction --prefer-dist --optimize-autoloader --no-dev

# Install/update NPM dependencies
echo "📦 Installing NPM dependencies..."
npm ci

# Build frontend assets
echo "🏗️  Building frontend assets..."
npm run build

# Clear and cache configuration
echo "⚙️  Optimizing application..."
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear

php artisan config:cache
php artisan route:cache
php artisan view:cache

# Run database migrations
echo "🗄️  Running database migrations..."
php artisan migrate --force

# Set proper permissions
echo "🔐 Setting permissions..."
chown -R www-data:www-data /var/www/erp
chmod -R 755 /var/www/erp/storage
chmod -R 755 /var/www/erp/bootstrap/cache

# Restart services
echo "🔄 Restarting services..."
sudo systemctl restart php8.2-fpm
sudo systemctl reload nginx

# Disable maintenance mode
echo "✅ Disabling maintenance mode..."
php artisan up

echo "🎉 Deployment completed successfully!"
