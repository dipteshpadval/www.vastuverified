# 🚀 VastuVerified - Hostinger Deployment Guide

## Prerequisites
- Hostinger hosting account with cPanel access
- Your domain name
- FTP/SFTP client (FileZilla recommended) or cPanel File Manager

## Step 1: Build Your Project
```bash
npm run build
```
This creates a `dist` folder with production-ready files.

## Step 2: Upload Files to Hostinger

### Method A: Using cPanel File Manager
1. Login to your Hostinger control panel
2. Go to **File Manager**
3. Navigate to `public_html` folder (or your domain's root folder)
4. Delete any existing files in the root directory
5. Upload all contents from the `dist` folder to `public_html`
6. Make sure `index.html` is in the root directory

### Method B: Using FTP/SFTP
1. Use FileZilla or similar FTP client
2. Connect to your Hostinger server using:
   - Host: your-domain.com or server IP
   - Username: your cPanel username
   - Password: your cPanel password
   - Port: 21 (FTP) or 22 (SFTP)
3. Navigate to `public_html` folder
4. Upload all files from `dist` folder

## Step 3: Configure Domain (if using subdomain)
If you want to use a subdomain like `app.yourdomain.com`:
1. In cPanel, go to **Subdomains**
2. Create subdomain pointing to `public_html/app`
3. Upload files to `public_html/app` instead

## Step 4: Test Your Website
1. Visit your domain: `https://yourdomain.com`
2. Test all routes: `/buy`, `/rent`, `/sell`, `/properties`
3. Check if all images and assets load correctly

## Step 5: SSL Certificate (Recommended)
1. In cPanel, go to **SSL/TLS**
2. Enable **Force HTTPS Redirect**
3. Install **Let's Encrypt** certificate (free)

## Troubleshooting

### Issue: 404 errors on page refresh
**Solution**: The `.htaccess` file should handle this. If not working:
1. Check if `.htaccess` file is uploaded
2. Ensure your hosting supports `.htaccess` files
3. Contact Hostinger support if needed

### Issue: Assets not loading
**Solution**: 
1. Check file permissions (should be 644 for files, 755 for folders)
2. Ensure all files from `dist` folder are uploaded
3. Check browser console for 404 errors

### Issue: Slow loading
**Solution**:
1. Enable Gzip compression in cPanel
2. Use CDN (Cloudflare recommended)
3. Optimize images before upload

## File Structure After Upload
```
public_html/
├── index.html
├── .htaccess
└── assets/
    ├── index-[hash].js
    ├── index-[hash].css
    └── index-[hash].js.map
```

## Performance Tips
1. **Enable Gzip**: In cPanel > Software > Optimize Website
2. **Use CDN**: Consider Cloudflare for better performance
3. **Cache Headers**: Set appropriate cache headers for static assets
4. **Image Optimization**: Compress images before upload

## Security Tips
1. **Hide .htaccess**: Make sure it's not publicly accessible
2. **Regular Updates**: Keep your dependencies updated
3. **Backup**: Regular backups of your files
4. **HTTPS**: Always use HTTPS in production

## Support
If you encounter issues:
1. Check Hostinger knowledge base
2. Contact Hostinger support
3. Check browser console for errors
4. Verify file uploads are complete

---
**Note**: This is a static React app, so no server-side configuration is needed beyond the `.htaccess` file for routing.
