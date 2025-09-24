import { Badge } from "@/components/ui/primitives/badge"

function PaymentTest({ className }: { className?: string }) {
  return (
    <Badge color="orange" className={className}>
      <span className="font-semibold">Attention:</span> For testing purposes
      only.
    </Badge>
  )
}

export { PaymentTest }
