import { Metadata } from "next"
import { notFound, redirect } from "next/navigation"
import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import ProductTemplate from "@modules/products/templates"

type Props = {
  params: { handle: string }
}

// Force dynamic rendering for this page
export const dynamic = "force-dynamic"
export const fetchCache = "default-no-store"
export const revalidate = 0

export async function generateMetadata(props: Props): Promise<Metadata> {
  try {
    const { handle } = props.params
    // Default to "us" for region compatibility
    const countryCode = "us"
    const region = await getRegion(countryCode)

    if (!region) {
      return {
        title: "Product | Medusa Store",
        description: "Product not found",
      }
    }

    const product = await listProducts({
      countryCode,
      queryParams: { handle },
    }).then(({ response }) => response.products[0])

    if (!product) {
      return {
        title: "Product | Medusa Store",
        description: "Product not found",
      }
    }

    return {
      title: `${product.title} | Medusa Store`,
      description: `${product.title}`,
      openGraph: {
        title: `${product.title} | Medusa Store`,
        description: `${product.title}`,
        images: product.thumbnail ? [product.thumbnail] : [],
      },
    }
  } catch (error) {
    console.error("Error generating metadata for product:", error)
    return {
      title: "Product | Medusa Store",
      description: "Product details",
    }
  }
}

export default function ProductPage(props: Props) {
  const { handle } = props.params
  // Redirect to the country code version
  redirect(`/dk/products/${handle}`)
} 