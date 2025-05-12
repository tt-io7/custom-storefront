'use client'

import React from 'react'

type ErrorDisplayProps = {
  error: string | Error
  title?: string
  message?: string
}

const ErrorDisplay = ({ 
  error, 
  title = "Unable to load products",
  message = "We're having trouble connecting to our product catalog. This might be due to temporary service interruption."
}: ErrorDisplayProps) => {
  const errorMessage = error instanceof Error ? error.message : error
  
  const handleRefresh = () => {
    window.location.reload()
  }
  
  return (
    <div className="flex flex-col items-center justify-center py-24">
      <h1 className="text-2xl-semi mb-4">{title}</h1>
      <p className="text-base-regular text-ui-fg-subtle text-center max-w-lg mb-8">
        {message}
      </p>
      <p className="text-small-regular text-ui-fg-subtle mb-4">
        Technical details: {errorMessage}
      </p>
      <button
        className="btn-ui"
        onClick={handleRefresh}
      >
        Try again
      </button>
    </div>
  )
}

export default ErrorDisplay 