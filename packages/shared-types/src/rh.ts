export type StrapiMedia = {
  url: string;
  width?: number;
  height?: number;
  alternativeText?: string;
  formats?: Record<string, { url: string; width: number; height: number }>;
};

export type PageSEO = {
  title: string;
  description?: string;
  og_image?: StrapiMedia;
  canonical_url?: string;
};

export type RHHero = {
  id: number;
  documentId: string;
  title: string;
  subtitle?: string;
  cta_label?: string;
  cta_href?: string;
  background_image?: StrapiMedia;
  seo?: PageSEO;
};

export type RHEditorialBlock = {
  id: number;
  documentId: string;
  heading: string;
  body: unknown;
  image?: StrapiMedia;
  layout: "left" | "right" | "full";
  order: number;
};
