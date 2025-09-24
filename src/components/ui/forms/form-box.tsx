import Link from "next/link"

export function FormBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-md space-y-4">
      <div className="rounded-md border p-6 [&>h1]:text-xl [&>h1]:font-medium [&>h1]:underline">
        {children}
      </div>
      <Link className="text-sm text-muted-foreground" href="/">
        &larr; Back to home
      </Link>
    </div>
  )
}
