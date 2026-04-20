import { Text, clx } from "@medusajs/ui"
import { VariantPrice } from "types/global"

export default async function PreviewPrice({ price }: { price: VariantPrice }) {
  if (!price) {
    return null
  }

  return (
    <>
      {price.price_type === "sale" && (
        <Text
          className="line-through text-qw-medium-grey text-[13px] tracking-[0.165px]"
          data-testid="original-price"
        >
          {price.original_price}
        </Text>
      )}
      <Text
        className={clx(
          "text-[13px] tracking-[0.165px] text-qw-charcoal whitespace-nowrap",
          {
            "text-[#CA2022]": price.price_type === "sale",
          }
        )}
        data-testid="price"
      >
        {price.calculated_price}
      </Text>
    </>
  )
}
