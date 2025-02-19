
"use client"
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "./card";
import { ChevronRight, ChevronLeft, Star } from "lucide-react";
import { Button } from "@medusajs/ui";

const products = [
  {
    name: "Premium Leather Bag",
    price: "Rs 7,999.99",
    originalPrice: "Rs 9,999.99",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3GALcaOEWsHVlsFtompzf_LrhM7FVuEwqmQ&s",
    description: "A stylish and durable leather bag for everyday use.",
    rating: 4.5,
    colors: 3,
    stock: 5,
    discount: 20,
  },
  {
    name: "Smartwatch Pro",
    price: "Rs 12,499.99",
    originalPrice: "Rs 14,999.99",
    image: "data:image/jpeg;base64,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",
    description: "Track your fitness and notifications with ease.",
    rating: 4.8,
    colors: 2,
    stock: 2,
    discount: 15,
  },
  {
    name: "Wireless Earbuds",
    price: "Rs 3,999.99",
    originalPrice: "Rs 5,499.99",
    image: "data:image/jpeg;base64,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",
    description: "Enjoy crystal-clear sound with these wireless earbuds.",
    rating: 4.2,
    colors: 4,
    stock: 10,
    discount: 27,
  },
  {
    name: "Gaming Headset",
    price: "Rs 6,499.99",
    originalPrice: "Rs 7,999.99",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSkzvZrXfdc1KuUiRTKGtjSrXuLQn_ZxkaeOQ&s",
    description: "Immersive sound experience for gaming enthusiasts.",
    rating: 4.6,
    colors: 2,
    stock: 3,
    discount: 18,
  },
  {
    name: "Bluetooth Speaker",
    price: "Rs 2,499.99",
    originalPrice: "Rs 3,999.99",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJNWhMyWQILNoVhNI-Wk5DDdYstcRNw6sRXw&s",
    description: "Portable and powerful wireless speaker.",
    rating: 4.4,
    colors: 3,
    stock: 7,
    discount: 25,
  },
  {
    name: "DSLR Camera",
    price: "Rs 49,999.99",
    originalPrice: "Rs 55,999.99",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtMGfxe8G2G2koUIGLG3iK_ouqoZtMGpQYGw&s",
    description: "Capture stunning photos and videos with high precision.",
    rating: 4.9,
    colors: 1,
    stock: 1,
    discount: 10,
  }
];

function FeaturedProductsss() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % products.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const visibleProducts = products.slice(currentIndex, currentIndex + 3);
  if (visibleProducts.length < 3) {
    visibleProducts.push(...products.slice(0, 3 - visibleProducts.length));
  }

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? products.length - 1 : prevIndex - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % products.length);
  };

  return (
    <section className="w-full bg-white py-16">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl text-black font-bold">Best Sellers</h2>
          <Button variant="transparent" className="group text-black">
            View All
            <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
        <div className="relative">
          <div className="flex gap-6 justify-center items-center overflow-hidden w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-6xl mx-auto">
              {visibleProducts.map((product, index) => (
                <Card key={index} className="overflow-hidden transition-transform hover:scale-105 relative">
                  {product.discount && (
                    <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Save {product.discount}%
                    </div>
                  )}
                  <div className="overflow-hidden h-48 md:h-56">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform hover:scale-110"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.description}</p>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < Math.floor(product.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">{product.rating.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-lg font-bold text-blue-600">{product.price}</p>
                      {product.originalPrice && (
                        <p className="text-sm text-gray-400 line-through">{product.originalPrice}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          <button
            onClick={handlePrevious}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 hidden md:block"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 hidden md:block"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      </div>
    </section>
  );
}

export default FeaturedProductsss;


