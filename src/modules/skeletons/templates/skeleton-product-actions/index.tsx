import { PricedProduct } from "@medusajs/medusa/dist/types/pricing"
import { Button } from "@medusajs/ui"
import Divider from "@modules/common/components/divider"
import SkeletonOptionSelect from "./skeleton-option-select"

const SkeletonProductActions = ({ product }: { product: PricedProduct }) => (
  <>
    <div className="flex flex-col gap-y-2">
      <div>
        {product?.variants?.length > 1 && (
          <div className="flex flex-col gap-y-4">
            {(product.options || []).map((option) => {
              return (
                <div key={option.id}>
                  <SkeletonOptionSelect option={option} title={option.title} />
                </div>
              )
            })}
            <Divider />
          </div>
        )}
      </div>

      <div className="block w-36 h-9 bg-gray-100 animate-pulse" />

      <Button disabled variant="primary" className="w-full h-10">
        Select variant
      </Button>
    </div>
    {/* <MobileActions product={product} show={!inView} /> */}
  </>
)

export default SkeletonProductActions
