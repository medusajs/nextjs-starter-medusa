import { Metadata } from "next"

import FeaturedProducts from "@modules/home/components/featured-products"
import Hero from "@modules/home/components/hero"
import { listCollections } from "@lib/data/collections"
import { getRegion } from "@lib/data/regions"
import { Categories } from "@modules/home/components/cetagory"
import { Feather, Store } from "lucide-react"
// import Feature from "@modules/home/components/featuredproduct"
// import AboutUs from "@modules/home/components/aboutus"
import { AboutUs } from "@modules/home/components/aboutus"
import GetPc from "./productpc/pclist"
import StoreTemplate from "@modules/store/templates"
import ProductList from "@modules/mystore/templates"
import FeaturedProductss from "@modules/home/components/featuredproduct"
import { HeroSection } from "./components/arriavals"
import { CategorySections } from "./components/popular"
import { ProductCard } from "./components/productarriaval"
// import { BoldHero, ExperienceSection } from "./components/salahero"
// import { HeroSection } from "@modules/home/components/newarrival/arriaval"
import FeaturedProductsss from "@modules/home/components/bestseller"
import PartnerSection from "./components/partner"
import { BoldTestimonials } from "./components/reviews"
import { FeaturedProductsb } from "./components/featured-products"
import { NewArrivalsb } from "./components/new-arrivals"
import Productn from "@modules/mystore/templates"
import ProductListn from "@modules/mystore/templates"
import { BoldHero} from "./components/salahero"
// import { LogoCarousel } from "./ui/logo-carousel"
// import Productn, {produtn} from "@modules/mystore/templates"




// const collections = [
//   {
//     name: "Anker Soundcore Life 2 Neo",
//     price: "Rs 9,999.00",
//     originalPrice: "Rs 16,999.00",
//     image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3",
//     description: "Wireless Over-Ear Bluetooth Headphones",
//     rating: 4.5,
//     stock: 1,
//     discount: 41,
//   },
//   {
//     name: "Anker Soundcore Space Q45 ANC",
//     price: "Rs 29,999.00",
//     originalPrice: "Rs 36,999.00",
//     image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?ixlib=rb-4.0.3",
//     description: "Active Noise Cancelling Headphones",
//     rating: 4.83,
//     colors: 3,
//     stock: 2,
//     discount: 19,
//   },
//   {
//     name: "Anker Soundcore R50i",
//     price: "Rs 4,999.00",
//     originalPrice: "Rs 7,699.00",
//     image: "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?ixlib=rb-4.0.3",
//     description: "True Wireless Earbuds",
//     rating: 4.84,
//     colors: 3,
//     stock: 5,
//     discount: 35,
//   },
// ];
// Example mock data for collections (You can replace this with real data from your backend or API)


// const logos = [
//   {
//     name: "Dialog",
//     id: 1,
//     img: () => (
//       <img
//         src="https://www.sala.lk/public/dbimages/client/1600503531_cnt_1.jpg"
//         alt="Dialog"
//         className="h-full w-full object-contain grayscale hover:grayscale-0 transition-all duration-500"
//       />
//     ),
//   },
//   {
//     name: "Mobitel",
//     id: 2,
//     img: () => (
//       <img
//         src="https://www.sala.lk/public/dbimages/client/1600503586_cnt_1.jpg"
//         alt="Mobitel"
//         className="h-full w-full object-contain grayscale hover:grayscale-0 transition-all duration-500"
//       />
//     ),
//   },
//   {
//     name: "SLT",
//     id: 3,
//     img: () => (
//       <img
//         src="https://www.sala.lk/public/dbimages/client/1600503615_cnt_1.jpg"
//         alt="SLT"
//         className="h-full w-full object-contain grayscale hover:grayscale-0 transition-all duration-500"
//       />
//     ),
//   },
//   {
//     name: "Hutch",
//     id: 4,
//     img: () => (
//       <img
//         src="https://www.sala.lk/public/dbimages/client/1600503811_cnt_1.jpg"
//         alt="Hutch"
//         className="h-full w-full object-contain grayscale hover:grayscale-0 transition-all duration-500"
//       />
//     ),
//   },
//   {
//     name: "Airtel",
//     id: 5,
//     img: () => (
//       <img
//         src="https://www.sala.lk/public/dbimages/client/1710750318_cnt_1.png"
//         alt="Airtel"
//         className="h-full w-full object-contain grayscale hover:grayscale-0 transition-all duration-500"
//       />
//     ),
//   },
//   {
//     name: "Lankabell",
//     id: 6,
//     img: () => (
//       <img
//         src="https://www.sala.lk/public/dbimages/client/1667546638_cnt_1.png"
//         alt="Lankabell"
//         className="h-full w-full object-contain grayscale hover:grayscale-0 transition-all duration-500"
//       />
//     ),
//   },
//   {
//     name: "Etisalat",
//     id: 7,
//     img: () => (
//       <img
//         src="https://www.sala.lk/public/dbimages/client/1600503469_cnt_1.jpg"
//         alt="Etisalat"
//         className="h-full w-full object-contain grayscale hover:grayscale-0 transition-all duration-500"
//       />
//     ),
//   },
// ]




