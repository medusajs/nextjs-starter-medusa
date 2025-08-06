# Deployment Guide - Monorepo Structure

This guide covers deploying both the **Next.js Storefront** and **Docusaurus Documentation** from a single repository.

## 🏗️ Repository Structure Impact

Having both applications in the same repository creates a **monorepo** that affects deployment in several ways:

### ✅ Benefits
- **Single Source of Truth**: All code and docs in one place
- **Synchronized Versioning**: Documentation stays in sync with features
- **Atomic Updates**: Deploy related changes together
- **Simplified Development**: One repository to maintain

### ⚠️ Considerations
- **Build Complexity**: Two different build processes
- **Deployment Strategy**: Need separate or coordinated deployments
- **CI/CD Setup**: More complex pipeline configuration
- **Resource Usage**: Potentially larger repository size

## 🚀 Deployment Strategies

### Strategy 1: Separate Deployments (Recommended)

Deploy each application to different platforms optimized for their use case:

```
📱 Storefront    → https://your-store.com      (Vercel/Netlify)
📚 Documentation → https://docs.your-store.com (GitHub Pages/Vercel)
```

#### **Advantages:**
- ✅ **Independent Scaling**: Each app scales based on its needs
- ✅ **Technology Optimization**: Use best platform for each technology
- ✅ **Faster Deployments**: Only deploy what changed
- ✅ **Cost Efficiency**: Pay only for what each app needs
- ✅ **Failure Isolation**: One app failure doesn't affect the other

#### **Setup Instructions:**

**1. Storefront Deployment (Vercel)**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from root directory
vercel --prod

# Or use the vercel.json configuration provided
```

**2. Documentation Deployment (GitHub Pages)**
```bash
# Enable GitHub Pages in repository settings
# Use the provided GitHub Action: .github/workflows/deploy-docs.yml

