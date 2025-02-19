


// import { Facebook, Github } from "@medusajs/icons";
// import { Button, Heading, Text } from "@medusajs/ui";
// import LocalizedClientLink from "@modules/common/components/localized-client-link";

// const Hero = () => {
//   return (
//     <div className="h-[75vh] w-full border-b border-ui-border-base relative bg-ui-bg-subtle">
//       <div className="absolute inset-0 z-10 flex flex-col justify-center items-center text-center small:p-32 gap-6">
//         {/* Heading Section */}
//         <span>
//           <Heading
//             level="h1"
//             className="text-4xl leading-10 text-ui-fg-base font-semibold"
//           >
//             Sala.lk Online
//           </Heading>
//           <Heading
//             level="h2"
//             className="text-2xl leading-8 text-ui-fg-subtle font-normal mt-2"
//           >
//             Your One-Stop Shop for All Your Needs
//           </Heading>
//         </span>

//         {/* Description */}
//         <Text className="text-base text-ui-fg-muted max-w-lg">
//           Discover the best deals, top brands, and unbeatable service at Sala.lk. 
//           From electronics to fashion, we bring the store to your door!
//         </Text>

//         {/* Follow Us Button */}
//         <div className="flex gap-4">
//           <a
//             href="https://facebook.com/sala-lk"
//             target="_blank"
//             rel="noreferrer"
//           >
//             <Button variant="secondary">
              
//               {/* <Facebook className="ml-2" /> */}
//             </Button>
//           </a>
//           <a
//             href="https://github.com/sala-lk"
//             target="_blank"
//             rel="noreferrer"
//           >
//             <Button variant="secondary">
//               shop now
//               {/* <Github className="ml-2" /> */}
//             </Button>
//           </a>
//           <a
//             href="https://twitter.com/sala-lk"
//             target="_blank"
//             rel="noreferrer"
//           >
//             {/* <Button variant="secondary">
//               Twitter
//               <Twitter className="ml-2" />
//             </Button> */}
//           </a>
//         </div>
//       </div>

      
//     </div>
//   );
// };

// export default Hero;



// "use client";

// import React, { useEffect, useState } from "react";
// import { ChevronLeft, ChevronRight } from "lucide-react";
// const slides = [
//   {
//     type: "image",
//     src: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?ixlib=rb-4.0.1&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2942&q=80",
//     heading: "Next-Gen Gaming PCs",
//     subheading: "Experience unparalleled performance with our custom builds",
//     buttonText: "Shop Gaming PCs",
//   },
//   {
//     type: "video",
//     src: "https://static.videezy.com/system/resources/previews/000/053/086/original/Labs8.mp4",
//     heading: "Professional Laptops",
//     subheading: "Powerful devices for your business needs",
//     buttonText: "Explore Laptops",
//   },
//   {
//     type: "image",
//     src: "https://images.unsplash.com/photo-1625842268584-8f3296236761?ixlib=rb-4.0.1&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80",
//     heading: "Premium Accessories",
//     subheading: "Enhance your setup with quality peripherals",
//     buttonText: "View Accessories",
//   },
//   {
//     type: "image",
//     src: "https://images.unsplash.com/photo-1603481546579-65d935ba9cdd?ixlib=rb-4.0.1&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80",
//     heading: "Custom Build Service",
//     subheading: "Create your dream PC with our experts",
//     buttonText: "Start Building",
//   },
//   {
//     type: "image",
//     src: "https://images.unsplash.com/photo-1623126908029-58cb08a2b272?ixlib=rb-4.0.1&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80",
//     heading: "Latest Tech Deals",
//     subheading: "Save big on selected products",
//     buttonText: "Shop Deals",
//   },
// ];
// export default const Hero = () => {
//   const [currentSlide, setCurrentSlide] = useState(0);
//   const nextSlide = () => {
//     setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
//   };
//   const prevSlide = () => {
//     setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
//   };
//   useEffect(() => {
//     const timer = setInterval(() => {
//       nextSlide();
//     }, 5000);
//     return () => clearInterval(timer);
//   }, []);
//   return (
//     <div className="relative w-full">
//       <div className="relative h-[600px] w-full overflow-hidden">
//         {slides.map((slide, index) => (
//           <div
//             key={index}
//             className={`absolute h-full w-full transition-transform duration-500 ease-in-out ${index === currentSlide ? "translate-x-0" : "translate-x-full"}`}
//             style={{
//               transform: `translateX(${(index - currentSlide) * 100}%)`,
//             }}
//           >
//             {slide.type === "image" ? (
//               <img
//                 src={slide.src}
//                 alt=""
//                 className="h-full w-full object-cover"
//               />
//             ) : (
//               <video autoPlay muted loop className="h-full w-full object-cover">
//                 <source src={slide.src} type="video/mp4" />
//               </video>
//             )}
//             <div className="absolute inset-0 bg-black/40">
//               <div className="container mx-auto flex h-full flex-col items-center justify-center px-4 text-center text-white">
//                 <h2 className="mb-4 text-5xl font-bold tracking-tight">
//                   {slide.heading}
//                 </h2>
//                 <p className="mb-8 text-xl">{slide.subheading}</p>
//                 <button className="rounded-full bg-white px-8 py-3 text-lg font-semibold text-gray-900 transition-colors hover:bg-gray-100">
//                   {slide.buttonText}
//                 </button>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//       <button
//         onClick={prevSlide}
//         className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/80 p-2 hover:bg-white"
//         aria-label="Previous slide"
//       >
//         <ChevronLeft className="h-6 w-6 text-gray-800" />
//       </button>
//       <button
//         onClick={nextSlide}
//         className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/80 p-2 hover:bg-white"
//         aria-label="Next slide"
//       >
//         <ChevronRight className="h-6 w-6 text-gray-800" />
//       </button>
//       <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
//         {slides.map((_, index) => (
//           <button
//             key={index}
//             onClick={() => setCurrentSlide(index)}
//             className={`h-2 w-2 rounded-full transition-colors ${index === currentSlide ? "bg-white" : "bg-white/50"}`}
//             aria-label={`Go to slide ${index + 1}`}
//           />
//         ))}
//       </div>
//     </div>
//   );
// };


