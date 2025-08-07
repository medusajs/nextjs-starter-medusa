"use server"

import { sdk } from "@lib/config"
import { sortProducts } from "@lib/util/sort-products"
import { HttpTypes } from "@medusajs/types"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products-dropdown"
import { getAuthHeaders, getCacheOptions } from "./cookies"
import { getRegion, retrieveRegion } from "./regions"

export const listProducts = async ({
    pageParam = 1,
    queryParams,
    countryCode,
    regionId,
}: {
    pageParam?: number
    queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams
    countryCode?: string
    regionId?: string
}): Promise<{
    response: { products: HttpTypes.StoreProduct[]; count: number }
    nextPage: number | null
    queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams
}> => {
    if (!countryCode && !regionId) {
        throw new Error("Country code or region ID is required")
    }

    const limit = queryParams?.limit || 12
    const _pageParam = Math.max(pageParam, 1)
    const offset = (_pageParam === 1) ? 0 : (_pageParam - 1) * limit;

    let region: HttpTypes.StoreRegion | undefined | null

    if (countryCode) {
        region = await getRegion(countryCode)
    } else {
        region = await retrieveRegion(regionId!)
    }

    if (!region) {
        return {
            response: { products: [], count: 0 },
            nextPage: null,
        }
    }

    const headers = {
        ...(await getAuthHeaders()),
    }

    const next = {
        ...(await getCacheOptions("products")),
    }

    return sdk.client
        .fetch<{ products: HttpTypes.StoreProduct[]; count: number }>(
            `/store/products`,
            {
                method: "GET",
                query: {
                    limit,
                    offset,
                    region_id: region?.id,
                    fields:
                        "*variants.calculated_price,+variants.inventory_quantity,+metadata,+tags",
                    ...queryParams,
                },
                headers,
                next,
                cache: "force-cache",
            }
        )
        .then(({ products, count }) => {
            const nextPage = count > offset + limit ? pageParam + 1 : null

            return {
                response: {
                    products,
                    count,
                },
                nextPage: nextPage,
                queryParams,
            }
        })
}

/**
 * This will fetch 100 products to the Next.js cache and sort them based on the sortBy parameter.
 * It will then return the paginated products based on the page and limit parameters.
 */
export const listProductsWithSort = async ({
    page = 0,
    queryParams,
    sortBy = "created_at",
    countryCode,
    clientFilters, // NEW: For filters that can't be done at API level
}: {
    page?: number
    queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams
    sortBy?: SortOptions
    countryCode: string
    clientFilters?: {
        types?: string[]    // Handle-based types for client filtering
        sizes?: string[]    // Variant option sizes for client filtering
    }
}): Promise<{
    response: { products: HttpTypes.StoreProduct[]; count: number }
    nextPage: number | null
    queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams
}> => {
    const limit = queryParams?.limit || 12

    // Fetch products with hybrid filtering approach

    const {
        response: { products, count },
    } = await listProducts({
        pageParam: 0,
        queryParams: {
            ...queryParams,
            limit: 100,
        },
        countryCode,
    })
    
    // Apply client-side filters for derived fields

    let filteredProducts = products
    
    // Apply client-side filters for fields that can't be filtered at API level
    if (clientFilters) {
        // Filter by handle-based types
        if (clientFilters.types && clientFilters.types.length > 0) {
            filteredProducts = filteredProducts.filter(product => {
                return clientFilters.types!.includes(product.handle?.toLowerCase() || '')
            })
        }
        
        // Filter by variant option sizes  
        if (clientFilters.sizes && clientFilters.sizes.length > 0) {
            filteredProducts = filteredProducts.filter(product => {
                return product.variants?.some(variant => 
                    variant.options?.some(option => 
                        clientFilters.sizes!.includes(option.value?.toUpperCase() || '')
                    )
                ) || false
            })
        }
    }

    const sortedProducts = sortProducts(filteredProducts, sortBy)
    const filteredCount = sortedProducts.length

    const pageParam = (page - 1) * limit
    const paginatedProducts = sortedProducts.slice(pageParam, pageParam + limit)

    const nextPage = filteredCount > pageParam + limit ? pageParam + limit : null

    // Return paginated results with accurate counts

    return {
        response: {
            products: paginatedProducts,
            count: filteredCount, // Use filtered count, not original API count
        },
        nextPage,
        queryParams,
    }
}

/**
 * Aggregates product data to build dynamic filter options
 */
