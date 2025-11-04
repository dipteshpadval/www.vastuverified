# ⚠️ IMPORTANT: Render Dashboard Settings

## Render is still trying to run `node index.js` from root

You **MUST** update the settings in Render dashboard manually:

## 🔧 Step-by-Step Fix:

### 1. Go to Render Dashboard
- Open your Render service
- Click on **Settings** tab

### 2. Update Build & Deploy Settings:
Scroll to **"Build & Deploy"** section and change:

- **Root Directory:** Set to: `backend` ⚠️ (This is CRITICAL!)
- **Build Command:** `npm install`
- **Start Command:** `npm start`

### 3. Verify Environment Variables:
Go to **Environment** tab and ensure these are set:

```
MONGODB_URI=mongodb+srv://dipteshpadval:Diptesh6272@cluster0.avhq4bo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
PORT=3001
NODE_ENV=production
JWT_SECRET=your-random-secret-key-change-this
FRONTEND_URL=https://your-frontend-url.vercel.app
```

### 4. Save and Redeploy:
- Click **Save Changes**
- Go to **Manual Deploy** tab
- Click **"Deploy latest commit"**

---

## 🎯 The Key Issue:

Render is auto-detecting and trying to run `node index.js` from the root directory. 
By setting **Root Directory** to `backend`, Render will:
- Run `npm install` in the `backend` folder
- Run `npm start` which executes `node server.js` (from package.json)

---

## ✅ After Fixing:

Once you update the Root Directory setting, the deployment should work!
Test with: `https://your-app.onrender.com/api/health`

