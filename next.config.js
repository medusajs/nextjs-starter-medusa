const { withStoreConfig } = require("./store-config")
const store = require("./store.config.json")

module.exports = withStoreConfig({
  features: store.features,
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_MEDUSA_BACKEND_URL: process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL,
    NEXT_PUBLIC_FRONTEND_URL: process.env.NEXT_PUBLIC_FRONTEND_URL,
    NEXT_PUBLIC_RAZORPAY_KEY: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
    NEXT_PUBLIC_SHOP_NAME: process.env.NEXT_PUBLIC_SHOP_NAME,
    NEXT_PUBLIC_SHOP_DESCRIPTION: process.env.NEXT_PUBLIC_SHOP_DESCRIPTION,
    NEXT_PUBLIC_CUSTOMER_CARE: process.env.NEXT_PUBLIC_CUSTOMER_CARE,
    NEXT_PUBLIC_FEATURED_PRODUCTS:"Shirt",
    NEXT_PUBLIC_SEARCH_APP_ID:process.env.NEXT_PUBLIC_SEARCH_APP_ID,
    NEXT_PUBLIC_SEARCH_API_KEY:process.env.NEXT_PUBLIC_SEARCH_API_KEY,
  },
  images: {
    domains: ["medusa-public-images.s3.eu-west-1.amazonaws.com", "localhost"],
  },
})

console.log("next.config.js", JSON.stringify(module.exports, null, 2))
