// "use client"

// import { Button } from "@medusajs/ui"
// import { motion } from "framer-motion"
// import { ArrowUpRight, Phone } from "lucide-react"
// // import { Button } from "@/components/ui/button"

// export function BoldHero() {
//     return (
//         <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
//             {/* Background Effects */}
//             <div className="absolute inset-0 bg-gradient-to-b from-black via-black/95 to-black">
//                 <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />
//                 <motion.div
//                     className="absolute -top-[25%] left-[50%] h-[500px] w-[500px] rounded-full bg-purple-500/30 blur-[100px]"
//                     animate={{
//                         scale: [1, 1.2, 1],
//                         opacity: [0.3, 0.2, 0.3],
//                     }}
//                     transition={{
//                         duration: 5,
//                         repeat: Infinity,
//                         repeatType: "reverse",
//                     }}
//                 />
//                 <motion.div
//                     className="absolute -bottom-[25%] right-[25%] h-[500px] w-[500px] rounded-full bg-pink-500/30 blur-[100px]"
//                     animate={{
//                         scale: [1, 1.1, 1],
//                         opacity: [0.3, 0.2, 0.3],
//                     }}
//                     transition={{
//                         duration: 7,
//                         repeat: Infinity,
//                         repeatType: "reverse",
//                     }}
//                 />
//             </div>

//             {/* Content */}
//             <div className="relative container mx-auto px-4">
//                 <div className="flex flex-col items-center text-center">
//                     <motion.span
//                         className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-gray-400 backdrop-blur-sm"
//                         initial={{ opacity: 0, y: 20 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ duration: 0.5 }}
//                     >
//                         Serving Sri Lanka Since 1992
//                     </motion.span>

//                     <motion.h1
//                         className="mt-8 max-w-4xl text-5xl sm:text-7xl md:text-8xl font-black tracking-tight"
//                         initial={{ opacity: 0, y: 20 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ duration: 0.5, delay: 0.2 }}
//                     >
//                         WE MAKE
//                         <br />
//                         <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 bg-clip-text text-transparent">
//                             TECHNOLOGY AFFORDABLE
//                         </span>
//                     </motion.h1>

//                     <motion.p
//                         className="mt-8 max-w-2xl text-xl text-gray-400"
//                         initial={{ opacity: 0, y: 20 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ duration: 0.5, delay: 0.4 }}
//                     >
//                         Your trusted partner in enterprise technology solutions. With over 25 years of experience,
//                         we serve 5000+ customers including government ministries, banks, and leading businesses.
//                     </motion.p>

//                     <motion.div
//                         className="mt-12 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
//                         initial={{ opacity: 0, y: 20 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ duration: 0.5, delay: 0.6 }}
//                     >
//                         <Button
//                             size="small"
//                             className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white hover:opacity-90 text-lg h-12 px-8 w-full sm:w-auto"
//                         >
//                             Our Products
//                             <ArrowUpRight className="ml-2 h-5 w-5" />
//                         </Button>
//                         <Button
//                             size="small"
//                             variant="primary"
//                             className="border-white/10 bg-white/5 text-white hover:bg-white/10 text-lg h-12 px-8 w-full sm:w-auto transition-colors"
//                         >
//                             <Phone className="mr-2 h-5 w-5" />
//                             +94 772 270 005
//                         </Button>
//                     </motion.div>

//                     {/* Stats */}
//                     <motion.div
//                         className="mt-20 grid grid-cols-2 gap-8 sm:grid-cols-4 lg:gap-16"
//                         initial={{ opacity: 0, y: 20 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ duration: 0.5, delay: 0.8 }}
//                     >
//                         {[
//                             { value: "25+", label: "Years Experience" },
//                             { value: "5000+", label: "Happy Clients" },
//                             { value: "Island", label: "Wide Delivery" },
//                             { value: "24/7", label: "Support" },
//                         ].map((stat, index) => (
//                             <div key={index} className="flex flex-col items-center">
//                                 <div className="text-3xl sm:text-4xl font-bold text-white">
//                                     {stat.value}
//                                 </div>
//                                 <div className="mt-2 text-sm text-gray-400">{stat.label}</div>
//                             </div>
//                         ))}
//                     </motion.div>
//                 </div>
//             </div>