"use client";

import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    type: "image",
    src: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?ixlib=rb-4.0.1&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2942&q=80",
    heading: "Next-Gen Gaming PCs Sala.lk",
    subheading: "Experience unparalleled performance with our custom builds",
    buttonText: "Shop Gaming PCs",
  },
  {
    type: "image",
    src: "https://images.unsplash.com/photo-1603481546579-65d935ba9cdd?ixlib=rb-4.0.1&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80",
    heading: "Professional Laptops",
    subheading: "Powerful devices for your business needs",
    buttonText: "Explore Laptops",
  },
  {
    type: "image",
    src: "https://images.unsplash.com/photo-1625842268584-8f3296236761?ixlib=rb-4.0.1&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80",
    heading: "Premium Accessories",
    subheading: "Enhance your setup with quality peripherals",
    buttonText: "View Accessories",
  },
  {
    type: "image",
    src: "https://images.unsplash.com/photo-1603481546579-65d935ba9cdd?ixlib=rb-4.0.1&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80",
    heading: "Custom Build Service",
    subheading: "Create your dream PC with our experts",
    buttonText: "Start Building",
  },
  {
    type: "image",
    src: "https://images.unsplash.com/photo-1623126908029-58cb08a2b272?ixlib=rb-4.0.1&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80",
    heading: "Latest Tech Deals",
    subheading: "Save big on selected products",
    buttonText: "Shop Deals",
  },
];

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full">
      <div className="relative h-[600px] w-full overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute h-full w-full transition-transform duration-500 ease-in-out ${index === currentSlide ? "translate-x-0" : "translate-x-full"}`}
            style={{
              transform: `translateX(${(index - currentSlide) * 100}%)`,
            }}
          >
            {slide.type === "image" ? (
              <img
                src={slide.src}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              <video autoPlay muted loop className="h-full w-full object-cover">
                <source src={slide.src} type="video/mp4" />
              </video>
            )}
            <div className="absolute inset-0 bg-black/40">
              <div className="container mx-auto flex h-full flex-col items-center justify-center px-4 text-center text-white">
                <h2 className="mb-4 text-5xl font-bold tracking-tight">
                  {slide.heading}
                </h2>
                <p className="mb-8 text-xl">{slide.subheading}</p>
                <button className="rounded-full bg-transparent px-8 py-3 text-lg font-semibold text-white-900 transition-colors hover:bg-black">
                  {slide.buttonText}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/25 p-2 hover:bg-white"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6 text-gray-800" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/25 p-2 hover:bg-white"
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6 text-gray-800" />
      </button>
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2 w-2 rounded-full transition-colors ${index === currentSlide ? "bg-white" : "bg-white/50"}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Hero;

