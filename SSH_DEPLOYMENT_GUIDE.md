# 🔑 Complete SSH Deployment Guide to Hostinger

## Your SSH Information:
- **Host**: `in-mum-web1672.main-hosting.eu`
- **User**: `u698056983`
- **Domain**: `vastuverifiyed.com`
- **SSH Key**: Already configured ✅

---

## 🚀 **Method 1: Automated Deployment (Recommended)**

### **Step 1: Install Required Tools**

#### **For Windows:**
1. **Install Git Bash** (includes SSH)
2. **Install Node.js** (if not already installed)
3. **Install OpenSSH** (usually pre-installed on Windows 10+)

#### **For Mac/Linux:**
```bash
# SSH is usually pre-installed
# Install Node.js if needed
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install node
```

### **Step 2: Test SSH Connection**
```bash
# Test your SSH connection
ssh u698056983@in-mum-web1672.main-hosting.eu

# If successful, you should see a command prompt
# Type 'exit' to return to your local machine
```

### **Step 3: Run Automated Deployment**

#### **For Windows:**
```bash
# Open Git Bash or Command Prompt
cd "C:\Users\Lenovo\Downloads\new pro"

# Run the deployment script
./deploy-to-hostinger.bat
```

#### **For Mac/Linux:**
```bash
# Make script executable
chmod +x deploy-to-hostinger.sh

# Run the deployment script
./deploy-to-hostinger.sh
```

---

## 🛠️ **Method 2: Manual Deployment**

### **Step 1: Build Your Project**
```bash
# Navigate to your project directory
cd "C:\Users\Lenovo\Downloads\new pro"

# Install dependencies
npm install

# Build the React application
npm run build
```

### **Step 2: Prepare Files for Upload**
```bash
# Create deployment directory
mkdir hostinger-deploy

# Copy frontend files
cp -r dist/* hostinger-deploy/

# Copy backend files (if Node.js is supported)
cp -r backend hostinger-deploy/api

# Copy additional files
cp public/.htaccess hostinger-deploy/
cp public/manifest.json hostinger-deploy/
```

### **Step 3: Upload to Hostinger**
```bash
# Upload frontend files
scp -r hostinger-deploy/* u698056983@in-mum-web1672.main-hosting.eu:public_html/

# Upload backend files (if supported)
scp -r backend/* u698056983@in-mum-web1672.main-hosting.eu:public_html/api/
```

### **Step 4: Configure Server**
```bash
# SSH into your server
ssh u698056983@in-mum-web1672.main-hosting.eu

# Set file permissions
chmod 755 public_html/
chmod 644 public_html/*.html
chmod 644 public_html/*.css
chmod 644 public_html/*.js

# If backend exists, install dependencies
cd public_html/api
npm install --production

# Exit SSH
exit
```

---

## 🔧 **Method 3: Hybrid Deployment (If Node.js Not Supported)**

### **Step 1: Deploy Frontend to Hostinger**
```bash
# Build frontend
npm run build

# Upload to Hostinger
scp -r dist/* u698056983@in-mum-web1672.main-hosting.eu:public_html/
```

### **Step 2: Deploy Backend to Cloud**

#### **Option A: Railway (Recommended)**
1. **Go to railway.app**
2. **Connect GitHub**
3. **Deploy backend folder**
4. **Get backend URL** (e.g., `https://your-backend.railway.app`)

#### **Option B: Vercel**
1. **Go to vercel.com**
2. **Connect GitHub**
3. **Deploy backend folder**
4. **Get backend URL**

### **Step 3: Update Frontend API URL**
```bash
# Update src/utils/config.ts
# Change API base URL to your cloud backend
VITE_API_BASE_URL=https://your-backend.railway.app/api
```

---

## 📋 **Environment Variables Setup**

### **Step 1: Create Environment File**
```bash
# Create .env file for production
cat > .env.production << EOF
MONGODB_URI=mongodb+srv://dipteshpadval:YOUR_PASSWORD@cluster0.avhq4bo.mongodb.net/vastuverifiyed?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=your-super-secret-jwt-key-for-production
NODE_ENV=production
VITE_API_BASE_URL=https://vastuverifiyed.com/api
EOF
```

### **Step 2: Upload Environment File**
```bash
# Upload to Hostinger
scp .env.production u698056983@in-mum-web1672.main-hosting.eu:public_html/api/.env
```

---

## 🧪 **Testing Your Deployment**

### **Step 1: Test Website**
1. **Visit**: `https://vastuverifiyed.com`
2. **Check**: Homepage loads correctly
3. **Test**: User registration
4. **Test**: User login
5. **Test**: Property listing

### **Step 2: Test API Endpoints**
```bash
# Test health check
curl https://vastuverifiyed.com/api/health

# Test user registration
curl -X POST https://vastuverifiyed.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","phone":"+91 98765 43210","password":"password123","role":"user"}'
```

### **Step 3: Check Database**
1. **Go to MongoDB Atlas**
2. **Check Collections**: users, properties, contactmessages
3. **Verify**: Data is being stored

---

## 🔍 **Troubleshooting**

### **Common Issues:**

#### **1. SSH Connection Failed**
```bash
# Check SSH key
ssh-add -l

# Test connection
ssh -v u698056983@in-mum-web1672.main-hosting.eu
```

#### **2. Upload Failed**
```bash
# Check disk space
ssh u698056983@in-mum-web1672.main-hosting.eu "df -h"

# Check permissions
ssh u698056983@in-mum-web1672.main-hosting.eu "ls -la public_html/"
```

#### **3. Website Not Loading**
```bash
# Check if files exist
ssh u698056983@in-mum-web1672.main-hosting.eu "ls -la public_html/"

# Check web server logs
ssh u698056983@in-mum-web1672.main-hosting.eu "tail -f /var/log/apache2/error.log"
```

#### **4. Backend Not Working**
- **Check**: If Node.js is supported on your Hostinger plan
- **Alternative**: Use hybrid deployment (frontend on Hostinger, backend on cloud)

---

## 📞 **Support Resources**

### **If You Need Help:**
1. **Hostinger Support**: 24/7 chat support
2. **SSH Documentation**: Hostinger SSH guide
3. **MongoDB Atlas**: Database support
4. **GitHub Issues**: Repository problems

### **Quick Commands:**
```bash
# Check deployment status
ssh u698056983@in-mum-web1672.main-hosting.eu "ls -la public_html/"

# View server logs
ssh u698056983@in-mum-web1672.main-hosting.eu "tail -f /var/log/apache2/access.log"

# Restart services (if needed)
ssh u698056983@in-mum-web1672.main-hosting.eu "sudo systemctl restart apache2"
```

---

## 🎉 **Success Checklist**

Your deployment is successful when:
- [ ] **Website loads**: `https://vastuverifiyed.com`
- [ ] **User registration works**
- [ ] **User login works**
- [ ] **Property listing works**
- [ ] **Database stores data**
- [ ] **API endpoints respond**
- [ ] **Mobile responsive**
- [ ] **SSL certificate active**

**Your real estate website is now live!** 🚀

---

## 🔄 **Future Updates**

### **To Update Your Website:**
1. **Make changes** to your code
2. **Test locally**: `npm run dev`
3. **Build**: `npm run build`
4. **Deploy**: Run deployment script
5. **Website updates** automatically

### **Automated Updates:**
- **Push to GitHub**: `git push origin main`
- **Run deployment script**: `./deploy-to-hostinger.sh`
- **Website updates** live

**Your real estate website is now production-ready!** 🏠✨
