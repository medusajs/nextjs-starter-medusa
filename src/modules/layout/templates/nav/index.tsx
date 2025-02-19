// import { Suspense } from "react"

// import { listRegions } from "@lib/data/regions"
// import { StoreRegion } from "@medusajs/types"
// import LocalizedClientLink from "@modules/common/components/localized-client-link"
// import CartButton from "@modules/layout/components/cart-button"
// import SideMenu from "@modules/layout/components/side-menu"

// export default async function Nav() {
//   const regions = await listRegions().then((regions: StoreRegion[]) => regions)

//   return (
//     <div className="sticky top-0 inset-x-0 z-50 group">
//       <header className="relative h-16 mx-auto border-b duration-200 bg-white border-ui-border-base">
//         <nav className="content-container txt-xsmall-plus text-ui-fg-subtle flex items-center justify-between w-full h-full text-small-regular">
//           <div className="flex-1 basis-0 h-full flex items-center">
//             <div className="h-full">
//               <SideMenu regions={regions} />
//             </div>
//           </div>

//           <div className="flex items-center h-full">
//             <LocalizedClientLink
//               href="/"
//               className="txt-compact-xlarge-plus hover:text-ui-fg-base uppercase"
//               data-testid="nav-store-link"
//             >
//               Sala.lk Store
//             </LocalizedClientLink>
//           </div>

//           <div className="flex items-center gap-x-6 h-full flex-1 basis-0 justify-end">
//           <div className="hidden small:flex items-center gap-x-6 h-full">
//               <LocalizedClientLink
//                 className="hover:text-ui-fg-base"
//                 href="/"
//                 data-testid="nav-gome-link"
//               >
//                 Home
//               </LocalizedClientLink>
//               <LocalizedClientLink
//                 className="hover:text-ui-fg-base"
//                 href="/store"
//                 data-testid="nav-store-link"
//               >
//                 Products
//               </LocalizedClientLink>
//               <LocalizedClientLink
//                 className="hover:text-ui-fg-base"
//                 href="/productpc"
//                 data-testid="nav-store-link"
//               >
//                 Computers
//               </LocalizedClientLink>
//             </div>
//             <LocalizedClientLink
//                 className="hover:text-ui-fg-base"
//                 href="/contact"
//                 data-testid="nav-contact-link"
//               >
//                 Contact Us
//               </LocalizedClientLink>
//             <div className="hidden small:flex items-center gap-x-6 h-full">
//               <LocalizedClientLink
//                 className="hover:text-ui-fg-base"
//                 href="/account"
//                 data-testid="nav-account-link"
//               >
//                 Account
//               </LocalizedClientLink>
//             </div>
//             <Suspense
//               fallback={
//                 <LocalizedClientLink
//                   className="hover:text-ui-fg-base flex gap-2"
//                   href="/cart"
//                   data-testid="nav-cart-link"
//                 >
//                   Cart (0)
//                 </LocalizedClientLink>
//               }
//             >
//               <CartButton />
//             </Suspense>
//           </div>
//         </nav>
//       </header>
//     </div>
//   )
// }








// "use client"

// import { useState, useEffect } from "react"
// import { motion, AnimatePresence } from "framer-motion"
// import Link from "next/link"
// import { Search, ShoppingBag, Menu, X, User } from "lucide-react"
// import { Button } from "@medusajs/ui"
// //import { Button } from "@/components/ui/button"
// // import { BoldSearch } from "./search"

// interface NavItem {
//   name: string
//   href: string
// }

// const mainNav: NavItem[] = [
//   { name: "Home", href: "/" },
//   { name: "Categories", href: "/mystore" },
//   { name: "Special-Offers", href: "/special" },
//   { name: "Contact Us", href: "/contactus" },
//   { name: "Corporate-Inquiries", href: "/corporate" },
// ]

// export default function Nav() {
//   const [isScrolled, setIsScrolled] = useState(false)
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
//   const [isSearchOpen, setIsSearchOpen] = useState(false)

//   useEffect(() => {
//     const handleScroll = () => {
//       setIsScrolled(window.scrollY > 0)
//     }
//     window.addEventListener("scroll", handleScroll)
//     return () => window.removeEventListener("scroll", handleScroll)
//   }, [])

//   return (
//     <>
//       <header
//         className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
//           isScrolled ? "bg-black/50 backdrop-blur-xl" : "bg-transparent"
//         }`}
//       >
//         <nav className="container mx-auto px-4 py-4">
//           <div className="flex items-center justify-between">
//             {/* Logo */}
//             {/* <Link
//               href="/"
//               className="text-2xl font-black tracking-tighter text-white"
//             >
//               sala<span className="text-purple-500">.lk</span>
//             </Link> */}
//                         <Link href="/" className="flex items-center">
//                             <img
//                                 src="https://www.sala.lk/public/home/images/home/sala_logo.png"
//                                 alt="SALA"
//                                 className="h-8 w-auto"
//                             />
//                         </Link>

//             {/* Desktop Navigation */}
//             <div className="hidden md:flex items-center space-x-8">
//               {mainNav.map((item) => (
//                 <Link
//                   key={item.name}
//                   href={item.href}
//                   className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
//                 >
//                   {item.name}
//                 </Link>
//               ))}
//             </div>

//             {/* Actions */}
//             <div className="flex items-center space-x-0">
              
//               <Button
//                 variant="transparent" // Or another valid variant
//                 size="small" // Change "icon" to "small" or "base"
//                 className="text-gray-300 hover:text-black"
//                 onClick={() => setIsSearchOpen(true)}
//               >
//                 <Search className="h-5 w-5" />
//               </Button>