export const getProductFilters = async ({
    countryCode,
    collectionId,
    categoryId,
}: {
    countryCode: string
    collectionId?: string
    categoryId?: string
}) => {
    const region = await getRegion(countryCode)
    
    if (!region) {
        return {
            tags: [],
            types: [],
            materials: [],
            sizes: [],
            collections: [],
            categories: [],
            priceRange: { min: 0, max: 0 },
        }
    }

    // Fetch a large sample of products to analyze for filter options
    const queryParams: any = {
        limit: 1000, // Get a large sample
        region_id: region.id,
    }

    // If we're on a specific collection/category, get filters relevant to that context
    if (collectionId) {
        queryParams.collection_id = [collectionId]
    }
    if (categoryId) {
        queryParams.category_id = [categoryId]
    }

    const headers = {
        ...(await getAuthHeaders()),
    }

    const next = {
        ...(await getCacheOptions("products")),
    }

    const { products } = await sdk.client
        .fetch<{ products: HttpTypes.StoreProduct[]; count: number }>(
            `/store/products`,
            {
                method: "GET",
                query: {
                    ...queryParams,
                    fields: "*variants.calculated_price,+variants.inventory_quantity,+metadata,+tags",
                },
                headers,
                next,
                cache: "force-cache",
            }
        )

    // Uncomment for debugging
    // console.log("🔍 Filter Debug - Number of products fetched:", products.length)

    // Aggregate filter data
    const tagCounts = new Map<string, { label: string; count: number }>()
    const typeCounts = new Map<string, { label: string; count: number }>()
    const materialCounts = new Map<string, { label: string; count: number }>()
    const sizeCounts = new Map<string, { label: string; count: number }>() // NEW: Extract sizes from variants
    const collectionCounts = new Map<string, { label: string; count: number }>()
    const categoryCounts = new Map<string, { label: string; count: number }>()
    let minPrice = Infinity
    let maxPrice = 0

    products.forEach((product, index) => {

        // Process tags
        product.tags?.forEach((tag) => {
            if (tag.value) {
                const current = tagCounts.get(tag.id) || { label: tag.value, count: 0 }
                tagCounts.set(tag.id, { ...current, count: current.count + 1 })
            }
        })

        // Process product type - first try the type field, then fallback to handle
        if (product.type?.value) {
            const current = typeCounts.get(product.type.id) || { label: product.type.value, count: 0 }
            typeCounts.set(product.type.id, { ...current, count: current.count + 1 })
        } else if (product.handle) {
            // NEW: Extract type from handle since type field is null
            const typeFromHandle = product.handle.toLowerCase()
            // Map handles to friendly names
            const typeMapping: { [key: string]: string } = {
                't-shirt': 'T-Shirt',
                'sweatpants': 'Sweatpants', 
                'shorts': 'Shorts',
                'sweatshirt': 'Sweatshirt'
            }
            const friendlyType = typeMapping[typeFromHandle] || product.title
            const current = typeCounts.get(typeFromHandle) || { label: friendlyType, count: 0 }
            typeCounts.set(typeFromHandle, { ...current, count: current.count + 1 })
        }

        // Process material (from metadata or direct property)
        const material = product.material || product.metadata?.material
        if (material && typeof material === 'string') {
            const current = materialCounts.get(material) || { label: material, count: 0 }
            materialCounts.set(material, { ...current, count: current.count + 1 })
        }

        // Process collection - products have collection_id directly
        if (product.collection_id && !collectionId) { // Don't include if we're already filtering by collection
            const current = collectionCounts.get(product.collection_id) || { 
                label: `Collection ${product.collection_id}`, // We'll need to get collection name separately
                count: 0 
            }
            collectionCounts.set(product.collection_id, { ...current, count: current.count + 1 })
        }

        // Process categories
        product.categories?.forEach((category) => {
            if (!categoryId || category.id !== categoryId) { // Don't include current category
                const current = categoryCounts.get(category.id) || { 
                    label: category.name, 
                    count: 0 
                }
                categoryCounts.set(category.id, { ...current, count: current.count + 1 })
            }
        })

        // Process variants for price and sizes
        product.variants?.forEach((variant, vIndex) => {
            // Extract price
            if (variant.calculated_price?.calculated_amount) {
                // Don't divide by 100 - the amount appears to already be in the base currency unit
                const price = variant.calculated_price.calculated_amount
                minPrice = Math.min(minPrice, price)
                maxPrice = Math.max(maxPrice, price)
            }
            
            // NEW: Extract sizes from variant options
            variant.options?.forEach((option) => {
                if (option.value) {
                    const size = option.value.toUpperCase() // Normalize to uppercase
                    const current = sizeCounts.get(size) || { label: size, count: 0 }
                    sizeCounts.set(size, { ...current, count: current.count + 1 })
                }
            })
        })
    })

    // Convert maps to arrays and sort by count (most popular first)
    const sortByCount = (a: [string, any], b: [string, any]) => b[1].count - a[1].count

    // NO MORE FALLBACK FILTERS - Only show what actually exists in the data

    const result: {
        tags: Array<{ id: string; label: string; count: number }>
        types: Array<{ id: string; label: string; count: number }>
        materials: Array<{ id: string; label: string; count: number }>
        sizes: Array<{ id: string; label: string; count: number }>
        collections: Array<{ id: string; label: string; count: number }>
        categories: Array<{ id: string; label: string; count: number }>
        priceRange: { min: number; max: number }
    } = {
        // Only show tags if they actually exist
        tags: Array.from(tagCounts.entries()).length > 0
            ? Array.from(tagCounts.entries())
                .sort(sortByCount)
                .slice(0, 20)
                .map(([id, data]) => ({ id, ...data }))
            : [],
        
        // Only show types if they actually exist
        types: Array.from(typeCounts.entries()).length > 0
            ? Array.from(typeCounts.entries())
                .sort(sortByCount)
                .map(([id, data]) => ({ id, ...data }))
            : [],
        
        // Only show materials if they actually exist
        materials: Array.from(materialCounts.entries()).length > 0
            ? Array.from(materialCounts.entries())
                .sort(sortByCount)
                .slice(0, 15)
                .map(([material, data]) => ({ id: material, ...data }))
            : [],
        
        // Extract sizes from variant options  
        sizes: Array.from(sizeCounts.entries()).length > 0
            ? Array.from(sizeCounts.entries())
                .sort(sortByCount)
                .map(([id, data]) => ({ id, ...data }))
            : [],
        
        // Collections and categories based on actual data
        collections: Array.from(collectionCounts.entries())
            .sort(sortByCount)
            .map(([id, data]) => ({ id, ...data })),
        
        categories: Array.from(categoryCounts.entries())
            .sort(sortByCount)
            .map(([id, data]) => ({ id, ...data })),
        
        // Price range based on actual product prices
        priceRange: {
            min: minPrice === Infinity ? 0 : Math.floor(minPrice),
            max: Math.ceil(maxPrice),
        },
    }

    // Return discovered filter options

    return result
}
