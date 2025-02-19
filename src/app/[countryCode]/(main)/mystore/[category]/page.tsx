// // /app/[countryCode]/(main)/mystore/[category]/page.tsx
// "use client";
// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation"; // Import useRouter from next/navigation for client-side routing
// import { fetchProductsByCategory } from "@lib/data/myproducts"; // Adjust this import to your actual data fetching logic
// import Link from "next/link";

// export default function CategoryPage() {
//   const router = useRouter();
//   const { category } = router.query; // Extract the category from the URL parameter
//   const [products, setProducts] = useState<any[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);

//   useEffect(() => {
//     if (!category) return; // If category is not available, return early

//     const loadCategoryProducts = async () => {
//       try {
//         const { products } = await fetchProductsByCategory(category, "dk", 12); // Replace "dk" with country code as needed
//         setProducts(products);
//       } catch (error) {
//         console.error("Error loading category products:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadCategoryProducts();
//   }, [category]);

//   if (loading) return <p className="text-center">Loading category products...</p>;

//   return (
//     <section className="w-full bg-white py-20 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="flex justify-between items-end mb-12">
//           <div>
//             <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-2">
//               {category} Products
//             </h2>
//             <p className="text-gray-600">Explore all products in this category.</p>
//           </div>
//         </div>

//         {/* Product Grid */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
//           {products.length > 0 ? (
//             products.map((product) => (
//               <Link key={product.id} href={`/mystore/${category}/${product.id}`}>
//                 <div className="group relative border rounded-lg shadow-md bg-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl cursor-pointer">
//                   {/* Product Image */}
//                   <div className="aspect-[4/3] overflow-hidden rounded-lg">
//                     <img
//                       src={product.image || product.thumbnail || "/fallback.jpg"}
//                       alt={product.name || "Product image"}
//                       className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
//                     />
//                   </div>

//                   {/* Gradient Overlay */}
//                   <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

//                   {/* Product Details */}
//                   <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
//                     <p className="text-sm">{product.category}</p>
//                     <h3 className="text-lg font-bold mb-2">{product.name || product.title}</h3>
//                     <p className="text-gray-300 line-clamp-2">{product.description}</p>
//                     <p className="text-lg font-semibold mt-2">${product.price}10</p>
//                   </div>
//                 </div>
//               </Link>
//             ))
//           ) : (
//             <p className="col-span-3 text-center text-gray-500">No products found in this category.</p>
//           )}
//         </div>
//       </div>
//     </section>
//   );
// }




// "use client"

// import { useEffect, useState } from "react";
// import { fetchProducts } from "@lib/data/myproducts";
// import Link from "next/link";

// interface CategoryPageProps {
//   params: {
//     category: string;
//   };
// }

// export default function CategoryPage({ params }: CategoryPageProps) {
//   const { category } = params;
//   const [products, setProducts] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const loadProducts = async () => {
//       try {
//         const filters = { category };
//         const { products } = await fetchProducts("dk", 12, 0, filters);
//         setProducts(products);
//       } catch (error) {
//         console.error("Error loading category products:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadProducts();
//   }, [category]);

//   if (loading) return <p>Loading...</p>;

//   return (
//     <section>
//       <h2>{category} Products</h2>
//       <div>
//         {products.map((product) => (
//           <Link key={product.id} href={`/mystore/${category}/${product.id}`}>
//             <div>
//               <img src={product.image} alt={product.name} />
//               <p>{product.name}</p>
//             </div>
//           </Link>
//         ))}
//       </div>
//     </section>
//   );
// }



// "use client";

// import { useEffect, useState } from "react";
// import { fetchProducts } from "@lib/data/myproducts";
// import { useParams } from "next/navigation";
// import Link from "next/link";

// export default function CategoryPage() {
//   const { category } = useParams(); // Get category from the URL
//   const [products, setProducts] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (!category) return;

//     const loadProducts = async () => {
//       try {
//         const { products } = await fetchProducts("dk", 12, 0, { category });
//         setProducts(products);
//       } catch (error) {
//         console.error("Error fetching category products:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadProducts();
//   }, [category]);

//   if (loading) return <p className="text-center">Loading category products...</p>;

//   return (
//     <section className="w-full bg-white py-20 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-7xl mx-auto">
//         <h2 className="text-2xl font-bold text-gray-900 mb-4 capitalize">
//           {category} Products
//         </h2>
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
//           {products.length > 0 ? (
//             products.map((product) => (
//               <Link key={product.id} href={`/mystore/${category}/${product.id}`}>
//                 <div className="group relative border rounded-lg shadow-md p-4">
//                   <img src={product.image || "/fallback.jpg"} alt={product.name} />
//                   <h3 className="text-lg font-semibold mt-4">{product.name}</h3>
//                   <p>{product.description}</p>
//                   <p>${product.price}</p>
//                 </div>
//               </Link>
//             ))
//           ) : (
//             <p className="col-span-3 text-center text-gray-500">No products found in this category.</p>
//           )}
//         </div>
//       </div>
//     </section>
//   );
// }






// "use client"

// import { useEffect, useState } from "react"
// import { useParams } from "next/navigation"
// import Link from "next/link"
// import Image from "next/image"
// import { fetchProducts } from "@lib/data/myproducts"

// export default function CategoryPage() {
//   const { category } = useParams() // Get category from URL
//   const [products, setProducts] = useState<any[]>([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)

//   useEffect(() => {
//     if (!category) return

//     const loadProducts = async () => {
//       try {
//         setLoading(true)
//         setError(null)

//         // Fetch products by category
//         const { products } = await fetchProducts("dk", 12, 0, { category }) // Adjust countryCode as needed
//         setProducts(products)
//       } catch (error) {
//         setError("Failed to load products. Please try again later.")
//         console.error("Error fetching category products:", error)
//       } finally {
//         setLoading(false)
//       }
//     }