//               <Button
//                 variant="transparent"
//                 size="small"
//                 className="text-gray-300 hover:text-black"
//               >
//                 <ShoppingBag className="h-5 w-5" />
//               </Button>
//               <Button
//                  variant="transparent"
//                 size="small"
//                 className="text-white hover:text-black"
//                             >
//                <User className="h-5 w-5" />
//               </Button>
//               <Button
//                 variant="transparent"
//                 size="small"
//                 className="md:hidden text-gray-300 hover:text-black"
//                 onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//               >
//                 {isMobileMenuOpen ? (
//                   <X className="h-5 w-5" />
//                 ) : (
//                   <Menu className="h-5 w-5" />
//                 )}
//               </Button>
//             </div>
//           </div>
//         </nav>
//       </header>

//       {/* Mobile Menu */}
//       <AnimatePresence>
//         {isMobileMenuOpen && (
//           <motion.div
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -20 }}
//             className="fixed inset-0 z-40 bg-black/80 pt-20"
//           >
//             <nav className="container mx-auto px-4 py-8">
//               <ul className="space-y-6">
//                 {mainNav.map((item) => (
//                   <motion.li
//                     key={item.name}
//                     initial={{ opacity: 0, x: -20 }}
//                     animate={{ opacity: 1, x: 0 }}
//                     exit={{ opacity: 0, x: -20 }}
//                     className="border-b border-white/10 pb-6"
//                   >
//                     <Link
//                       href={item.href}
//                       className="text-1xl font-bold text-white hover:text-purple-500 transition-colors"
//                       onClick={() => setIsMobileMenuOpen(false)}
//                     >
//                       {item.name}
//                     </Link>
//                   </motion.li>
//                 ))}
//               </ul>
//             </nav>
//           </motion.div>
//         )}
//       </AnimatePresence>

     
//     </>
//   )
// }






"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Search, ShoppingBag, Menu, X, User, ChevronDown } from "lucide-react";
import { Button } from "@medusajs/ui";

interface NavItem {
  name: string;
  href?: string;
  subItems?: { name: string; href: string }[];
}

const mainNav: NavItem[] = [
  { 
    name: "Home", 
    href: "/" 
  },
  { 
    name: "Categories", 
    subItems: [
      { name: "Shirts", href: "/mystore/shirts" },
      { name: "Sweatshirts", href: "/mystore/sweatshirts" },
      { name: "Merch", href: "/mystore/merch" },
      { name: "Pants", href: "/mystore/pants" }
    ]
  },
  { 
    name: "Special-Offers", 
    href: "/special" 
  },
  { 
    name: "Contact Us", 
    href: "/contactus" 
  },
  { 
    name: "Corporate-Inquiries", 
    href: "/corporate" 
  },
];

export default function Nav() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? "bg-black/50 backdrop-blur-xl" : "bg-transparent"
        }`}
      >
        <nav className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <img
                src="https://www.sala.lk/public/home/images/home/sala_logo.png"
                alt="SALA"
                className="h-8 w-auto"
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {mainNav.map((item) =>
                item.subItems ? (
                  <div
                    key={item.name}
                    className="relative"
                    onMouseEnter={() => setIsCategoryOpen(true)}
                    onMouseLeave={() => setIsCategoryOpen(false)}
                  >
                    <button className="flex items-center text-sm font-medium text-gray-300 hover:text-white transition-colors">
                      {item.name}
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </button>

                    {/* Dropdown */}
                    <AnimatePresence>
                      {isCategoryOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute left-0 mt-2 w-48 bg-white/50 rounded-md shadow-lg z-50"
                        >
                          <ul className="py-2">
                            {item.subItems.map((subItem) => (
                              <li key={subItem.name}>
                                <Link
                                  href={subItem.href}
                                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
                                >
                                  {subItem.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    key={item.name}
                    href={item.href!}
                    className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
                  >
                    {item.name}
                  </Link>
                )
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-0">
              <Button
                variant="transparent"
                size="small"
                className="text-gray-300 hover:text-black"
              >
                <Search className="h-5 w-5" />
              </Button>

              <Button
                variant="transparent"
                size="small"
                className="text-gray-300 hover:text-black"
              >
                <ShoppingBag className="h-5 w-5" />
              </Button>

              <Button
                variant="transparent"
                size="small"
                className="text-white hover:text-black"
              >
                <User className="h-5 w-5" />
              </Button>

              <Button
                variant="transparent"
                size="small"
                className="md:hidden text-gray-300 hover:text-black"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-black/80 pt-20"
          >
            <nav className="container mx-auto px-4 py-8">
              <ul className="space-y-6">
                {mainNav.map((item) =>
                  item.subItems ? (
                    <li key={item.name}>
                      <button
                        className="flex justify-between w-full text-1xl font-bold text-white hover:text-purple-500 transition-colors"
                        onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                      >
                        {item.name}
                        <ChevronDown className={`h-5 w-5 ${isCategoryOpen ? "rotate-180" : ""}`} />
                      </button>

                      <AnimatePresence>
                        {isCategoryOpen && (
                          <motion.ul
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-2 space-y-2 pl-4"
                          >
                            {item.subItems.map((subItem) => (
                              <li key={subItem.name}>
                                <Link
                                  href={subItem.href}
                                  className="block text-white hover:text-purple-500 transition-colors"
                                  onClick={() => setIsMobileMenuOpen(false)}
                                >
                                  {subItem.name}
                                </Link>
                              </li>
                            ))}
                          </motion.ul>
                        )}
                      </AnimatePresence>
                    </li>
                  ) : (
                    <li key={item.name}>
                      <Link
                        href={item.href!}
                        className="text-1xl font-bold text-white hover:text-purple-500 transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    </li>
                  )
                )}
              </ul>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
