import { ProductVariant } from "@medusajs/medusa"
import { Text } from "@medusajs/ui"

type LineItemOptionsProps = {
  variant: ProductVariant
  'data-testid'?: string
  'data-value'?: ProductVariant
  isHidden?: boolean
}

const LineItemOptions = ({ variant, 'data-testid': dataTestid, 'data-value': dataValue , isHidden}: LineItemOptionsProps) => {

  if (isHidden) {
    return null;
  }
  
  return (
    <Text data-testid={dataTestid} data-value={dataValue} className="inline-block w-full overflow-hidden txt-medium text-ui-fg-subtle text-ellipsis">
      Variant: {variant.title}
    </Text>
  )
}

export default LineItemOptions
