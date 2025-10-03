# 🚀 Hostinger SSH Deployment Guide

## Using SSH Key for Direct Deployment

### SSH Key Information:
- **Host**: in-mum-web1672.main-hosting.eu
- **User**: u698056983
- **Key**: SSH RSA key provided

## Step 1: Configure SSH Connection

### Add SSH Key to Your System
1. **Save the SSH key to your system:**
   ```bash
   # Create SSH directory if it doesn't exist
   mkdir -p ~/.ssh
   
   # Add the key to SSH agent
   ssh-add ~/.ssh/hostinger_key
   ```

### Test SSH Connection
```bash
ssh u698056983@in-mum-web1672.main-hosting.eu
```

## Step 2: Prepare Deployment Files

### Create Deployment Script
```bash
#!/bin/bash
# deploy-to-hostinger.sh

# Build the project
echo "Building React application..."
npm run build

# Create deployment package
echo "Creating deployment package..."
mkdir -p hostinger-deploy
cp -r dist/* hostinger-deploy/
cp -r backend hostinger-deploy/api

# Upload to Hostinger
echo "Uploading to Hostinger..."
scp -r hostinger-deploy/* u698056983@in-mum-web1672.main-hosting.eu:public_html/

# Clean up
rm -rf hostinger-deploy
echo "Deployment complete!"
```

## Step 3: Environment Configuration

### Create .env file for Hostinger
```env
# Database
MONGODB_URI=mongodb+srv://dipteshpadval:<password>@cluster0.avhq4bo.mongodb.net/vastuverifiyed?retryWrites=true&w=majority&appName=Cluster0

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-for-production

# Node Environment
NODE_ENV=production

# API Base URL
VITE_API_BASE_URL=https://vastuverifiyed.com/api
```

## Step 4: Deploy Backend (if Node.js supported)

### Upload Backend Files
```bash
# Upload backend to Hostinger
scp -r backend/* u698056983@in-mum-web1672.main-hosting.eu:public_html/api/

# Upload environment file
scp backend/.env u698056983@in-mum-web1672.main-hosting.eu:public_html/api/
```

## Step 5: Deploy Frontend

### Upload Frontend Files
```bash
# Build frontend
npm run build

# Upload to Hostinger
scp -r dist/* u698056983@in-mum-web1672.main-hosting.eu:public_html/
```

## Step 6: Configure Server

### SSH into Hostinger
```bash
ssh u698056983@in-mum-web1672.main-hosting.eu
```

### Install Node.js Dependencies (if supported)
```bash
cd public_html/api
npm install
```

### Set File Permissions
```bash
chmod 755 public_html/
chmod 644 public_html/*.html
chmod 644 public_html/*.css
chmod 644 public_html/*.js
```

## Step 7: Test Deployment

### Check Files
```bash
# List uploaded files
ls -la public_html/

# Check if backend is accessible
curl https://vastuverifiyed.com/api/health
```

## Alternative: Hybrid Deployment

### If Hostinger doesn't support Node.js:

1. **Deploy Frontend to Hostinger:**
   ```bash
   npm run build
   scp -r dist/* u698056983@in-mum-web1672.main-hosting.eu:public_html/
   ```

2. **Deploy Backend to Railway/Vercel:**
   - Use the existing railway.json or vercel.json
   - Deploy backend separately
   - Update API URL in frontend

## Troubleshooting

### Common Issues:
1. **Permission denied**: Check SSH key permissions
2. **Connection refused**: Verify Hostinger server status
3. **File upload fails**: Check disk space and permissions
4. **Backend not working**: Check if Node.js is supported

### Support:
- **Hostinger Support**: 24/7 chat
- **SSH Documentation**: Hostinger SSH guide
- **Node.js Support**: Check hosting plan features
