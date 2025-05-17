import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Products",
  description: "Explore our products.",
}

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex-1">
      {children}
    </div>
  )
} 