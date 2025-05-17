import { Metadata } from "next"
import { notFound } from "next/navigation"

import { getCollectionByHandle, listCollections } from "@lib/data/collections"
import { listRegions } from "@lib/data/regions"
import { StoreCollection, StoreRegion } from "@medusajs/types"
import CollectionTemplate from "@modules/collections/templates"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

type Props = {
  params: Promise<{ handle: string; countryCode: string }>
  searchParams: Promise<{
    page?: string
    sortBy?: SortOptions
  }>
}

export const PRODUCT_LIMIT = 12

export async function generateStaticParams() {
  // Skip static generation during build time if the environment variable is set
  if (process.env.SKIP_BUILD_PRODUCT_FETCH === "true") {
    return []
  }

  try {
    const { collections } = await listCollections({
      fields: "*products",
    })

    if (!collections) {
      return []
    }

    const countryCodes = await listRegions().then(
      (regions: StoreRegion[]) =>
        regions
          ?.map((r) => r.countries?.map((c) => c.iso_2))
          .flat()
          .filter(Boolean) as string[]
    )

    const collectionHandles = collections.map(
      (collection: StoreCollection) => collection.handle
    )

    const staticParams = countryCodes
      ?.map((countryCode: string) =>
        collectionHandles.map((handle: string | undefined) => ({
          countryCode,
          handle,
        }))
      )
      .flat()

    return staticParams
  } catch (error) {
    console.error("Error generating static params for collections:", error)
    return []
  }
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  try {
    const params = await props.params
    const collection = await getCollectionByHandle(params.handle)

    if (!collection) {
      return {
        title: "Collection | Medusa Store",
        description: "Collection not found",
      }
    }

    const metadata = {
      title: `${collection.title} | Medusa Store`,
      description: `${collection.title} collection`,
    } as Metadata

    return metadata
  } catch (error) {
    console.error("Error generating metadata for collection:", error)
    return {
      title: "Collection | Medusa Store",
      description: "Collection",
    }
  }
}

export default async function CollectionPage(props: Props) {
  try {
    const searchParams = await props.searchParams
    const params = await props.params
    const { sortBy, page } = searchParams

    const collection = await getCollectionByHandle(params.handle)

    if (!collection) {
      notFound()
    }

    return (
      <CollectionTemplate
        collection={collection}
        page={page}
        sortBy={sortBy}
        countryCode={params.countryCode}
      />
    )
  } catch (error) {
    console.error("Error rendering collection page:", error)
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <h1 className="text-2xl font-bold">Collection not available</h1>
        <p className="text-gray-500 mt-4">
          This collection will be available after connecting to the Medusa backend.
        </p>
      </div>
    )
  }
}
