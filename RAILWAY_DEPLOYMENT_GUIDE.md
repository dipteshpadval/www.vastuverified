# Railway Deployment Configuration

## Backend Deployment to Railway

### Step 1: Deploy Backend to Railway
1. **Go to railway.app**
2. **Sign up/Login with GitHub**
3. **Click "New Project"**
4. **Select "Deploy from GitHub repo"**
5. **Choose**: `dipteshpadval/www.vastuverified`
6. **Select**: `backend` folder
7. **Railway will auto-deploy your backend**

### Step 2: Set Environment Variables in Railway
In Railway dashboard, add these environment variables:
```
MONGODB_URI=mongodb+srv://dipteshpadval:Diptesh6272@cluster0.avhq4bo.mongodb.net/vastuverified?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=your-super-secret-jwt-key-for-production-2024
NODE_ENV=production
FRONTEND_URL=https://www.vastuverified.com
```

### Step 3: Get Backend URL
After deployment, Railway will give you a URL like:
`https://vastuverified-backend.railway.app`

### Step 4: Update Frontend
Update `src/utils/config.ts` with your Railway backend URL:
```typescript
apiBaseUrl: 'https://your-backend-url.railway.app/api'
```

### Step 5: Deploy Frontend to Hostinger
1. **Build frontend**: `npm run build`
2. **Upload `dist` folder** to Hostinger File Manager
3. **Your website will now use real database!**

## Alternative: Vercel Deployment

### Step 1: Deploy Backend to Vercel
1. **Go to vercel.com**
2. **Import GitHub repository**
3. **Select `backend` folder**
4. **Deploy**

### Step 2: Set Environment Variables
Add the same environment variables as above.

## Testing Your Setup

### Check Backend Health
Visit: `https://your-backend-url.railway.app/api/health`

### Test API Endpoints
```bash
# Test user registration
curl -X POST https://your-backend-url.railway.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","phone":"+91 98765 43210","password":"password123","role":"user"}'
```

## Troubleshooting

### If Backend Not Working:
1. **Check Railway logs** for errors
2. **Verify MongoDB connection** string
3. **Check environment variables**
4. **Test API endpoints** manually

### If Frontend Still Shows Mock Data:
1. **Clear browser cache**
2. **Check browser console** for API errors
3. **Verify backend URL** in config
4. **Test backend health** endpoint

**Your website will now use real MongoDB database!** 🚀
