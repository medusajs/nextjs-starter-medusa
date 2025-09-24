import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/primitives/button"
import { ComponentProps } from "react"
import { useFormStatus } from "react-dom"

export function SubmitButton({
  loading,
  children,
  ...props
}: ComponentProps<"button"> & { loading?: boolean }) {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" size="lg" disabled={loading || pending} {...props}>
      {loading || pending ? <Loader2 className="animate-spin" /> : children}
    </Button>
  )
}
