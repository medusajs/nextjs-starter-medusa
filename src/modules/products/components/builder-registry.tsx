"use client"

import { Builder } from '@builder.io/react'
import dynamic from 'next/dynamic'

// Dynamically import components to avoid SSR issues
const ProductInfo = dynamic(() => import('../templates/product-info'), { ssr: true })
const ProductTabs = dynamic(() => import('./product-tabs'), { ssr: true })
const RelatedProducts = dynamic(() => import('./related-products'), { ssr: true })
const DynamicProductInfo = dynamic(() => import('./dynamic-product-info'), { ssr: true })

// Register ProductInfo component
Builder.registerComponent(ProductInfo, {
  name: 'ProductInfo',
  inputs: [
    {
      name: 'product',
      type: 'object',
      helperText: 'Product data (automatically populated from Medusa)'
    }
  ],
  image: 'https://cdn.builder.io/api/v1/image/assets%2FYJIGb4i01jvw0SRdL5Bt%2Fproduct-info-icon',
  description: 'Product information display'
})

// Register ProductTabs component
Builder.registerComponent(ProductTabs, {
  name: 'ProductTabs',
  inputs: [
    {
      name: 'product',
      type: 'object',
      helperText: 'Product data (automatically populated from Medusa)'
    }
  ],
  image: 'https://cdn.builder.io/api/v1/image/assets%2FYJIGb4i01jvw0SRdL5Bt%2Fproduct-tabs-icon',
  description: 'Product tabs with description and additional info'
})

// Register RelatedProducts component
Builder.registerComponent(RelatedProducts, {
  name: 'RelatedProducts',
  inputs: [
    {
      name: 'product',
      type: 'object',
      helperText: 'Product data (automatically populated from Medusa)'
    },
    {
      name: 'countryCode',
      type: 'text',
      helperText: 'Country code for pricing'
    },
    {
      name: 'title',
      type: 'text',
      defaultValue: 'Related Products',
      helperText: 'Section title'
    }
  ],
  image: 'https://cdn.builder.io/api/v1/image/assets%2FYJIGb4i01jvw0SRdL5Bt%2Frelated-products-icon',
  description: 'Related products section'
})

// Register DynamicProductInfo component
Builder.registerComponent(DynamicProductInfo, {
  name: 'DynamicProductInfo',
  inputs: [
    {
      name: 'productHandle',
      type: 'text',
      helperText: 'Product handle (URL slug) to fetch from Medusa'
    },
    {
      name: 'productId',
      type: 'text',
      helperText: 'Product ID to fetch from Medusa (alternative to handle)'
    },
    {
      name: 'countryCode',
      type: 'text',
      required: true,
      defaultValue: 'us',
      helperText: 'Country code for pricing and region'
    }
  ],
  image: 'https://cdn.builder.io/api/v1/image/assets%2FYJIGb4i01jvw0SRdL5Bt%2Fdynamic-product-icon',
  description: 'Dynamic product info that fetches data from Medusa by handle or ID'
})

// Register a custom product content section
Builder.registerComponent(
  ({ children, className = "", backgroundColor, padding = "py-8" }: { 
    children: React.ReactNode
    className?: string
    backgroundColor?: string
    padding?: string
  }) => (
    <div 
      className={`content-container ${padding} ${className}`}
      style={{ backgroundColor }}
    >
      {children}
    </div>
  ),
  {
    name: 'ProductSection',
    inputs: [
      {
        name: 'backgroundColor',
        type: 'color',
        helperText: 'Section background color'
      },
      {
        name: 'padding',
        type: 'text',
        defaultValue: 'py-8',
        helperText: 'Tailwind padding classes (e.g., py-8, px-4)'
      },
      {
        name: 'className',
        type: 'text',
        helperText: 'Additional CSS classes'
      }
    ],
    canHaveChildren: true,
    defaultChildren: [
      {
        '@type': '@builder.io/sdk:Element',
        component: {
          name: 'Text',
          options: {
            text: 'Add your product content here'
          }
        }
      }
    ],
    image: 'https://cdn.builder.io/api/v1/image/assets%2FYJIGb4i01jvw0SRdL5Bt%2Fproduct-section-icon',
    description: 'A flexible section container for product pages'
  }
)

// Register a testimonials component for product pages
Builder.registerComponent(
  ({ testimonials = [], title = "What Our Customers Say" }: {
    testimonials: Array<{ name: string; text: string; rating?: number }>
    title: string
  }) => (
    <div className="py-12">
      <h2 className="text-2xl font-bold text-center mb-8">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((testimonial, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-gray-600 mb-4">"{testimonial.text}"</p>
            <div className="flex items-center">
              <div>
                <p className="font-semibold">{testimonial.name}</p>
                {testimonial.rating && (
                  <div className="flex text-yellow-400">
                    {Array.from({ length: testimonial.rating }, (_, i) => (
                      <span key={i}>★</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  ),
  {
    name: 'ProductTestimonials',
    inputs: [
      {
        name: 'title',
        type: 'text',
        defaultValue: 'What Our Customers Say',
        helperText: 'Section title'
      },
      {
        name: 'testimonials',
        type: 'list',
        subFields: [
          {
            name: 'name',
            type: 'text',
            required: true
          },
          {
            name: 'text',
            type: 'longText',
            required: true
          },
          {
            name: 'rating',
            type: 'number',
            min: 1,
            max: 5
          }
        ],
        defaultValue: [
          {
            name: 'John Doe',
            text: 'Amazing product! Highly recommended.',
            rating: 5
          }
        ]
      }
    ],
    image: 'https://cdn.builder.io/api/v1/image/assets%2FYJIGb4i01jvw0SRdL5Bt%2Ftestimonials-icon',
    description: 'Customer testimonials section'
  }
)

// Export a function to initialize all product components
export function initializeProductComponents() {
  console.log('Product components registered with Builder.io')
}