# Manual deployment
cd website
npm run build
npm run deploy
```

### Strategy 2: Coordinated Deployments

Deploy both applications together with synchronized releases:

#### **GitHub Actions Setup:**

The repository includes pre-configured workflows:

**`.github/workflows/deploy-storefront.yml`**
- Triggers on changes to storefront files
- Runs tests and builds Next.js app
- Deploys to Vercel

**`.github/workflows/deploy-docs.yml`**
- Triggers on changes to documentation files
- Builds Docusaurus site
- Deploys to GitHub Pages

#### **Configuration:**

1. **Add Repository Secrets:**
```
VERCEL_TOKEN=your_vercel_token
VERCEL_ORG_ID=your_org_id
VERCEL_PROJECT_ID=your_project_id
MEDUSA_BACKEND_URL=your_medusa_url
STRIPE_PUBLIC_KEY=your_stripe_key
```

2. **Enable GitHub Pages:**
- Go to repository Settings → Pages
- Source: GitHub Actions
- The workflow will automatically deploy

### Strategy 3: Monolithic Deployment

Deploy both applications to a single platform (advanced):

#### **Vercel Monorepo Setup:**
```json
// vercel.json
{
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    },
    {
      "src": "website/package.json", 
      "use": "@vercel/static-build",
      "config": {
        "distDir": "website/build"
      }
    }
  ],
  "routes": [
    {
      "src": "/docs/(.*)",
      "dest": "/website/build/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ]
}
```

## 🛠️ Platform-Specific Guides

### Vercel Deployment

**For Storefront Only:**
```bash
# Use the provided vercel.json
vercel --prod

# Environment variables in Vercel dashboard:
NEXT_PUBLIC_MEDUSA_BACKEND_URL=your_backend_url
NEXT_PUBLIC_STRIPE_KEY=your_stripe_key
```

**For Both Applications:**
```bash
# Configure vercel.json for monorepo
# Set build commands for each app
# Configure routing rules
```

### Netlify Deployment

**Storefront:**
```toml
# netlify.toml
[build]
  command = "yarn build"
  publish = ".next"

[build.environment]
  NEXT_PUBLIC_MEDUSA_BACKEND_URL = "your_backend_url"
  NEXT_PUBLIC_STRIPE_KEY = "your_stripe_key"

[[redirects]]
  from = "/docs/*"
  to = "https://docs.your-domain.com/:splat"
  status = 301
```

**Documentation:**
```toml
# website/netlify.toml
[build]
  base = "website/"
  command = "npm run build"
  publish = "build/"
```

### GitHub Pages

**Automatic with GitHub Actions:**
```yaml
# .github/workflows/deploy-docs.yml is already configured
# Just enable GitHub Pages in repository settings
```

**Manual Deployment:**
```bash
cd website
npm run build

# Configure docusaurus.config.ts:
url: 'https://yourusername.github.io'
baseUrl: '/your-repo-name/'

npm run deploy
```

## 🔧 Development Workflow

### Local Development

```bash
# Terminal 1: Storefront
yarn dev

# Terminal 2: Documentation  
yarn docs:dev

# Or run both simultaneously
yarn dev & yarn docs:dev
```

### Build Testing

```bash
# Test storefront build
yarn build

# Test documentation build
yarn docs:build

# Test both builds
yarn build:all

# Serve documentation locally
yarn docs:serve
```

### Environment Management

**Storefront (`.env.local`):**
```env
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000
NEXT_PUBLIC_STRIPE_KEY=pk_test_your_key
```

**Documentation (No env needed):**
- Configuration in `website/docusaurus.config.ts`
- Build-time configuration only

## 📊 Performance Considerations

### Build Optimization

**Storefront:**
```javascript
// next.config.js optimizations
module.exports = {
  experimental: {
    optimizePackageImports: ['lodash', '@medusajs/ui'],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  }
}
```

**Documentation:**
```javascript
// website/docusaurus.config.ts
export default {
  future: {
    v4: true, // Use Docusaurus v4 optimizations
  },
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
}
```

### CI/CD Optimization

```yaml
# Cache dependencies
- name: Cache dependencies
  uses: actions/cache@v3
  with:
    path: |
      ~/.npm
      ~/.yarn
      **/node_modules
    key: ${{ runner.os }}-deps-${{ hashFiles('**/package-lock.json', '**/yarn.lock') }}

# Parallel builds
jobs:
  build-storefront:
    # Storefront build job
  build-docs:
    # Documentation build job
```

## 🐛 Common Issues & Solutions

### Issue: Vercel Ignores Documentation Changes

**Solution:** Use `ignoreCommand` in `vercel.json`:
```json
{
  "ignoreCommand": "git diff --quiet HEAD^ HEAD -- . ':(exclude)website' ':(exclude)documentation'"
}
```

### Issue: GitHub Pages Build Fails

**Solution:** Check `website/docusaurus.config.ts`:
```typescript
export default {
  url: 'https://yourusername.github.io',
  baseUrl: '/your-repo-name/', // Must match repository name
  organizationName: 'yourusername',
  projectName: 'your-repo-name',
}
```

### Issue: Cross-Application Linking

**Solution:** Use environment-aware URLs:
```typescript
// In storefront
const docsUrl = process.env.NODE_ENV === 'production' 
  ? 'https://docs.your-domain.com'
  : 'http://localhost:3000'

// In documentation  
const storeUrl = process.env.NODE_ENV === 'production'
  ? 'https://your-store.com'
  : 'http://localhost:8000'
```

## 🚀 Quick Start Commands

```bash
# Initial setup
yarn install:all

# Development
yarn dev & yarn docs:dev

# Production builds
yarn build:all

# Clean builds
yarn clean

# Deploy documentation only
yarn docs:deploy
```

## 📚 Additional Resources

- [Vercel Monorepo Guide](https://vercel.com/docs/concepts/git/monorepos)
- [GitHub Actions for Monorepos](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions)
- [Docusaurus Deployment Guide](https://docusaurus.io/docs/deployment)
- [Next.js Deployment Options](https://nextjs.org/docs/deployment)

---

**Need Help?** Check the [troubleshooting guide](./website/docs/troubleshooting/common-issues.md) or open an issue on GitHub.