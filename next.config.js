const checkEnvVariables = require("./check-env-variables")

// Skip environment check during testing and build process
if (process.env.NODE_ENV !== 'test' && process.env.NODE_ENV !== 'production' && process.env.VERCEL !== '1') {
  checkEnvVariables()
}

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  experimental: {
    // Fix for React 19 with Next.js 15
    reactCompiler: false,
    // Fix for client reference manifest issues
    serverComponentsHmrCache: false,
    // Optimize static generation
    optimizePackageImports: ['@medusajs/ui', 'lucide-react'],
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "medusa-public-images.s3.eu-west-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "medusa-server-testing.s3.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "medusa-server-testing.s3.us-east-1.amazonaws.com",
      },
    ],
  },
}

module.exports = nextConfig
