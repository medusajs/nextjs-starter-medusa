import { sdk } from "@lib/config";
import { getAuthHeaders, getCacheOptions } from "./cookies";
import { getRegion } from "./regions";




// // Example of fetching products by category
// export async function fetchProducts(category: string, limit: number) {
//   const response = await fetch(`/api/products?category=${category}&limit=${limit}`);
//   const data = await response.json();
//   return data; // Returns { products: [...] }
// }

// Example of fetching a single product by ID
export async function fetchProductById(productId: string) {
  const response = await fetch(`/api/products/${productId}`);
  const data = await response.json();
  return data.product; // Returns { product: {...} }
}










export const fetchProducts = async (
  countryCode: string,
  limit: number = 12,
  offset: number = 0,
  filters: Record<string, any> = {}
) => {
  if (!countryCode) {
    throw new Error("Country code is required");
  }

  // Get the region based on the country code
  const region = await getRegion(countryCode);
  if (!region) {
    return { products: [], count: 0 };
  }

  // Set up headers and caching options
  const headers = { ...(await getAuthHeaders()) };
  const next = { ...(await getCacheOptions("products")) };

  try {
    // Fetch data from Medusa's API
    const response = await sdk.client.fetch<{ products: any[]; count: number }>(
      `/store/products`,
      {
        method: "GET",
        query: {
          limit,
          offset,
          region_id: region.id,
          ...filters, // Apply filters dynamically
        },
        headers,
        next,
        cache: "force-cache",
      }
    );
    console.log(response)
    return response;
    
  } catch (error) {
    console.error("Error fetching products:", error);
    return { products: [], count: 0 };
  }
};
