# Kaltus E-Commerce - Deployment Guide

## Overview
- **Frontend**: Netlify (React + Vite)
- **Backend**: Railway (Node.js + Express)
- **Database**: MongoDB Atlas

---

## 1. Database Setup (MongoDB Atlas)

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free cluster
3. Create a database user with password
4. Whitelist IP addresses (0.0.0.0/0 for all)
5. Get your connection string:
   ```
   mongodb+srv://<username>:<password>@cluster.mongodb.net/kaltus?retryWrites=true&w=majority
   ```

---

## 2. Backend Deployment (Railway)

### Step 1: Push to GitHub
```bash
cd backend
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/kaltus-backend.git
git push -u origin main
```

### Step 2: Deploy to Railway
1. Go to [Railway](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your backend repository
4. Railway will auto-detect Node.js

### Step 3: Set Environment Variables
In Railway dashboard → Variables, add:
```
PORT=5000
MONGO_URI=mongodb+srv://...your-atlas-connection-string...
JWT_SECRET=your-super-secure-jwt-secret-key
RZR_PAY_TEST_KEY=your_razorpay_key
RZR_PAY_TEST_SECRET=your_razorpay_secret
FRONTEND_URL=https://your-app.netlify.app
NODE_ENV=production
```

### Step 4: Get Railway URL
After deployment, copy your Railway URL (e.g., `https://kaltus-backend.up.railway.app`)

---

## 3. Frontend Deployment (Netlify)

### Step 1: Push to GitHub
```bash
cd frontend
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/kaltus-frontend.git
git push -u origin main
```

### Step 2: Deploy to Netlify
1. Go to [Netlify](https://netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Connect to GitHub and select your frontend repo
4. Build settings (auto-detected):
   - Build command: `npm run build`
   - Publish directory: `dist`

### Step 3: Set Environment Variables
In Netlify dashboard → Site settings → Environment variables, add:
```
VITE_API_URL=https://your-railway-backend.up.railway.app
```

### Step 4: Trigger Redeploy
After adding env variables, trigger a new deploy from Netlify dashboard.

---

## 4. Update CORS (Important!)

After getting your Netlify URL, update Railway backend:
1. Go to Railway → Variables
2. Update `FRONTEND_URL` to your Netlify URL

---

## 5. Verify Deployment

### Backend Check
```
curl https://your-railway-backend.up.railway.app/api/health
```
Should return: `{"status":"healthy","timestamp":"..."}`

### Frontend Check
Visit your Netlify URL and test:
- [ ] Homepage loads
- [ ] Products display
- [ ] Search works
- [ ] Login/Register works
- [ ] Add to cart works
- [ ] Checkout works

---

## Troubleshooting

### CORS Errors
- Ensure `FRONTEND_URL` in Railway matches your Netlify URL exactly
- Check if URL has trailing slash (remove it)

### API Not Found
- Verify `VITE_API_URL` is set correctly in Netlify
- Redeploy frontend after changing env variables

### Database Connection Failed
- Whitelist `0.0.0.0/0` in MongoDB Atlas Network Access
- Verify connection string is correct

### Build Failures
- Check Node.js version compatibility
- Ensure all dependencies are in package.json

---

## Files Created for Deployment

### Frontend
- `netlify.toml` - Netlify configuration
- `.env.example` - Example environment variables
- `vite.config.js` - Build optimizations
- `src/config/api.js` - Centralized API configuration

### Backend
- `railway.json` - Railway configuration
- `Procfile` - Start command
- `.env.example` - Example environment variables
- `server.js` - Updated with production CORS

---

## Quick Reference

| Service | Dashboard |
|---------|-----------|
| Netlify | https://app.netlify.com |
| Railway | https://railway.app/dashboard |
| MongoDB Atlas | https://cloud.mongodb.com |
| Razorpay | https://dashboard.razorpay.com |
