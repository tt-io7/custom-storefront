import { Metadata } from "next"
import { notFound } from "next/navigation"
import { listProducts } from "@lib/data/products"
import { getRegion, listRegions } from "@lib/data/regions"
import ProductTemplate from "@modules/products/templates"

type Props = {
  params: Promise<{ countryCode: string; handle: string }>
}

// Force dynamic rendering for this page
export const dynamic = "force-dynamic"
export const fetchCache = "default-no-store"
export const revalidate = 0

export async function generateMetadata(props: Props): Promise<Metadata> {
  try {
    const params = await props.params
    const { handle } = params
    const region = await getRegion(params.countryCode)

    if (!region) {
      return {
        title: "Product | Medusa Store",
        description: "Product not found",
      }
    }

    const product = await listProducts({
      countryCode: params.countryCode,
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

export default async function ProductPage(props: Props) {
  try {
    const params = await props.params
    
    // Use a fallback region if we can't get the actual one
    let region = null
    try {
      region = await getRegion(params.countryCode)
    } catch (error) {
      console.error("Error fetching region:", error)
    }
    
    if (!region) {
      console.log("Region not found, using fallback display")
      return (
        <div className="flex flex-col items-center justify-center py-24">
          <h1 className="text-2xl font-bold">Product not available</h1>
          <p className="text-gray-500 mt-4">
            Please check back later when we can connect to the Medusa backend.
          </p>
        </div>
      )
    }

    // Fetch product with error handling
    let pricedProduct = null
    try {
      const productResponse = await listProducts({
        countryCode: params.countryCode,
        queryParams: { handle: params.handle },
      })
      
      pricedProduct = productResponse.response.products[0]
    } catch (error) {
      console.error("Error fetching product:", error)
    }

    if (!pricedProduct) {
      return (
        <div className="flex flex-col items-center justify-center py-24">
          <h1 className="text-2xl font-bold">Product not found</h1>
          <p className="text-gray-500 mt-4">
            We couldn't find the product you were looking for.
          </p>
        </div>
      )
    }

    // Fetch product reviews
    const reviews = await fetch(
      `${process.env.MEDUSA_BACKEND_URL}/store/products/${pricedProduct.id}/reviews`,
      {
        headers: {
          "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
        },
        next: { revalidate: 60 },
      }
    )
      .then(res => res.json())
      .then(data => data.reviews || [])
      .catch(() => [])

    return (
      <ProductTemplate
        product={pricedProduct}
        region={region}
        countryCode={params.countryCode}
        reviews={reviews}
      />
    )
  } catch (error) {
    console.error("Error rendering product page:", error)
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <h1 className="text-2xl font-bold">Product not available</h1>
        <p className="text-gray-500 mt-4">
          This product will be available after connecting to the Medusa backend.
        </p>
      </div>
    )
  }
}
