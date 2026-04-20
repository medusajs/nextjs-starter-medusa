import type { StrapiMedia, PageSEO } from "./rh";

export type IDSProject = {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  category: string;
  client?: string;
  location?: string;
  year?: number;
  cover_image?: StrapiMedia;
  gallery?: StrapiMedia[];
  description?: unknown;
  featured?: boolean;
  seo?: PageSEO;
};

export type IDSNewsArticle = {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  cover_image?: StrapiMedia;
  excerpt?: string;
  body: unknown;
  tags?: string[];
  seo?: PageSEO;
};
