"use client"

import { Builder } from '@builder.io/react'
import dynamic from 'next/dynamic'

// Dynamically import components to avoid SSR issues
const FilteredProductsContainer = dynamic(() => import('./filtered-products-container'), { ssr: true })

// Register FilteredProductsContainer component
Builder.registerComponent(FilteredProductsContainer, {
  name: 'FilteredProductsContainer',
  inputs: [
    {
      name: 'sortBy',
      type: 'text',
      defaultValue: 'created_at',
      helperText: 'Sort products by field'
    },
    {
      name: 'page',
      type: 'number',
      defaultValue: 1,
      helperText: 'Current page number'
    },
    {
      name: 'countryCode',
      type: 'text',
      helperText: 'Country code for pricing (automatically populated)'
    },
    {
      name: 'title',
      type: 'text',
      defaultValue: 'All products',
      helperText: 'Section title'
    },
    {
      name: 'searchParams',
      type: 'object',
      helperText: 'Search and filter parameters (automatically populated)'
    }
  ],
  image: 'https://cdn.builder.io/api/v1/image/assets%2FYJIGb4i01jvw0SRdL5Bt%2Fproduct-grid-icon',
  description: 'Filtered products grid with search and pagination'
})

// Register a store banner component
Builder.registerComponent(
  ({ title, subtitle, backgroundImage, backgroundColor, textColor = "#ffffff" }: {
    title: string
    subtitle?: string
    backgroundImage?: string
    backgroundColor?: string
    textColor?: string
  }) => (
    <div 
      className="relative h-64 md:h-80 flex items-center justify-center"
      style={{ 
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
        backgroundColor: backgroundColor || '#f3f4f6',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {backgroundImage && (
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      )}
      <div className="relative z-10 text-center px-4">
        <h1 
          className="text-4xl md:text-6xl font-bold mb-4"
          style={{ color: textColor }}
        >
          {title}
        </h1>
        {subtitle && (
          <p 
            className="text-lg md:text-xl"
            style={{ color: textColor }}
          >
            {subtitle}
          </p>
        )}
      </div>
    </div>
  ),
  {
    name: 'StoreBanner',
    inputs: [
      {
        name: 'title',
        type: 'text',
        required: true,
        defaultValue: 'Our Store',
        helperText: 'Main banner title'
      },
      {
        name: 'subtitle',
        type: 'text',
        helperText: 'Optional subtitle text'
      },
      {
        name: 'backgroundImage',
        type: 'file',
        allowedFileTypes: ['jpeg', 'jpg', 'png', 'svg', 'webp'],
        helperText: 'Background image for the banner'
      },
      {
        name: 'backgroundColor',
        type: 'color',
        defaultValue: '#f3f4f6',
        helperText: 'Background color (used if no image is provided)'
      },
      {
        name: 'textColor',
        type: 'color',
        defaultValue: '#ffffff',
        helperText: 'Text color'
      }
    ],
    image: 'https://cdn.builder.io/api/v1/image/assets%2FYJIGb4i01jvw0SRdL5Bt%2Fstore-banner-icon',
    description: 'Store page banner with customizable background and text'
  }
)

// Register a category showcase component
Builder.registerComponent(
  ({ categories = [], title = "Shop by Category" }: {
    categories: Array<{ name: string; image: string; handle: string }>
    title: string
  }) => (
    <div className="py-12">
      <h2 className="text-3xl font-bold text-center mb-8">{title}</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categories.map((category, index) => (
          <a 
            key={index}
            href={`/collections/${category.handle}`}
            className="group block"
          >
            <div className="aspect-square relative overflow-hidden rounded-lg bg-gray-100">
              {category.image && (
                <img 
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              )}
              <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-40 transition-all duration-300"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <h3 className="text-white text-lg font-semibold text-center px-2">
                  {category.name}
                </h3>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  ),
  {
    name: 'CategoryShowcase',
    inputs: [
      {
        name: 'title',
        type: 'text',
        defaultValue: 'Shop by Category',
        helperText: 'Section title'
      },
      {
        name: 'categories',
        type: 'list',
        subFields: [
          {
            name: 'name',
            type: 'text',
            required: true
          },
          {
            name: 'handle',
            type: 'text',
            required: true,
            helperText: 'URL handle for the category'
          },
          {
            name: 'image',
            type: 'file',
            allowedFileTypes: ['jpeg', 'jpg', 'png', 'svg', 'webp']
          }
        ],
        defaultValue: [
          {
            name: 'Electronics',
            handle: 'electronics',
            image: ''
          }
        ]
      }
    ],
    image: 'https://cdn.builder.io/api/v1/image/assets%2FYJIGb4i01jvw0SRdL5Bt%2Fcategory-showcase-icon',
    description: 'Category showcase grid'
  }
)

// Register a promotional section component
Builder.registerComponent(
  ({ title, description, ctaText, ctaUrl, backgroundImage, backgroundColor = "#f9fafb" }: {
    title: string
    description?: string
    ctaText?: string
    ctaUrl?: string
    backgroundImage?: string
    backgroundColor?: string
  }) => (
    <div 
      className="relative py-16 px-4"
      style={{ 
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
        backgroundColor: backgroundColor,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {backgroundImage && (
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
      )}
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
          {title}
        </h2>
        {description && (
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            {description}
          </p>
        )}
        {ctaText && ctaUrl && (
          <a 
            href={ctaUrl}
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            {ctaText}
          </a>
        )}
      </div>
    </div>
  ),
  {
    name: 'PromotionalSection',
    inputs: [
      {
        name: 'title',
        type: 'text',
        required: true,
        defaultValue: 'Special Offer',
        helperText: 'Main promotional title'
      },
      {
        name: 'description',
        type: 'longText',
        helperText: 'Promotional description text'
      },
      {
        name: 'ctaText',
        type: 'text',
        helperText: 'Call-to-action button text'
      },
      {
        name: 'ctaUrl',
        type: 'url',
        helperText: 'Call-to-action button URL'
      },
      {
        name: 'backgroundImage',
        type: 'file',
        allowedFileTypes: ['jpeg', 'jpg', 'png', 'svg', 'webp'],
        helperText: 'Background image'
      },
      {
        name: 'backgroundColor',
        type: 'color',
        defaultValue: '#f9fafb',
        helperText: 'Background color (used if no image is provided)'
      }
    ],
    image: 'https://cdn.builder.io/api/v1/image/assets%2FYJIGb4i01jvw0SRdL5Bt%2Fpromotional-section-icon',
    description: 'Promotional section with customizable content and CTA'
  }
)

// Export a function to initialize all store components
export function initializeStoreComponents() {
  console.log('Store components registered with Builder.io')
}