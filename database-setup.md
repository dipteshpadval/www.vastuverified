# 🗄️ Database Setup Guide for Real Estate Website

## 🏆 **Recommended Database: PostgreSQL + Redis**

### **Why This Combination:**
- **PostgreSQL**: Main database for properties, users, transactions
- **Redis**: Caching for fast searches and session management
- **Used by**: Housing.com, 99acres, and most major real estate platforms

---

## 📊 **Database Schema Design**

### **1. Users Table**
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    avatar_url TEXT,
    role VARCHAR(20) DEFAULT 'user', -- user, agent, admin
    verified BOOLEAN DEFAULT FALSE,
    preferences JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    last_login TIMESTAMP
);
```

### **2. Properties Table**
```sql
CREATE TABLE properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(500) NOT NULL,
    description TEXT,
    price BIGINT NOT NULL,
    price_per_sqft INTEGER,
    area INTEGER NOT NULL,
    bedrooms INTEGER,
    bathrooms INTEGER,
    property_type VARCHAR(50) NOT NULL, -- apartment, house, villa, plot, commercial
    transaction_type VARCHAR(20) NOT NULL, -- buy, rent, sell
    location JSONB NOT NULL, -- {address, city, state, pincode, coordinates}
    images TEXT[],
    amenities TEXT[],
    features TEXT[],
    age INTEGER DEFAULT 0,
    floor INTEGER,
    total_floors INTEGER,
    furnishing VARCHAR(20), -- furnished, semi-furnished, unfurnished
    parking INTEGER DEFAULT 0,
    balcony INTEGER DEFAULT 0,
    owner_id UUID REFERENCES users(id),
    agent_id UUID REFERENCES users(id),
    featured BOOLEAN DEFAULT FALSE,
    verified BOOLEAN DEFAULT FALSE,
    virtual_tour_url TEXT,
    floor_plan_url TEXT,
    nearby_places JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### **3. Property Images Table**
```sql
CREATE TABLE property_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    image_type VARCHAR(20) DEFAULT 'gallery', -- gallery, floor_plan, virtual_tour
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### **4. Favorites Table**
```sql
CREATE TABLE favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, property_id)
);
```

### **5. Contact Messages Table**
```sql
CREATE TABLE contact_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    subject VARCHAR(500),
    message TEXT NOT NULL,
    property_id UUID REFERENCES properties(id),
    status VARCHAR(20) DEFAULT 'new', -- new, contacted, closed
    created_at TIMESTAMP DEFAULT NOW()
);
```

### **6. Newsletter Subscriptions Table**
```sql
CREATE TABLE newsletter_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    status VARCHAR(20) DEFAULT 'active', -- active, unsubscribed
    subscribed_at TIMESTAMP DEFAULT NOW(),
    unsubscribed_at TIMESTAMP
);
```

---

## 🚀 **Setup Instructions**

### **Option 1: Local PostgreSQL Setup**

1. **Install PostgreSQL:**
   ```bash
   # Windows (using Chocolatey)
   choco install postgresql
   
   # Or download from: https://www.postgresql.org/download/windows/
   ```

2. **Create Database:**
   ```sql
   CREATE DATABASE real_estate_db;
   CREATE USER real_estate_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE real_estate_db TO real_estate_user;
   ```

### **Option 2: Cloud Database (Recommended)**

#### **A. Supabase (PostgreSQL + Real-time)**
- **Free Tier**: 500MB database, 2GB bandwidth
- **Features**: Built-in auth, real-time subscriptions, API auto-generation
- **Setup**: 
  1. Go to [supabase.com](https://supabase.com)
  2. Create new project
  3. Get connection string
  4. Run schema migrations

#### **B. PlanetScale (MySQL)**
- **Free Tier**: 1 billion reads, 1 million writes
- **Features**: Serverless, branching, automatic scaling
- **Setup**: 
  1. Go to [planetscale.com](https://planetscale.com)
  2. Create database
  3. Get connection string

#### **C. Railway (PostgreSQL)**
- **Free Tier**: $5 credit monthly
- **Features**: Easy deployment, automatic backups
- **Setup**: 
  1. Go to [railway.app](https://railway.app)
  2. Create PostgreSQL service
  3. Get connection string

---

## 🔧 **Backend API Setup**

### **1. Node.js + Express + PostgreSQL**

```bash
# Install dependencies
npm install express pg cors helmet morgan
npm install -D @types/express @types/pg @types/cors
```

### **2. Environment Variables**
```env
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/real_estate_db
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# File Upload
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

