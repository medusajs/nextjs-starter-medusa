"use client"

import React from 'react'
import { useIsPreviewing } from '@builder.io/react'
import type { BuilderContent } from '@lib/builder'
import BuilderWrapper from './index'

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