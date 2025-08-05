"use client"

import { HttpTypes } from "@medusajs/types"
import ProductPreview from "@modules/products/components/product-preview"
import { Pagination } from "@modules/store/components/pagination"

const PRODUCT_LIMIT = 12

interface PaginatedProductsProps {
    products: HttpTypes.StoreProduct[]
    count: number
    page: number
    region: HttpTypes.StoreRegion
}

export default function PaginatedProducts({
    products,
    count,
    page,
    region,
}: PaginatedProductsProps) {
    const totalPages = Math.ceil(count / PRODUCT_LIMIT)
    
    // Calculate pagination and render products

    return (
        <>
            <ul
                className="grid grid-cols-2 w-full cmd:grid-cols-3 clg:grid-cols-4 panel-open-clg:!grid-cols-3 gap-x-6 gap-y-8"
                data-testid="products-list"
            >
                {products.map((p) => {
                    return (
                        <li key={p.id}>
                            <ProductPreview product={p} region={region} />
                        </li>
                    )
                })}
            </ul>
            {totalPages > 1 && (
                <Pagination
                    data-testid="product-pagination"
                    page={page}
                    totalPages={totalPages}
                />
            )}
        </>
    )
}
