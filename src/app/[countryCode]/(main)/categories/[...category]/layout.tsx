import React from "react"
import ErrorBoundary from "@modules/common/components/error-boundary"

export default function CategoriesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ErrorBoundary>
      {children}
    </ErrorBoundary>
  )
} 