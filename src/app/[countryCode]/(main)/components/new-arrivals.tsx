// "use client"

// // import { Button } from "@medusajs/ui"
// import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"
// // import { Button } from "@/components/ui/button"
// // import { Badge } from "@/components/ui/badge"
// import { useState, useEffect } from "react"
// import { Badge } from "../ui/badge"
// import { Button } from "../ui/button"

// interface Product {
//     id: number
//     name: string
//     description: string
//     price: {
//         original: number
//         discounted?: number
//     }
//     image: string
//     category: string
//     badge?: string
//     inStock: boolean
//     link: string
// }

// const featuredProduct = {
//     id: 1,
//     name: "Premium Blue Butterfly Pea Tea",
//     description: "Indulge in the mesmerizing allure of our premium Blue Butterfly Pea Tea, a delightful infusion that not only captivates your senses but also boasts numerous health benefits. Sourced from the finest handpicked butterfly pea flowers, this exquisite tea is a true masterpiece of nature.",
//     category: "EXQUISITE, NATURAL, AND HEALTHY",
//     image: "https://d.newsweek.com/en/full/2550217/tea-bag.jpg?w=1600&h=1200&q=88&f=231baac7b165b551ce1f8081ee9c8bc9",
//     link: "/products/blue-tea"
// }

// const newProducts: Product[] = [
//     {
//         id: 1,
//         name: "UGREEN Uno Charger 65W - UK PIN (25686)",
//         description: "Fast charging solution for all your devices",
//         price: {
//             original: 9999,
//             discounted: 3333
//         },
//         image: "https://www.sala.lk/public/dbimages/product/1719201932_pdt_1.jpg",
//         category: "Chargers",
//         badge: "Sold out",
//         inStock: false,
//         link: "/products/ugreen-charger"
//     },
//     {
//         id: 2,
//         name: "UGREEN Bluetooth FM Transmitter Car Charger (80910)",
//         description: "Wireless audio streaming and charging",
//         price: {
//             original: 5999,
//             discounted: 1999
//         },
//         image: "https://www.sala.lk/public/dbimages/product/1683178785_pdt_1.jpg",
//         category: "Car Accessories",
//         badge: "Sold out",
//         inStock: false,
//         link: "/products/ugreen-fm"
//     },
//     {
//         id: 3,
//         name: "UGREEN USB-C Car Charger 130W (90413)",
//         description: "High-power car charging solution",
//         price: {
//             original: 5999
//         },
//         image: "https://www.sala.lk/public/dbimages/product/1705911108_pdt_1.jpg",
//         category: "Chargers",
//         badge: "Sold out",
//         inStock: false,
//         link: "/products/ugreen-usbc"
//     },
//     {
//         id: 4,
//         name: "Anker Soundcore Rave Party 2 (120W) Portable Speaker",
//         description: "Powerful portable party speaker",
//         price: {
//             original: 59999,
//             discounted: 49999
//         },
//         image: "https://www.sala.lk/public/dbimages/product/1696834873_pdt_1.jpg",
//         category: "Speakers",
//         inStock: true,
//         link: "/products/anker-speaker"
//     }
// ]

// export function NewArrivalsb() {
//     const [currentIndex, setCurrentIndex] = useState(0)
//     const [touchStart, setTouchStart] = useState(0)
//     const [touchEnd, setTouchEnd] = useState(0)

//     // Calculate products to show based on screen size
//     const [productsToShow, setProductsToShow] = useState(4)

//     useEffect(() => {
//         const handleResize = () => {
//             if (window.innerWidth < 640) {
//                 setProductsToShow(1)
//             } else if (window.innerWidth < 1024) {
//                 setProductsToShow(2)
//             } else {
//                 setProductsToShow(4)
//             }
//         }

//         handleResize()
//         window.addEventListener('resize', handleResize)
//         return () => window.removeEventListener('resize', handleResize)
//     }, [])

//     const nextSlide = () => {
//         setCurrentIndex((prev) =>
//             (prev + 1) % (newProducts.length - productsToShow + 1)
//         )
//     }