const collections = [
  {
    name: "Product 1",
    price: "$100.00",
    originalPrice: "$120.00",
    image: "/path/to/image1.jpg", // Replace with actual image path
    description: "This is a great product 1.",
    rating: 4.5,
    stock: 10,
    discount: 20,
  },
  {
    name: "Product 2",
    price: "$80.00",
    originalPrice: "$90.00",
    image: "/path/to/image2.jpg", // Replace with actual image path
    description: "This is a great product 2.",
    rating: 3.9,
    stock: 5,
    discount: 15,
  },
  {
    name: "Product 3",
    price: "$120.00",
    originalPrice: "$150.00",
    image: "/path/to/image3.jpg", // Replace with actual image path
    description: "This is a great product 3.",
    rating: 4.8,
    stock: 8,
    discount: 10,
  },
  // Add more products as needed
];


export const metadata: Metadata = {
  title: "Medusa Next.js Starter Template",
  description:
    "A performant frontend ecommerce starter template with Next.js 14 and Medusa.",
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params

  const { countryCode } = params

  const region = await getRegion(countryCode)

  const { collections } = await listCollections({
    fields: "id, handle, title",
  })

  if (!collections || !region) {
    return null
  }

  return (
    <>
      <Hero />
      <NewArrivalsb/>
      <ProductListn countryCode={"dk"}/>

      {/* <FeaturedProductsb/> */}
      {/* <CategorySections/> */}
      {/* <FeaturedProductss/>    myshowing peoducts */}

      {/* <Productn countryCode={"dk"}/> */}
    
      <CategorySections/>

      {/* <HeroSection/>  my arrivalssection */}

      {/* <ProductCard/>  my product arriavals */}

      <FeaturedProductsss/>
      {/* <LogoCarousel columnCount={3} logos={logos} /> */}

      <BoldHero/>
      {/* <ExperienceSection/> */}

      {/* <FeaturedProductss/> featured product my */}

      
      <PartnerSection/>
      <BoldTestimonials/>
      

      
      
      
    
      
      {/* <ProductCard/> */}
      
      {/* <Categories/> */}
      {/* <Feature/> */}
      
      
      
      {/* <GetPc/> */}
      {/* <StoreTemplate countryCode={"dk"}/> */}
      {/* <FeaturedProducts collections={[]} region={undefined}/> */}
      {/* <FeaturedProductss collections={collections} /> */}
      {/* <FeaturedProductss collections={[]}/> */}
     

      {/* <ProductList countryCode={"dk"}/>  */}
      

      {/* this is the one the data come from backend */}

      
      {/* <AboutUs/> */}
      
      {/* <div className="py-12 ">
        <ul className="flex flex-col gap-x-6">
          <FeaturedProducts collections={collections} region={region} />
        </ul>
      </div> */}
    </>
  )
}
