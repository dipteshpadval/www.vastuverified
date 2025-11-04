# Render.com Deployment Fix

## Problem
Render is trying to run `node index.js` but your backend uses `backend/server.js`

## Solution: Update Render Dashboard Settings

Go to your Render dashboard and update these settings:

### 1. Root Directory
Set **Root Directory** to: `backend`

### 2. Build Command
Set **Build Command** to: `npm install`

### 3. Start Command  
Set **Start Command** to: `npm start`

### 4. Environment Variables
Add these environment variables:

```
MONGODB_URI=mongodb+srv://dipteshpadval:Diptesh6272@cluster0.avhq4bo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
PORT=3001
NODE_ENV=production
JWT_SECRET=your-random-secret-key-change-this
FRONTEND_URL=https://your-frontend-url.vercel.app
```

### Steps:
1. Go to your Render service dashboard
2. Click **Settings** tab
3. Scroll to **Build & Deploy** section
4. Set **Root Directory** to: `backend`
5. Set **Build Command** to: `npm install`
6. Set **Start Command** to: `npm start`
7. Go to **Environment** tab
8. Add all environment variables listed above
9. Click **Save Changes**
10. Go to **Manual Deploy** tab and click **Deploy latest commit**

This should fix the deployment issue!

