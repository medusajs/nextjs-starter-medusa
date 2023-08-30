import medusaRequest from "./"

const PRODUCT_MODULE_ENABLED = process.env.FEATURE_PRODUCTMODULE_ENABLED

export async function getProductByHandle(handle: string) {
  if (PRODUCT_MODULE_ENABLED) {
    console.log("PRODUCT_MODULE_ENABLED")
    const data = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/products/${handle}`
    )
      .then((res) => res.json())
      .catch((err) => {
        throw err
      })

    return data
  }

  console.log("PRODUCT_MODULE_DISABLED")
  const data = await medusaRequest("GET", "/products", {
    query: {
      handle,
    },
  })

  return {
    products: data.body.products,
    status: data.status,
    ok: data.ok,
  }
}
