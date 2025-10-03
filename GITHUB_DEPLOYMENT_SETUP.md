# 🤖 Automatic GitHub Deployment Setup

## Your Repository: https://github.com/dipteshpadval/www.vastuverified.git

## Method 1: GitHub Actions (Automatic)

### Step 1: Add SSH Key to GitHub Secrets
1. **Go to your GitHub repository**
2. **Click "Settings" → "Secrets and variables" → "Actions"**
3. **Click "New repository secret"**
4. **Name**: `HOSTINGER_SSH_KEY`
5. **Value**: Your SSH private key content
6. **Click "Add secret"**

### Step 2: Push to GitHub (Triggers Auto-Deploy)
```bash
git add .
git commit -m "Setup automatic deployment"
git push origin main
```

### Step 3: Check Deployment Status
- **Go to "Actions" tab in your GitHub repository**
- **Watch the deployment progress**
- **Your website will be live at**: https://www.vastuverified.com

## Method 2: Hostinger GitHub Integration

### Step 1: Enable in Hostinger Control Panel
1. **Login to Hostinger Control Panel**
2. **Go to "GitHub Integration"**
3. **Connect your GitHub account**
4. **Select repository**: `dipteshpadval/www.vastuverified`
5. **Set build command**: `npm run build`
6. **Set output directory**: `dist`
7. **Enable auto-deploy**

### Step 2: Configure Environment Variables
In Hostinger Control Panel, add:
```
MONGODB_URI=mongodb+srv://dipteshpadval:Diptesh6272@cluster0.avhq4bo.mongodb.net/vastuverifiyed?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=your-super-secret-jwt-key-for-production
NODE_ENV=production
VITE_API_BASE_URL=https://www.vastuverified.com/api
```

## Method 3: One-Click Deploy Script

### Run Automatic Deployment
```bash
# Build and prepare for deployment
node auto-deploy.js

# Or use npm script
npm run deploy:github
```

## 🎯 Quick Start Commands

### Deploy Now:
```bash
# Option 1: GitHub Actions (Recommended)
git add .
git commit -m "Deploy to production"
git push origin main

# Option 2: Manual deployment
npm run deploy:hostinger

# Option 3: Auto-deploy script
node auto-deploy.js
```

## ✅ What Happens Automatically:

1. **Code pushed to GitHub** → Triggers deployment
2. **GitHub Actions builds** your project
3. **Files uploaded** to Hostinger
4. **Website goes live** at https://www.vastuverified.com
5. **Database connected** to MongoDB Atlas

## 🔄 Future Updates:

Just push to GitHub and your website updates automatically:
```bash
git add .
git commit -m "Update website"
git push origin main
```

**Your website will be live and automatically updated!** 🚀
