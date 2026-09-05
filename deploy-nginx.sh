#!/bin/bash

set -e

PROJECT_DIR="/opt/react-native-shop"
BUILD_DIR="$PROJECT_DIR/dist"
NGINX_DIR="/var/www/react-native-shop"
DOTENV_FILE="${DOTENV_FILE:-.env.uat}"

cd "$PROJECT_DIR"

if [ ! -f "$PROJECT_DIR/$DOTENV_FILE" ]; then
  echo "❌ Missing $PROJECT_DIR/$DOTENV_FILE (set DOTENV_FILE=... to use a different file)"
  exit 1
fi

echo "📦 Building Expo Web app (no cache) using $DOTENV_FILE..."
EXPO_NO_DOTENV=1 DOTENV_FILE="$DOTENV_FILE" npx expo export --platform web --clear

echo "🧹 Clearing old deployment..."
sudo rm -rf $NGINX_DIR/*
sudo mkdir -p $NGINX_DIR

echo "📁 Copying new build files..."
sudo cp -r $BUILD_DIR/* $NGINX_DIR/
sudo chown -R www-data:www-data $NGINX_DIR

echo "🔄 Reloading Nginx..."
sudo systemctl reload nginx

echo "🚀 Deployment complete! Your site is live at: https://ui.shk-uat-chipie.uk"