//     const prevSlide = () => {
//         setCurrentIndex((prev) =>
//             prev === 0 ? newProducts.length - productsToShow : prev - 1
//         )
//     }

//     const handleTouchStart = (e: React.TouchEvent) => {
//         setTouchStart(e.targetTouches[0].clientX)
//     }

//     const handleTouchMove = (e: React.TouchEvent) => {
//         setTouchEnd(e.targetTouches[0].clientX)
//     }

//     const handleTouchEnd = () => {
//         if (!touchStart || !touchEnd) return

//         const distance = touchStart - touchEnd
//         const isLeftSwipe = distance > 50
//         const isRightSwipe = distance < -50

//         if (isLeftSwipe) {
//             nextSlide()
//         }
//         if (isRightSwipe) {
//             prevSlide()
//         }

//         setTouchStart(0)
//         setTouchEnd(0)
//     }

//     useEffect(() => {
//         const timer = setInterval(nextSlide, 5000)
//         return () => clearInterval(timer)
//     }, [])

//     return (
//         <section className="w-full bg-white py-16 sm:py-24">
//             <div className="container mx-auto px-4">
//                 <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#004B93] text-center mb-8 sm:mb-12">
//                     NEW ARRIVALS
//                 </h2>

//                 {/* Featured Product */}
//                 <div className="bg-gray-50 rounded-3xl overflow-hidden mb-8 sm:mb-12 transform transition-all duration-500 hover:shadow-xl">
//                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 p-6 sm:p-8 lg:p-12">
//                         <div className="flex flex-col justify-center lg:pr-8">
//                             <div className="space-y-4 sm:space-y-6">
//                                 <Badge className="bg-[#004B93]/10 text-[#004B93] text-xs sm:text-sm hover:bg-[#004B93]/20 inline-flex items-center px-4 py-1.5">
//                                     {featuredProduct.category}
//                                 </Badge>
//                                 <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 leading-tight">
//                                     {featuredProduct.name}
//                                 </h3>
//                                 <p className="text-sm sm:text-base text-gray-600 leading-relaxed max-w-xl">
//                                     {featuredProduct.description}
//                                 </p>
//                                 <Button
//                                     size="lg"
//                                     className="bg-[#004B93] text-white hover:bg-[#004B93]/90 text-sm sm:text-base h-11 sm:h-12 px-6 sm:px-8 w-full sm:w-auto inline-flex items-center justify-center"
//                                 >
//                                     Buy Now
//                                     <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
//                                 </Button>
//                             </div>
//                         </div>
//                         <div className="relative aspect-square lg:aspect-auto lg:h-full">
//                             <img
//                                 src={featuredProduct.image}
//                                 alt={featuredProduct.name}
//                                 className="h-full w-full object-cover rounded-2xl transform transition-all duration-500 hover:scale-105"
//                             />
//                         </div>
//                     </div>
//                 </div>

