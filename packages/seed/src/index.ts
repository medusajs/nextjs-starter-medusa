const STRAPI = process.env.STRAPI_URL ?? "http://localhost:1337";
const TOKEN = process.env.STRAPI_ADMIN_TOKEN;

if (!TOKEN) {
  console.error("Missing STRAPI_ADMIN_TOKEN env var (use a Full-access token for seeding)");
  process.exit(1);
}

async function createOne(path: string, data: object) {
  const res = await fetch(`${STRAPI}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${TOKEN}`,
    },
    body: JSON.stringify({ data }),
  });

  if (!res.ok) {
    throw new Error(`POST ${path} -> ${res.status}: ${await res.text()}`);
  }

  return res.json();
}

await fetch(`${STRAPI}/api/rh-hero`, {
  method: "PUT",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${TOKEN}`,
  },
  body: JSON.stringify({
    data: {
      title: "SPRING COLLECTION",
      subtitle: "Placeholder subtitle for development.",
      cta_label: "EXPLORE",
      cta_href: "/store",
    },
  }),
}).then((r) => console.log("rh-hero:", r.status));

for (const p of [
  { title: "Hospitality Placeholder", slug: "hospitality-placeholder", category: "Hospitality", year: 2024 },
  { title: "Retail Placeholder", slug: "retail-placeholder", category: "Retail", year: 2023 },
  { title: "Office Placeholder", slug: "office-placeholder", category: "Office", year: 2025 },
]) {
  const r = await createOne("/api/ids-projects", p);
  console.log("ids-project:", p.slug, "->", r.data?.documentId);
}

console.log("✅ Seed completed.");
