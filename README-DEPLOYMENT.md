# Free Hosting Deployment Guide - Agarmay Fer

## Overview
This guide will help you deploy your Agarmay Fer website online for free using Railway and MongoDB Atlas.

## Architecture
- **Frontend & Backend**: Railway (Full-stack hosting)
- **Database**: MongoDB Atlas (Free 512MB tier)
- **Total Monthly Cost**: $0 (within free tier limits)

---

## Option 1: Railway + MongoDB Atlas (Recommended)

### Prerequisites
- GitHub account
- Email for MongoDB Atlas account

### Step 1: Prepare Your Code for Deployment

#### 1.1 Update Backend Configuration
First, we need to modify your backend to work with environment variables:

**File: `backend/src/app.js`**
```javascript
// Add these environment variables at the top
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/agarmayfer';

// Update your MongoDB connection
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Update server start
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});
```

#### 1.2 Create Package.json Scripts
**File: `backend/package.json`**
```json
{
  "scripts": {
    "start": "node src/app.js",
    "dev": "nodemon src/app.js",
    "seed": "node src/seedProducts.js"
  }
}
```

#### 1.3 Create Railway Configuration
**File: `railway.toml` (in root directory)**
```toml
[build]
command = "cd backend && npm install"

[deploy]
startCommand = "cd backend && npm start"
```

### Step 2: Set Up MongoDB Atlas (Free Database)

1. **Sign Up**: Go to [MongoDB Atlas](https://cloud.mongodb.com/v2/register)
2. **Create Cluster**:
   - Choose "Build a Database"
   - Select "M0 Sandbox" (FREE)
   - Choose a cloud provider and region (closest to you)
   - Cluster Name: `agarmayfer-cluster`

3. **Configure Database Access**:
   - Go to "Database Access" → "Add New Database User"
   - Authentication Method: Password
   - Username: `agarmayfer-user`
   - Password: Generate secure password
   - Built-in Role: "Read and write to any database"

4. **Configure Network Access**:
   - Go to "Network Access" → "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Confirm

5. **Get Connection String**:
   - Go to "Clusters" → Click "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `<dbname>` with `agarmayfer`

### Step 3: Deploy to Railway

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Agarmay Fer website"
   git branch -M main
   git remote add origin https://github.com/yourusername/agarmayfer.git
   git push -u origin main
   ```

2. **Sign Up for Railway**:
   - Go to [Railway](https://railway.app)
   - Sign up with GitHub
   - Get $5 free credits

3. **Deploy Project**:
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your `agarmayfer` repository
   - Railway will automatically detect it's a Node.js app

4. **Configure Environment Variables**:
   - In Railway dashboard, go to your project
   - Click on Variables tab
   - Add these variables:
     ```
     MONGODB_URI = your_mongodb_atlas_connection_string
     NODE_ENV = production
     ```

5. **Configure Domain**:
   - Go to Settings → Domains
   - Generate a Railway domain (e.g., `agarmayfer-production.up.railway.app`)
   - Or add your custom domain if you have one

### Step 4: Update Frontend for Production

Since your frontend is served by the same Express server, update any API calls:

**File: `js/main.js`, `js/products.js`, etc.**
```javascript
// Replace localhost URLs with your Railway domain
const API_BASE_URL = window.location.origin; // This will use the same domain
```

---

## Option 2: Vercel + Railway Backend (Alternative)

### For Frontend (Vercel)
1. **Sign up**: [Vercel](https://vercel.com)
2. **Deploy**: Connect GitHub repo, select frontend folder
3. **Free tier**: Unlimited static hosting

### For Backend (Railway)
1. **Deploy backend only**: Select `backend` folder
2. **Environment variables**: Same MongoDB Atlas setup
3. **CORS**: Update to allow Vercel domain

---

## Option 3: GitHub Pages + Railway Backend

### For Frontend (GitHub Pages)
1. **Enable GitHub Pages**: Repository Settings → Pages
2. **Source**: Deploy from branch (`main` or `gh-pages`)
3. **Custom domain**: Optional
4. **Limitation**: Static files only, need to update API URLs

---

## Cost Breakdown

### Railway Free Tier
- **Credits**: $5/month free
- **Typical usage**: $0.50-2.00/month for small apps
- **Resources**: 512MB RAM, shared CPU, 1GB disk

### MongoDB Atlas Free Tier
- **Storage**: 512MB
- **Connections**: 500 connections
- **Data transfer**: No charge for free tier

### Total Monthly Cost: $0

---

## Production Checklist

### Security
- [ ] MongoDB Atlas IP whitelist configured
- [ ] Database user with minimal required permissions
- [ ] Environment variables set in Railway (not in code)
- [ ] CORS configured for your domain only

### Performance  
- [ ] Static files served efficiently
- [ ] Database indexes created if needed
- [ ] Error logging configured

### Monitoring
- [ ] Railway logs monitoring
- [ ] MongoDB Atlas monitoring
- [ ] Uptime monitoring (optional)

---

## Custom Domain (Optional)

If you want a custom domain like `agarmayfer.com`:

1. **Buy domain**: Namecheap, GoDaddy, etc. (~$10-15/year)
2. **Configure DNS**: Point to Railway or Vercel
3. **SSL**: Automatically provided by hosting platforms

---

## Troubleshooting

### Common Issues
1. **Build fails**: Check Node.js version in package.json
2. **Database connection**: Verify MongoDB Atlas whitelist and credentials
3. **Static files not loading**: Check file paths are relative
4. **Email service**: Update EmailJS configuration for production domain

### Support Resources
- Railway Discord: [discord.gg/railway](https://discord.gg/railway)
- MongoDB Atlas Support: Through Atlas console
- GitHub Issues: For platform-specific problems

---

## Next Steps After Deployment

1. **Test thoroughly**: All functionality in production environment
2. **Monitor usage**: Railway dashboard for resource usage
3. **Backup strategy**: MongoDB Atlas automated backups (included)
4. **Scale as needed**: Upgrade Railway plan when you exceed free tier

Your website will be live at: `https://yourdomain.up.railway.app` 