//                 {/* New Products Slider */}
//                 <div className="relative">
//                     <div className="overflow-hidden">
//                         <div
//                             className="flex transition-transform duration-500 ease-in-out"
//                             style={{ transform: `translateX(-${currentIndex * (100 / productsToShow)}%)` }}
//                             onTouchStart={handleTouchStart}
//                             onTouchMove={handleTouchMove}
//                             onTouchEnd={handleTouchEnd}
//                         >
//                             {newProducts.map((product) => (
//                                 <div
//                                     key={product.id}
//                                     className="min-w-full sm:min-w-[calc(100%/2)] lg:min-w-[calc(100%/4)] px-3 sm:px-4"
//                                 >
//                                     <div className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden h-full">
//                                         <div className="relative aspect-square overflow-hidden">
//                                             {product.badge && (
//                                                 <Badge
//                                                     className="absolute top-4 left-4 bg-red-500 text-white text-xs px-2 py-0.5"
//                                                 >
//                                                     {product.badge}
//                                                 </Badge>
//                                             )}
//                                             <img
//                                                 src={product.image}
//                                                 alt={product.name}
//                                                 className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
//                                             />
//                                         </div>
//                                         <div className="p-4 sm:p-6">
//                                             <h3 className="text-sm sm:text-base font-semibold text-gray-800 line-clamp-2 mb-2">
//                                                 {product.name}
//                                             </h3>
//                                             <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
//                                                 <div>
//                                                     {product.price.discounted ? (
//                                                         <>
//                                                             <span className="text-lg sm:text-xl font-bold text-[#004B93]">
//                                                                 Rs {product.price.discounted.toLocaleString()}
//                                                             </span>
//                                                             <span className="block text-xs text-gray-500 line-through mt-0.5">
//                                                                 Rs {product.price.original.toLocaleString()}
//                                                             </span>
//                                                         </>
//                                                     ) : (
//                                                         <span className="text-lg sm:text-xl font-bold text-[#004B93]">
//                                                             Rs {product.price.original.toLocaleString()}
//                                                         </span>
//                                                     )}
//                                                 </div>
//                                                 <Button
//                                                     className="bg-[#004B93] text-white hover:bg-[#004B93]/90 w-full sm:w-auto text-sm group-hover:scale-105 transition-transform duration-300"
//                                                 >
//                                                     View Details
//                                                     <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
//                                                 </Button>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>

//                     {/* Navigation Arrows */}
//                     <button
//                         onClick={prevSlide}
//                         className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 bg-white shadow-lg text-[#004B93] p-2 sm:p-3 rounded-full hover:bg-[#004B93] hover:text-white transition-all duration-300 hidden sm:block transform hover:scale-110"
//                     >
//                         <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
//                     </button>
//                     <button
//                         onClick={nextSlide}
//                         className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 bg-white shadow-lg text-[#004B93] p-2 sm:p-3 rounded-full hover:bg-[#004B93] hover:text-white transition-all duration-300 hidden sm:block transform hover:scale-110"
//                     >
//                         <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
//                     </button>
//                 </div>

//                 {/* Mobile Navigation Dots */}
//                 <div className="flex justify-center gap-2 mt-6 sm:hidden">
//                     {Array.from({ length: newProducts.length - (productsToShow - 1) }).map((_, index) => (
//                         <button
//                             key={index}
//                             onClick={() => setCurrentIndex(index)}
//                             className={`h-2 rounded-full transition-all duration-300 ${index === currentIndex ? "w-8 bg-[#004B93]" : "w-2 bg-[#004B93]/30"
//                                 }`}
//                         />
//                     ))}
//                 </div>
//             </div>
//         </section>
//     )
// }

// "use client"

// import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
// import { useState, useEffect } from "react";
// import { Badge } from "../ui/badge";
// import { Button } from "../ui/button";
// import { fetchProducts } from "@lib/data/myproducts";
// // import { fetchProducts } from "@lib/api"; // Adjust the import path as needed

// interface Product {
//     id: string;
//     title: string;
//     description: string;
//     images: { url: string }[];
//     prices: { original: number; discounted?: number };
//     inStock: boolean;
//     handle: string;
// }

// export function NewArrivalsb() {
//     const [products, setProducts] = useState<Product[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState<string | null>(null);
//     const [currentIndex, setCurrentIndex] = useState(0);
//     const [productsToShow, setProductsToShow] = useState(4);

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const response = await fetchProducts("dk", 12, 0, {}); // Adjust country code dynamically
//                 setProducts(response.products);
//             } catch (err) {
//                 setError("Failed to fetch products.");
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchData();
//     }, []);

//     useEffect(() => {
//         const handleResize = () => {
//             setProductsToShow(window.innerWidth < 640 ? 1 : window.innerWidth < 1024 ? 2 : 4);
//         };
//         handleResize();
//         window.addEventListener("resize", handleResize);
//         return () => window.removeEventListener("resize", handleResize);
//     }, []);

//     const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % (products.length - productsToShow + 1));
//     const prevSlide = () => setCurrentIndex((prev) => (prev === 0 ? products.length - productsToShow : prev - 1));

