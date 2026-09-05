#!/bin/bash
set -e

PROJECT_DIR="/opt/react-native-shop"
BUILD_DIR="$PROJECT_DIR/dist"
NGINX_DIR="/var/www/react-native-shop"
NGINX_SITE="/etc/nginx/sites-available/react-native-shop"
NGINX_LINK="/etc/nginx/sites-enabled/react-native-shop"
DOTENV_FILE="${DOTENV_FILE:-.env.uat}"

cd "$PROJECT_DIR"

if [ ! -f "$PROJECT_DIR/$DOTENV_FILE" ]; then
  echo "❌ Missing $PROJECT_DIR/$DOTENV_FILE (set DOTENV_FILE=... to use a different file)"
  exit 1
fi

echo "📦 Building Expo Web app using $DOTENV_FILE..."
EXPO_NO_DOTENV=1 DOTENV_FILE="$DOTENV_FILE" npx expo export --platform web --clear

if [ ! -d "$BUILD_DIR" ]; then
  echo "❌ Build directory not found: $BUILD_DIR"
  exit 1
fi

echo "📁 Preparing Nginx directory..."
sudo mkdir -p "$NGINX_DIR"
sudo rm -rf "$NGINX_DIR"/*

echo "📄 Copying build files..."
sudo cp -r "$BUILD_DIR"/* "$NGINX_DIR"/
sudo chown -R www-data:www-data "$NGINX_DIR"

if [ ! -f "$NGINX_SITE" ]; then
  echo "⚠️ Nginx site config not found at $NGINX_SITE"
  echo "Create it first before continuing."
  exit 1
fi

echo "🔗 Enabling Nginx site..."
sudo ln -sfn "$NGINX_SITE" "$NGINX_LINK"

echo "🧪 Testing Nginx config..."
sudo nginx -t

echo "🔄 Reloading Nginx..."
sudo systemctl reload nginx

echo "✅ Checking local response..."
curl -I http://localhost || true

echo "🚀 Deployment complete"
echo "🌐 URL: https://ui.shk-uat-chipie.uk"