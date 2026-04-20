import { getProjects } from "@/lib/strapi/ids"

export default async function Home() {
  const projects = await getProjects()

  return (
    <main className="p-8">
      <h1 className="text-4xl font-bold">id-studio (scaffold)</h1>
      <ul className="mt-4 space-y-2">
        {projects?.map((p) => (
          <li key={p.documentId}>
            {p.title} - {p.category} ({p.year})
          </li>
        )) ?? <li>CMS unreachable</li>}
      </ul>
    </main>
  )
}
