// Set NODE_ENV to test before any other modules load
// This ensures next.config.js skips environment validation during tests
process.env.NODE_ENV = 'test'

// Set up test environment variables early
process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY = 'test-publishable-key-12345'
process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL = 'http://localhost:9000'