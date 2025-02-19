// "use client";
// import { fetchProducts } from "@lib/data/myproducts";
// import Link from "next/link";
// import { useEffect, useState } from "react";

// export default function ProductList({ countryCode }: { countryCode: string }) {
//   const [products, setProducts] = useState<any[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);

//   useEffect(() => {
//     const loadProducts = async () => {
//       try {
//         const { products } = await fetchProducts(countryCode, 12);
//         setProducts(products);
//       } catch (error) {
//         console.error("Error loading products:", error);
//       } finally {
//         setLoading(false);
        
        
//       }
//     };

//     loadProducts();
//   }, [countryCode]);

//   if (loading) {
//     return <p className="text-center">Loading products...</p>;
//   }

// return (
//     <section className="w-full bg-white py-20 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-7xl mx-auto">
//         <div className="flex justify-between items-end mb-12">
//           <div>
//             <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-2">
//               Featured Products
//             </h2>
//             <p className="text-gray-600">Discover our premium selection</p>
//           </div>
//           {/* <button className="hidden sm:flex items-center gap-2 bg-transparent text-blue-500 border border-blue-500 px-4 py-2 rounded hover:bg-blue-100">
//             View All
//           </button> */}
//         </div>
  
//         {/* Product Grid */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
//           {products.length > 0 ? (
//             products.map((product) => (
//                  <Link href='/store'>
//               <div
//                 key={product.id}
//                 className="group relative border rounded-lg shadow-md bg-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl cursor-pointer"
//               >
//                 {/* Product Image */}
//                 <div className="aspect-[4/3] overflow-hidden rounded-lg">
//                   <img
//                     src={product.image || product.thumbnail}
//                     alt={product.name || product.title}
//                     className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
//                   />
//                 </div>
  
//                 {/* Gradient Overlay */}
//                 <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
  
//                 {/* Product Details (Hidden Until Hover) */}
//                 <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
//                   <p className="text-sm">{product.category}</p>
//                   <h3 className="text-lg font-bold mb-2">{product.name || product.title}</h3>
//                   <p className="text-gray-300 line-clamp-2">{product.description}</p>
//                   <p className="text-lg font-semibold mt-2">${product.price}10</p>
  
//                   {/* <button className="mt-4 bg-white text-black px-4 py-2 rounded hover:bg-gray-100 w-full">
//                     Buy Now
//                   </button> */}
//                 </div>
//               </div>
//               </Link>
//             ))
//           ) : (
//             <p className="col-span-3 text-center text-gray-500">No products found.</p>
//           )}
//         </div>
//       </div>
//     </section>
//   );
  
// }




// "use client";

// import React, { useEffect, useState } from "react";
// import Link from "next/link";
// import { fetchProducts } from "@lib/data/myproducts";
// import { Card, CardContent } from "./card";
// import { Button } from "@medusajs/ui";
// import { Star, ChevronRight, ChevronLeft } from "lucide-react";

// export default function ProductListn({ countryCode }: { countryCode: string }) {
//   const [products, setProducts] = useState<any[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [currentIndex, setCurrentIndex] = useState(0);

//   useEffect(() => {
//     const loadProducts = async () => {
//       try {
//         const { products } = await fetchProducts(countryCode, 12);
//         setProducts(products);
//       } catch (error) {
//         console.error("Error loading products:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     loadProducts();
//   }, [countryCode]);

//   const handlePrevious = () => {
//     setCurrentIndex((prev) => (prev > 0 ? prev - 1 : products.length - 1));
//   };

//   const handleNext = () => {
//     setCurrentIndex((prev) => (prev < products.length - 1 ? prev + 1 : 0));
//   };

//   if (loading) {
//     return <p className="text-center text-white">Loading products...</p>;
//   }

//   return (
//     <section className="w-full bg-white py-16">
//       <div className="container mx-auto px-4">
//         <div className="flex justify-between items-center mb-8">
//           {/* <h2 className="size-3xl text-black align-center font-bold">Featured Products</h2> */}
//           <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#004B93] text-center mb-8 sm:mb-12">
//           Featured Products
//                 </h2>
//           <Button variant="transparent" className="group text-white">
//             View All
//             <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
//           </Button>
//         </div>
//         <div className="relative">
//           <div className="flex gap-6 justify-center items-center">
//             {products.slice(currentIndex, currentIndex + 3).map((product, index) => (
//               <Link key={index} href="/store">
//                 <Card className="w-[300px] overflow-hidden transition-transform hover:scale-105 relative">
//                   <div className="overflow-hidden h-[200px]">
//                     <img
//                       src={product.image || product.thumbnail}
//                       alt={product.name || product.title}
//                       className="w-full h-full object-cover transition-transform hover:scale-110"
//                     />
//                   </div>
//                   <CardContent className="p-4">
//                     <h3 className="font-semibold text-lg mb-2">{product.name || product.title}</h3>
//                     <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.description}</p>
//                     <div className="flex items-center gap-2 mb-2">
//                       <div className="flex items-center">
//                         {[...Array(5)].map((_, i) => (
//                           <Star
//                             key={i}
//                             className={`h-4 w-4 ${i < Math.floor(product.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
//                           />
//                         ))}
//                       </div>
//                       {/* <span className="text-sm text-gray-600">{product.rating.toFixed(2)}</span> */}
//                       <span className="text-sm text-gray-600">
//                             {product.rating ? product.rating.toFixed(2) : "4.50"}
//                       </span>

