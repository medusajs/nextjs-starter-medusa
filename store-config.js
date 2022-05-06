function withStoreConfig(nextConfig = {}) {
  const store = nextConfig.store || {}

  const features = store.features || {}
  const options = store.options || {}

  nextConfig.env = nextConfig.env || {}

  Object.entries(features).forEach(([key, value]) => {
    if (value) {
      nextConfig.env[`FEATURE_${key.toUpperCase()}_ENABLED`] = true
    }
  })

  return nextConfig
}

module.exports = { withStoreConfig }
