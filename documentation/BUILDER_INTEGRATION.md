# Builder.io + Medusa Integration Guide

This project integrates Builder.io with your Medusa storefront, enabling visual page building while maintaining full e-commerce functionality.

## 🚀 Quick Start

### 1. Environment Setup

Copy the environment example and configure your Builder.io API key:

```bash
cp .env.local.example .env.local
```

Add your Builder.io API key to `.env.local`:

```env
NEXT_PUBLIC_BUILDER_API_KEY=your_builder_api_key_here
```

Get your API key from [Builder.io Account Settings](https://builder.io/account/organization).

### 2. Install Dependencies

Dependencies are already installed. The integration uses:
- `@builder.io/react` - React SDK
- `@builder.io/sdk` - Core SDK

### 3. Start Development

```bash
npm run dev
```

Your storefront will be available at `http://localhost:8000` with Builder.io integration enabled.

## 🏗️ Integration Architecture

This integration uses a **three-pronged approach** for maximum flexibility:

### 1. **Page-Level Integration** (Homepage)
- **Use Case**: Complete page control with fallback
- **Implementation**: `/src/app/[countryCode]/(main)/page.tsx`
- **Fallback**: Original homepage components
- **Best For**: Marketing landing pages, seasonal campaigns

### 2. **Section-Based Integration** (Product Pages)
- **Use Case**: Customizable content sections while preserving core functionality
- **Implementation**: `/src/modules/products/templates/index.tsx`
- **Fallback**: Related products section
- **Best For**: Product descriptions, testimonials, additional content

### 3. **Hybrid Integration** (Store/Catalog Pages)
- **Use Case**: Customizable headers/banners with core functionality intact
- **Implementation**: `/src/modules/store/templates/index.tsx`
- **Fallback**: None (Builder content is optional)
- **Best For**: Category banners, promotional sections, store headers

## 📦 Available Components

### Home Components
- **Hero**: Customizable hero section with CTA
- **FeaturedProducts**: Product showcase from collections
- **Section**: Flexible container with styling options

### Product Components
- **ProductInfo**: Product details display
- **ProductTabs**: Product description and details tabs
- **RelatedProducts**: Related products grid
- **DynamicProductInfo**: Fetch product data by handle/ID
- **ProductTestimonials**: Customer testimonials
- **ProductSection**: Flexible product page container

### Store Components
- **FilteredProductsContainer**: Product grid with filtering
- **StoreBanner**: Customizable store page banner
- **CategoryShowcase**: Category grid display
- **PromotionalSection**: Promotional content with CTA

## 🔧 Builder.io Setup

### 1. Create Models

In your Builder.io space, create these models:

#### Page Model
- **Name**: `page`
- **Use For**: Homepage and custom pages
- **Preview URL**: `http://localhost:8000/[COUNTRY_CODE]?builder.preview=true`

#### Product Content Model
- **Name**: `product-content`
- **Use For**: Product page sections
- **Preview URL**: `http://localhost:8000/[COUNTRY_CODE]/products/[HANDLE]?builder.preview=true`

#### Store Content Model
- **Name**: `store-content`
- **Use For**: Store page headers/banners
- **Preview URL**: `http://localhost:8000/[COUNTRY_CODE]/store?builder.preview=true`

### 2. Configure Preview URLs

Set dynamic preview URLs in Builder.io:

```javascript
// For pages
`${protocol}://${host}/${countryCode}${targeting?.urlPath || ''}?builder.preview=true`

// For products
`${protocol}://${host}/${countryCode}/products/${targeting?.productHandle || 'sample-product'}?builder.preview=true`

// For store
`${protocol}://${host}/${countryCode}/store?builder.preview=true`
```

## 🎨 Creating Content

### 1. Homepage Customization

1. Go to Builder.io Content
2. Create a new `Page` entry
3. Set URL to `/`
4. Drag and drop components:
   - **Hero**: Main banner
   - **FeaturedProducts**: Product showcase
   - **Section**: Custom content areas

### 2. Product Page Enhancement

1. Create a new `Product Content` entry
2. Target specific products or use global content
3. Add components:
   - **ProductTestimonials**: Customer reviews
   - **ProductSection**: Additional product info
   - **DynamicProductInfo**: Cross-sell products

### 3. Store Page Headers

1. Create a new `Store Content` entry
2. Add banner and promotional content:
   - **StoreBanner**: Hero banner
   - **CategoryShowcase**: Featured categories
   - **PromotionalSection**: Special offers

## 🔄 Product Data Sync

### Option 1: Dynamic Fetching (Default)
Components automatically fetch product data from Medusa when needed. No additional setup required.

### Option 2: Webhook Sync (Recommended for Production)

Set up Medusa webhooks to sync product data to Builder.io:

1. **Configure Medusa Webhook**:
   ```javascript
   // In your Medusa backend
   {
     url: "https://your-domain.com/api/builder/sync-products",
     events: [
       "product.created",
       "product.updated", 
       "product.deleted"
     ]
   }
   ```

2. **Manual Sync** (for development):
   ```bash
   curl "http://localhost:8000/api/builder/sync-products?productId=PRODUCT_ID&action=sync"
   ```

## 🛠️ Development

### Adding New Components

1. **Create Component**:
   ```tsx
   // src/modules/[module]/components/my-component/index.tsx
   export default function MyComponent({ title, description }) {
     return (
       <div>
         <h2>{title}</h2>
         <p>{description}</p>
       </div>
     )
   }
   ```

2. **Register with Builder**:
   ```tsx
   // src/modules/[module]/components/builder-registry.tsx
   Builder.registerComponent(MyComponent, {
     name: 'MyComponent',
     inputs: [
       { name: 'title', type: 'text', required: true },
       { name: 'description', type: 'longText' }
     ]
   })
   ```

3. **Import Registry**:
   ```tsx
   // Add to src/lib/builder-registry.ts
   import '@modules/[module]/components/builder-registry'
   ```

### Debugging

1. **Check API Key**: Ensure `NEXT_PUBLIC_BUILDER_API_KEY` is set
2. **Preview Mode**: Use `?builder.preview=true` in URLs
3. **Console Logs**: Check browser console for component registration
4. **Network Tab**: Verify Builder.io API calls

## 🚀 Deployment

### 1. Environment Variables

Set in your deployment platform:
```env
NEXT_PUBLIC_BUILDER_API_KEY=your_production_api_key
```

### 2. Update Preview URLs

In Builder.io, update preview URLs to your production domain:
```
https://your-domain.com/[COUNTRY_CODE]?builder.preview=true
```

### 3. Webhook Configuration

Update webhook URLs in Medusa to point to production:
```
https://your-domain.com/api/builder/sync-products
```

## 🔒 Security Considerations

1. **API Keys**: Builder.io public API keys are safe for client-side use
2. **Webhooks**: Consider adding webhook signature verification
3. **Content**: Review all Builder.io content before publishing
4. **CORS**: Builder.io preview requires proper CORS configuration

## 📊 Performance

### Optimizations Included

1. **Dynamic Imports**: Components are loaded on-demand
2. **Error Boundaries**: Graceful fallbacks for failed Builder content
3. **Caching**: Static generation with ISR for Builder content
4. **Bundle Splitting**: Builder.io code is separated from main bundle

### Monitoring

- Monitor Core Web Vitals impact
- Track Builder.io API response times
- Monitor fallback usage rates

## 🆘 Troubleshooting

### Common Issues

1. **Components not showing in Builder**:
   - Check API key configuration
   - Verify component registration
   - Check browser console for errors

2. **Preview not working**:
   - Verify preview URL configuration
   - Check middleware allows Builder preview
   - Ensure proper country code in URL

3. **Fallback not working**:
   - Check BuilderWrapper configuration
   - Verify fallback component props
   - Check error boundaries

4. **Product data not loading**:
   - Verify Medusa backend connection
   - Check product handle/ID accuracy
   - Review network requests

### Getting Help

- [Builder.io Documentation](https://www.builder.io/c/docs)
- [Builder.io Forum](https://forum.builder.io/)
- [Medusa Documentation](https://docs.medusajs.com/)

## 🎯 Best Practices

1. **Content Strategy**: Plan your Builder.io content models carefully
2. **Component Design**: Keep components focused and reusable
3. **Fallbacks**: Always provide meaningful fallback content
4. **Testing**: Test both Builder and fallback scenarios
5. **Performance**: Monitor the impact on page load times
6. **SEO**: Ensure Builder content is properly indexed

---

**Happy Building!** 🎉

Your Medusa storefront now has the power of visual page building while maintaining full e-commerce functionality.