//     if (loading) return <p>Loading products...</p>;
//     if (error) return <p>{error}</p>;

//     return (
//         <section className="w-full bg-white py-16 sm:py-24">
//             <div className="container mx-auto px-4">
//                 <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#004B93] text-center mb-8 sm:mb-12">
//                     NEW ARRIVALS
//                 </h2>
//                 <div className="relative">
//                     <div className="overflow-hidden">
//                         <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentIndex * (100 / productsToShow)}%)` }}>
//                             {products.map((product) => (
//                                 <div key={product.id} className="min-w-full sm:min-w-[calc(100%/2)] lg:min-w-[calc(100%/4)] px-3 sm:px-4">
//                                     <div className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden h-full">
//                                         <div className="relative aspect-square overflow-hidden">
//                                             <img src={product.images[0]?.url} alt={product.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
//                                         </div>
//                                         <div className="p-4 sm:p-6">
//                                             <h3 className="text-sm sm:text-base font-semibold text-gray-800 line-clamp-2 mb-2">
//                                                 {product.title}
//                                             </h3>
//                                             <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
//                                                 {/* <div>
//                                                     {product.prices.discounted ? (
//                                                         <>
//                                                             <span className="text-lg sm:text-xl font-bold text-[#004B93]">
//                                                                 Rs {product.prices.discounted.toLocaleString()}
//                                                             </span>
//                                                             <span className="block text-xs text-gray-500 line-through mt-0.5">
//                                                                 Rs {product.prices.original.toLocaleString()}
//                                                             </span>
//                                                         </>
//                                                     ) : (
//                                                         <span className="text-lg sm:text-xl font-bold text-[#004B93]">
//                                                             Rs {product.prices.original.toLocaleString()}
//                                                         </span>
//                                                     )}
//                                                 </div> */}

// <div>
//     <span className="text-lg sm:text-xl font-bold text-[#004B93]">
//         Rs {product.prices?.discounted?.toLocaleString() || product.prices?.original?.toLocaleString() || "N/A"}
//     </span>
//     {product.prices?.discounted && (
//         <span className="block text-xs text-gray-500 line-through mt-0.5">
//             Rs {product.prices?.original?.toLocaleString()}
//         </span>
//     )}
// </div>

//                                                 <Button className="bg-[#004B93] text-white hover:bg-[#004B93]/90 w-full sm:w-auto text-sm group-hover:scale-105 transition-transform duration-300">
//                                                     View Details
//                                                     <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
//                                                 </Button>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                     <button onClick={prevSlide} className="absolute left-0 top-1/2 -translate-y-1/2 bg-white shadow-lg text-[#004B93] p-2 sm:p-3 rounded-full hover:bg-[#004B93] hover:text-white transition-all duration-300 hidden sm:block">
//                         <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
//                     </button>
//                     <button onClick={nextSlide} className="absolute right-0 top-1/2 -translate-y-1/2 bg-white shadow-lg text-[#004B93] p-2 sm:p-3 rounded-full hover:bg-[#004B93] hover:text-white transition-all duration-300 hidden sm:block">
//                         <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
//                     </button>
//                 </div>
//             </div>
//         </section>
//     );
// }

"use client"

import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"
import { useState, useEffect } from "react"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { fetchProducts } from "@lib/data/myproducts"

interface Product {
  id: string
  title: string
  description: string
  images: { url: string }[]
  prices: { original: number; discounted?: number }
  inStock: boolean
  handle: string
}

interface FeaturedProduct {
  category: string
  name: string
  description: string
  image: string
}

