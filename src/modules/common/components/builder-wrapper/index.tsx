import React from 'react'
import type { BuilderContent } from '@lib/builder'
import BuilderWrapperClient from './client'

interface BuilderWrapperProps {
  model: string
  content: BuilderContent | null
  fallbackComponent?: React.ComponentType<any>
  fallbackProps?: Record<string, any>
  data?: Record<string, any>
  children?: React.ReactNode
}

export default function BuilderWrapper({
  model,
  content,
  fallbackComponent: Fallback,
  fallbackProps = {},
  data = {},
  children
}: BuilderWrapperProps) {
  // Server-side logic: if no content and no fallback, render children
  if (!content && !Fallback && children) {
    return <>{children}</>
  }

  // Server-side logic: if no content and we have a fallback, render fallback
  if (!content && Fallback) {
    return <Fallback {...fallbackProps} />
  }

  // Pass everything to client component for Builder.io handling
  return (
    <BuilderWrapperClient
      model={model}
      content={content}
      fallbackComponent={Fallback}
      fallbackProps={fallbackProps}
      data={data}
    >
      {children}
    </BuilderWrapperClient>
  )
}

// Export client-side hook and HOC from client component
export { useBuilderPreview } from './client-utils'
export { withBuilderSupport } from './client-utils'