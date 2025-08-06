# ⚡ Performance Guide

## Overview

The Companion Panel System is designed for optimal performance across all device types. This guide covers performance optimization strategies, monitoring techniques, and best practices for maintaining high performance in production environments.

## 🎯 Performance Goals

### Target Metrics
- **Panel Opening**: < 150ms
- **Navigation Between Panels**: < 100ms
- **Memory Usage**: < 50MB for full system
- **Bundle Size**: < 100KB (gzipped)
- **First Contentful Paint**: < 1.2s
- **Cumulative Layout Shift**: < 0.1

## 🏗️ Architecture Optimizations

### 1. Component Lazy Loading

```typescript
// Lazy load heavy panel components
const AICompanionPanel = lazy(() => import('./panels/AICompanionPanel'))
const ProductComparePanel = lazy(() => import('./panels/ProductComparePanel'))
const ReviewsPanel = lazy(() => import('./panels/ReviewsPanel'))

// Panel renderer with suspense
const PanelRenderer = () => {
  const { currentPanel } = useCompanionPanel()
  
  if (!currentPanel) return null

  const renderPanel = () => {
    switch (currentPanel.type) {
      case 'ai-assistant':
        return (
          <Suspense fallback={<PanelSkeleton />}>
            <AICompanionPanel data={currentPanel.data} />
          </Suspense>
        )
      case 'product-compare':
        return (
          <Suspense fallback={<PanelSkeleton />}>
            <ProductComparePanel data={currentPanel.data} />
          </Suspense>
        )
      case 'reviews':
        return (
          <Suspense fallback={<PanelSkeleton />}>
            <ReviewsPanel data={currentPanel.data} />
          </Suspense>
        )
      default:
        return <DefaultPanel data={currentPanel.data} />
    }
  }

  return (
    <ErrorBoundary fallback={<PanelErrorFallback />}>
      {renderPanel()}
    </ErrorBoundary>
  )
}
```

### 2. State Management Optimization

```typescript
// Optimized context with selective subscriptions
interface CompanionPanelContextOptimized {
  // Core state (always subscribed)
  isOpen: boolean
  currentPanel: PanelState | null
  
  // Optional subscriptions
  subscriptions: {
    history: boolean
    analytics: boolean
    chatSystem: boolean
  }
}

// Selective subscription hook
const useCompanionPanelSelective = <T>(
  selector: (state: CompanionPanelContextType) => T,
  equalityFn?: (prev: T, next: T) => boolean
): T => {
  const context = useContext(CompanionPanelContext)
  
  return useMemo(
    () => selector(context),
    [context, selector]
  )
}

// Usage example - only re-render when panel type changes
const PanelHeader = () => {
  const panelType = useCompanionPanelSelective(
    state => state.currentPanel?.type,
    (prev, next) => prev === next
  )
  
  return <h2>{getPanelTitle(panelType)}</h2>
}
```

### 3. Memory Management

```typescript
// Memory-efficient panel history
class PanelHistoryManager {
  private history: PanelState[] = []
  private readonly maxHistorySize = 10
  private readonly compressionThreshold = 5

  addToHistory(panel: PanelState): void {
    // Compress old entries
    if (this.history.length >= this.compressionThreshold) {
      this.compressHistory()
    }

    this.history.push(panel)

    // Trim to max size
    if (this.history.length > this.maxHistorySize) {
      this.history = this.history.slice(-this.maxHistorySize)
    }
  }

  private compressHistory(): void {
    // Remove large data objects from old entries
    this.history = this.history.map((panel, index) => {
      if (index < this.history.length - 3) {
        return {
          ...panel,
          data: this.compressData(panel.data)
        }
      }
      return panel
    })
  }

  private compressData(data: any): any {
    if (!data) return data
    
    // Keep only essential fields for history navigation
    return {
      id: data.id,
      type: data.type,
      timestamp: data.timestamp,
      // Remove heavy objects like images, large arrays, etc.
    }
  }

  getHistory(): PanelState[] {
    return [...this.history]
  }

  clearHistory(): void {
    this.history = []
  }
}
```

### 4. Render Optimization

