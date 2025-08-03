# 🔄 AI Workflows & History Navigation

## Overview

The Companion Panel System's **History Navigation** is specifically designed to enable complex AI-driven shopping workflows. Instead of linear modal interactions, users can navigate through sophisticated decision trees while maintaining complete context and the ability to backtrack through their journey.

## 🧠 History Navigation System

### How History Works

Every time a panel opens, the system intelligently manages the navigation stack:

1. **Current Panel → History**: When opening a new panel type, the current panel moves to history
2. **Same Type Updates**: Opening the same panel type updates data without adding to history
3. **Back Navigation**: Users can navigate back through the complete workflow
4. **Smart Cleanup**: History is limited to 10 items with automatic cleanup

### History State Structure

```typescript
interface HistoryState {
  panelHistory: PanelState[]     // Stack of previous panels
  canGoBack: boolean             // Whether back navigation is available
  historyCount: number           // Current stack depth (max 10)
}

// Example history progression
const workflowHistory = [
  // User journey: AI → Compare → Cart
  { type: 'ai-assistant', data: { query: 'gaming laptop' }, ... },
  { type: 'product-compare', data: { products: [...] }, ... },
  // Current: { type: 'cart', data: { selectedItem: ... }, ... }
]
```

### Navigation Methods

```typescript
const { goBack, canGoBack, historyCount, clearHistory } = useCompanionPanel()

// Navigate back one step
if (canGoBack) {
  goBack() // Returns to previous panel
}

// Clear history (useful after major actions)
clearHistory() // Keeps current panel, clears stack

// Check navigation state
console.log(`History depth: ${historyCount}, Can go back: ${canGoBack}`)
```

## 🤖 AI-Driven Workflow Patterns

### 1. Product Discovery Journey

**Flow**: AI Assistant → Product Compare → Cart → Checkout

```typescript
// 1. User starts with AI assistant
const startProductDiscovery = () => {
  openPanel('ai-assistant', {
    mode: 'product-discovery',
    userQuery: 'I need a laptop for work and gaming',
    context: {
      budget: '$1000-1500',
      usage: ['work', 'gaming'],
      preferences: ['performance', 'portability']
    }
  })
}

// 2. AI suggests products to compare
const suggestComparison = (recommendedProducts: Product[]) => {
  openPanel('product-compare', {
    products: recommendedProducts.map(p => p.id),
    source: 'ai-recommendation',
    aiReasoning: 'Based on your budget and gaming needs, these laptops offer the best value...',
    comparisonMatrix: {
      criteria: ['performance', 'price', 'reviews', 'features'],
      aiWeights: { performance: 0.4, price: 0.3, reviews: 0.2, features: 0.1 }
    }
  })
}

// 3. User selects product and adds to cart
const addSelectedToCart = (selectedProduct: Product) => {
  openPanel('cart', {
    newItem: selectedProduct,
    source: 'ai-workflow',
    workflowId: `ai-discovery-${Date.now()}`,
    aiContext: {
      confidence: 0.92,
      alternativeOptions: otherProducts,
      reasonForChoice: 'Best match for gaming performance within budget'
    }
  })
}

// History: cart ← compare ← ai-assistant
// User can navigate back through entire journey
```

### 2. Support Escalation Workflow

**Flow**: Help → AI Assistant → Human Chat → Cart (Assisted Purchase)

```typescript
// 1. User starts with general help
const startSupport = (topic: string) => {
  openPanel('help', {
    topic,
    source: 'user-initiated',
    userContext: {
      currentPage: window.location.pathname,
      cartItems: cart?.items?.length || 0,
      sessionDuration: getSessionDuration()
    }
  })
}

// 2. Help system escalates to AI for complex queries
const escalateToAI = (helpContext: any) => {
  openPanel('ai-assistant', {
    mode: 'support-escalation',
    previousContext: helpContext,
    escalationReason: 'complex-product-question',
    supportTier: 'ai-assistant'
  })
}

// 3. AI provides personalized assistance and recommends products
const aiAssistedPurchase = (recommendation: any) => {
  openPanel('cart', {
    aiRecommendation: recommendation,
    source: 'ai-support',
    assistanceLevel: 'high',
    userSatisfaction: 'pending' // Will be updated after purchase
  })
}
```

