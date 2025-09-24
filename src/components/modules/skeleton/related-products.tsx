import { repeat } from "@/lib/utils"

import { SkeletonProductPreview } from "@/components/modules/skeleton/product-preview"

function SkeletonRelatedProducts() {
  return (
    <div className="product-page-constraint">
      <div className="flex flex-col gap-8 items-center text-center mb-8">
        <div className="w-20 h-6 animate-pulse bg-muted"></div>
        <div className="flex flex-col gap-4 items-center text-center mb-16">
          <div className="w-96 h-10 animate-pulse bg-muted"></div>
          <div className="w-48 h-10 animate-pulse bg-muted"></div>
        </div>
      </div>
      <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-8 flex-1">
        {repeat(3).map((index) => (
          <li key={index}>
            <SkeletonProductPreview />
          </li>
        ))}
      </ul>
    </div>
  )
}

export { SkeletonRelatedProducts }