```typescript
// Optimized panel wrapper with memoization
const PanelWrapper = memo<{
  panel: PanelState
  onClose: () => void
  onBack: () => void
}>(({ panel, onClose, onBack }) => {
  // Memoize expensive calculations
  const panelConfig = useMemo(
    () => getPanelConfiguration(panel.type),
    [panel.type]
  )

  // Memoize event handlers
  const handleClose = useCallback(() => {
    // Cleanup panel resources
    cleanupPanelResources(panel.type)
    onClose()
  }, [panel.type, onClose])

  const handleBack = useCallback(() => {
    onBack()
  }, [onBack])

  return (
    <div className={`panel panel-${panel.type}`}>
      <PanelHeader
        title={panel.title}
        config={panelConfig}
        onClose={handleClose}
        onBack={handleBack}
      />
      <PanelContent panel={panel} />
    </div>
  )
}, (prevProps, nextProps) => {
  // Custom comparison for optimal re-renders
  return (
    prevProps.panel.type === nextProps.panel.type &&
    prevProps.panel.timestamp === nextProps.panel.timestamp &&
    JSON.stringify(prevProps.panel.data) === JSON.stringify(nextProps.panel.data)
  )
})
```

## 🚀 Loading Performance

### 1. Code Splitting Strategy

```typescript
// Dynamic imports with prefetching
const prefetchPanelComponent = (panelType: PanelType) => {
  switch (panelType) {
    case 'ai-assistant':
      return import('./panels/AICompanionPanel')
    case 'product-compare':
      return import('./panels/ProductComparePanel')
    case 'reviews':
      return import('./panels/ReviewsPanel')
    default:
      return Promise.resolve(null)
  }
}

// Prefetch likely panels based on user behavior
const usePanelPrefetching = () => {
  const { currentPanel } = useCompanionPanel()

  useEffect(() => {
    if (currentPanel?.type === 'cart') {
      // Users often go from cart to product comparison
      prefetchPanelComponent('product-compare')
    } else if (currentPanel?.type === 'filter') {
      // Users often go from filter to AI assistance
      prefetchPanelComponent('ai-assistant')
    }
  }, [currentPanel?.type])
}
```

### 2. Bundle Optimization

```javascript
// webpack.config.js optimizations
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        // Separate companion panel system
        companionPanel: {
          test: /[\\/]src[\\/]lib[\\/]context[\\/]companion-panel/,
          name: 'companion-panel',
          chunks: 'all',
          priority: 20
        },
        // Separate heavy dependencies
        aiLibs: {
          test: /[\\/]node_modules[\\/](openai|langchain)/,
          name: 'ai-libs',
          chunks: 'async',
          priority: 15
        }
      }
    }
  }
}
```

### 3. Asset Optimization

```typescript
// Image optimization for panel content
const OptimizedImage = ({ src, alt, ...props }) => {
  const [imageSrc, setImageSrc] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const img = new Image()
    img.onload = () => {
      setImageSrc(src)
      setIsLoading(false)
    }
    img.src = src
  }, [src])

  if (isLoading) {
    return <ImageSkeleton {...props} />
  }

  return (
    <img
      src={imageSrc}
      alt={alt}
      loading="lazy"
      decoding="async"
      {...props}
    />
  )
}

// Progressive enhancement for panel features
const ProgressivePanel = ({ children, fallback }) => {
  const [isEnhanced, setIsEnhanced] = useState(false)

  useEffect(() => {
    // Enable enhancements after initial render
    const timer = setTimeout(() => setIsEnhanced(true), 100)
    return () => clearTimeout(timer)
  }, [])

  return isEnhanced ? children : fallback
}
```

## 📊 Performance Monitoring

### 1. Real-time Metrics

