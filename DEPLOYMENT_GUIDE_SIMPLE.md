# Real Estate Platform - Deployment Guide
# Simple & Professional Setup Guide

## 🎯 Overview
This guide will help you deploy your backend and connect it to your frontend to show real data instead of demo data.

---

## 📋 Prerequisites
1. MongoDB Atlas account (you already have this)
2. GitHub account (for easy deployment)
3. Render.com account (free tier available) OR Railway.app account

---

## 🗄️ Step 1: Setup MongoDB Atlas Database

You already have MongoDB Atlas configured! Your connection string is:
```
mongodb+srv://dipteshpadval:Diptesh6272@cluster0.avhq4bo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
```

### Important: Allow Network Access
1. Go to [MongoDB Atlas Dashboard](https://cloud.mongodb.com/)
2. Click **Network Access** → **Add IP Address**
3. Click **Allow Access from Anywhere** (0.0.0.0/0) for development
4. Click **Confirm**

---

## 🚀 Step 2: Deploy Backend to Render.com

### Option A: Render.com (Recommended - Free Tier Available)

1. **Sign up at [Render.com](https://render.com)** (free account)

2. **Create New Web Service:**
   - Go to Dashboard → **New +** → **Web Service**
   - Connect your GitHub repository
   - Select your repository

3. **Configure Service:**
   - **Name:** `real-estate-backend` (or any name)
   - **Environment:** `Node`
   - **Build Command:** `cd backend && npm install`
   - **Start Command:** `cd backend && npm start`
   - **Root Directory:** Leave empty (or set to `backend` if needed)

4. **Add Environment Variables:**
   Click **Environment** tab and add:
   ```
   MONGODB_URI=mongodb+srv://dipteshpadval:Diptesh6272@cluster0.avhq4bo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
   PORT=3001
   NODE_ENV=production
   FRONTEND_URL=https://your-frontend-url.vercel.app
   JWT_SECRET=your-super-secret-random-string-change-this
   ```

5. **Deploy:**
   - Click **Create Web Service**
   - Wait 5-10 minutes for deployment
   - Copy your backend URL (e.g., `https://real-estate-backend.onrender.com`)

### Option B: Railway.app (Alternative)

1. Sign up at [Railway.app](https://railway.app)
2. Click **New Project** → **Deploy from GitHub**
3. Select your repository
4. Click on your service → **Settings**
5. Add environment variables (same as above)
6. Railway will auto-detect Node.js and deploy
7. Get your backend URL from **Settings** → **Domains**

---

## 🌐 Step 3: Update Frontend Environment

### For Local Development:
1. Create `.env` file in project root:
   ```bash
   VITE_API_BASE_URL=http://localhost:3001/api
   ```

2. Test locally:
   ```bash
   # Terminal 1: Start backend
   cd backend
   npm install
   npm start

   # Terminal 2: Start frontend
   npm install
   npm run dev
   ```

### For Production:
1. Update your frontend `.env` or environment variables in Vercel:

   **If using Vercel:**
   - Go to your Vercel project → **Settings** → **Environment Variables**
   - Add: `VITE_API_BASE_URL` = `https://your-backend-url.onrender.com/api`

   **If using other hosting:**
   - Create `.env.production` file:
     ```
     VITE_API_BASE_URL=https://your-backend-url.onrender.com/api
     ```

2. **Rebuild and redeploy** your frontend

---

## ✅ Step 4: Verify Everything Works

### Test Backend:
1. Visit: `https://your-backend-url.onrender.com/api/health`
2. Should see: `{"status":"OK","timestamp":"...","uptime":...}`

### Test Frontend:
1. Open your frontend website
2. Properties should load from database (not mock data)
3. Try logging in/registering
4. Try listing a property

---

## 🔧 Step 5: Add Sample Data (Optional)

To test with real data, you can add properties via API:

### Using Postman or curl:
```bash
POST https://your-backend-url.onrender.com/api/properties
Headers:
  Content-Type: application/json
  Authorization: Bearer YOUR_JWT_TOKEN

Body:
{
  "title": "Luxury 3BHK Apartment",
  "description": "Beautiful apartment...",
  "price": 25000000,
  "pricePerSqft": 45000,
  "area": 1200,
  "bedrooms": 3,
  "bathrooms": 2,
  "propertyType": "apartment",
  "transactionType": "buy",
  "location": {
    "address": "Bandra West",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400050",
    "coordinates": [72.8406, 19.0544]
  },
  "images": ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2"],
  "amenities": ["Swimming Pool", "Gym", "Parking"],
  "features": ["Marble Flooring", "Modular Kitchen"],
  "age": 2,
  "floor": 8,
  "totalFloors": 15,
  "furnishing": "semi-furnished",
  "parking": 1,
  "balcony": 2
}
```

**Note:** You need to be logged in first to get a JWT token.

---

## 🐛 Troubleshooting

### Backend not connecting to MongoDB:
- Check MongoDB Atlas Network Access allows your IP
- Verify `MONGODB_URI` is correct in environment variables
- Check backend logs in Render dashboard

### Frontend showing "API not configured":
- Make sure `VITE_API_BASE_URL` is set correctly
- Rebuild frontend after adding environment variable
- Check browser console for errors

### CORS errors:
- Update `FRONTEND_URL` in backend environment variables
- Restart backend service

### Properties not loading:
- Check backend logs
- Verify database has properties
- Check API endpoint: `https://your-backend-url.onrender.com/api/properties`

---

## 📝 Quick Checklist

- [ ] MongoDB Atlas network access configured
- [ ] Backend deployed to Render/Railway
- [ ] Environment variables set in backend
- [ ] Backend health check works
- [ ] Frontend environment variable set
- [ ] Frontend rebuilt and redeployed
- [ ] Test login/register
- [ ] Test property listing
- [ ] Test property viewing

---

## 🎉 You're Done!

Your frontend should now show real data from your MongoDB database instead of demo data!

**Backend URL Format:**
- Render: `https://your-app-name.onrender.com`
- Railway: `https://your-app-name.up.railway.app`

**API Endpoints:**
- Health: `GET /api/health`
- Properties: `GET /api/properties`
- Auth: `POST /api/auth/login`, `POST /api/auth/register`

---

## 💡 Pro Tips

1. **Keep backend logs open** during testing to see errors
2. **Use MongoDB Compass** to view your database directly
3. **Test endpoints** with Postman or Thunder Client (VS Code extension)
4. **Monitor** your Render/Railway dashboard for usage limits

---

## 📞 Need Help?

- Check Render docs: https://render.com/docs
- Check Railway docs: https://docs.railway.app
- MongoDB Atlas docs: https://docs.atlas.mongodb.com

Good luck! 🚀