//                     </div>
//                     <div className="flex items-center gap-2">
//                       <p className="text-lg font-bold text-blue-600">${product.price}10</p>
//                       {product.originalPrice && (
//                         <p className="text-sm text-gray-400 line-through">${product.originalPrice}</p>
//                       )}
//                     </div>
//                   </CardContent>
//                 </Card>
//               </Link>
//             ))}
//           </div>
//           <button onClick={handlePrevious} className="absolute left-0 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-lg hover:bg-gray-100">
//             <ChevronLeft className="h-6 w-6" />
//           </button>
//           <button onClick={handleNext} className="absolute right-0 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-lg hover:bg-gray-100">
//             <ChevronRight className="h-6 w-6" />
//           </button>
//         </div>
//       </div>
//     </section>
//   );
// }




"use client"; // Enables client-side rendering for Next.js

import React, { useEffect, useState } from "react"; // Import React and hooks
import Link from "next/link"; // Import Link for client-side navigation
import { fetchProducts } from "@lib/data/myproducts"; // Function to fetch product data
import { Card, CardContent } from "./card"; // Custom UI components
import { Button } from "@medusajs/ui"; // Medusa UI button
import { Star, ChevronRight, ChevronLeft } from "lucide-react"; // Import icons

// ProductListn Component
export default function ProductListn({ countryCode }: { countryCode: string }) {
  // State variables to manage products, loading status, and carousel index
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fetch products when component mounts or when countryCode changes
  useEffect(() => {
    const loadProducts = async () => {
      try {
        // Fetch products based on countryCode and limit to 12
        const { products } = await fetchProducts(countryCode, 12);
        setProducts(products); // Store fetched products in state
      } catch (error) {
        console.error("Error loading products:", error);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };
    loadProducts();
  }, [countryCode]);

  // Function to navigate to the previous product in the carousel
  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : products.length - 1));
  };

  // Function to navigate to the next product in the carousel
  const handleNext = () => {
    setCurrentIndex((prev) => (prev < products.length - 1 ? prev + 1 : 0));
  };

  // Show a loading message while fetching products
  if (loading) {
    return <p className="text-center text-white">Loading products...</p>;
  }

  return (
    <section className="w-full bg-white py-16">
      <div className="container mx-auto px-4">
        
        {/* Header Section with Title and "View All" Button */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#004B93] text-center mb-8 sm:mb-12">
            Featured Products
          </h2>
          <Button variant="transparent" className="group text-white">
            View All
            <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>

        {/* Product Carousel */}
        <div className="relative">
          <div className="flex gap-6 justify-center items-center">
            {/* Display only 3 products at a time */}
            {products.slice(currentIndex, currentIndex + 3).map((product, id) => (
              <Link key={id} href={`/products/${product.handle}`}>
                <Card className="w-[300px] overflow-hidden transition-transform hover:scale-105 relative">
                  
                  {/* Product Image */}
                  <div className="overflow-hidden h-[200px]">
                    <img
                      src={product.image || product.thumbnail} // Use image or fallback to thumbnail
                      alt={product.name || product.title} // Use name or fallback to title
                      className="w-full h-full object-cover transition-transform hover:scale-110"
                    />
                  </div>

                  {/* Product Details */}
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{product.name || product.title}</h3>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.description}</p>

                    {/* Product Rating */}
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(product.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">
                        {product.rating ? product.rating.toFixed(2) : "4.50"} {/* Default rating if missing */}
                      </span>
                    </div>

                    {/* Product Pricing */}
                    <div className="flex items-center gap-2">
                      <p className="text-lg font-bold text-blue-600">${product.price}10</p>
                      {product.originalPrice && (
                        <p className="text-sm text-gray-400 line-through">${product.originalPrice}100</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* Carousel Navigation Buttons */}
          <button
            onClick={handlePrevious}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-lg hover:bg-gray-100"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-lg hover:bg-gray-100"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      </div>
    </section>
  );
}