//             {/* Scroll Indicator */}
//             <motion.div
//                 className="absolute bottom-8 left-1/2 -translate-x-1/2"
//                 initial={{ opacity: 0, y: -20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{
//                     duration: 1,
//                     delay: 1,
//                     repeat: Infinity,
//                     repeatType: "reverse",
//                 }}
//             >
//                 <div className="h-12 w-8 rounded-full border-2 border-white/10 p-1">
//                     <div className="h-2 w-1 rounded-full bg-white/50 mx-auto animate-pulse" />
//                 </div>
//             </motion.div>
//         </section>
//     )
// } 


"use client"

import { motion } from "framer-motion"
import { ArrowRight, Phone } from "lucide-react"
import { Button } from "../ui/button"
// import { Button } from "@/components/ui/button"

export function BoldHero() {
    return (
        <section className="relative min-h-[80vh] sm:min-h-screen flex items-center justify-center overflow-hidden py-16 sm:py-24">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-b from-white via-white to-gray-50">
                <div className="absolute inset-0 bg-grid-black/[0.02] bg-[size:40px_40px] sm:bg-[size:60px_60px]" />
                <motion.div
                    className="absolute -top-[25%] left-[50%] h-[300px] sm:h-[500px] w-[300px] sm:w-[500px] rounded-full bg-[#004B93]/10 blur-[100px]"
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.1, 0.05, 0.1],
                    }}
                    transition={{
                        duration: 5,
                        repeat: Infinity,
                        repeatType: "reverse",
                    }}
                />
                <motion.div
                    className="absolute -bottom-[25%] right-[25%] h-[300px] sm:h-[500px] w-[300px] sm:w-[500px] rounded-full bg-[#004B93]/10 blur-[100px]"
                    animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.3, 0.2, 0.3],
                    }}
                    transition={{
                        duration: 7,
                        repeat: Infinity,
                        repeatType: "reverse",
                    }}
                />
            </div>

            {/* Content */}
            <div className="relative container mx-auto px-4">
                <div className="flex flex-col items-center text-center">
                    <motion.span
                        className="inline-flex items-center rounded-full border border-[#004B93]/10 bg-[#004B93]/5 px-3 py-1 text-sm text-[#004B93] backdrop-blur-sm"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        Serving Sri Lanka Since 1992
                    </motion.span>

                    <motion.h1
                        className="mt-6 sm:mt-8 max-w-4xl text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-[#004B93]"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        WE MAKE
                        <br />
                        <span className="text-[#004B93]">
                            TECHNOLOGY AFFORDABLE
                        </span>
                    </motion.h1>

                    <motion.p
                        className="mt-6 sm:mt-8 max-w-2xl text-base sm:text-lg md:text-xl text-gray-600"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        Your trusted partner in enterprise technology solutions. With over 25 years of experience,
                        we serve 5000+ customers including government ministries, banks, and leading businesses.
                    </motion.p>

                    <motion.div
                        className="mt-8 sm:mt-12 flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                    >
                        <Button
                            size="lg"
                            className="bg-[#004B93] text-white hover:bg-[#004B93]/90 text-base sm:text-lg h-11 sm:h-12 px-6 sm:px-8 w-full sm:w-auto"
                        >
                            Our Products
                            <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            className="border-[#004B93]/10 bg-white text-[#004B93] hover:bg-[#004B93]/5 text-base sm:text-lg h-11 sm:h-12 px-6 sm:px-8 w-full sm:w-auto transition-colors"
                        >
                            <Phone className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                            +94 772 270 005
                        </Button>
                    </motion.div>

                    {/* Stats */}
                    <motion.div
                        className="mt-12 sm:mt-20 grid grid-cols-2 gap-6 sm:gap-8 sm:grid-cols-4 lg:gap-16"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.8 }}
                    >
                        {[
                            { value: "25+", label: "Years Experience" },
                            { value: "5000+", label: "Happy Clients" },
                            { value: "Island", label: "Wide Delivery" },
                            { value: "24/7", label: "Support" },
                        ].map((stat, index) => (
                            <div key={index} className="flex flex-col items-center">
                                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#004B93]">
                                    {stat.value}
                                </div>
                                <div className="mt-1 sm:mt-2 text-xs sm:text-sm text-gray-600">{stat.label}</div>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                    duration: 1,
                    delay: 1,
                    repeat: Infinity,
                    repeatType: "reverse",
                }}
            >
                <div className="h-10 sm:h-12 w-6 sm:w-8 rounded-full border-2 border-[#004B93]/10 p-1">
                    <div className="h-2 w-1 rounded-full bg-[#004B93]/50 mx-auto animate-pulse" />
                </div>
            </motion.div>
        </section>
    )
} 