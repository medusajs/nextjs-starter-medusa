---
title: Common Issues
description: Solutions to frequently encountered problems with the Medusa Next.js Starter
sidebar_position: 1
---

# Common Issues & Solutions

This guide covers the most frequently encountered issues and their solutions. Before reaching out for support, please check if your issue is covered here.

## 🚀 Installation & Setup Issues

### Node.js Version Conflicts

**Problem**: Build fails with Node.js version errors
```
Error: The current version of Node.js (v16.x.x) is not supported. Please use Node.js 18.0.0 or higher.
```

**Solution**:
```bash
# Check current Node version
node --version

# Install Node 18+ using nvm
nvm install 18
nvm use 18

# Or using nvm-windows
nvm install 18.0.0
nvm use 18.0.0

# Verify version
node --version
```

### Yarn/npm Installation Problems

**Problem**: Package installation fails or takes too long
```
error: EACCES: permission denied, open '/home/user/.config/yarn/global/package.json'
```

**Solution**:
```bash
# Clear npm/yarn cache
npm cache clean --force
yarn cache clean

# Fix permissions (macOS/Linux)
sudo chown -R $(whoami) ~/.npm
sudo chown -R $(whoami) ~/.config

# Reinstall packages
rm -rf node_modules package-lock.json yarn.lock
yarn install
# or
npm install
```

### Environment Variables Not Loading

**Problem**: Environment variables not accessible in the application

**Solution**:
```bash
# 1. Ensure .env.local exists in project root
ls -la | grep .env

# 2. Check variable naming (must start with NEXT_PUBLIC_ for client-side)
# ❌ Wrong
STRIPE_KEY=pk_test_123

# ✅ Correct  
NEXT_PUBLIC_STRIPE_KEY=pk_test_123

# 3. Restart development server after changes
yarn dev
```

## 🔧 Development Issues

### Companion Panel Not Opening

**Problem**: Panel buttons don't trigger panel opening

**Solution**:
1. **Check Provider Setup**:
```tsx
// Ensure CompanionPanelProvider wraps your app
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <CompanionPanelProvider>
      <Component {...pageProps} />
    </CompanionPanelProvider>
  )
}
```

2. **Verify Hook Usage**:
```tsx
// Use the hook correctly
const { openPanel, isOpen } = useCompanionPanel()

// Call openPanel with correct parameters
<button onClick={() => openPanel('cart', { items: cartItems })}>
  Open Cart
</button>
```

3. **Check Feature Flags**:
```javascript
// store.config.js
const storeConfig = {
  featureFlags: {
    // Ensure the feature is enabled
    aiCompanion: true,
    helpCompanion: true,
  }
}
```

### TypeScript Errors

**Problem**: TypeScript compilation errors with companion panel types

**Solution**:
```typescript
// 1. Import types correctly
import type { PanelType } from '@/types/companion-panel'
import { useCompanionPanel } from '@/contexts/companion-panel-context'

// 2. Type your panel data
interface CartPanelData {
  items: CartItem[]
  showCheckout?: boolean
}

const { openPanel } = useCompanionPanel()
openPanel('cart', { items: [], showCheckout: true } as CartPanelData)

// 3. Update tsconfig.json paths if needed
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/lib/*": ["./src/lib/*"]
    }
  }
}
```

### Hydration Mismatches

**Problem**: React hydration errors on page load

**Solution**:
```tsx
// 1. Use dynamic imports for client-only components
import dynamic from 'next/dynamic'

const CompanionPanelProvider = dynamic(
  () => import('@/contexts/companion-panel-context'),
  { ssr: false }
)

// 2. Check for browser-only code
useEffect(() => {
  // Browser-only logic here
  const isMobile = window.innerWidth < 768
}, [])

// 3. Use suppressHydrationWarning sparingly
<div suppressHydrationWarning>
  {/* Content that might differ between server and client */}
</div>
```

## 🛒 Medusa Integration Issues

### Connection to Medusa Backend Fails

**Problem**: Cannot connect to Medusa server
```
Error: Network Error - ERR_CONNECTION_REFUSED
```

**Solution**:
```bash
# 1. Verify Medusa server is running
curl http://localhost:9000/health

# 2. Check environment variable
# .env.local
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000

# 3. Start Medusa server if not running
cd path/to/medusa-server
yarn dev

# 4. Check port conflicts
lsof -i :9000  # Check what's using port 9000
```

### CORS Errors

**Problem**: CORS policy blocks requests to Medusa
```
Access to fetch at 'http://localhost:9000' from origin 'http://localhost:3000' has been blocked by CORS policy
```

**Solution**:
1. **Update Medusa Configuration**:
```javascript
// medusa-config.js
module.exports = {
  projectConfig: {
    cors: "http://localhost:8000,http://localhost:3000",
    // Add your frontend URLs
  },
}
```

2. **Development Proxy** (alternative):
```javascript
// next.config.js
module.exports = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:9000/:path*',
      },
    ]
  },
}
```

### Cart Synchronization Issues

**Problem**: Cart state not persisting or syncing with Medusa

**Solution**:
```typescript
// 1. Check cart initialization
useEffect(() => {
  const initializeCart = async () => {
    try {
      const cart = await medusa.carts.create()
      localStorage.setItem('cart_id', cart.id)
    } catch (error) {
      console.error('Cart initialization failed:', error)
    }
  }
  
  initializeCart()
}, [])

// 2. Verify API calls
const addToCart = async (variantId: string, quantity: number) => {
  try {
    const cartId = localStorage.getItem('cart_id')
    if (!cartId) throw new Error('No cart found')
    
    await medusa.carts.lineItems.create(cartId, {
      variant_id: variantId,
      quantity,
    })
  } catch (error) {
    console.error('Add to cart failed:', error)
  }
}
```

