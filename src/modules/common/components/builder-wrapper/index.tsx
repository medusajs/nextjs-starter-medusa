"use client"

import React, { ErrorBoundary } from 'react'
import { BuilderComponent, useIsPreviewing } from '@builder.io/react'
import type { BuilderContent } from '@lib/builder'

interface BuilderWrapperProps {
  model: string
  content: BuilderContent | null
  fallbackComponent?: React.ComponentType<any>
  fallbackProps?: Record<string, any>
  data?: Record<string, any>
  children?: React.ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

class BuilderErrorBoundary extends React.Component<
  { fallback: React.ComponentType<any>; fallbackProps?: any; children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: any) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Builder component error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      const { fallback: Fallback, fallbackProps = {} } = this.props
      return <Fallback {...fallbackProps} />
    }

    return this.props.children
  }
}

export default function BuilderWrapper({
  model,
  content,
  fallbackComponent: Fallback,
  fallbackProps = {},
  data = {},
  children
}: BuilderWrapperProps) {
  const isPreviewing = useIsPreviewing()

  // If no Builder content and not in preview mode, use fallback
  if (!content && !isPreviewing) {
    if (Fallback) {
      return <Fallback {...fallbackProps} />
    }
    
    // If no fallback component provided, render children or nothing
    return children ? <>{children}</> : null
  }

  // If we have content or are in preview mode, render Builder component
  return (
    <BuilderErrorBoundary fallback={Fallback || (() => children || null)} fallbackProps={fallbackProps}>
      <BuilderComponent 
        model={model} 
        content={content || undefined}
        data={data}
      />
    </BuilderErrorBoundary>
  )
}

// Hook for checking Builder preview state
export function useBuilderPreview() {
  const isPreviewing = useIsPreviewing()
  return isPreviewing
}

// Higher-order component for wrapping existing components with Builder support
export function withBuilderSupport<P extends Record<string, any>>(
  WrappedComponent: React.ComponentType<P>,
  builderConfig?: {
    model?: string
    dataMapper?: (props: P) => Record<string, any>
  }
) {
  return function BuilderEnhancedComponent(props: P & { 
    builderContent?: BuilderContent | null
    builderMode?: boolean 
  }) {
    const { builderContent, builderMode = false, ...componentProps } = props
    
    // If Builder mode is enabled and we have content, use Builder
    if (builderMode && builderContent && builderConfig?.model) {
      const builderData = builderConfig.dataMapper ? builderConfig.dataMapper(componentProps as P) : componentProps
      
      return (
        <BuilderWrapper
          model={builderConfig.model}
          content={builderContent}
          fallbackComponent={WrappedComponent}
          fallbackProps={componentProps}
          data={builderData}
        />
      )
    }
    
    // Otherwise, render the original component
    return <WrappedComponent {...(componentProps as P)} />
  }
}