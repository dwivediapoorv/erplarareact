# Deployment Guide for EC2

This guide covers deploying the ERP application to an AWS EC2 instance with automated deployment on push.

## Prerequisites

- EC2 instance running Ubuntu 22.04 or later
- Domain/subdomain pointed to EC2 instance
- SSH access to EC2 instance
- GitHub repository for the project

## Initial Server Setup

### 1. Connect to EC2 Instance

```bash
ssh -i your-key.pem ubuntu@your-ec2-ip
```

### 2. Install Required Software

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Nginx
sudo apt install nginx -y

# Install PHP 8.2 and extensions
sudo apt install software-properties-common -y
sudo add-apt-repository ppa:ondrej/php -y
sudo apt update
sudo apt install php8.2 php8.2-fpm php8.2-cli php8.2-common php8.2-mysql php8.2-zip php8.2-gd php8.2-mbstring php8.2-curl php8.2-xml php8.2-bcmath php8.2-pgsql -y

# Install PostgreSQL client (if using remote database)
sudo apt install postgresql-client -y

# Install Composer
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer

# Install Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install nodejs -y

# Install Git
sudo apt install git -y
```

### 3. Setup Application Directory

```bash
# Create directory
sudo mkdir -p /var/www/erp
sudo chown -R $USER:$USER /var/www/erp

# Clone repository
cd /var/www
git clone https://github.com/your-username/your-repo.git erp
cd erp

# Copy environment file
cp .env.example .env

# Edit .env file with production settings
nano .env
```

### 4. Configure Environment Variables

Edit `/var/www/erp/.env`:

```env
APP_NAME="DigiRocket ERP"
APP_ENV=production
APP_KEY=base64:YOUR_APP_KEY_HERE
APP_DEBUG=false
APP_URL=https://your-domain.com

LOG_CHANNEL=stack
LOG_LEVEL=error

DB_CONNECTION=pgsql
DB_HOST=your-supabase-host
DB_PORT=6543
DB_DATABASE=postgres
DB_USERNAME=postgres.your-project
DB_PASSWORD=your-password

SESSION_DRIVER=database
QUEUE_CONNECTION=database

# Add other production settings...
```

### 5. Install Dependencies and Setup

```bash
# Install PHP dependencies
composer install --no-interaction --prefer-dist --optimize-autoloader --no-dev

# Install Node dependencies
npm ci

# Build frontend assets
npm run build

# Generate application key (if not set)
php artisan key:generate

# Run migrations
php artisan migrate --force

# Optimize application
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Set permissions
sudo chown -R www-data:www-data /var/www/erp
sudo chmod -R 755 /var/www/erp/storage
sudo chmod -R 755 /var/www/erp/bootstrap/cache
```

### 6. Configure Nginx

Create Nginx configuration:

```bash
sudo nano /etc/nginx/sites-available/erp
```

Add this configuration:

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/erp/public;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    index index.php;

    charset utf-8;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    error_page 404 /index.php;

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }

    # Additional security headers
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
}
```

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/erp /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 7. Install SSL Certificate (Optional but Recommended)

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d your-domain.com
```

### 8. Make Deployment Script Executable

```bash
chmod +x /var/www/erp/deploy.sh
```

## Automated Deployment Setup

### 1. Generate SSH Key on EC2

```bash
# On EC2 instance
ssh-keygen -t ed25519 -C "github-deploy"
cat ~/.ssh/id_ed25519.pub
```

Add this public key to your GitHub repository's Deploy Keys:
- Go to: Repository Settings → Deploy Keys → Add deploy key
- Paste the public key
- Enable "Allow write access" if needed

### 2. Configure GitHub Secrets

Go to your GitHub repository Settings → Secrets and variables → Actions, and add:

- **EC2_HOST**: Your EC2 instance public IP or domain
- **EC2_USERNAME**: `ubuntu` (or your SSH username)
- **EC2_SSH_KEY**: Content of your private key file (the .pem file you use to connect)

To get your private key content:
```bash
cat your-key.pem
```

### 3. Setup Git on EC2

```bash
cd /var/www/erp
git config --global user.email "deploy@yourdomain.com"
git config --global user.name "Deploy Bot"
```

### 4. Test Deployment

Push changes to the main branch:

```bash
git add .
git commit -m "Setup automated deployment"
git push origin main
```

The GitHub Action will automatically:
1. Connect to your EC2 instance via SSH
2. Run the deployment script
3. Pull latest code
4. Install dependencies
5. Build assets
6. Run migrations
7. Restart services

## Manual Deployment

If you need to deploy manually, SSH into the server and run:

```bash
cd /var/www/erp
bash deploy.sh
```

## Troubleshooting

### Check Logs

```bash
# Application logs
tail -f /var/www/erp/storage/logs/laravel.log

# Nginx logs
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log

# PHP-FPM logs
sudo tail -f /var/log/php8.2-fpm.log
```

### Permission Issues

```bash
sudo chown -R www-data:www-data /var/www/erp
sudo chmod -R 755 /var/www/erp/storage
sudo chmod -R 755 /var/www/erp/bootstrap/cache
```

### Clear Cache

```bash
cd /var/www/erp
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear
```

### Restart Services

```bash
sudo systemctl restart php8.2-fpm
sudo systemctl restart nginx
```

## Production Checklist

- [ ] Environment is set to `production`
- [ ] Debug mode is disabled (`APP_DEBUG=false`)
- [ ] APP_KEY is generated
- [ ] Database credentials are correct
- [ ] SSL certificate is installed
- [ ] File permissions are correct
- [ ] Nginx is configured properly
- [ ] GitHub Actions secrets are set
- [ ] Deploy script is executable
- [ ] Git is configured on server
- [ ] Monitoring is setup (optional)

## Monitoring & Maintenance

### Setup Monitoring (Optional)

Consider setting up:
- CloudWatch for EC2 metrics
- Application Performance Monitoring (APM) like New Relic or Datadog
- Uptime monitoring like UptimeRobot

### Regular Maintenance

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Clear old logs
php artisan log:clear

# Optimize database
php artisan optimize
```

## Rollback

If deployment fails, you can rollback:

```bash
cd /var/www/erp
git reset --hard HEAD~1
bash deploy.sh
```

## Security Recommendations

1. Keep system and packages updated
2. Use strong passwords for database
3. Enable firewall (UFW)
4. Regularly backup database
5. Monitor logs for suspicious activity
6. Use environment-specific .env files
7. Never commit .env to version control

## Support

For issues or questions, contact the development team.
