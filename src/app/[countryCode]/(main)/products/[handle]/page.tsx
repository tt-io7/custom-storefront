import { Metadata } from "next"
import { notFound } from "next/navigation"
import { listProducts } from "@lib/data/products"
import { getRegion, listRegions } from "@lib/data/regions"
import ProductTemplate from "@modules/products/templates"

type Props = {
  params: Promise<{ countryCode: string; handle: string }>
}

export async function generateStaticParams() {
  // Skip static generation during build time if the environment variable is set
  if (process.env.SKIP_BUILD_PRODUCT_FETCH === "true") {
    return []
  }

  try {
    const countryCodes = await listRegions().then((regions) =>
      regions?.map((r) => r.countries?.map((c) => c.iso_2)).flat()
    )

    if (!countryCodes) {
      return []
    }

    const products = await listProducts({
      countryCode: "US",
      queryParams: { fields: "handle" },
    }).then(({ response }) => response.products)

    return countryCodes
      .map((countryCode) =>
        products.map((product) => ({
          countryCode,
          handle: product.handle,
        }))
      )
      .flat()
      .filter((param) => param.handle)
  } catch (error) {
    console.error(
      `Failed to generate static paths for product pages: ${
        error instanceof Error ? error.message : "Unknown error"
      }.`
    )
    return []
  }
}

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
    const region = await getRegion(params.countryCode)

    if (!region) {
      notFound()
    }

    const pricedProduct = await listProducts({
      countryCode: params.countryCode,
      queryParams: { handle: params.handle },
    }).then(({ response }) => response.products[0])

    if (!pricedProduct) {
      notFound()
    }

    return (
      <ProductTemplate
        product={pricedProduct}
        region={region}
        countryCode={params.countryCode}
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
