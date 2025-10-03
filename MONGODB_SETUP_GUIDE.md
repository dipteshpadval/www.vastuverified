# 🍃 MongoDB Setup Guide for Real Estate Website

## 🎯 **What We've Built**

✅ **Complete MongoDB Backend API**  
✅ **User Authentication & Authorization**  
✅ **Property Management System**  
✅ **Contact Form Handling**  
✅ **Newsletter Subscription**  
✅ **Geospatial Search Capabilities**  
✅ **Security & Rate Limiting**  

---

## 🚀 **Quick Start Guide**

### **Step 1: Install MongoDB**

#### **Option A: Local MongoDB (Recommended for Development)**
```bash
# Windows - Download from: https://www.mongodb.com/try/download/community
# Or use Chocolatey:
choco install mongodb

# Start MongoDB service
net start MongoDB
```

#### **Option B: MongoDB Atlas (Cloud - Recommended for Production)**
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create free account
3. Create new cluster
4. Get connection string
5. Update `MONGODB_URI` in your `.env` file

### **Step 2: Setup Backend**

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp env.example .env

# Edit .env file with your settings
# MONGODB_URI=mongodb://localhost:27017/real_estate_db
# JWT_SECRET=your-super-secret-key
# PORT=3001
```

### **Step 3: Start Backend Server**

```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

### **Step 4: Test API Endpoints**

```bash
# Health check
curl http://localhost:3001/api/health

# Get properties
curl http://localhost:3001/api/properties

# Register user
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","phone":"+91 98765 43210","password":"password123"}'
```

---

## 🗄️ **Database Schema Overview**

### **Collections Created:**

1. **users** - User accounts and profiles
2. **properties** - Property listings with geospatial data
3. **contactmessages** - Contact form submissions
4. **newslettersubscriptions** - Newsletter subscribers

### **Key Features:**

- **Geospatial Indexes**: Location-based property search
- **Text Search**: Full-text search across property details
- **User Authentication**: JWT-based secure authentication
- **Data Validation**: Mongoose schema validation
- **Performance Indexes**: Optimized for fast queries

---

## 🔧 **API Endpoints**

### **Authentication**
```
POST /api/auth/register     - Register new user
POST /api/auth/login        - User login
GET  /api/auth/me          - Get current user
PUT  /api/auth/profile     - Update user profile
POST /api/auth/logout      - Logout user
```

### **Properties**
```
GET    /api/properties           - Get all properties (with filters)
GET    /api/properties/:id       - Get single property
POST   /api/properties           - Create new property
PUT    /api/properties/:id       - Update property
DELETE /api/properties/:id       - Delete property
GET    /api/properties/search/location - Search by location
GET    /api/properties/featured/list   - Get featured properties
```

### **Contact & Newsletter**
```
POST /api/contact           - Send contact message
GET  /api/contact           - Get all messages (admin)
PUT  /api/contact/:id/status - Update message status

POST /api/newsletter/subscribe   - Subscribe to newsletter
POST /api/newsletter/unsubscribe - Unsubscribe from newsletter
GET  /api/newsletter            - Get all subscriptions (admin)
GET  /api/newsletter/stats      - Get subscription stats (admin)
```

---

## 🔍 **Advanced Features**

### **1. Geospatial Search**
```javascript
// Find properties within 10km of coordinates
GET /api/properties/search/location?lat=19.0760&lng=72.8777&radius=10
```

### **2. Advanced Filtering**
```javascript
// Filter properties
GET /api/properties?type=apartment&transactionType=buy&city=Mumbai&minPrice=5000000&maxPrice=15000000&bedrooms=3
```

### **3. Text Search**
```javascript
// Search properties by text
GET /api/properties?search=luxury apartment bandra
```

### **4. Pagination**
```javascript
// Paginated results
GET /api/properties?page=1&limit=10
```

---

## 🚀 **Deployment Options**

