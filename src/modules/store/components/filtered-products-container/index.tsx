import { getProductFilters, listProductsWithSort } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products-dropdown"
import FilteredProductsClient from "./client"

interface FilteredProductsContainerProps {
  sortBy?: SortOptions
  page: number
  countryCode: string
  collectionId?: string
  categoryId?: string
  productsIds?: string[]
  title?: string
  searchParams?: {
    tags?: string
    types?: string
    materials?: string
    sizes?: string
    price_min?: string
    price_max?: string
  }
}

export default async function FilteredProductsContainer({
  sortBy,
  page,
  countryCode,
  collectionId,
  categoryId,
  productsIds,
  title,
  searchParams = {}
}: FilteredProductsContainerProps) {
  // Parse filters from URL parameters
  const filters = {
    tags: searchParams.tags?.split(',').filter(Boolean) || [],
    types: searchParams.types?.split(',').filter(Boolean) || [],
    materials: searchParams.materials?.split(',').filter(Boolean) || [],
    sizes: searchParams.sizes?.split(',').filter(Boolean) || [],
    priceRange: (searchParams.price_min || searchParams.price_max) ? {
      min: searchParams.price_min ? parseInt(searchParams.price_min) : undefined,
      max: searchParams.price_max ? parseInt(searchParams.price_max) : undefined,
    } : undefined,
  }



  // Build query parameters for product fetching
  const queryParams: any = {
    limit: 12,
  }

  if (collectionId) {
    queryParams.collection_id = [collectionId]
  }

  if (categoryId) {
    queryParams.category_id = [categoryId]
  }

  if (productsIds) {
    queryParams.id = productsIds
  }

  if (sortBy === "created_at") {
    queryParams.order = "created_at"
  }

  // HYBRID FILTERING: API filters for real fields, client filters for derived fields
  
  // API-level filters (for real database fields)
  // Tags (colors) - apply all selected tags to API
  if (filters.tags.length > 0) {
    queryParams.tag_id = filters.tags
  }

  // Materials - apply all selected materials to API
  if (filters.materials.length > 0) {
    queryParams.material = filters.materials
  }

  // Client-side filters (for derived fields that don't exist in the database)
  const clientFilters: {
    types?: string[]
    sizes?: string[]
  } = {}

  // Types - filter client-side by product handle (since type_id is null)
  if (filters.types.length > 0) {
    clientFilters.types = filters.types
  }

  // Sizes - filter client-side by variant options (since no size field exists)
  if (filters.sizes.length > 0) {
    clientFilters.sizes = filters.sizes
  }
  
  // Price range - apply if selected
  if (filters.priceRange) {
    queryParams.price_range = filters.priceRange
  }

  // Fetch data in parallel
  const [dynamicFiltersResult, regionResult, productsResult] = await Promise.allSettled([
    getProductFilters({
      countryCode,
      collectionId,
      categoryId,
    }),
    getRegion(countryCode),
    listProductsWithSort({
      page,
      queryParams,
      sortBy,
      countryCode,
      clientFilters, // Pass client-side filters for handle-based types and variant sizes
    })
  ])

  // Handle results
  const dynamicFilters = dynamicFiltersResult.status === 'fulfilled' 
    ? dynamicFiltersResult.value 
    : {
        tags: [],
        types: [],
        materials: [],
        sizes: [],
        collections: [],
        categories: [],
        priceRange: { min: 0, max: 0 }
      }
  const region = regionResult.status === 'fulfilled' ? regionResult.value : null
  const { response: { products, count } } = productsResult.status === 'fulfilled' 
    ? productsResult.value 
    : { response: { products: [], count: 0 } }

  if (!region) {
    return <div>Region not found</div>
  }

  return (
    <FilteredProductsClient
      sortBy={sortBy}
      page={page}
      countryCode={countryCode}
      collectionId={collectionId}
      categoryId={categoryId}
      productsIds={productsIds}
      title={title}
      dynamicFilters={dynamicFilters}
      products={products}
      count={count}
      region={region}
    />
  )
}