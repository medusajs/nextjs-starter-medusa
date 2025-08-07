# 🚀 GitHub Actions Deployment Setup

This guide will help you set up automated deployments for both your storefront and documentation using GitHub Actions.

## ✅ Fixed Issues

- ❌ **Old**: `vercel/action@v1` (doesn't exist)
- ✅ **New**: `amondnet/vercel-action@v25` (working community action)

## 🔐 Required GitHub Secrets

You need to add these secrets to your GitHub repository:

### Vercel Secrets

1. Go to your GitHub repository → **Settings** → **Secrets and variables** → **Actions**
2. Add these repository secrets:

#### `VERCEL_TOKEN`
```bash
# Get from: https://vercel.com/account/tokens
# Create a new token with full access
```

#### `VERCEL_ORG_ID`
```bash
# Get from your Vercel dashboard
# Or run: vercel link (then check .vercel/project.json)
```

#### `VERCEL_PROJECT_ID`
```bash
# Get from your Vercel project settings
# Or run: vercel link (then check .vercel/project.json)
```

### Environment Secrets

#### `MEDUSA_BACKEND_URL`
```bash
# Your production Medusa backend URL
# Example: https://your-medusa-backend.com
```

#### `STRIPE_PUBLIC_KEY`
```bash
# Your Stripe publishable key
# Example: pk_live_...
```



## 📋 How to Get Vercel Credentials

### 1. Get Vercel Token
1. Go to [Vercel Account Settings](https://vercel.com/account/tokens)
2. Click **"Create Token"**
3. Give it a name like "GitHub Actions"
4. Select **"Full Account"** scope
5. Copy the token and add it as `VERCEL_TOKEN` secret

### 2. Get Organization ID
1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Click on your team/account name in the top-left
3. Go to **Settings** → **General**
4. Copy the **Team ID** and add it as `VERCEL_ORG_ID` secret

### 3. Get Project ID
1. Go to your Vercel project dashboard
2. Click **Settings**
3. Scroll down to **General** section
4. Copy the **Project ID** and add it as `VERCEL_PROJECT_ID` secret

### Alternative: Using Vercel CLI
```bash
# Link your project (run in your project root)
vercel link

# This creates .vercel/project.json with your IDs
cat .vercel/project.json
```

## 🔄 Workflow Triggers

### Storefront Deployment
Triggers on changes to:
- `src/**` - Source code changes
- `public/**` - Static assets
- `package.json` - Dependencies
- `package-lock.json` - Lock file changes
- `next.config.js` - Next.js configuration
- `tailwind.config.js` - Styling changes
- `tsconfig.json` - TypeScript configuration
- `store.config.js` - Store configuration
- Manual trigger via GitHub UI

### Documentation Deployment
Triggers on changes to:
- `website/**` - Documentation source
- `documentation/**` - Original docs folder
- Manual trigger via GitHub UI

## 🧪 Testing the Workflows

### Test Storefront Deployment
1. Make a small change to any file in `src/`
2. Commit and push to `main` branch
3. Check **Actions** tab in GitHub
4. Verify deployment in Vercel dashboard

### Test Documentation Deployment
1. Make a change to any file in `website/`
2. Commit and push to `main` branch
3. Check **Actions** tab in GitHub
4. Verify deployment in GitHub Pages

## 🛠️ Troubleshooting

### Common Issues

#### "Action not found" Error
- ✅ **Fixed**: Updated from `vercel/action@v1` to `amondnet/vercel-action@v25`

#### "Missing secrets" Error
```bash
# Ensure all required secrets are added:
- VERCEL_TOKEN
- VERCEL_ORG_ID  
- VERCEL_PROJECT_ID
- MEDUSA_BACKEND_URL
- STRIPE_PUBLIC_KEY
- BUILDER_PUBLIC_KEY
```

#### "Build failed" Error
- Check the build logs in GitHub Actions
- Ensure all dependencies are in `package.json`
- Verify environment variables are correct

#### "Tests failed" Error
- Added `--passWithNoTests` flag to handle missing tests
- If you have tests, ensure they pass locally first

### Debug Steps

1. **Check GitHub Actions logs**:
   - Go to **Actions** tab in your repository
   - Click on the failed workflow run
   - Expand each step to see detailed logs

2. **Verify secrets**:
   - Go to **Settings** → **Secrets and variables** → **Actions**
   - Ensure all required secrets are present
   - Re-create secrets if unsure about values

3. **Test locally**:
   ```bash
   # Test the build process locally
   npm ci
   npm run build
   npm test
   ```

4. **Vercel CLI debugging**:
   ```bash
   # Test Vercel deployment locally
   npm install -g vercel
   vercel --prod
   ```

## 🚀 Manual Deployment

If GitHub Actions fail, you can deploy manually:

### Storefront
```bash
# Deploy storefront manually
npm run build
vercel --prod
```

### Documentation
```bash
# Deploy documentation manually
cd website
npm run build
npm run deploy
```

## 📊 Monitoring Deployments

### Vercel Dashboard
- Monitor deployments: [Vercel Dashboard](https://vercel.com/dashboard)
- Check build logs and performance metrics
- Set up deployment notifications

### GitHub Actions
- View workflow history in **Actions** tab
- Set up email notifications for failed deployments
- Monitor build times and success rates

## 🔄 Next Steps

1. **✅ Add all required secrets** to GitHub repository
2. **✅ Test deployment** by pushing a small change
3. **✅ Verify** both storefront and docs deploy correctly
4. **✅ Set up monitoring** and notifications
5. **✅ Document** any custom deployment requirements

## 🆘 Need Help?

If you encounter issues:

1. **Check the logs** in GitHub Actions
2. **Verify secrets** are correctly set
3. **Test locally** to isolate the issue
4. **Check Vercel dashboard** for deployment status
5. **Review this guide** for missing steps

---

**Last Updated**: December 2024  
**Actions Version**: `amondnet/vercel-action@v25`  
**Node Version**: 22 LTS  
**Vercel CLI**: Latest