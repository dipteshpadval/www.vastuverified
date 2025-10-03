# 🚀 Quick Deploy Guide - Hostinger + GitHub

## Your Setup:
- **Domain**: vastuverifiyed.com
- **GitHub**: https://github.com/dipteshpadval/www.vastuverified.git
- **SSH Host**: in-mum-web1672.main-hosting.eu
- **SSH User**: u698056983

## Method 1: Manual Upload (Easiest)

### Step 1: Build Your Project
```bash
# In your project directory
npm run build
```

### Step 2: Upload via Hostinger File Manager
1. **Login to Hostinger Control Panel**
2. **Go to File Manager**
3. **Navigate to public_html folder**
4. **Upload all files from your `dist` folder**

### Step 3: Upload Backend (if needed)
1. **Create a folder called `api` in public_html**
2. **Upload all files from your `backend` folder to `api`**

## Method 2: GitHub Integration

### Step 1: Enable GitHub Integration in Hostinger
1. **Login to Hostinger Control Panel**
2. **Go to "GitHub Integration"**
3. **Connect your GitHub account**
4. **Select repository**: `dipteshpadval/www.vastuverified`
5. **Set build command**: `npm run build`
6. **Set output directory**: `dist`

### Step 2: Configure Environment Variables
In Hostinger Control Panel, add these environment variables:
```
MONGODB_URI=mongodb+srv://dipteshpadval:Diptesh6272@cluster0.avhq4bo.mongodb.net/vastuverifiyed?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=your-super-secret-jwt-key-for-production
NODE_ENV=production
```

## Method 3: SSH Deployment (If Connection Works)

### Step 1: Test SSH Connection
```bash
ssh u698056983@in-mum-web1672.main-hosting.eu
```

### Step 2: Upload Files
```bash
# Upload frontend
scp -r dist/* u698056983@in-mum-web1672.main-hosting.eu:public_html/

# Upload backend (if Node.js supported)
scp -r backend/* u698056983@in-mum-web1672.main-hosting.eu:public_html/api/
```

## Method 4: Hybrid Deployment (Recommended)

### Frontend on Hostinger
1. **Upload `dist` folder contents to public_html**
2. **This handles your website display**

### Backend on Cloud (Railway/Vercel)
1. **Deploy backend to Railway or Vercel**
2. **Get backend URL** (e.g., `https://your-backend.railway.app`)
3. **Update frontend API URL** to point to cloud backend

## Quick Start - Choose One:

### Option A: Manual Upload (5 minutes)
1. Build project: `npm run build`
2. Login to Hostinger File Manager
3. Upload `dist` folder contents to `public_html`
4. Done! Your website is live

### Option B: GitHub Integration (10 minutes)
1. Enable GitHub integration in Hostinger
2. Connect your repository
3. Set build settings
4. Push to GitHub - auto-deploys!

### Option C: Hybrid (15 minutes)
1. Upload frontend to Hostinger
2. Deploy backend to Railway/Vercel
3. Update API URLs
4. Full-stack website live!

## Your Website Will Be Live At:
🌐 **https://vastuverifiyed.com**

## Next Steps After Deployment:
1. **Test user registration**
2. **Test property listing**
3. **Check MongoDB Atlas for data**
4. **Configure domain settings**

**Choose the method that works best for you!** 🚀
