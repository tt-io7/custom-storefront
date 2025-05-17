const checkEnvVariables = require("./check-env-variables")

checkEnvVariables()

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
  env: {
    NEXT_PUBLIC_MEDUSA_BACKEND_URL: process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "https://backend-production-1aec.up.railway.app",
    MEDUSA_BACKEND_URL: process.env.MEDUSA_BACKEND_URL || process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "https://backend-production-1aec.up.railway.app",
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
      {
        protocol: "https",
        hostname: "backend-production-1aec.up.railway.app",
      },
      {
        protocol: "https",
        hostname: "**.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "**.railway.app",
      },
    ],
  },
  // Increase timeout for static generation
  staticPageGenerationTimeout: 180,
  // Add error handling for runtime errors
  onDemandEntries: {
    // Keep in memory for longer between builds
    maxInactiveAge: 25 * 1000,
    // Number of pages to keep in memory
    pagesBufferLength: 5,
  },
}

// Skip static generation during Docker build
if (process.env.SKIP_BUILD_PRODUCT_FETCH === "true") {
  nextConfig.staticPageGenerationTimeout = 1
  nextConfig.output = "standalone"
}

module.exports = nextConfig