## 📱 Mobile & Responsive Issues

### Panel Animations Jerky on Mobile

**Problem**: Poor animation performance on mobile devices

**Solution**:
```css
/* Add to your CSS */
.companion-panel {
  /* Force hardware acceleration */
  transform: translateZ(0);
  will-change: transform;
  
  /* Optimize for touch devices */
  -webkit-overflow-scrolling: touch;
  -webkit-tap-highlight-color: transparent;
}

/* Reduce motion for accessibility */
@media (prefers-reduced-motion: reduce) {
  .companion-panel {
    transition-duration: 0.01ms !important;
  }
}
```

### Touch Gestures Not Working

**Problem**: Swipe gestures don't work on mobile

**Solution**:
```tsx
// Install react-swipeable if not already installed
// npm install react-swipeable

import { useSwipeable } from 'react-swipeable'

function CompanionPanel() {
  const { closePanel } = useCompanionPanel()
  
  const handlers = useSwipeable({
    onSwipedRight: () => closePanel(),
    trackMouse: true,
    preventDefaultTouchmoveEvent: true,
  })
  
  return <div {...handlers}>{/* Panel content */}</div>
}
```

## 🎨 Styling & UI Issues

### Tailwind Classes Not Applied

**Problem**: Tailwind CSS classes don't take effect

**Solution**:
```javascript
// 1. Check tailwind.config.js
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    // Make sure your paths are correct
  ],
}

// 2. Restart development server
yarn dev

// 3. Check for CSS conflicts
// Use browser dev tools to inspect element
```

### Custom CSS Not Loading

**Problem**: Custom styles don't override component styles

**Solution**:
```css
/* Use higher specificity or !important */
.my-custom-panel {
  background-color: blue !important;
}

/* Or use CSS modules */
/* styles.module.css */
.customPanel {
  background-color: blue;
}
```

```tsx
import styles from './styles.module.css'

<div className={styles.customPanel}>
  Content
</div>
```

## 🔍 Performance Issues

### Slow Panel Opening

**Problem**: Panels take too long to open (>500ms)

**Solution**:
```tsx
// 1. Use dynamic imports for heavy components
const HeavyPanelContent = lazy(() => import('./HeavyPanelContent'))

// 2. Implement proper loading states
function MyPanel() {
  return (
    <Suspense fallback={<PanelSkeleton />}>
      <HeavyPanelContent />
    </Suspense>
  )
}

// 3. Profile performance
useEffect(() => {
  performance.mark('panel-open-start')
  
  return () => {
    performance.mark('panel-open-end')
    performance.measure(
      'panel-open-time',
      'panel-open-start',
      'panel-open-end'
    )
    
    const measures = performance.getEntriesByName('panel-open-time')
    console.log('Panel open time:', measures[0].duration)
  }
}, [])
```

### Large Bundle Size

**Problem**: Application bundle is too large

**Solution**:
```javascript
// 1. Analyze bundle
yarn build
yarn analyze  # If you have webpack-bundle-analyzer

// 2. Implement code splitting
const LazyComponent = lazy(() => import('./LazyComponent'))

// 3. Tree shake properly
import { specific } from 'library/specific'
// Instead of: import * as library from 'library'

// 4. Check next.config.js
module.exports = {
  experimental: {
    optimizePackageImports: ['lodash', '@medusajs/ui'],
  },
}
```

## 🔐 Security & Authentication

### Authentication Tokens Not Persisting

**Problem**: User logged out after page refresh

**Solution**:
```typescript
// 1. Use secure storage
const storeToken = (token: string) => {
  // Secure storage for tokens
  localStorage.setItem('medusa_auth_token', token)
  
  // Or use cookies for SSR
  Cookies.set('medusa_auth_token', token, {
    expires: 7,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  })
}

// 2. Implement token refresh
useEffect(() => {
  const refreshToken = async () => {
    try {
      const token = localStorage.getItem('medusa_auth_token')
      if (token) {
        await medusa.auth.refresh(token)
      }
    } catch (error) {
      // Redirect to login
    }
  }
  
  refreshToken()
}, [])
```

## 🆘 Getting Additional Help

If your issue isn't covered here:

1. **Check the Console**: Look for error messages in browser developer tools
2. **Review Logs**: Check terminal output for server-side errors  
3. **Search Issues**: Check [GitHub Issues](https://github.com/medusajs/nextjs-starter-medusa/issues)
4. **Ask the Community**: Join our [Discord](https://discord.gg/xpCwq3Kfn8)
5. **Create an Issue**: If you found a bug, please report it

### When Reporting Issues

Include:
- Operating system and version
- Node.js version (`node --version`)
- Browser and version
- Steps to reproduce
- Expected vs actual behavior
- Console errors and logs
- Minimal code example

## 🔄 Quick Reset

If all else fails, try a complete reset:

```bash
# 1. Clean everything
rm -rf node_modules
rm package-lock.json
rm yarn.lock
rm -rf .next

# 2. Clear caches
npm cache clean --force
yarn cache clean

# 3. Reinstall
yarn install

# 4. Restart
yarn dev
```

This should resolve most environment-related issues.