```typescript
interface PerformanceMetrics {
  panelOpenTime: number
  renderTime: number
  memoryUsage: number
  bundleSize: number
  errorRate: number
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics[] = []
  private observer: PerformanceObserver

  constructor() {
    this.setupObserver()
  }

  private setupObserver(): void {
    if (typeof PerformanceObserver !== 'undefined') {
      this.observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.recordMetric(entry)
        }
      })

      this.observer.observe({ entryTypes: ['measure', 'navigation'] })
    }
  }

  markPanelOpen(panelType: string): void {
    performance.mark(`panel-${panelType}-start`)
  }

  markPanelReady(panelType: string): void {
    performance.mark(`panel-${panelType}-end`)
    performance.measure(
      `panel-${panelType}-duration`,
      `panel-${panelType}-start`,
      `panel-${panelType}-end`
    )
  }

  private recordMetric(entry: PerformanceEntry): void {
    if (entry.name.includes('panel') && entry.entryType === 'measure') {
      const metric = {
        name: entry.name,
        duration: entry.duration,
        timestamp: Date.now()
      }
      
      this.metrics.push(metric)
      this.sendToAnalytics(metric)
    }
  }

  private sendToAnalytics(metric: any): void {
    // Send to your analytics service
    if (typeof gtag !== 'undefined') {
      gtag('event', 'performance_metric', {
        metric_name: metric.name,
        metric_value: metric.duration,
        custom_map: { metric_type: 'panel_performance' }
      })
    }
  }

  getMetrics(): PerformanceMetrics[] {
    return [...this.metrics]
  }

  getAverageOpenTime(): number {
    const openTimes = this.metrics
      .filter(m => m.name.includes('duration'))
      .map(m => m.duration)
    
    return openTimes.length > 0
      ? openTimes.reduce((sum, time) => sum + time, 0) / openTimes.length
      : 0
  }
}

export const performanceMonitor = new PerformanceMonitor()
```

### 2. Component Performance Profiling

```typescript
// HOC for performance profiling
const withPerformanceTracking = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  componentName: string
) => {
  return React.forwardRef<any, P>((props, ref) => {
    const renderStartTime = useRef<number>()
    const [renderCount, setRenderCount] = useState(0)

    // Track render start
    renderStartTime.current = performance.now()

    useEffect(() => {
      // Track render completion
      const renderTime = performance.now() - (renderStartTime.current || 0)
      setRenderCount(prev => prev + 1)

      if (renderTime > 16) { // Flag slow renders (>1 frame)
        console.warn(`Slow render detected in ${componentName}: ${renderTime}ms`)
      }

      // Log to performance monitoring
      performanceMonitor.recordRender(componentName, renderTime, renderCount)
    })

    return <WrappedComponent ref={ref} {...props} />
  })
}

// Usage
const OptimizedCartPanel = withPerformanceTracking(CartPanel, 'CartPanel')
```

### 3. Memory Usage Tracking

```typescript
class MemoryMonitor {
  private measurements: Array<{
    timestamp: number
    heapUsed: number
    heapTotal: number
    external: number
  }> = []

  startMonitoring(): void {
    setInterval(() => {
      this.recordMemoryUsage()
    }, 5000) // Every 5 seconds
  }

  private recordMemoryUsage(): void {
    if ('memory' in performance) {
      const memory = (performance as any).memory
      
      this.measurements.push({
        timestamp: Date.now(),
        heapUsed: memory.usedJSHeapSize,
        heapTotal: memory.totalJSHeapSize,
        external: memory.totalJSHeapSize - memory.usedJSHeapSize
      })

      // Keep only last 100 measurements
      if (this.measurements.length > 100) {
        this.measurements = this.measurements.slice(-100)
      }

      // Alert if memory usage is high
      const usagePercent = memory.usedJSHeapSize / memory.totalJSHeapSize
      if (usagePercent > 0.9) {
        console.warn('High memory usage detected:', usagePercent * 100, '%')
        this.triggerGarbageCollection()
      }
    }
  }

  private triggerGarbageCollection(): void {
    // Cleanup strategies
    this.clearOldPanelData()
    this.compressHistoryData()
    
    // Force garbage collection in development
    if (process.env.NODE_ENV === 'development' && 'gc' in window) {
      (window as any).gc()
    }
  }

  private clearOldPanelData(): void {
    // Implementation depends on your state management
    // Clear cached data, compressed images, etc.
  }

  private compressHistoryData(): void {
    // Compress or remove old history entries
  }

  getMemoryStats() {
    if (this.measurements.length === 0) return null

    const latest = this.measurements[this.measurements.length - 1]
    const avg = this.measurements.reduce(
      (sum, m) => sum + m.heapUsed, 0
    ) / this.measurements.length

    return {
      current: latest.heapUsed,
      average: avg,
      peak: Math.max(...this.measurements.map(m => m.heapUsed)),
      trend: this.calculateTrend()
    }
  }

  private calculateTrend(): 'increasing' | 'decreasing' | 'stable' {
    if (this.measurements.length < 10) return 'stable'

    const recent = this.measurements.slice(-10)
    const older = this.measurements.slice(-20, -10)

    const recentAvg = recent.reduce((sum, m) => sum + m.heapUsed, 0) / recent.length
    const olderAvg = older.reduce((sum, m) => sum + m.heapUsed, 0) / older.length

    const diff = recentAvg - olderAvg
    const threshold = olderAvg * 0.1 // 10% threshold

    if (diff > threshold) return 'increasing'
    if (diff < -threshold) return 'decreasing'
    return 'stable'
  }
}

export const memoryMonitor = new MemoryMonitor()
```

