import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Search",
  description: "Explore all of our products.",
}

export default function StorePage(params: Record<string, string>) {
  const { query } = params
  return <div>{query}</div>
}
