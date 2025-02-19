// // /app/[countryCode]/(main)/mystore/page.tsx
// "use client";
// import { useEffect, useState } from "react";
// import { fetchProducts } from "@lib/data/myproducts"; // Adjust to your Medusa product fetching logic
// import Link from "next/link";

// export default function StorePage() {
//   const [products, setProducts] = useState<any[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);

//   useEffect(() => {
//     const loadProducts = async () => {
//       try {
//         const { products } = await fetchProducts("dk", 12); // Fetch all products
//         setProducts(products);
//       } catch (error) {
//         console.error("Error loading products:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadProducts();
//   }, []);

//   if (loading) return <p className="text-center">Loading products...</p>;

//   return (
//     <section className="w-full bg-white py-20 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-7xl mx-auto">
//         <h2 className="text-2xl font-bold text-gray-900 mb-4">All Products</h2>
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
//           {products.length > 0 ? (
//             products.map((product) => (
//               <Link key={product.id} href={`/mystore/${product.category}/${product.id}`}>
//                 <div className="group relative border rounded-lg shadow-md p-4">
//                   <img src={product.image || "/fallback.jpg"} alt={product.name} />
//                   <h3 className="text-lg font-semibold mt-4">{product.name}</h3>
//                   <p>{product.description}</p>
//                   <p>${product.price}</p>
//                 </div>
//               </Link>
//             ))
//           ) : (
//             <p>No products found.</p>
//           )}
//         </div>
//       </div>
//     </section>
//   );
// }


// /app/[countryCode]/(main)/mystore/page.tsx







// "use client";
// import { useEffect, useState } from "react";
// import { fetchProducts } from "@lib/data/myproducts"; // Adjust this import to your actual data fetching logic
// import Link from "next/link";

// export default function ProductList() {
//   const [products, setProducts] = useState<any[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);

//   useEffect(() => {
//     const loadProducts = async () => {
//       try {
//         const { products } = await fetchProducts("dk", 12); // Change "dk" with country code if necessary
//         setProducts(products);
//       } catch (error) {
//         console.error("Error loading products:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadProducts();
//   }, []); // Empty array ensures this only runs once when the component mounts

//   if (loading) return <p className="text-center">Loading products...</p>;

//   return (
//     <section className="w-full bg-white py-20 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="flex justify-between items-end mb-12">
//           <div>
//             <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-2">
//               {/* Featured Products */}
//             </h2>
//             <p className="text-gray-600">Discover our premium selection</p>
//           </div>
//           {/* Optional link to view all products */}
//           <Link href="/store">
//             {/* Uncomment and style the button if needed */}
//             {/* <button className="hidden sm:flex items-center gap-2 bg-transparent text-blue-500 border border-blue-500 px-4 py-2 rounded hover:bg-blue-100">
//               View All
//             </button> */}
//           </Link>
//         </div>

//         {/* Product Grid */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
//           {products.length > 0 ? (
//             products.map((product) => (
//               <Link key={product.id} href={`/products/${product.handle}`}>
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
//             <p className="col-span-3 text-center text-gray-500">No products found.</p>
//           )}
//         </div>
//       </div>
//       console.console.log(product.category);
      
//     </section>
//   );
// }





"use client";

import { useEffect, useState } from "react";
import { fetchProducts } from "@lib/data/myproducts";
import Link from "next/link";
import Image from "next/image";

export default function ProductList() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Filters
  const [category, setCategory] = useState<string>("");
  const [brand, setBrand] = useState<string>("");
  const [minPrice, setMinPrice] = useState<number | "">("");
  const [maxPrice, setMaxPrice] = useState<number | "">("");

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const filters: Record<string, any> = {};

        if (category) filters.category = category;
        if (brand) filters.brand = brand;
        if (minPrice) filters.min_price = minPrice;
        if (maxPrice) filters.max_price = maxPrice;

        const { products } = await fetchProducts("dk", 12, 0, filters);
        setProducts(products);
        console.log("Fetched Products:", products);
      } catch (error) {
        console.error("Error loading products:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [category, brand, minPrice, maxPrice]); // Runs when filters change

  if (loading) return <p className="text-center">Loading products...</p>;

  return (
    <section className="w-full bg-white py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Filters Section */}
        <div className="flex flex-wrap justify items-center mb-6 bg-white p-4 rounded-lg ">
          
          {/* Category Filter */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold">Category:</label>
            <select 
              className="border-none p-2 rounded"
              value={category} 
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              <option value="electronics">Electronics</option>
              <option value="clothing">Clothing</option>
              <option value="shoes">Shoes</option>
            </select>
          </div>

          {/* Brand Filter */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold">Brand:</label>
            <select 
              className="border-none p-2 rounded"
              value={brand} 
              onChange={(e) => setBrand(e.target.value)}
            >
              <option value="">All Brands</option>
              <option value="nike">Nike</option>
              <option value="adidas">Adidas</option>
              <option value="apple">Apple</option>
            </select>
          </div>

          {/* Price Range Filter */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold">Price Range:</label>
            <div className="flex gap-2">
              <input 
                type="number" 
                className="border-none p-2 rounded w-20"
                placeholder="Min"
                value={minPrice} 
                onChange={(e) => setMinPrice(e.target.value ? Number(e.target.value) : "")} 
              />
              <input 
                type="number" 
                className="border-none p-2 rounded w-20"
                placeholder="Max"
                value={maxPrice} 
                onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : "")} 
              />
            </div>
          </div>
          
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.length > 0 ? (
            products.map((product) => (
              <Link key={product.id} href={`/products/${product.handle}`}>
                <div className="group relative border rounded-lg shadow-md bg-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl cursor-pointer">
                  
                  {/* Product Image */}
                  <div className="aspect-[4/3] overflow-hidden rounded-lg">
                    <Image
                      src={product.image || product.thumbnail || "/fallback.jpg"}
                      alt={product.name || "Product image"}
                      width={300}
                      height={200}
                      className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                  {/* Product Details */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    <p className="text-sm">{product.category}</p>
                    <h3 className="text-lg font-bold mb-2">{product.name || product.title}</h3>
                    <p className="text-gray-300 line-clamp-2">{product.description}</p>
                    <p className="text-lg font-semibold mt-2">${product.price}</p>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <p className="col-span-3 text-center text-gray-500">No products found.</p>
          )}
        </div>
      </div>
    </section>
  );
}