## 🎨 UI Performance

### 1. Animation Optimization

```typescript
// Hardware-accelerated animations
const slideInAnimation = {
  initial: { x: '100%', opacity: 0 },
  animate: { 
    x: 0, 
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30,
      mass: 0.8
    }
  },
  exit: { 
    x: '100%', 
    opacity: 0,
    transition: { duration: 0.2 }
  }
}

// Optimized panel animations
const AnimatedPanel = ({ children, isVisible }) => {
  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          variants={slideInAnimation}
          initial="initial"
          animate="animate"
          exit="exit"
          style={{
            // Force hardware acceleration
            transform: 'translateZ(0)',
            willChange: 'transform, opacity'
          }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
```

### 2. Virtualization for Large Lists

```typescript
// Virtual scrolling for large product lists
import { FixedSizeList as List } from 'react-window'

const VirtualizedProductList = ({ products, itemHeight = 120 }) => {
  const listRef = useRef()

  const ProductItem = memo(({ index, style }) => {
    const product = products[index]
    
    return (
      <div style={style}>
        <ProductCard product={product} />
      </div>
    )
  })

  return (
    <List
      ref={listRef}
      height={400}
      itemCount={products.length}
      itemSize={itemHeight}
      itemData={products}
      overscanCount={5} // Render 5 extra items for smooth scrolling
    >
      {ProductItem}
    </List>
  )
}
```

### 3. Intersection Observer for Lazy Loading

```typescript
// Lazy loading hook with intersection observer
const useLazyLoad = (threshold = 0.1) => {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [threshold])

  return [ref, isVisible] as const
}

// Usage in components
const LazyPanel = ({ children }) => {
  const [ref, isVisible] = useLazyLoad()

  return (
    <div ref={ref}>
      {isVisible ? children : <PanelSkeleton />}
    </div>
  )
}
```

## 📱 Mobile Performance

### 1. Touch Optimization

```typescript
// Optimized touch handlers
const useTouchOptimized = () => {
  const [touchState, setTouchState] = useState({
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
    isDragging: false
  })

  const handleTouchStart = useCallback((e: TouchEvent) => {
    const touch = e.touches[0]
    setTouchState(prev => ({
      ...prev,
      startX: touch.clientX,
      startY: touch.clientY,
      currentX: touch.clientX,
      currentY: touch.clientY,
      isDragging: true
    }))
  }, [])

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!touchState.isDragging) return
    
    const touch = e.touches[0]
    setTouchState(prev => ({
      ...prev,
      currentX: touch.clientX,
      currentY: touch.clientY
    }))
  }, [touchState.isDragging])

  const handleTouchEnd = useCallback(() => {
    setTouchState(prev => ({
      ...prev,
      isDragging: false
    }))
  }, [])

  return {
    touchState,
    touchHandlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd
    }
  }
}
```

### 2. Responsive Loading