export function NewArrivalsb() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [productsToShow, setProductsToShow] = useState(4)

  const featuredProduct: FeaturedProduct = {
    category: "Limited Edition",
    name: "Exclusive Devices",
    description:
      "Step into style with our latest drop of premium devices. Limited stock available!",
    image:
      "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?ixlib=rb-4.0.1&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2942&q=80", // Update with the actual image path
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchProducts("dk", 12, 0, {})
        setProducts(response.products)
      } catch (err) {
        setError("Failed to fetch products.")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    const handleResize = () => {
      setProductsToShow(
        window.innerWidth < 640 ? 1 : window.innerWidth < 1024 ? 2 : 4
      )
    }
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const nextSlide = () =>
    setCurrentIndex(
      (prev) => (prev + 1) % (products.length - productsToShow + 1)
    )
  const prevSlide = () =>
    setCurrentIndex((prev) =>
      prev === 0 ? products.length - productsToShow : prev - 1
    )

  if (loading) return <p>Loading products...</p>
  if (error) return <p>{error}</p>

  return (
    <section className="w-full bg-white py-16 sm:py-24">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#004B93] text-center mb-8 sm:mb-12">
          NEW ARRIVALS
        </h2>

        {/* Featured Product */}
        <div className="bg-gray-50 rounded-3xl overflow-hidden mb-8 sm:mb-12 transform transition-all duration-500 hover:shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 p-6 sm:p-8 lg:p-12">
            <div className="flex flex-col justify-center lg:pr-8">
              <div className="space-y-4 sm:space-y-6">
                <Badge className="bg-[#004B93]/10 text-[#004B93] text-xs sm:text-sm hover:bg-[#004B93]/20 inline-flex items-center px-4 py-1.5">
                  {featuredProduct.category}
                </Badge>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 leading-tight">
                  {featuredProduct.name}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed max-w-xl">
                  {featuredProduct.description}
                </p>
                <Button
                  size="lg"
                  className="bg-[#004B93] text-white hover:bg-[#004B93]/90 text-sm sm:text-base h-11 sm:h-12 px-6 sm:px-8 w-full sm:w-auto inline-flex items-center justify-center"
                >
                  Buy Now
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </div>
            </div>
            <div className="relative aspect-square lg:aspect-auto lg:h-full">
              <img
                src={featuredProduct.image}
                alt={featuredProduct.name}
                className="h-full w-full object-cover rounded-2xl transform transition-all duration-500 hover:scale-105"
              />
            </div>
          </div>
        </div>

        {/* Product Slider */}
        <div className="relative">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${
                  currentIndex * (100 / productsToShow)
                }%)`,
              }}
            >
              {products.map((product) => (
                <div
                  key={product.id}
                  className="min-w-full sm:min-w-[calc(100%/2)] md:min-w-[calc(100%/3)] lg:min-w-[calc(100%/4)] px-3 sm:px-4"
                >
                  <div className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden h-full">
                    <div className="relative aspect-square overflow-hidden">
                      <img
                        src={product.images[0]?.url}
                        alt={product.title}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    </div>
                    <div className="p-4 sm:p-6">
                      <h3 className="text-sm sm:text-base font-semibold text-gray-800 line-clamp-2 mb-2">
                        {product.title}
                      </h3>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div>
                          <span className="text-lg sm:text-xl font-bold text-[#004B93]">
                            $10{" "}
                            {product.prices?.discounted?.toLocaleString() ||
                              product.prices?.original?.toLocaleString() ||
                              "N/A"}
                          </span>
                          {product.prices?.discounted && (
                            <span className="block text-xs text-gray-500 line-through mt-0.5">
                              Rs {product.prices?.original?.toLocaleString()}
                            </span>
                          )}
                        </div>
                        <Button className="bg-[#004B93] text-white hover:bg-[#004B93]/90 w-full sm:w-auto text-sm group-hover:scale-105 transition-transform duration-300">
                          View Details
                          <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-white shadow-lg text-[#004B93] p-2 sm:p-3 md:p-4 rounded-full hover:bg-[#004B93] hover:text-white transition-all duration-300 flex items-center justify-center z-10"
          >
            <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-white shadow-lg text-[#004B93] p-2 sm:p-3 md:p-4 rounded-full hover:bg-[#004B93] hover:text-white transition-all duration-300 flex items-center justify-center z-10"
          >
            <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7" />
          </button>
        </div>
      </div>
    </section>
  )
}
