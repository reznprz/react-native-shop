🚀 React Native Web Deployment (Expo → Nginx)

This guide describes how to build and deploy a React Native (Expo) web app on an Ubuntu VM using Nginx, with a domain such as:

https://ui.shk-uat-chipie.uk

📁 Project Structure

Your actual React Native project lives here:

/opt/react-native-shop

Expo will always build the web output into this folder:

/opt/react-native-shop/dist

Nginx serves files from:

/var/www/react-native-shop

🛠 Prerequisites

Node.js 20+

yarn (optional)

Nginx installed

Domain configured via Cloudflare Tunnel or DNS

🔧 Step 1 — Build the Web App

Inside the project folder:

cd /opt/react-native-shop
npx expo export --platform web

This generates your production build inside:

/opt/react-native-shop/dist

You should see:

index.html
\_expo/
assets/
favicon.ico
metadata.json

🔧 Step 2 — Deploy to Nginx

The deployment folder is:

/var/www/react-native-shop

You can deploy manually:

sudo rm -rf /var/www/react-native-shop/_
sudo cp -r dist/_ /var/www/react-native-shop/
sudo chown -R www-data:www-data /var/www/react-native-shop

Or simply run:

./deploy.sh

(See script below)

🔧 Step 3 — Reload Nginx
sudo systemctl reload nginx

Your updated app is now live at:

https://ui.shk-uat-chipie.uk

🔧 Step 4 — Environment Variables

Example .env for connecting frontend → backend:

EXPO_PUBLIC_TOKEN_BASE_URL=https://token.shk-uat-chipie.uk
EXPO_PUBLIC_API_BASE_URL=https://api.shk-uat-chipie.uk
EXPO_PUBLIC_ENV=uat
EXPO_PUBLIC_DEBUG=false

After editing .env, rebuild:

npx expo export --platform web
./deploy.sh

🔧 Step 5 — Nginx Configuration (UI)

File: /etc/nginx/sites-available/react-native-shop

server {
listen 80;
server_name ui.shk-uat-chipie.uk;

    root /var/www/react-native-shop;
    index index.html;

    location / {
        try_files $uri /index.html;
    }

}

Then enable:

sudo ln -s /etc/nginx/sites-available/react-native-shop /etc/nginx/sites-enabled/react-native-shop
sudo nginx -t
sudo systemctl reload nginx
