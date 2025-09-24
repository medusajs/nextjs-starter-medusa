import { LoaderCircleIcon } from "lucide-react"

export default function Loading() {
  return (
    <div className="flex items-center justify-center w-full h-full text-foreground">
      <LoaderCircleIcon className="animate-spin" size={36} />
    </div>
  )
}
