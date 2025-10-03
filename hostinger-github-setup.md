# 🚀 Hostinger GitHub Integration Guide

## Automatic Deployment from GitHub to Hostinger

### Prerequisites
- Hostinger hosting account
- GitHub repository with your real estate website
- MongoDB Atlas database (already configured)

### Step 1: Enable GitHub Integration in Hostinger

1. **Login to Hostinger Control Panel**
2. **Go to "Advanced" → "Git Version Control"**
3. **Enable Git Integration**
4. **Connect your GitHub account**

### Step 2: Configure Repository

1. **Select Repository**: Choose your real estate website repo
2. **Set Branch**: Usually `main` or `master`
3. **Set Build Command**: 
   ```bash
   npm install && npm run build
   ```
4. **Set Publish Directory**: `dist` (for React build)

### Step 3: Environment Variables

In Hostinger Control Panel, set these environment variables:

```env
# Database
MONGODB_URI=mongodb+srv://dipteshpadval:<password>@cluster0.avhq4bo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

# JWT Secret
JWT_SECRET=your-production-secret-key

# Node Environment
NODE_ENV=production

# API Base URL
VITE_API_BASE_URL=https://vastuverifiyed.com/api
```

### Step 4: Configure Build Settings

#### For React Frontend:
```json
{
  "buildCommand": "npm install && npm run build",
  "publishDirectory": "dist",
  "installCommand": "npm install"
}
```

#### For Node.js Backend (if supported):
```json
{
  "buildCommand": "cd backend && npm install",
  "startCommand": "cd backend && npm start",
  "publishDirectory": "backend"
}
```

### Step 5: Database Connection

1. **MongoDB Atlas**:
   - Already configured ✅
   - Connection string ready ✅
   - Whitelist Hostinger IP addresses

2. **Update Connection String**:
   ```javascript
   // In backend/.env
   MONGODB_URI=mongodb+srv://dipteshpadval:<password>@cluster0.avhq4bo.mongodb.net/vastuverifiyed?retryWrites=true&w=majority&appName=Cluster0
   ```

### Step 6: Automatic Deployment

Once configured:
1. **Push to GitHub** → Automatic deployment
2. **Website updates** → Live on vastuverifiyed.com
3. **Database connected** → Real user data storage

## Alternative: Manual Deployment

If GitHub integration isn't available:

### Step 1: Build Locally
```bash
npm run build
```

### Step 2: Upload to Hostinger
1. **File Manager** → Upload `dist/` folder
2. **Backend** → Upload `backend/` folder
3. **Configure** → Set environment variables

### Step 3: Database Setup
1. **MongoDB Atlas** → Add Hostinger IP to whitelist
2. **Connection** → Update connection string
3. **Test** → Verify database connection

## Hostinger Features for Your Project

### ✅ Supported:
- **Static Site Hosting** (React frontend)
- **Node.js Support** (if available on your plan)
- **Database Connections** (MongoDB Atlas)
- **SSL Certificates** (free)
- **Custom Domains** (vastuverifiyed.com)

### ⚠️ Limitations:
- **Server-side rendering** (may need Vercel/Railway)
- **Advanced Node.js features** (check your plan)
- **Database hosting** (use MongoDB Atlas)

## Quick Setup Commands

```bash
# 1. Prepare for deployment
npm run build

# 2. Create production build
npm run build:production

# 3. Test locally
npm run preview

# 4. Push to GitHub (triggers auto-deploy)
git add .
git commit -m "Deploy to Hostinger"
git push origin main
```

## Environment Configuration

### Frontend (.env.production):
```env
VITE_API_BASE_URL=https://vastuverifiyed.com/api
VITE_ENABLE_ANALYTICS=true
```

### Backend (.env):
```env
MONGODB_URI=mongodb+srv://dipteshpadval:<password>@cluster0.avhq4bo.mongodb.net/vastuverifiyed?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=your-super-secret-jwt-key-for-production
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://vastuverifiyed.com
```

## Testing Your Deployment

1. **Frontend**: `https://vastuverifiyed.com`
2. **API Health**: `https://vastuverifiyed.com/api/health`
3. **User Registration**: Test signup/login
4. **Property Listing**: Test property creation
5. **Database**: Check MongoDB Atlas for data

## Support Resources

- **Hostinger Support**: 24/7 chat
- **GitHub Integration**: Hostinger documentation
- **MongoDB Atlas**: Cloud database support
- **React Deployment**: Hostinger React guide
