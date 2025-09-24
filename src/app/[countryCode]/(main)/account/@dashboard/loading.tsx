import { LoaderCircleIcon } from "lucide-react"

export default function Loading() {
  return (
    <div className="flex items-center justify-center w-full h-full text-muted-foreground">
      <LoaderCircleIcon size={40} strokeWidth={1.5} className="animate-spin" />
    </div>
  )
}
