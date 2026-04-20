export type PlpViewMode = 1 | 2 | 3

export type PlpViewConfig = {
  allowedViews: PlpViewMode[]
  defaultView: PlpViewMode
}

type PlpViewOverrides = Record<string, Partial<PlpViewConfig>>

const GLOBAL_DEFAULT: PlpViewConfig = {
  allowedViews: [2, 3],
  defaultView: 3,
}

/**
 * Placeholder maps: add handle-based overrides here.
 * Example:
 * sofas: { allowedViews: [1, 2], defaultView: 1 }
 */
const CATEGORY_OVERRIDES: PlpViewOverrides = {}
const COLLECTION_OVERRIDES: PlpViewOverrides = {}

const normalizeConfig = (config: Partial<PlpViewConfig>): PlpViewConfig => {
  const allowedViews = config.allowedViews?.length
    ? (Array.from(new Set(config.allowedViews)) as PlpViewMode[])
    : GLOBAL_DEFAULT.allowedViews

  const defaultView =
    config.defaultView && allowedViews.includes(config.defaultView)
      ? config.defaultView
      : allowedViews[allowedViews.length - 1]

  return {
    allowedViews,
    defaultView,
  }
}

export const resolveCategoryPlpViewConfig = (
  handle?: string | null
): PlpViewConfig => {
  if (!handle) return GLOBAL_DEFAULT

  return normalizeConfig({
    ...GLOBAL_DEFAULT,
    ...CATEGORY_OVERRIDES[handle],
  })
}

export const resolveCollectionPlpViewConfig = (
  handle?: string | null
): PlpViewConfig => {
  if (!handle) return GLOBAL_DEFAULT

  return normalizeConfig({
    ...GLOBAL_DEFAULT,
    ...COLLECTION_OVERRIDES[handle],
  })
}

export const resolveStorePlpViewConfig = (): PlpViewConfig => GLOBAL_DEFAULT

export const parsePlpViewMode = (
  rawView: string | undefined,
  config: PlpViewConfig
): PlpViewMode => {
  const view = Number(rawView)
  if (view === 1 || view === 2 || view === 3) {
    if (config.allowedViews.includes(view)) return view
  }
  return config.defaultView
}
