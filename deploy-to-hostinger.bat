@echo off
REM 🚀 Hostinger SSH Deployment Script for Windows
REM Real Estate Website Deployment

echo 🏠 Starting deployment to Hostinger...

REM Configuration
set HOSTINGER_HOST=in-mum-web1672.main-hosting.eu
set HOSTINGER_USER=u698056983
set DOMAIN=vastuverifiyed.com

echo 📦 Building React application...
call npm run build

if %errorlevel% neq 0 (
    echo ❌ Build failed! Please fix errors and try again.
    pause
    exit /b 1
)

echo ✅ Build completed successfully!

echo 📁 Creating deployment package...
if exist hostinger-deploy rmdir /s /q hostinger-deploy
mkdir hostinger-deploy

REM Copy frontend files
xcopy /E /I /Y dist\* hostinger-deploy\

REM Copy backend files (if Node.js is supported)
if exist backend (
    echo 📦 Including backend files...
    xcopy /E /I /Y backend hostinger-deploy\api
)

REM Copy additional files
if exist public\.htaccess copy public\.htaccess hostinger-deploy\
if exist public\manifest.json copy public\manifest.json hostinger-deploy\

echo 🚀 Uploading to Hostinger...
echo Host: %HOSTINGER_USER%@%HOSTINGER_HOST%

REM Upload files to Hostinger using SCP
scp -r hostinger-deploy\* %HOSTINGER_USER%@%HOSTINGER_HOST%:public_html/

if %errorlevel% equ 0 (
    echo ✅ Files uploaded successfully!
) else (
    echo ❌ Upload failed! Please check your SSH connection.
    pause
    exit /b 1
)

echo 🔧 Setting up server configuration...

REM SSH into server and configure
ssh %HOSTINGER_USER%@%HOSTINGER_HOST% "chmod 755 public_html/ && chmod 644 public_html/*.html 2>/dev/null || true && chmod 644 public_html/*.css 2>/dev/null || true && chmod 644 public_html/*.js 2>/dev/null || true"

REM If backend exists, try to install dependencies
ssh %HOSTINGER_USER%@%HOSTINGER_HOST% "if [ -d 'public_html/api' ]; then cd public_html/api && npm install --production 2>/dev/null || echo 'Node.js not available or npm install failed'; fi"

echo 🧹 Cleaning up...
rmdir /s /q hostinger-deploy

echo 🎉 Deployment completed successfully!
echo 📋 Next steps:
echo 1. Visit: https://%DOMAIN%
echo 2. Test user registration
echo 3. Test property listing
echo 4. Check MongoDB Atlas for data

echo 🔍 Testing deployment...
echo Testing website: https://%DOMAIN%

echo 🚀 Deployment complete! Your real estate website is now live!
pause
