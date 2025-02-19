import React from "react";
export function CategorySections() {
  return (
    <section className="w-full p-6 bg-white">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#004B93] text-center mb-8 sm:mb-12">
            Featured Products
          </h2>
      <div className="container grid grid-cols-1 md:grid-cols-2 gap-4 max-w-7xl mx-auto">
        <div className="md:col-span-2 relative rounded-lg overflow-hidden group">
          <img
            src="https://media.gettyimages.com/id/545098584/photo/teenage-girl-listening-to-the-music-and-shaking-head.jpg?s=612x612&w=0&k=20&c=3_3FxIfsEvAvw-nEpogK15zKVPBHZFAR3FMhih5tZzU="
            alt="Apple products display"
            className="w-full h-[600px] object-cover"
          />
          <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-6">
            <h3 className="text-white text-3xl font-bold mb-2">
              Apple Products
            </h3>
            <button className="text-white flex items-center gap-2 hover:gap-3 transition-all">
              Explore <span className="text-lg">→</span>Popular Now
            </button>
          </div>
        </div>
        <div className="relative rounded-lg overflow-hidden group">
          <img
            src="https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?q=80&w=600"
            alt="Speakers category"
            className="w-full h-[250px] object-cover"
          />
          <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-6">
            <h3 className="text-white text-2xl font-bold mb-2">Speakers</h3>
            <button className="text-white flex items-center gap-2 hover:gap-3 transition-all">
              Explore <span className="text-lg">→</span>
            </button>
          </div>
        </div>
        <div className="relative rounded-lg overflow-hidden group">
          <img
            src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=600"
            alt="Cameras category"
            className="w-full h-[250px] object-cover"
          />
          <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-6">
            <h3 className="text-white text-2xl font-bold mb-2">Cameras</h3>
            <button className="text-white flex items-center gap-2 hover:gap-3 transition-all">
              Explore <span className="text-lg">→</span>
            </button>
          </div>
        </div>
        <div className="relative rounded-lg overflow-hidden group md:col-span-2">
          <img
            src="https://images.unsplash.com/photo-1491947153227-33d59da6c448?q=80&w=1200"
            alt="Accessories category"
            className="w-full h-[250px] object-cover"
          />
          <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-6">
            <h3 className="text-white text-2xl font-bold mb-2">Accessories</h3>
            <button className="text-white flex items-center gap-2 hover:gap-3 transition-all">
              Explore <span className="text-lg">→</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
