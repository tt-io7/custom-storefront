'use client'

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { useParams } from "next/navigation"
import { ReactNode } from "react"

type LocalizedCategoryLinkProps = {
  categoryHandle: string
  children: ReactNode
  className?: string
}

/**
 * This component links to a category page using the next/link component and ensures the proper country code is included in the path
 */
const LocalizedCategoryLink = ({
  categoryHandle,
  children,
  className,
}: LocalizedCategoryLinkProps) => {
  const { countryCode } = useParams() as { countryCode: string }
  
  if (!categoryHandle) {
    return <span className={className}>{children}</span>
  }

  return (
    <LocalizedClientLink 
      href={`/categories/${categoryHandle}`} 
      className={className}
    >
      {children}
    </LocalizedClientLink>
  )
}

export default LocalizedCategoryLink 