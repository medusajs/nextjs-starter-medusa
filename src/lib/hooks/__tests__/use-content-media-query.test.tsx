import { renderHook } from '@testing-library/react'
import { useContentMediaQuery } from '../use-content-media-query'

// Mock ResizeObserver
global.ResizeObserver = jest.fn(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

describe('useContentMediaQuery', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useContentMediaQuery())

    expect(result.current.contentWidth).toBe(0)
    expect(result.current.currentSize).toBe('xs')
    expect(result.current.semanticSize).toBe('mobile')
  })

  it('should provide containerRef', () => {
    const { result } = renderHook(() => useContentMediaQuery())

    expect(result.current.containerRef).toBeDefined()
    expect(result.current.containerRef.current).toBeNull()
  })

  it('should provide utility functions', () => {
    const { result } = renderHook(() => useContentMediaQuery())

    expect(typeof result.current.isAtLeast).toBe('function')
    expect(typeof result.current.isSize).toBe('function')
    expect(typeof result.current.isSemantic).toBe('function')
  })
})