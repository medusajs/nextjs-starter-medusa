const checkEnvVariables = require("./check-env-variables")
const nextIntl = require("next-intl/plugin")


checkEnvVariables()

/**
 * @type {import('next').NextConfig}
 */

const withNextIntl = nextIntl("./src/lib/i18n/request-config.js")

const configOpts = {
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

const nextConfig = withNextIntl(configOpts)

module.exports = nextConfig
