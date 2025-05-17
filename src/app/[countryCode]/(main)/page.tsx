import { Metadata } from "next"
import { HttpTypes } from "@medusajs/types"

import FeaturedProducts from "@modules/home/components/featured-products"
import Hero from "@modules/home/components/hero"
import { listCollections } from "@lib/data/collections"
import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"

export const metadata: Metadata = {
  title: "Home",
  description:
    "Shop all available models only at the AndMore. Worldwide Shipping. Secure Payment.",
}

export default async function Home({
  params,
}: {
  params: { countryCode: string }
}) {
  const region = await getRegion(params.countryCode)

  if (!region) {
    throw new Error("Region not found")
  }

  // Get collections and featured products
  const { collections } = await listCollections({
    fields: "*products",
    limit: "1",
  })

  let featuredProducts: HttpTypes.StoreProduct[] = []
  
  if (collections[0]?.products?.length) {
    // Get the featured products details
    const productIds = collections[0].products.slice(0, 8).map((p: any) => p.id)
    
    // Use proper format for listProducts API - pass ID as array
    const { response } = await listProducts({
      countryCode: params.countryCode,
      queryParams: { 
        limit: 8
      },
    })
    
    featuredProducts = response.products.slice(0, 8)
  }

  return (
    <>
      <Hero />
      {featuredProducts.length > 0 && (
        <FeaturedProducts 
          products={featuredProducts} 
          region={region} 
          countryCode={params.countryCode}
        />
      )}
    </>
  )
}
