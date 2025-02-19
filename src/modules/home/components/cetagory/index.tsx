import LocalizedClientLink from "@modules/common/components/localized-client-link";
import React from "react";
export const Categories = () => {
  const categories = [
    {
      title: "Laptops",
      image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853",
      count: "150+ Products",
    },
    {
      title: "Desktop PCs",
      image: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5",
      count: "100+ Products",
    },
    {
      title: "Accessories",
      image: "https://images.unsplash.com/photo-1527814050087-3793815479db",
      count: "200+ Products",
    },
  ];
  return (
    <section className="w-full bg-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold mb-8">Shop by Category</h2>
        {/* <LocalizedClientLink
              href="/"
              className="txt-compact-xlarge-plus hover:text-ui-fg-base uppercase"
              data-testid="nav-store-link"
            >
              Shop by Category
            </LocalizedClientLink> */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div key={category.title} className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-lg">
                <img
                  src={category.image}
                  alt={category.title}
                  className="w-full h-64 object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end p-6">
                  <div className="text-white">
                    <h3 className="text-xl font-semibold">{category.title}</h3>
                    <p className="text-sm opacity-90">{category.count}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
