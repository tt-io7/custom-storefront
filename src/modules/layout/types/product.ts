 export interface Money {
  amount: number
  currency_code: string
}

export interface Region {
  id: string
  name: string
  currency_code: string
  tax_rate: number
}

export interface ProductImage {
  id: string
  url: string
  alt?: string
}

export interface ProductOptionValue {
  id: string
  value: string
  option_id: string
}

export interface ProductOption {
  id: string
  title: string
  values: ProductOptionValue[]
}

export interface ProductVariant {
  id: string
  title: string
  sku: string | null
  price: Money
  compare_at_price?: Money
  inventory_quantity: number
  options: ProductOptionValue[]
  thumbnail?: string
}

export interface Product {
  id: string
  title: string
  handle: string
  description: string
  thumbnail: string
  images: ProductImage[]
  variants: ProductVariant[]
  options: ProductOption[]
  price: Money
  compare_at_price?: Money
  created_at: string
  updated_at: string
  metadata?: Record<string, unknown>
}

export interface LineItem {
  id: string
  title: string
  variant_id: string
  quantity: number
  unit_price: number
  thumbnail?: string
}

export interface Cart {
  id: string
  items: LineItem[]
  total: number
  subtotal: number
  discount_total: number
  shipping_total: number
  tax_total: number
}

export interface ProductCardProps {
  product: Product
  onQuickView?: (product: Product) => void
  onAddToWishlist?: (product: Product) => void
}

export interface ProductGridProps {
  products: Product[]
  loading?: boolean
  columns?: number
  gap?: number
}

export interface ProductFiltersProps {
  filters: {
    name: string
    options: string[]
  }[]
  selectedFilters: Record<string, string[]>
  onFilterChange: (name: string, value: string[]) => void
}