---

## 📈 **Performance Optimization**

### **1. Database Indexes**
```sql
-- Property search indexes
CREATE INDEX idx_properties_type ON properties(property_type);
CREATE INDEX idx_properties_transaction ON properties(transaction_type);
CREATE INDEX idx_properties_city ON properties USING GIN ((location->>'city'));
CREATE INDEX idx_properties_price ON properties(price);
CREATE INDEX idx_properties_bedrooms ON properties(bedrooms);
CREATE INDEX idx_properties_created ON properties(created_at);

-- Geospatial index (if using PostGIS)
CREATE INDEX idx_properties_location ON properties USING GIST (ST_Point(
    (location->>'coordinates')::json->>0,
    (location->>'coordinates')::json->>1
));
```

### **2. Redis Caching**
```javascript
// Cache popular searches
const cacheKey = `search:${JSON.stringify(filters)}`;
const cached = await redis.get(cacheKey);
if (cached) return JSON.parse(cached);

// Cache for 1 hour
await redis.setex(cacheKey, 3600, JSON.stringify(results));
```

---

## 🔐 **Security Best Practices**

### **1. Database Security**
```sql
-- Create read-only user for public queries
CREATE USER readonly_user WITH PASSWORD 'readonly_password';
GRANT SELECT ON ALL TABLES IN SCHEMA public TO readonly_user;

-- Row Level Security (RLS)
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public properties are viewable by everyone" ON properties
    FOR SELECT USING (true);
```

### **2. API Security**
```javascript
// Rate limiting
const rateLimit = require('express-rate-limit');
app.use('/api/', rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
}));

// Input validation
const Joi = require('joi');
const propertySchema = Joi.object({
    title: Joi.string().max(500).required(),
    price: Joi.number().positive().required(),
    // ... other validations
});
```

---

## 📊 **Monitoring & Analytics**

### **1. Database Monitoring**
- **pgAdmin**: PostgreSQL administration
- **Grafana**: Database metrics visualization
- **New Relic**: Application performance monitoring

### **2. Search Analytics**
```sql
-- Track popular searches
CREATE TABLE search_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    search_query TEXT,
    filters JSONB,
    results_count INTEGER,
    user_id UUID,
    created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🚀 **Deployment Options**

### **1. Vercel + Supabase (Easiest)**
- Frontend: Vercel
- Database: Supabase
- Storage: Supabase Storage
- Auth: Supabase Auth

### **2. AWS (Most Scalable)**
- Frontend: S3 + CloudFront
- Database: RDS PostgreSQL
- Cache: ElastiCache Redis
- Storage: S3

### **3. DigitalOcean (Cost-Effective)**
- Frontend: App Platform
- Database: Managed PostgreSQL
- Cache: Managed Redis
- Storage: Spaces

---

## 💡 **Pro Tips from Housing.com & 99acres**

1. **Use CDN**: Serve property images from CDN (Cloudinary, AWS CloudFront)
2. **Implement Caching**: Cache search results and popular properties
3. **Database Sharding**: Shard by city/region for large scale
4. **Search Optimization**: Use Elasticsearch for advanced search
5. **Real-time Updates**: WebSocket for live property updates
6. **Mobile Optimization**: Optimize for mobile-first experience

---

## 🎯 **Next Steps**

1. **Choose your database provider** (Supabase recommended for beginners)
2. **Set up the database schema**
3. **Create backend API** (Node.js + Express)
4. **Connect frontend to backend**
5. **Implement caching and optimization**
6. **Deploy to production**

Would you like me to help you set up any specific part of this database architecture?
