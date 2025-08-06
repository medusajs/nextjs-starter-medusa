"use client"

import React from 'react'
import { BuilderComponent, useIsPreviewing } from '@builder.io/react'
import type { BuilderContent } from '@lib/builder'

interface BuilderWrapperClientProps {
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
  { fallback?: React.ComponentType<any>; fallbackProps?: any; children: React.ReactNode },
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
      if (Fallback) {
        return <Fallback {...fallbackProps} />
      }
      return <div>Something went wrong with the Builder component.</div>
    }

    return this.props.children
  }
}

export default function BuilderWrapperClient({
  model,
  content,
  fallbackComponent: Fallback,
  fallbackProps = {},
  data = {},
  children
}: BuilderWrapperClientProps) {
  const isPreviewing = useIsPreviewing()

  // If no Builder content and not in preview mode, use fallback or children
  if (!content && !isPreviewing) {
    if (Fallback) {
      return <Fallback {...fallbackProps} />
    }
    
    // If no fallback component provided, render children or nothing
    return children ? <>{children}</> : null
  }

  // If we have content or are in preview mode, render Builder component
  return (
    <BuilderErrorBoundary fallback={Fallback} fallbackProps={fallbackProps}>
      <BuilderComponent 
        model={model} 
        content={content || undefined}
        data={data}
      />
    </BuilderErrorBoundary>
  )
}