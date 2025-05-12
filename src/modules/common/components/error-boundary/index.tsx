'use client'

import React, { ErrorInfo } from 'react'
import ErrorDisplay from '../error-display'

interface ErrorBoundaryProps {
  children: React.ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { 
      hasError: false,
      error: null
    }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return { 
      hasError: true,
      error: error
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // You can also log the error to an error reporting service
    console.error('Error boundary caught an error:', error, errorInfo)
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <ErrorDisplay 
          error={this.state.error?.message || 'An unknown error occurred'} 
          title="Something went wrong"
          message="We're sorry, but there was an error loading this page. Please try refreshing or come back later."
        />
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary 