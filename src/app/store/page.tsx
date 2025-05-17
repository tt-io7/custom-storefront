import { Metadata } from "next"
import { redirect } from "next/navigation"

import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import StoreTemplate from "@modules/store/templates"

export const metadata: Metadata = {
  title: "Store",
  description: "Explore all of our products.",
}

type Params = {
  searchParams: {
    sortBy?: SortOptions
    page?: string
  }
}

export default function StorePage() {
  // Redirect to the country code version
  redirect('/dk/store')
} 