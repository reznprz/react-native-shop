#!/bin/bash

set -e

PROJECT_DIR="/opt/react-native-shop"
BUILD_DIR="$PROJECT_DIR/dist"
NGINX_DIR="/var/www/react-native-shop"

echo "📦 Building Expo Web app (no cache)..."
cd "$PROJECT_DIR"
npx expo export --platform web --clear

echo "🧹 Clearing old deployment..."
sudo rm -rf $NGINX_DIR/*
sudo mkdir -p $NGINX_DIR

echo "📁 Copying new build files..."
sudo cp -r $BUILD_DIR/* $NGINX_DIR/
sudo chown -R www-data:www-data $NGINX_DIR

echo "🔄 Reloading Nginx..."
sudo systemctl reload nginx

echo "🚀 Deployment complete! Your site is live at: https://ui.shk-uat-chipie.uk"
