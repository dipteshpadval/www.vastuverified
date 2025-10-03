#!/usr/bin/env node

/**
 * Automatic Deployment Script for Hostinger
 * This script builds and deploys your website automatically
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting automatic deployment to Hostinger...');

try {
  // Step 1: Build the project
  console.log('📦 Building project...');
  execSync('npm run build', { stdio: 'inherit' });
  
  // Step 2: Check if dist folder exists
  if (!fs.existsSync('dist')) {
    throw new Error('Build failed - dist folder not found');
  }
  
  // Step 3: Create deployment package
  console.log('📁 Preparing deployment package...');
  const deployDir = 'hostinger-deploy';
  
  // Clean previous deployment
  if (fs.existsSync(deployDir)) {
    fs.rmSync(deployDir, { recursive: true });
  }
  
  // Copy dist files
  fs.mkdirSync(deployDir);
  execSync(`xcopy /E /I /Y dist\\* ${deployDir}\\`);
  
  // Copy additional files
  if (fs.existsSync('public/.htaccess')) {
    fs.copyFileSync('public/.htaccess', `${deployDir}/.htaccess`);
  }
  
  if (fs.existsSync('public/manifest.json')) {
    fs.copyFileSync('public/manifest.json', `${deployDir}/manifest.json`);
  }
  
  console.log('✅ Build completed successfully!');
  console.log('📋 Deployment package ready in:', deployDir);
  console.log('');
  console.log('🌐 Next steps:');
  console.log('1. Login to Hostinger Control Panel');
  console.log('2. Go to File Manager');
  console.log('3. Navigate to public_html folder');
  console.log('4. Upload all files from the hostinger-deploy folder');
  console.log('5. Your website will be live at: https://vastuverifiyed.com');
  console.log('');
  console.log('🚀 Or use GitHub integration for automatic deployment!');
  
} catch (error) {
  console.error('❌ Deployment failed:', error.message);
  process.exit(1);
}