```typescript
// Device-aware loading strategy
const useDeviceOptimization = () => {
  const [deviceInfo, setDeviceInfo] = useState({
    isMobile: false,
    isLowEnd: false,
    connectionType: 'unknown'
  })

  useEffect(() => {
    const updateDeviceInfo = () => {
      const isMobile = window.innerWidth < 768
      
      // Detect low-end devices
      const isLowEnd = 'deviceMemory' in navigator 
        ? (navigator as any).deviceMemory < 4
        : false

      // Detect connection type
      const connection = (navigator as any).connection
      const connectionType = connection?.effectiveType || 'unknown'

      setDeviceInfo({ isMobile, isLowEnd, connectionType })
    }

    updateDeviceInfo()
    window.addEventListener('resize', updateDeviceInfo)
    
    return () => window.removeEventListener('resize', updateDeviceInfo)
  }, [])

  return deviceInfo
}

// Adaptive component loading
const AdaptivePanel = ({ panelType, data }) => {
  const { isLowEnd, connectionType } = useDeviceOptimization()

  // Use simplified components for low-end devices
  if (isLowEnd || connectionType === 'slow-2g') {
    return <SimplifiedPanel panelType={panelType} data={data} />
  }

  return <FullFeaturedPanel panelType={panelType} data={data} />
}
```

## 🔧 Development Tools

### 1. Performance DevTools

```typescript
// Development performance overlay
const PerformanceOverlay = () => {
  const [metrics, setMetrics] = useState(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const interval = setInterval(() => {
        setMetrics({
          memory: memoryMonitor.getMemoryStats(),
          performance: performanceMonitor.getMetrics(),
          renders: getRenderCount()
        })
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [])

  if (process.env.NODE_ENV !== 'development' || !isVisible) {
    return (
      <button 
        className="fixed bottom-4 right-4 bg-blue-500 text-white p-2 rounded"
        onClick={() => setIsVisible(true)}
      >
        📊
      </button>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded max-w-sm">
      <div className="flex justify-between items-center mb-2">
        <h3>Performance</h3>
        <button onClick={() => setIsVisible(false)}>×</button>
      </div>
      
      {metrics && (
        <div className="text-xs space-y-1">
          <div>Memory: {(metrics.memory?.current / 1024 / 1024).toFixed(1)}MB</div>
          <div>Avg Panel Open: {metrics.performance?.avgOpenTime?.toFixed(1)}ms</div>
          <div>Renders: {metrics.renders}</div>
        </div>
      )}
    </div>
  )
}
```

### 2. Performance Testing

```typescript
// Performance test utilities
export const performanceTestUtils = {
  measurePanelOpen: async (panelType: string) => {
    const start = performance.now()
    
    // Simulate panel opening
    await new Promise(resolve => {
      const { openPanel } = useCompanionPanel()
      openPanel(panelType)
      requestAnimationFrame(resolve)
    })
    
    const end = performance.now()
    return end - start
  },

  stressTest: async (iterations: number = 100) => {
    const results = []
    
    for (let i = 0; i < iterations; i++) {
      const time = await this.measurePanelOpen('cart')
      results.push(time)
    }
    
    return {
      average: results.reduce((sum, time) => sum + time, 0) / results.length,
      min: Math.min(...results),
      max: Math.max(...results),
      p95: results.sort((a, b) => a - b)[Math.floor(results.length * 0.95)]
    }
  }
}
```

## 📋 Best Practices

### 1. Code Optimization
- Use React.memo for expensive components
- Implement proper dependency arrays in hooks
- Avoid inline object creation in render methods
- Use callback memoization for event handlers
- Implement code splitting for large features

### 2. Asset Management
- Optimize images with next/image
- Use WebP format when supported
- Implement progressive loading
- Minimize bundle sizes with tree shaking
- Use CDN for static assets

### 3. Runtime Optimization
- Monitor memory usage continuously
- Implement cleanup in useEffect hooks
- Use intersection observers for lazy loading
- Optimize animations for 60fps
- Profile components regularly

### 4. Monitoring
- Set up performance budgets
- Monitor Core Web Vitals
- Track error rates and performance correlation
- Use real user monitoring (RUM)
- Regular performance audits

## 🚀 Future Optimizations

### Planned Improvements
- Service worker implementation for offline support
- Advanced caching strategies
- Predictive prefetching based on user behavior
- WebAssembly for heavy computations
- Edge computing integration for faster response times