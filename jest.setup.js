import '@testing-library/jest-dom'

// Set up test environment variables
process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY = 'test-publishable-key'
process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL = 'http://localhost:9000'

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
}

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor(callback) {
    this.callback = callback
  }
  observe() {}
  unobserve() {}
  disconnect() {}
}

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    }
  },
  useSearchParams() {
    return {
      get: jest.fn(),
    }
  },
  usePathname() {
    return '/test-path'
  },
}))

// Mock Medusa SDK
jest.mock('@medusajs/js-sdk', () => ({
  Medusa: jest.fn(() => ({
    store: {
      product: {
        list: jest.fn(),
        retrieve: jest.fn(),
      },
      cart: {
        create: jest.fn(),
        retrieve: jest.fn(),
        update: jest.fn(),
      },
    },
  })),
}))

// Suppress console errors in tests unless explicitly testing them
const originalError = console.error
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render is no longer supported')
    ) {
      return
    }
    originalError.call(console, ...args)
  }
})

afterAll(() => {
  console.error = originalError
})