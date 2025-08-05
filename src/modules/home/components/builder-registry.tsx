"use client"

import { Builder } from '@builder.io/react'
import dynamic from 'next/dynamic'

// Dynamically import components to avoid SSR issues
const Hero = dynamic(() => import('./hero'), { ssr: true })
const FeaturedProducts = dynamic(() => import('./featured-products'), { ssr: true })

// Register Hero component
Builder.registerComponent(Hero, {
  name: 'Hero',
  inputs: [
    {
      name: 'title',
      type: 'text',
      defaultValue: 'Ecommerce Starter Template',
      helperText: 'Main heading text'
    },
    {
      name: 'subtitle', 
      type: 'text',
      defaultValue: 'Powered by Medusa and Next.js',
      helperText: 'Subtitle text'
    },
    {
      name: 'ctaText',
      type: 'text', 
      defaultValue: 'View on GitHub',
      helperText: 'Call-to-action button text'
    },
    {
      name: 'ctaUrl',
      type: 'url',
      defaultValue: 'https://github.com/medusajs/nextjs-starter-medusa',
      helperText: 'Call-to-action button URL'
    },
    {
      name: 'backgroundColor',
      type: 'color',
      defaultValue: '#f8f9fa',
      helperText: 'Background color'
    }
  ],
  image: 'https://cdn.builder.io/api/v1/image/assets%2FYJIGb4i01jvw0SRdL5Bt%2F72c80f114dc149019051b6852a9e3b7a',
  description: 'Hero section for homepage'
})

// Register FeaturedProducts component
Builder.registerComponent(FeaturedProducts, {
  name: 'FeaturedProducts',
  inputs: [
    {
      name: 'collections',
      type: 'list',
      subFields: [
        {
          name: 'id',
          type: 'text'
        },
        {
          name: 'handle', 
          type: 'text'
        },
        {
          name: 'title',
          type: 'text'
        }
      ],
      helperText: 'Product collections to display (automatically populated from Medusa)'
    },
    {
      name: 'title',
      type: 'text',
      defaultValue: 'Featured Products',
      helperText: 'Section title'
    },
    {
      name: 'maxProducts',
      type: 'number',
      defaultValue: 4,
      helperText: 'Maximum number of products to show per collection'
    }
  ],
  image: 'https://cdn.builder.io/api/v1/image/assets%2FYJIGb4i01jvw0SRdL5Bt%2F8c2c2c2c2c2c2c2c2c2c2c2c',
  description: 'Featured products section'
})

// Register a custom section wrapper for better layout control
Builder.registerComponent(
  ({ children, className = "", backgroundColor, padding = "py-12" }: { 
    children: React.ReactNode
    className?: string
    backgroundColor?: string
    padding?: string
  }) => (
    <div 
      className={`${padding} ${className}`}
      style={{ backgroundColor }}
    >
      {children}
    </div>
  ),
  {
    name: 'Section',
    inputs: [
      {
        name: 'backgroundColor',
        type: 'color',
        helperText: 'Section background color'
      },
      {
        name: 'padding',
        type: 'text',
        defaultValue: 'py-12',
        helperText: 'Tailwind padding classes (e.g., py-12, px-4)'
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
            text: 'Add your content here'
          }
        }
      }
    ],
    image: 'https://cdn.builder.io/api/v1/image/assets%2FYJIGb4i01jvw0SRdL5Bt%2Fsection-icon',
    description: 'A flexible section container'
  }
)

// Export a function to initialize all components
export function initializeHomeComponents() {
  // Components are registered when this module loads
  console.log('Home components registered with Builder.io')
}