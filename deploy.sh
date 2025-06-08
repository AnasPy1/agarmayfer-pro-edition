#!/bin/bash

echo "🚀 Agarmay Fer Deployment Script"
echo "================================"

# Check if git is initialized
if [ ! -d .git ]; then
    echo "📦 Initializing Git repository..."
    git init
    git branch -M main
else
    echo "✅ Git repository already initialized"
fi

# Add all files
echo "📁 Adding files to Git..."
git add .

# Commit changes
echo "💾 Committing changes..."
git commit -m "Deploy Agarmay Fer website - $(date)"

# Check if remote exists
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "⚠️  Please add your GitHub repository URL:"
    echo "   git remote add origin https://github.com/yourusername/agarmayfer.git"
    echo ""
    echo "Then run this script again."
    exit 1
fi

# Push to GitHub
echo "🌐 Pushing to GitHub..."
git push -u origin main

echo ""
echo "✅ Code pushed to GitHub successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Go to https://railway.app and sign up with GitHub"
echo "2. Click 'New Project' → 'Deploy from GitHub repo'"
echo "3. Select your agarmayfer repository"
echo "4. Add environment variables in Railway:"
echo "   - MONGODB_URI (your MongoDB Atlas connection string)"
echo "   - NODE_ENV=production"
echo "5. Your site will be live at: yourdomain.up.railway.app"
echo ""
echo "🔗 Don't forget to set up MongoDB Atlas (see README-DEPLOYMENT.md)" 