
"use client";  // This will ensure the component runs on the client side

import React from "react";
import { ArrowRight } from "lucide-react";

export const HeroSection = () => {
  // Static values
  const title = "Discover Our New Collection";
  const description = "Explore our handpicked selection of natural, exquisite, and healthy products that you will love.";
  
  // Static onShopNow function (redirects to '/shop' page)
  const onShopNow = () => {
    window.location.href = "/shop"; // Redirect to the shop page
  };

  return (
    <section className="w-full p-6 bg-black">
    <div className="relative bg-gray p-6 rounded-lg mb-12">
      <div className="flex flex-col md:flex-row gap-12 items-start">
        <div className="flex-1 max-w-xl">
          <div className="text-white font-medium text-sm mb-2">
            New Arriavals
          </div>
          <h1 className="text-3xl font-bold mb-4 text-white">{title}</h1>
          <p className="text-gray-600 mb-6 text-sm leading-relaxed">
            {description}
          </p>
          <button
            onClick={onShopNow}
            className="inline-flex items-center gap-2 bg-black text-white px-6 py-2 rounded hover:bg-transparent transition-colors text-sm font-medium"
          >
            BUY NOW
            <ArrowRight size={16} />
          </button>
        </div>
        <div className="flex-1">
          <img
            src="https://images.unsplash.com/photo-1603481546579-65d935ba9cdd?ixlib=rb-4.0.1&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80"
            alt="Featured Product"
            className="rounded-lg max-w-full h-auto"
          />
        </div>
      </div>
    </div>
    </section>
  );
};
