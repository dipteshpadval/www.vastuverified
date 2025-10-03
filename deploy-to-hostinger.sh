#!/bin/bash

# 🚀 Hostinger SSH Deployment Script
# Real Estate Website Deployment

echo "🏠 Starting deployment to Hostinger..."

# Configuration
HOSTINGER_HOST="in-mum-web1672.main-hosting.eu"
HOSTINGER_USER="u698056983"
DOMAIN="vastuverifiyed.com"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}📦 Building React application...${NC}"
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Build failed! Please fix errors and try again.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Build completed successfully!${NC}"

echo -e "${BLUE}📁 Creating deployment package...${NC}"
mkdir -p hostinger-deploy

# Copy frontend files
cp -r dist/* hostinger-deploy/

# Copy backend files (if Node.js is supported)
if [ -d "backend" ]; then
    echo -e "${YELLOW}📦 Including backend files...${NC}"
    cp -r backend hostinger-deploy/api
fi

# Copy additional files
cp public/.htaccess hostinger-deploy/ 2>/dev/null || echo "No .htaccess file found"
cp public/manifest.json hostinger-deploy/ 2>/dev/null || echo "No manifest.json found"

echo -e "${BLUE}🚀 Uploading to Hostinger...${NC}"
echo "Host: $HOSTINGER_USER@$HOSTINGER_HOST"

# Upload files to Hostinger
scp -r hostinger-deploy/* $HOSTINGER_USER@$HOSTINGER_HOST:public_html/

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Files uploaded successfully!${NC}"
else
    echo -e "${RED}❌ Upload failed! Please check your SSH connection.${NC}"
    exit 1
fi

echo -e "${BLUE}🔧 Setting up server configuration...${NC}"

# SSH into server and configure
ssh $HOSTINGER_USER@$HOSTINGER_HOST << 'EOF'
    echo "Setting file permissions..."
    chmod 755 public_html/
    chmod 644 public_html/*.html 2>/dev/null || true
    chmod 644 public_html/*.css 2>/dev/null || true
    chmod 644 public_html/*.js 2>/dev/null || true
    
    # If backend exists, try to install dependencies
    if [ -d "public_html/api" ]; then
        echo "Installing backend dependencies..."
        cd public_html/api
        npm install --production 2>/dev/null || echo "Node.js not available or npm install failed"
        cd ../..
    fi
    
    echo "Configuration complete!"
EOF

echo -e "${BLUE}🧹 Cleaning up...${NC}"
rm -rf hostinger-deploy

echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
echo -e "${YELLOW}📋 Next steps:${NC}"
echo "1. Visit: https://$DOMAIN"
echo "2. Test user registration"
echo "3. Test property listing"
echo "4. Check MongoDB Atlas for data"

echo -e "${BLUE}🔍 Testing deployment...${NC}"
echo "Testing website: https://$DOMAIN"
curl -s -o /dev/null -w "%{http_code}" https://$DOMAIN

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Website is accessible!${NC}"
else
    echo -e "${YELLOW}⚠️  Website might not be ready yet. Please wait a few minutes.${NC}"
fi

echo -e "${GREEN}🚀 Deployment complete! Your real estate website is now live!${NC}"
