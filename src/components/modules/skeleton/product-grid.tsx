import { repeat } from "@/lib/utils"

import { SkeletonProductPreview } from "@/components/modules/skeleton/product-preview"

function SkeletonProductGrid({
  numberOfProducts = 8,
}: {
  numberOfProducts?: number
}) {
  return (
    <ul
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-8 flex-1"
      data-testid="products-list-loader"
    >
      {repeat(numberOfProducts).map((index) => (
        <li key={index}>
          <SkeletonProductPreview />
        </li>
      ))}
    </ul>
  )
}

export { SkeletonProductGrid }
