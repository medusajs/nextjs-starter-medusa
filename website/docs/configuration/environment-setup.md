---
title: Environment Setup
description: Set up your development environment for the Medusa Next.js Starter
sidebar_position: 2
---

# Environment Setup

This guide walks you through setting up your development environment for the Medusa Next.js Starter.

## Prerequisites

Before you start, make sure you have the following installed:

- **Node.js** version 18.0 or above
- **Yarn** package manager (recommended) or npm
- **Medusa server** running locally on port 9000

### Install Node.js

You can check your Node.js version by running:

```bash
node -v
```

If you need to install or update Node.js, we recommend using [nvm (Node Version Manager)](https://github.com/nvm-sh/nvm):

```bash
# Install latest LTS version
nvm install --lts
nvm use --lts
```

## Environment Variables

Create a `.env.local` file in your project root:

```bash
cd your-project-directory
cp .env.template .env.local
```

### Required Environment Variables

```shell
# Medusa Backend URL
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000

# Stripe Payment Integration (optional)
NEXT_PUBLIC_STRIPE_KEY=pk_test_your_stripe_public_key

# Additional optional variables
NEXT_PUBLIC_BASE_URL=http://localhost:8000
```

### Optional Environment Variables

```shell
# Analytics (if using)
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX

# Deployment specific
NEXT_PUBLIC_VERCEL_URL=${VERCEL_URL}

# Builder.io integration (if using)
NEXT_PUBLIC_BUILDER_API_KEY=your-builder-api-key
```

## Development Setup

1. **Install dependencies:**
   ```bash
   yarn install
   # or
   npm install
   ```

2. **Start the development server:**
   ```bash
   yarn dev
   # or
   npm run dev
   ```

3. **Verify setup:**
   - Open http://localhost:8000 in your browser
   - The site should load with the Medusa storefront
   - Check browser console for any errors

## Medusa Backend Setup

If you don't have a Medusa server running yet:

1. **Quick setup with create-medusa-app:**
   ```bash
   npx create-medusa-app@latest my-medusa-store
   cd my-medusa-store
   yarn dev
   ```

2. **Verify Medusa server:**
   - Server should run on http://localhost:9000
   - Admin panel at http://localhost:9000/app
   - API accessible at http://localhost:9000/store

## Troubleshooting

### Common Issues

**Port conflicts:**
```bash
# Change the port in package.json scripts
"dev": "next dev --turbopack -p 3000"  # Use port 3000 instead
```

**Medusa connection errors:**
```bash
# Check if Medusa server is running
curl http://localhost:9000/store/products
```

**Build errors:**
```bash
# Clear Next.js cache
rm -rf .next
yarn dev
```

### Environment Variable Issues

Make sure your `.env.local` file:
- Is in the project root (same level as package.json)
- Has proper variable naming (NEXT_PUBLIC_ prefix for client-side)
- Contains no trailing spaces or quotes around values

### Getting Help

If you encounter issues:
1. Check the [Troubleshooting section](../troubleshooting/common-issues)
2. Review the [Medusa documentation](https://docs.medusajs.com)
3. Join the [Medusa Discord community](https://discord.gg/xpCwq3Kfn8)

## Next Steps

- [Feature Flags Configuration](./feature-flags)
- [Configuration Examples](./examples)
- [Development Guide](../development/overview)