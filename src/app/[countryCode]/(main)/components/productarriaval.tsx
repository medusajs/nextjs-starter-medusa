// import React from "react";
// interface ProductCardProps {
//   title: string;
//   price: string;
//   image: string;
//   soldOut?: boolean;
// }
// export const ProductCard = ({
//   title,
//   price,
//   image,
//   soldOut,
// }: ProductCardProps) => {
//   return (
//     <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
//       <div className="relative">
//         <img
//           src={image}
//           alt={title}
//           className="w-full h-48 object-contain p-4"
//         />
//         {soldOut && (
//           <div className="absolute top-2 left-2 bg-gray-600 text-white text-xs px-2 py-1 rounded">
//             Sold out
//           </div>
//         )}
//       </div>
//       <div className="p-4 border-t">
//         <h3 className="text-sm font-medium line-clamp-2 mb-2">{title}</h3>
//         <p className="text-sm font-medium text-gray-900">{price}</p>
//         <p className="text-xs text-gray-500 mt-1">
//           or pay in 3 x Rs 1,999.66 with{" "}
//           <span className="font-medium">KOKO</span>{" "}
//           <span className="text-gray-400">T&C Apply</span>
//         </p>
//       </div>
//     </div>
//   );
// };


import React from "react";

export const ProductCard = () => {
  // Static data for multiple products
  const products = [
    {
      title: "Product 1",
      price: "Rs 5,999.99",
      image: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?ixlib=rb-4.0.1&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2942&q=80", // Replace with your image URL
      soldOut: false,
    },
    {
      title: "Product 2",
      price: "Rs 2,999.99",
      image: "data:image/jpeg;base64,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",
      soldOut: true,
    },
    {
      title: "Product 3",
      price: "Rs 1,999.99",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ2t03UmxOQ06mJ7IOaAHQ7d-Fekvu2g74d7Q&s",
      soldOut: false,
    },
    {
      title: "Product 4",
      price: "Rs 4,499.99",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJtbDmowdhtSPuTkCEGsggbFvl2gu5Pmt8sA&s",
      soldOut: true,
    },
    {
      title: "Product 5",
      price: "Rs 3,499.99",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-jbrVdg7nhWy36Xyz0NewXYPN-DJcA25V1A&s",
      soldOut: false,
    },
    {
      title: "Product 6",
      price: "Rs 7,199.99",
      image: "data:image/jpeg;base64,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",
      soldOut: false,
    },
  ];

  return (

<section className="w-full p-6 bg-black dark:bg-black">
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 p-6">
    {products.map((product, index) => (
      <div
        key={index}
        className="bg-black rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out transform hover:scale-105 dark:bg-black dark:border-gray-700 dark:text-white"
      >
        <div className="relative">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-48 object-cover p-4 transition-transform duration-500 transform hover:scale-110"
          />
          {product.soldOut && (
            <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full">
              Sold out
            </div>
          )}
        </div>
        <div className="p-5 border-t border-gray-700 dark:border-gray-600">
          <h3 className="text-lg font-semibold text-white line-clamp-2 mb-2">
            {product.title}
          </h3>
          <p className="text-md font-medium text-white">
            {product.price}
          </p>
          <p className="text-xs text-white mt-1">
            or pay in 3 x Rs 1,999.66 with{" "}
            <span className="font-medium">KOKO</span>{" "}
            <span className="text-gray-400">T&C Apply</span>
          </p>
        </div>
      </div>
    ))}
  </div>
</section>




    

  );
};
