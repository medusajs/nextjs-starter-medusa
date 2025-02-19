"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight, ArrowRight, Badge } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
import { Button } from "@medusajs/ui"

interface Product {
    id: number
    name: string
    price: {
        original: number
        discounted: number
    }
    image: string
    discount: number
    rating: number
    inStock: number
    colors?: number
}

const products: Product[] = [
    {
        id: 1,
        name: "Anker Soundcore Life 2 Neo Wireless Over-Ear Bluetooth Headphones",
        price: {
            original: 15999,
            discounted: 9999
        },
        image: "https://www.sala.lk/public/dbimages/product/1697172166_pdt_1.jpg",
        discount: 41,
        rating: 4.5,
        inStock: 1
    },
    {
        id: 2,
        name: "Anker Soundcore Space Q45 ANC Headphones",
        price: {
            original: 35999,
            discounted: 29999
        },
        image: "https://www.sala.lk/public/dbimages/product/1697172166_pdt_2.jpg",
        discount: 17,
        rating: 4.83,
        inStock: 2,
        colors: 3
    },
    {
        id: 3,
        name: "Anker Soundcore R50i True Wireless Earbuds",
        price: {
            original: 7599,
            discounted: 4999
        },
        image: "https://www.sala.lk/public/dbimages/product/1697172166_pdt_3.jpg",
        discount: 35,
        rating: 4.94,
        inStock: 5,
        colors: 3
    },
    {
        id: 4,
        name: "Anker Soundcore Life P2 Mini True Wireless Earbuds",
        price: {
            original: 12999,
            discounted: 8999
        },
        image: "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcRTOq4dMnPsVMR3nrQR8o_WoDiy13WOZx0RZvtX9EUuF2E1iX8l4Np3hrZnZybqopn6vmDbj5YCyXp4HpK7wnwIbVkdCwUpBax6rcUDjnuS3NyKGYNLuY-3",
        discount: 31,
        rating: 4.7,
        inStock: 3,
        colors: 4
    },
    {
        id: 5,
        name: "Anker Soundcore Liberty Air 2 Pro True Wireless Earbuds",
        price: {
            original: 25999,
            discounted: 19999
        },
        image: "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcR96OA0qRl_2iNgHOcslOH__UcUV-Vzsm-JALo-NH7BIPh7Vho30gvpiw8ins4ga6XKz0GgaQummXeOJ1jT8QIDcoGztgYHCqZOO2pjFPpO9oP6GEhyUZ6F",
        discount: 23,
        rating: 4.88,
        inStock: 4,
        colors: 4
    }
]

export function FeaturedProductsb() {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [touchStart, setTouchStart] = useState(0)
    const [touchEnd, setTouchEnd] = useState(0)

    // Calculate products to show based on screen size
    const [productsToShow, setProductsToShow] = useState(3)

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 640) {
                setProductsToShow(1)
            } else if (window.innerWidth < 1024) {
                setProductsToShow(2)
            } else {
                setProductsToShow(3)
            }
        }

        handleResize()
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    const nextSlide = () => {
        setCurrentIndex((prev) =>
            (prev + 1) % (products.length - productsToShow + 1)
        )
    }

    const prevSlide = () => {
        setCurrentIndex((prev) =>
            prev === 0 ? products.length - productsToShow : prev - 1
        )
    }

    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchStart(e.targetTouches[0].clientX)
    }

    const handleTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX)
    }

    const handleTouchEnd = () => {
        if (!touchStart || !touchEnd) return

        const distance = touchStart - touchEnd
        const isLeftSwipe = distance > 50
        const isRightSwipe = distance < -50

        if (isLeftSwipe) {
            nextSlide()
        }
        if (isRightSwipe) {
            prevSlide()
        }

        setTouchStart(0)
        setTouchEnd(0)
    }

    useEffect(() => {
        const timer = setInterval(nextSlide, 5000)
        return () => clearInterval(timer)
    }, [])

    return (
        <section className="w-full bg-white py-24">
            <div className="container mx-auto px-4">
                <h2 className="text-4xl sm:text-5xl font-black text-[#004B93] text-center mb-16">
                    FEATURED PRODUCTS
                </h2>

                <div className="relative">
                    <div className="overflow-hidden">
                        <div
                            className="flex transition-transform duration-500 ease-in-out"
                            style={{ transform: `translateX(-${currentIndex * (100 / productsToShow)}%)` }}
                            onTouchStart={handleTouchStart}
                            onTouchMove={handleTouchMove}
                            onTouchEnd={handleTouchEnd}
                        >
                            {products.map((product) => (
                                <div
                                    key={product.id}
                                    className="min-w-full sm:min-w-[calc(100%/2)] lg:min-w-[calc(100%/3)] px-4"
                                >
                                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden group">
                                        <div className="relative aspect-square">
                                            <Badge
                                                className="absolute top-4 left-4 bg-red-500 text-white text-xs sm:text-sm"
                                            >
                                                Save {product.discount}%
                                            </Badge>
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                        </div>
                                        <div className="p-4 sm:p-6">
                                            <h3 className="text-base sm:text-lg font-semibold text-gray-800 line-clamp-2 mb-2">
                                                {product.name}
                                            </h3>
                                            <div className="flex items-center gap-2 mb-4">
                                                <div className="flex items-center text-yellow-400">
                                                    {"★".repeat(Math.floor(product.rating))}
                                                    <span className="text-xs sm:text-sm text-gray-600 ml-1">
                                                        {product.rating}
                                                    </span>
                                                </div>
                                                <span className="text-xs sm:text-sm text-gray-500">
                                                    {product.inStock} in stock
                                                </span>
                                                {product.colors && (
                                                    <span className="text-xs sm:text-sm text-gray-500">
                                                        Available in {product.colors} colors
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                                <div>
                                                    <span className="text-xl sm:text-2xl font-bold text-[#004B93]">
                                                        Rs {product.price.discounted.toLocaleString()}
                                                    </span>
                                                    <span className="block text-xs sm:text-sm text-gray-500 line-through">
                                                        Rs {product.price.original.toLocaleString()}
                                                    </span>
                                                </div>
                                                <Button
                                                    className="bg-[#004B93] text-white hover:bg-[#004B93]/90 w-full sm:w-auto"
                                                >
                                                    View Details
                                                    <ArrowRight className="ml-2 h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Navigation Arrows */}
                    <button
                        onClick={prevSlide}
                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 bg-white shadow-lg text-[#004B93] p-2 sm:p-3 rounded-full hover:bg-[#004B93] hover:text-white transition-all hidden sm:block"
                    >
                        <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 bg-white shadow-lg text-[#004B93] p-2 sm:p-3 rounded-full hover:bg-[#004B93] hover:text-white transition-all hidden sm:block"
                    >
                        <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
                    </button>
                </div>

                {/* Mobile Navigation Dots */}
                <div className="flex justify-center gap-2 mt-6 sm:hidden">
                    {Array.from({ length: products.length - (productsToShow - 1) }).map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`h-2 rounded-full transition-all duration-300 ${index === currentIndex ? "w-8 bg-[#004B93]" : "w-2 bg-[#004B93]/30"
                                }`}
                        />
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <Button
                        size="large"
                        className="bg-[#004B93] text-white hover:bg-[#004B93]/90 text-base sm:text-lg h-11 sm:h-12 px-6 sm:px-8 w-full sm:w-auto max-w-xs mx-auto"
                    >
                        View All Featured Products
                        <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                    </Button>
                </div>
            </div>
        </section>
    )
} 