### **Option 1: Railway (Easiest)**
1. Go to [Railway.app](https://railway.app)
2. Connect your GitHub repository
3. Add MongoDB service
4. Deploy automatically

### **Option 2: Heroku**
```bash
# Install Heroku CLI
# Create Procfile
echo "web: node server.js" > Procfile

# Deploy
heroku create your-app-name
heroku addons:create mongolab:sandbox
git push heroku main
```

### **Option 3: DigitalOcean**
1. Create Droplet
2. Install Node.js and MongoDB
3. Setup PM2 for process management
4. Configure Nginx reverse proxy

---

## 🔐 **Security Features**

### **Implemented Security:**
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **Helmet.js**: Security headers
- **CORS**: Cross-origin resource sharing
- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: bcrypt with salt rounds
- **Input Validation**: Mongoose schema validation

### **Additional Security (Recommended):**
- **HTTPS**: SSL/TLS encryption
- **Environment Variables**: Secure configuration
- **Database Indexes**: Prevent injection attacks
- **API Versioning**: Backward compatibility

---

## 📊 **Performance Optimization**

### **Database Indexes:**
```javascript
// Property indexes
propertySchema.index({ propertyType: 1, transactionType: 1 });
propertySchema.index({ 'location.city': 1 });
propertySchema.index({ price: 1 });
propertySchema.index({ 'location.coordinates': '2dsphere' });
propertySchema.index({ title: 'text', description: 'text' });
```

### **Caching (Optional):**
```bash
# Install Redis for caching
npm install redis

# Add to your .env
REDIS_URL=redis://localhost:6379
```

---

## 🧪 **Testing Your Setup**

### **1. Test Database Connection**
```bash
# Check if MongoDB is running
mongosh
# Should connect to MongoDB shell
```

### **2. Test API Endpoints**
```bash
# Health check
curl http://localhost:3001/api/health

# Should return: {"status":"OK","timestamp":"...","uptime":...}
```

### **3. Test Property Creation**
```bash
curl -X POST http://localhost:3001/api/properties \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Luxury 3BHK Apartment",
    "description": "Beautiful apartment in prime location",
    "price": 15000000,
    "area": 1200,
    "bedrooms": 3,
    "bathrooms": 2,
    "propertyType": "apartment",
    "transactionType": "buy",
    "location": {
      "address": "Bandra West, Mumbai",
      "city": "Mumbai",
      "state": "Maharashtra",
      "pincode": "400050",
      "coordinates": [72.8406, 19.0544]
    },
    "owner": {
      "id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "phone": "+91 98765 43210",
      "email": "john@example.com"
    }
  }'
```

---

## 🎯 **Next Steps**

1. **Connect Frontend**: Update your React app to use the new API
2. **Add Image Upload**: Implement Cloudinary for property images
3. **Email Integration**: Add email notifications
4. **Admin Dashboard**: Create admin panel for property management
5. **Mobile App**: Build React Native mobile app
6. **Analytics**: Add Google Analytics and custom tracking

---

## 🆘 **Troubleshooting**

### **Common Issues:**

1. **MongoDB Connection Error**
   ```bash
   # Check if MongoDB is running
   net start MongoDB
   # Or restart MongoDB service
   ```

2. **Port Already in Use**
   ```bash
   # Change PORT in .env file
   PORT=3002
   ```

3. **CORS Issues**
   ```javascript
   // Update CORS origin in server.js
   origin: 'http://localhost:3000'
   ```

4. **JWT Token Issues**
   ```bash
   # Make sure JWT_SECRET is set in .env
   JWT_SECRET=your-super-secret-key-here
   ```

---

## 🎉 **You're Ready!**

Your MongoDB backend is now fully set up with:
- ✅ User authentication
- ✅ Property management
- ✅ Contact forms
- ✅ Newsletter subscriptions
- ✅ Geospatial search
- ✅ Security features
- ✅ Production-ready code

**Next**: Connect your React frontend to this API! 🚀
