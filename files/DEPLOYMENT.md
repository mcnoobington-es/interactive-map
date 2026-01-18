# Deployment Guide

Deploy your BHS School Map to the internet so everyone can use it!

## Option 1: Firebase Hosting (Recommended)

Firebase Hosting is free, fast, and integrates perfectly with Firebase backend.

### Prerequisites
- Firebase project set up (see FIREBASE_SETUP.md)
- Firebase CLI installed

### Steps

1. **Install Firebase CLI**
```bash
npm install -g firebase-tools
```

2. **Login to Firebase**
```bash
firebase login
```

3. **Initialize Firebase Hosting**
```bash
firebase init hosting
```

Select:
- Use existing project → Choose your project
- Public directory → `build`
- Configure as single-page app → `Yes`
- Set up automatic builds → `No` (or `Yes` if using GitHub)
- Overwrite index.html → `No`

4. **Build Your App**
```bash
npm run build
```

This creates optimized production files in the `build` folder.

5. **Deploy**
```bash
firebase deploy --only hosting
```

6. **Access Your Site**

Your site will be at: `https://your-project-id.web.app`

### Updating Your Site

Whenever you make changes:
```bash
npm run build
firebase deploy --only hosting
```

---

## Option 2: Netlify

Netlify offers easy deployment with drag-and-drop or Git integration.

### Method A: Drag and Drop

1. Build your app:
```bash
npm run build
```

2. Go to [app.netlify.com](https://app.netlify.com)
3. Drag the `build` folder onto Netlify
4. Done! Your site is live

### Method B: Git Integration

1. Push code to GitHub
2. Go to [app.netlify.com](https://app.netlify.com)
3. Click "New site from Git"
4. Connect to your GitHub repo
5. Build settings:
   - Build command: `npm run build`
   - Publish directory: `build`
6. Click "Deploy site"

**Environment Variables:**
- Go to Site settings → Build & deploy → Environment
- Add your Firebase config variables

---

## Option 3: Vercel

Similar to Netlify, great for React apps.

### Steps

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Login:
```bash
vercel login
```

3. Deploy:
```bash
vercel
```

Follow prompts, then your site is live!

### Or use Git integration:

1. Push to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Configure build settings (auto-detected for React)
5. Deploy

---

## Option 4: GitHub Pages

Free hosting directly from your GitHub repository.

### Steps

1. Install gh-pages:
```bash
npm install --save-dev gh-pages
```

2. Update `package.json`:
```json
{
  "homepage": "https://your-username.github.io/bhs-school-map",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d build"
  }
}
```

3. Deploy:
```bash
npm run deploy
```

4. Enable GitHub Pages:
- Go to repo Settings → Pages
- Source: `gh-pages` branch
- Save

Your site: `https://your-username.github.io/bhs-school-map`

---

## Custom Domain (Optional)

### For Firebase Hosting

1. Go to Firebase Console → Hosting
2. Click "Add custom domain"
3. Enter your domain (e.g., `map.bhsschool.com`)
4. Follow DNS setup instructions
5. Wait for SSL certificate (automatic, ~24 hours)

### For Netlify/Vercel

1. Go to Domain settings
2. Add custom domain
3. Update DNS records at your domain registrar
4. SSL certificate is automatic

---

## Environment Variables in Production

### Firebase Hosting

Create `firebase.json`:
```json
{
  "hosting": {
    "public": "build",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "no-cache, no-store, must-revalidate"
          }
        ]
      }
    ]
  }
}
```

### Netlify

Create `netlify.toml`:
```toml
[build]
  command = "npm run build"
  publish = "build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

## Performance Optimization

### Before Deploying

1. **Optimize Images**
```bash
# Install image optimization tool
npm install -g imagemin-cli

# Optimize floor plans
imagemin public/floor-plans/*.png --out-dir=public/floor-plans-optimized
```

2. **Enable Compression**

All platforms (Firebase, Netlify, Vercel) automatically compress files, but you can pre-compress:

```json
// In firebase.json
{
  "hosting": {
    "headers": [
      {
        "source": "**/*.@(js|css)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=31536000"
          }
        ]
      }
    ]
  }
}
```

3. **Code Splitting**

React automatically does this with `npm run build`, but you can improve it:

```javascript
// Lazy load components
import { lazy, Suspense } from 'react';

const RoomModal = lazy(() => import('./components/RoomModal'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RoomModal />
    </Suspense>
  );
}
```

---

## Monitoring and Analytics

### Google Analytics (Optional)

1. Create GA4 property at [analytics.google.com](https://analytics.google.com)
2. Get Measurement ID (G-XXXXXXXXXX)
3. Add to Firebase config or `.env`
4. Update `src/firebase/config.js`:

```javascript
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
```

### Error Tracking

Consider adding Sentry for error tracking:

```bash
npm install @sentry/react
```

```javascript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "your-sentry-dsn",
  integrations: [new Sentry.BrowserTracing()],
  tracesSampleRate: 1.0,
});
```

---

## Security Checklist

Before going live:

- [ ] Update Firebase security rules (see FIREBASE_SETUP.md)
- [ ] Remove any test/debug code
- [ ] Ensure no API keys in source code (use environment variables)
- [ ] Test on multiple devices/browsers
- [ ] Set up proper authentication if needed
- [ ] Review Firestore rules
- [ ] Enable backup for Firestore
- [ ] Set up monitoring/alerts

---

## Maintenance

### Regular Updates

1. Update dependencies monthly:
```bash
npm outdated
npm update
```

2. Check for security vulnerabilities:
```bash
npm audit
npm audit fix
```

3. Rebuild and redeploy:
```bash
npm run build
firebase deploy
```

### Backup Strategy

1. **Code**: Always in Git
2. **Data**: Export Firestore regularly
```bash
firebase firestore:export backup-$(date +%Y%m%d)
```

3. **Images**: Keep originals in separate location

---

## Troubleshooting Deployment

### Build Fails

```bash
# Clear cache and rebuild
rm -rf node_modules build
npm install
npm run build
```

### 404 Errors on Refresh

**Problem**: Single-page app routing breaks on refresh

**Solution**: Configure rewrites (see firebase.json above)

### Slow Loading

1. Optimize images (use WebP format)
2. Enable lazy loading for components
3. Use CDN for static assets
4. Enable caching headers

### Firebase Quota Exceeded

1. Review Firestore usage in console
2. Implement caching in app
3. Optimize queries
4. Consider upgrading plan

---

## Cost Estimates

### Firebase (Spark Plan - Free)
- ✅ 10 GB/month storage
- ✅ 50,000 reads/day
- ✅ 20,000 writes/day
- ✅ 10 GB/month hosting transfer
- ✅ Perfect for school use!

### Netlify (Free)
- ✅ 100 GB bandwidth/month
- ✅ Unlimited sites
- ✅ Automatic SSL

### Vercel (Free)
- ✅ 100 GB bandwidth/month
- ✅ Unlimited sites
- ✅ Automatic SSL

**For a school with 500 active users:** Free tier is more than enough!

---

## Going Live Checklist

- [ ] Build completes without errors
- [ ] All features work in production build
- [ ] Tested on Chrome, Firefox, Safari
- [ ] Tested on mobile devices
- [ ] Firebase security rules configured
- [ ] Environment variables set
- [ ] Custom domain configured (if using)
- [ ] SSL certificate active
- [ ] Analytics set up (optional)
- [ ] Backup strategy in place
- [ ] Documentation updated
- [ ] Team knows how to update content

---

**Congratulations!** Your school map is now live and accessible to everyone! 🎉

For updates and maintenance, keep this guide handy.
