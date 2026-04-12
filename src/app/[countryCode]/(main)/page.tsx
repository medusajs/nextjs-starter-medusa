import { Metadata } from "next"

import HomeHeroStack from "@modules/home/components/hero/home-hero-stack"

export const metadata: Metadata = {
  title: "Medusa Next.js Starter Template",
  description:
    "A performant frontend ecommerce starter template with Next.js 15 and Medusa.",
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  await props.params

  return <HomeHeroStack />
}
