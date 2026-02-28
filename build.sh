#!/usr/bin/env bash
# الخروج عند حدوث خطأ
set -o errexit

echo "--- Starting Build Process ---"

# تثبيت مكتبات PHP
composer install --no-dev --optimize-autoloader

# تثبيت مكتبات Node وتجميع ملفات React (Vite)
npm install
npm run build

echo "--- Caching Laravel Configurations ---"
php artisan config:cache
php artisan route:cache
php artisan view:cache

# ملاحظة: سيتم تشغيل الميجريشن يدوياً أو بعد التأكد من ربط القاعدة
# php artisan migrate --force

echo "--- Build Finished Successfully ---"
