# 🚀 StudyHub Deployment Guide

Complete guide to deploy StudyHub to production with best practices for performance, security, and scalability.

## 📋 Pre-Deployment Checklist

### ✅ **Database Setup**

- [ ] Production Supabase project created
- [ ] All database tables created (run SQL scripts)
- [ ] RLS policies configured
- [ ] Admin user created
- [ ] Environment variables configured

### ✅ **Code Preparation**

- [ ] Build passes without errors (`npm run build`)
- [ ] TypeScript checks pass (`npm run typecheck`)
- [ ] All features tested
- [ ] Error boundaries implemented
- [ ] Loading states added

### ✅ **SEO & Performance**

- [ ] Meta tags configured
- [ ] Sitemap created
- [ ] Images optimized
- [ ] Bundle size analyzed
- [ ] Performance tested

## 🌐 Deployment Options

### **Option 1: Vercel (Recommended)**

1. **Install Vercel CLI**

   ```bash
   npm i -g vercel
   ```

2. **Deploy**

   ```bash
   vercel --prod
   ```

3. **Configure Environment Variables**

   - Go to Vercel Dashboard → Project → Settings → Environment Variables
   - Add all variables from `.env.production`

4. **Custom Domain**
   - Add your domain in Vercel Dashboard
   - Update DNS records as instructed

### **Option 2: Netlify**

1. **Build the Project**

   ```bash
   npm run build
   ```

2. **Deploy**

   - Drag and drop `dist` folder to Netlify
   - Or connect GitHub repository

3. **Configure**
   - Set environment variables in Site Settings
   - Configure redirects for SPA routing

### **Option 3: GitHub Pages**

1. **Install gh-pages**

   ```bash
   npm install --save-dev gh-pages
   ```

2. **Add Deploy Script**

   ```json
   "scripts": {
     "deploy": "npm run build && gh-pages -d dist"
   }
   ```

3. **Deploy**
   ```bash
   npm run deploy
   ```

### **Option 4: Docker**

1. **Create Dockerfile**

   ```dockerfile
   FROM node:18-alpine AS builder
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci --only=production
   COPY . .
   RUN npm run build

   FROM nginx:alpine
   COPY --from=builder /app/dist /usr/share/nginx/html
   COPY nginx.conf /etc/nginx/nginx.conf
   EXPOSE 80
   CMD ["nginx", "-g", "daemon off;"]
   ```

2. **Build and Run**
   ```bash
   docker build -t studyhub .
   docker run -p 80:80 studyhub
   ```

## ⚙️ Environment Configuration

### **Production Environment Variables**

Create `.env.production` with your values:

```env
# Required
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_APP_URL=https://yourdomain.com

# Optional
VITE_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
VITE_SENTRY_DSN=https://your-sentry-dsn
```

### **Supabase Production Setup**

1. **Create Production Project**

   - New organization/project in Supabase
   - Different from development

2. **Configure Database**

   ```sql
   -- Run all database setup scripts
   -- Create admin users
   -- Configure RLS policies
   ```

3. **Security Settings**
   - Add production domain to allowed origins
   - Configure SMTP for emails
   - Set up proper backup policies

## 🔒 Security Configuration

### **Content Security Policy**

Add to your hosting platform headers:

```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://*.supabase.co;
```

### **Additional Headers**

```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

## 📊 Performance Optimization

### **Bundle Analysis**

```bash
npm run build -- --analyze
```

### **Image Optimization**

- Use WebP format for images
- Implement lazy loading
- Compress images (use tools like TinyPNG)

### **Code Splitting**

```typescript
// Lazy load pages
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Admin = lazy(() => import("./pages/Admin"));
```

## 📈 Analytics Setup

### **Google Analytics 4**

1. Create GA4 property
2. Add tracking ID to environment variables
3. Analytics will be automatically tracked

### **Performance Monitoring**

```bash
# Install web vitals
npm install web-vitals
```

## 🐛 Error Monitoring

### **Sentry Setup** (Optional)

1. Create Sentry project
2. Add DSN to environment variables
3. Error boundary will automatically report errors

## 🔄 CI/CD Pipeline

### **GitHub Actions Example**

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: "18"
      - run: npm ci
      - run: npm run build
      - run: npm run typecheck
      - uses: vercel/action@v1
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-args: "--prod"
```

## 🎯 Domain & SSL

### **Custom Domain Setup**

1. **Purchase Domain** (Namecheap, GoDaddy, etc.)
2. **Configure DNS**
   - Point to hosting provider
   - Add CNAME records if needed
3. **SSL Certificate**
   - Automatic with Vercel/Netlify
   - Manual with other providers

## 📱 PWA Configuration

The app is already PWA-ready with:

- ✅ Service worker
- ✅ App manifest
- ✅ Offline support
- ✅ Install prompts

## 🚨 Monitoring & Maintenance

### **Health Checks**

Monitor these endpoints:

- `/` - Homepage loads
- `/assignments` - Core functionality
- Supabase connection

### **Performance Metrics**

Track:

- Page load times
- First contentful paint
- Largest contentful paint
- Cumulative layout shift

### **Database Monitoring**

- Query performance
- Connection pooling
- Backup verification
- Storage usage

## 🆘 Troubleshooting

### **Common Issues**

1. **Build Failures**

   ```bash
   npm run typecheck  # Check TypeScript errors
   npm run build      # Check build errors
   ```

2. **Environment Variables**

   - Must start with `VITE_` for client-side
   - Check spelling and format
   - Restart dev server after changes

3. **Supabase Connection**

   - Verify URL and key
   - Check RLS policies
   - Confirm database tables exist

4. **Routing Issues**
   - Configure SPA redirects
   - Check file-based routing
   - Verify 404 handling

## 📞 Support

- **Documentation**: Check this guide first
- **Issues**: Create GitHub issue
- **Email**: support@studyhub.app

---

## 🎉 Post-Deployment

After successful deployment:

1. ✅ Test all core features
2. ✅ Verify analytics tracking
3. ✅ Check error monitoring
4. ✅ Test performance on mobile
5. ✅ Submit to Google for indexing
6. ✅ Share with users!

Your StudyHub platform is now live and ready for users! 🚀