### 3. Comparison Shopping Workflow

**Flow**: Product Page → Compare → Wishlist → Cart

```typescript
// 1. User adds product to comparison from product page
const addToComparison = (product: Product) => {
  openPanel('product-compare', {
    products: [product.id],
    source: 'product-page',
    comparisonMode: 'single-start'
  })
}

// 2. User adds more products to comparison
const addMoreProducts = (additionalProducts: Product[]) => {
  // This updates the existing comparison panel (same type)
  openPanel('product-compare', {
    products: [...currentProducts, ...additionalProducts.map(p => p.id)],
    source: 'product-page',
    comparisonMode: 'multi-product'
  })
}

// 3. User saves some products to wishlist
const saveToWishlist = (selectedProducts: Product[]) => {
  openPanel('wishlist', {
    newItems: selectedProducts,
    source: 'product-compare',
    comparisonData: currentComparisonMatrix,
    saveReason: 'future-consideration'
  })
}

// 4. User adds final choice to cart
const finalizeChoice = (chosenProduct: Product) => {
  openPanel('cart', {
    newItem: chosenProduct,
    source: 'comparison-workflow',
    comparisonData: {
      alternativesConsidered: otherProducts.length,
      decisionFactors: ['price', 'reviews', 'features'],
      confidenceLevel: 'high'
    }
  })
}

// History: cart ← wishlist ← compare
```

## 🔄 Advanced Workflow Patterns

### Conditional Navigation
```typescript
// Smart workflow routing based on user context
const smartWorkflowNavigation = (userAction: string, context: any) => {
  switch (userAction) {
    case 'hesitant-purchase':
      // Show comparison to build confidence
      openPanel('product-compare', {
        products: [context.productId, ...getSimilarProducts(context.productId)],
        purpose: 'confidence-building',
        aiSuggestion: true
      })
      break
      
    case 'price-concern':
      // Show AI assistant for budget alternatives
      openPanel('ai-assistant', {
        mode: 'budget-optimization',
        targetProduct: context.productId,
        maxBudget: context.budget
      })
      break
      
    case 'feature-question':
      // Show help with product-specific context
      openPanel('help', {
        topic: 'product-features',
        productId: context.productId,
        specificQuestion: context.question
      })
      break
  }
}
```

### Workflow Analytics
```typescript
// Track complete user journeys
const trackWorkflowAnalytics = () => {
  const { currentPanel, panelHistory } = useCompanionPanel()
  
  useEffect(() => {
    if (currentPanel) {
      const workflow = {
        currentStep: currentPanel.type,
        journeyPath: panelHistory.map(p => p.type),
        totalSteps: panelHistory.length + 1,
        timeInWorkflow: Date.now() - (panelHistory[0]?.timestamp || Date.now()),
        workflowType: classifyWorkflow(panelHistory)
      }
      
      analytics.track('Workflow Step', workflow)
    }
  }, [currentPanel, panelHistory])
}

const classifyWorkflow = (history: PanelState[]): string => {
  const path = history.map(p => p.type).join(' → ')
  
  if (path.includes('ai-assistant → product-compare → cart')) {
    return 'ai-guided-purchase'
  } else if (path.includes('help → ai-assistant')) {
    return 'support-escalation'
  } else if (path.includes('product-compare → wishlist')) {
    return 'research-shopping'
  }
  
  return 'custom-workflow'
}
```

### Memory and Context Preservation
```typescript
// Preserve context across panel transitions
const contextualPanelData = {
  // User preferences persist across workflow
  userPreferences: {
    budget: '$500-1000',
    category: 'laptops',
    usage: 'gaming',
    brands: ['Apple', 'Dell', 'HP']
  },
  
  // Session context available to all panels
  sessionContext: {
    visitedProducts: ['prod1', 'prod2', 'prod3'],
    searchQueries: ['gaming laptop', 'budget laptop'],
    timeOnSite: getSessionDuration(),
    referralSource: 'google-search'
  },
  
  // AI conversation context
  aiContext: {
    conversationHistory: [...],
    userIntent: 'product-discovery',
    confidenceLevel: 0.87,
    nextSuggestedAction: 'product-compare'
  }
}

// Pass context between panels
const openContextualPanel = (type: PanelType, specificData: any) => {
  openPanel(type, {
    ...specificData,
    userContext: contextualPanelData.userPreferences,
    sessionContext: contextualPanelData.sessionContext,
    aiContext: contextualPanelData.aiContext
  })
}
```

