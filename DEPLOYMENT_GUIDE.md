# Deployment Guide for myhomefurniture.in

## Quick Start - Deploy to Vercel & Railway

### Step 1: Deploy Backend to Railway

1. **Go to Railway:** https://railway.app/
2. **Sign up** with your GitHub account
3. **Create New Project** → **Deploy from GitHub repo**
4. **Select:** `RajnishJangidinfo/myhomefurniture`
5. **Select subfolder:** `AspNetCoreJwt`
6. **Add environment variables:**
   ```
   ASPNETCORE_ENVIRONMENT=Production
   Jwt__Key=your-super-secret-jwt-key-at-least-32-characters-long-production
   ```
7. **Deploy** - Railway will build and deploy automatically
8. **Copy your Railway URL** (e.g., `https://your-app.railway.app`)

---

### Step 2: Deploy Frontend to Vercel

1. **Go to Vercel:** https://vercel.com/
2. **Sign up** with your GitHub account
3. **Import Project** → Select `myhomefurniture` repository
4. **Configure:**
   - **Framework Preset:** Next.js
   - **Root Directory:** `myhomefurniture_repo/frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`
5. **Add Environment Variable:**
   ```
   NEXT_PUBLIC_API_URL = https://your-railway-url.railway.app
   ```
   (Use the Railway URL from Step 1)
6. **Deploy** - Vercel will build and deploy
7. **Copy your Vercel URL** (e.g., `https://myhomefurniture.vercel.app`)

---

### Step 3: Configure Your Domain (myhomefurniture.in)

#### In Vercel Dashboard:
1. Go to **Project Settings** → **Domains**
2. Add custom domain: `myhomefurniture.in`
3. Add custom domain: `www.myhomefurniture.in`
4. Vercel will show you DNS records to add

#### In GoDaddy:
1. Go to **DNS Management** for `myhomefurniture.in`
2. **Add these records** (from Vercel):
   ```
   Type: A
   Name: @
   Value: 76.76.21.21 (Vercel's IP)
   TTL: 600

   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   TTL: 600
   ```
3. **Remove** any old A/CNAME records
4. **Save** changes

#### Wait for DNS Propagation
- Usually takes 10-60 minutes
- Can take up to 48 hours

---

### Step 4: Update Backend CORS

After deployment, update your backend to allow the frontend domain:

In Railway dashboard → Environment Variables → Add:
```
AllowedOrigins=https://myhomefurniture.in,https://www.myhomefurniture.in
```

---

## Testing

Once DNS propagates:
1. Visit: https://myhomefurniture.in
2. Test login, register, forgot password
3. Verify all features work

---

##  Automatic Deployments

Both Vercel and Railway are connected to your GitHub repository:
- **Push to GitHub** → Automatic deployment
- **No manual steps needed**

---

## Troubleshooting

**If the site still doesn't load:**
- Check DNS propagation: https://dnschecker.org/
- Verify Vercel deployment succeeded
- Check Railway logs for backend errors
- Ensure environment variables are set correctly

**If API calls fail:**
- Check CORS settings in backend
- Verify `NEXT_PUBLIC_API_URL` matches Railway URL
- Check Railway logs for errors
