import { fetchStrapi } from "./client"
import type { IDSNewsArticle, IDSProject } from "@workspace/shared-types"

export const getProjects = () =>
  fetchStrapi<IDSProject[]>("/api/ids-projects?populate=*&sort=year:desc", {
    tags: ["ids-projects"],
  })

export const getProjectBySlug = (slug: string) =>
  fetchStrapi<IDSProject[]>(
    `/api/ids-projects?filters[slug][$eq]=${slug}&populate=*`,
    { tags: [`ids-project-${slug}`] }
  )

export const getNews = () =>
  fetchStrapi<IDSNewsArticle[]>("/api/ids-news?populate=*&sort=publishedAt:desc", {
    tags: ["ids-news"],
  })
