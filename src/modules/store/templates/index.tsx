import { Suspense } from "react"

import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

import PaginatedProducts from "./paginated-products"
import { VehicleDTO } from "types/global"

const StoreTemplate = ({
  sortBy,
  vehicleId,
  vehicles,
  page,
  countryCode,
}: {
  sortBy?: SortOptions
  vehicleId?: string
  vehicles?: VehicleDTO[]
  page?: string
  countryCode: string
}) => {
  const pageNumber = page ? parseInt(page) : 1

  return (
    <div className="flex flex-col small:flex-row small:items-start py-6 content-container">
      <RefinementList sortBy={sortBy || "created_at"} vehicles={vehicles} />
      <div className="w-full">
        <div className="mb-8 text-2xl-semi">
          <h1>All products</h1>
        </div>
        <Suspense fallback={<SkeletonProductGrid />}>
          <PaginatedProducts
            vehicleId={vehicleId}
            sortBy={sortBy || "created_at"}
            page={pageNumber}
            countryCode={countryCode}
          />
        </Suspense>
      </div>
    </div>
  )
}

export default StoreTemplate
