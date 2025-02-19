// /app/mystore/[category]/[productId]/page.tsx
"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { fetchProductById } from "@lib/data/myproducts"; // Function to fetch a single product by ID

export default function ProductDetailPage() {
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const router = useRouter();
  const { category, productId } = router.query; // Get category and productId from the URL

  useEffect(() => {
    const loadProduct = async () => {
      if (productId) {
        try {
          const product = await fetchProductById(productId as string); // Fetch product by ID
          setProduct(product);
        } catch (error) {
          console.error("Error loading product:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadProduct(); // Load product when productId is available
  }, [productId]);

  if (loading) return <p className="text-center">Loading product...</p>;

  if (!product) return <p>Product not found.</p>;

  return (
    <section className="w-full bg-white py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">{product.name}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <img src={product.image || "/fallback.jpg"} alt={product.name} className="w-full" />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">${product.price}</h3>
            <p>{product.description}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