## 🎯 Workflow Best Practices

### 1. Logical Progression
```typescript
// Good: Logical workflow progression
const goodWorkflow = () => {
  openPanel('ai-assistant')        // Start with help/discovery
  openPanel('product-compare')     // Compare options
  openPanel('cart')               // Make decision
  
  // User can navigate: cart ← compare ← ai-assistant
}

// Avoid: Random panel jumping
const avoidThis = () => {
  openPanel('cart')               // Starts with decision
  openPanel('help')               // Then seeks help (confusing)
  openPanel('ai-assistant')       // Then discovery (backwards)
}
```

### 2. Context-Rich Data
```typescript
// Good: Rich context for AI and analytics
openPanel('product-compare', {
  products: ['prod1', 'prod2'],
  source: 'ai-recommendation',
  userIntent: 'gaming-laptop-search',
  aiReasoning: 'Based on your performance needs...',
  comparisonCriteria: ['performance', 'price', 'reviews'],
  confidenceLevel: 0.92
})

// Avoid: Minimal context
openPanel('product-compare', {
  products: ['prod1', 'prod2'] // Missing valuable context
})
```

### 3. User Control
```typescript
// Always provide clear navigation options
const WorkflowNavigation = () => {
  const { canGoBack, goBack, currentPanel } = useCompanionPanel()
  
  return (
    <div className="panel-header">
      {canGoBack && (
        <button onClick={goBack}>
          ← Back to {getPreviousPanelName()}
        </button>
      )}
      
      <h2>{currentPanel?.title}</h2>
      
      <button onClick={closePanel}>✕</button>
    </div>
  )
}
```

### 4. Workflow Recovery
```typescript
// Handle interrupted workflows gracefully
const recoverWorkflow = () => {
  const savedWorkflow = localStorage.getItem('interrupted-workflow')
  
  if (savedWorkflow) {
    const { panelHistory, currentPanel } = JSON.parse(savedWorkflow)
    
    // Restore the workflow
    panelHistory.forEach((panel: PanelState) => {
      // Restore history step by step
    })
    
    openPanel(currentPanel.type, currentPanel.data)
  }
}
```

## 🚀 Advanced Features

### Panel Preloading
```typescript
// Preload likely next panels in workflow
const preloadWorkflowPanels = (currentType: PanelType) => {
  const likelyNext = {
    'ai-assistant': ['product-compare', 'help'],
    'product-compare': ['cart', 'wishlist'],
    'help': ['ai-assistant', 'cart']
  }
  
  likelyNext[currentType]?.forEach(panelType => {
    // Preload panel component
    import(`./panels/${panelType}-panel`)
  })
}
```

### Smart History Management
```typescript
// Intelligent history pruning
const smartHistoryManagement = () => {
  // Remove redundant entries
  const dedupedHistory = panelHistory.filter((panel, index) => {
    const nextPanel = panelHistory[index + 1]
    return !(nextPanel && panel.type === nextPanel.type)
  })
  
  // Keep only meaningful workflow steps
  const meaningfulHistory = dedupedHistory.filter(panel => {
    return !panel.data?.temporary && !panel.data?.skipHistory
  })
  
  return meaningfulHistory.slice(-10) // Keep last 10
}
```

---

## 🎉 **Workflow-Driven Commerce**

These workflow patterns transform traditional e-commerce from simple "add to cart" interactions into sophisticated, AI-guided shopping journeys that adapt to user needs and provide intelligent assistance throughout the purchase decision process.

**Next Steps:**
- [Panel Types](./panel-types.md) - Learn about available panel types
- [Custom Panels](../guides/custom-panels.md) - Build workflow-specific panels
- [Analytics Integration](../guides/analytics-integration.md) - Track complex workflows