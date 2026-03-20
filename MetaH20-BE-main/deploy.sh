#!/bin/bash
# Production deployment script for Hydra ICO Backend

set -e  # Exit on error

echo "🚀 Starting backend deployment..."

# Pull latest changes from git (if using git)
# git pull origin main

# Install dependencies if package.json changed
# npm install

# Restart the backend with PM2
echo "🔄 Restarting backend with PM2..."
pm2 restart hydra-ico-backend

echo "✅ Backend deployment complete!"
echo "📊 Backend status:"
pm2 status hydra-ico-backend
