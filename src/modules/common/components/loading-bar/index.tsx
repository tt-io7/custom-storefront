'use client'

import { useEffect, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

const LoadingBar = () => {
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Reset loading state when navigation completes
    setLoading(false)
    setProgress(100)
    
    const timer = setTimeout(() => {
      setProgress(0)
    }, 400)
    
    return () => clearTimeout(timer)
  }, [pathname, searchParams])
  
  useEffect(() => {
    if (!loading) return
    
    // Simulate progress increase
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(timer)
          return prev
        }
        return prev + 10
      })
    }, 200)
    
    return () => clearInterval(timer)
  }, [loading])
  
  // Start loading when user clicks a link (capture click events)
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const link = target.closest('a')
      
      if (link && 
          link.href && 
          !link.target && 
          !link.download && 
          !link.rel?.includes('external') &&
          link.href.startsWith(window.location.origin)) {
        setLoading(true)
        setProgress(10)
      }
    }
    
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  return (
    <div 
      className="h-1 bg-blue-500 transition-all duration-300 ease-out"
      style={{ 
        width: `${progress}%`,
        opacity: progress > 0 ? 1 : 0,
      }}
    />
  )
}

export default LoadingBar 