//     loadProducts()
//   }, [category])

//   if (loading) return <p className="text-center">Loading category products...</p>

//   if (error) return <p className="text-center text-red-500">{error}</p>

//   return (
//     <section className="w-full bg-white py-20 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-7xl mx-auto">
//         <h2 className="text-3xl font-bold text-gray-900 mb-6 capitalize">
//           {category} Collection
//         </h2>

//         {products.length > 0 ? (
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//             {products.map((product) => (
//               <Link key={product.id} href={`/mystore/${category}/${product.id}`}>
//                 <div className="group relative border rounded-lg shadow-md p-4 hover:shadow-xl transition">
//                   {/* Product Image */}
//                   <div className="relative w-full h-60">
//                     <Image
//                       src={product.image || "/fallback.jpg"}
//                       alt={product.name}
//                       layout="fill"
//                       objectFit="cover"
//                       className="rounded-lg"
//                     />
//                   </div>

//                   {/* Product Details */}
//                   <h3 className="text-lg font-semibold mt-4 text-gray-900">
//                     {product.name}
//                   </h3>
//                   <p className="text-gray-600">{product.description}</p>
//                   <p className="text-xl font-semibold text-gray-900">${product.price}</p>
//                 </div>
//               </Link>
//             ))}
//           </div>
//         ) : (
//           <p className="text-center text-gray-500">No products found in this category.</p>
//         )}
//       </div>
//     </section>
//   )
// }





// "use client"

// import { useEffect, useState } from "react"
// import { useParams } from "next/navigation"
// import Link from "next/link"
// import Image from "next/image"
// import { fetchProducts } from "@lib/data/myproducts"

// export default function CategoryPage() {
//   const { category } = useParams() // Get category from URL
//   const [products, setProducts] = useState<any[]>([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)

//   useEffect(() => {
//     if (!category) return

//     const loadProducts = async () => {
//       try {
//         setLoading(true)
//         setError(null)

//         // Adjust this filter format based on backend expectations
//         const filters = { category: category } // Apply category filter
//         const { products } = await fetchProducts("dk", 12, 0, filters) // Adjust countryCode as needed
//         setProducts(products)
//       } catch (error) {
//         setError("Failed to load products. Please try again later.")
//         console.error("Error fetching category products:", error)
//       } finally {
//         setLoading(false)
//       }
//     }

//     loadProducts()
//   }, [category])

//   if (loading) return <p className="text-center">Loading category products...</p>

//   if (error) return <p className="text-center text-red-500">{error}</p>

//   return (
//     <section className="w-full bg-white py-20 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-7xl mx-auto">
//         <h2 className="text-3xl font-bold text-gray-900 mb-6 capitalize">
//           {category} Collection
//         </h2>

//         {products.length > 0 ? (
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//             {products.map((product) => (
//               <Link key={product.id} href={`/mystore/${category}/${product.id}`}>
//                 <div className="group relative border rounded-lg shadow-md p-4 hover:shadow-xl transition">
//                   {/* Product Image */}
//                   <div className="relative w-full h-60">
//                     <Image
//                       src={product.image || "/fallback.jpg"}
//                       alt={product.name}
//                       layout="fill"
//                       objectFit="cover"
//                       className="rounded-lg"
//                     />
//                   </div>

//                   {/* Product Details */}
//                   <h3 className="text-lg font-semibold mt-4 text-gray-900">
//                     {product.name}
//                   </h3>
//                   <p className="text-gray-600">{product.description}</p>
//                   <p className="text-xl font-semibold text-gray-900">${product.price}</p>
//                 </div>
//               </Link>
//             ))}
//           </div>
//         ) : (
//           <p className="text-center text-gray-500">No products found in this category.</p>
//         )}
//       </div>
//     </section>
//   )
// }



"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { fetchProducts } from "@lib/data/myproducts"

export default function CategoryPage() {
  const { category } = useParams() // Get category handle from URL
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  // const category = 'shirts';
  useEffect(() => {
    if (!category) return

    const loadProducts = async () => {
      try {
        setLoading(true)
        setError(null)

        // Apply filter based on category handle (e.g., /shirts, /sweatshirts)
        const filters = { category: category } // Using the handle to filter products
        // const { products } = await fetchProducts("dk", 12, 0, filters) // Adjust countryCode if needed
        const { products } = await fetchProducts("dk", 12, 0,)
        setProducts(products)
      } catch (error) {
        setError("Failed to load products. Please try again later.")
        console.error("Error fetching category products:", error)
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [category])

  if (loading) return <p className="text-center">Loading category products...</p>

  if (error) return <p className="text-center text-red-500">{error}</p>

  return (
    <section className="w-full bg-white py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 capitalize">
          {category} Collection
        </h2>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <Link key={product.id} href={`/products/${product.handle}`}>
                <div className="group relative border rounded-lg shadow-md p-4 hover:shadow-xl transition">
                  {/* Product Image */}
                  <div className="relative w-full h-60">
                    <img
                      // src={product.image || "/fallback.jpg"}
                      src={product.image || product.thumbnail || "/fallback.jpg"}
                      alt={product.name || "Product image"}
                      className="rounded-lg object-cover w-full h-full"
                    />
                  </div>

                  {/* Product Details */}
                  <h3 className="text-lg font-semibold mt-4 text-gray-900">
                    {product.name}
                  </h3>
                  {/* <p className="text-gray-600">{product.name}</p> */}
                  <p className="text-gray-600">{product.description}</p>
                  <p className="text-xl font-semibold text-gray-900">${product.price}10</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No products found in this category.</p>
        )}
      </div>
    </section>
  )
}



