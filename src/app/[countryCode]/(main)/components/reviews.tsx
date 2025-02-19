// "use client"

// import { useEffect, useState } from "react"
// import { motion, AnimatePresence } from "framer-motion"
// import { Quote } from "lucide-react"

// interface Testimonial {
//     id: number
//     content: string
//     author: string
//     role: string
//     company: string
//     image: string
// }

// const testimonials: Testimonial[] = [
//     {
//         id: 1,
//         content: "The enterprise solutions provided by sala.lk have transformed our business operations. Their network infrastructure is robust and reliable.",
//         author: "John Smith",
//         role: "CTO",
//         company: "Tech Innovations Ltd",
//         image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&h=200&fit=crop",
//     },
//     {
//         id: 2,
//         content: "Exceptional service and cutting-edge technology. Their security systems have given us peace of mind in protecting our digital assets.",
//         author: "Sarah Johnson",
//         role: "IT Director",
//         company: "Global Systems Inc",
//         image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&h=200&fit=crop",
//     },
//     {
//         id: 3,
//         content: "The team's expertise in enterprise tech solutions is unmatched. They've been instrumental in our digital transformation journey.",
//         author: "Michael Chen",
//         role: "CEO",
//         company: "Digital Solutions Corp",
//         image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&h=200&fit=crop",
//     },
// ]

// export function BoldTestimonials() {
//     const [currentIndex, setCurrentIndex] = useState(0)

//     useEffect(() => {
//         const timer = setInterval(() => {
//             setCurrentIndex((prev) => (prev + 1) % testimonials.length)
//         }, 5000)
//         return () => clearInterval(timer)
//     }, [])

//     return (
//         <section className="w-full bg-black py-24 sm:py-32">
//             <div className="container mx-auto px-4">
//                 <div className="flex flex-col items-center text-center">
//                     <motion.div
//                         initial={{ opacity: 0, y: 20 }}
//                         whileInView={{ opacity: 1, y: 0 }}
//                         transition={{ duration: 0.5 }}
//                         viewport={{ once: true }}
//                         className="flex items-center gap-2 text-gray-400"
//                     >
//                         <Quote className="h-5 w-5" />
//                         <span className="text-sm font-medium uppercase tracking-wider">
//                             Client Testimonials
//                         </span>
//                         <Quote className="h-5 w-5" />
//                     </motion.div>

//                     <motion.h2
//                         className="mt-6 text-4xl font-black tracking-tight text-white sm:text-5xl"
//                         initial={{ opacity: 0, y: 20 }}
//                         whileInView={{ opacity: 1, y: 0 }}
//                         transition={{ duration: 0.5, delay: 0.2 }}
//                         viewport={{ once: true }}
//                     >
//                         What Our Clients Say
//                     </motion.h2>
//                 </div>

//                 <div className="relative mt-16 h-[400px] sm:h-[500px]">
//                     <AnimatePresence mode="wait">
//                         {testimonials.map((testimonial, index) => (
//                             index === currentIndex && (
//                                 <motion.div
//                                     key={testimonial.id}
//                                     className="absolute inset-0 flex flex-col items-center"
//                                     initial={{ opacity: 0, y: 20 }}
//                                     animate={{ opacity: 1, y: 0 }}
//                                     exit={{ opacity: 0, y: -20 }}
//                                     transition={{ duration: 0.5 }}
//                                 >
//                                     <div className="relative h-24 w-24 rounded-full overflow-hidden border-2 border-white/10">
//                                         <img
//                                             src={testimonial.image}
//                                             alt={testimonial.author}
//                                             className="h-full w-full object-cover"
//                                         />
//                                     </div>
//                                     <blockquote className="mt-8 max-w-2xl text-center">
//                                         <p className="text-xl text-gray-300 sm:text-2xl">
//                                             "{testimonial.content}"
//                                         </p>
//                                     </blockquote>
//                                     <div className="mt-8 flex flex-col items-center">
//                                         <div className="text-lg font-medium text-white">
//                                             {testimonial.author}
//                                         </div>
//                                         <div className="mt-1 text-sm text-gray-400">
//                                             {testimonial.role} at {testimonial.company}
//                                         </div>
//                                     </div>
//                                 </motion.div>
//                             )
//                         ))}
//                     </AnimatePresence>

//                     {/* Navigation Dots */}
//                     <div className=" absolute bottom-0 left-1/2 -translate-x-1/2 flex space-x-3">
//                         {testimonials.map((_, index) => (
//                             <button
//                                 key={index}
//                                 onClick={() => setCurrentIndex(index)}
//                                 className={`h-2 rounded-full transition-all duration-300 ${index === currentIndex ? "w-8 bg-white" : "w-2 bg-white/30"
//                                     }`}
//                             />
//                         ))}
//                     </div>
//                 </div>
//             </div>
//         </section>
//     )
// } 



"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Quote } from "lucide-react"

interface Testimonial {
    id: number
    content: string
    author: string
    role: string
    company: string
    image: string
}

const testimonials: Testimonial[] = [
    {
        id: 1,
        content: "The enterprise solutions provided by sala.lk have transformed our business operations. Their network infrastructure is robust and reliable.",
        author: "John Smith",
        role: "CTO",
        company: "Tech Innovations Ltd",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&h=200&fit=crop",
    },
    {
        id: 2,
        content: "Exceptional service and cutting-edge technology. Their security systems have given us peace of mind in protecting our digital assets.",
        author: "Sarah Johnson",
        role: "IT Director",
        company: "Global Systems Inc",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&h=200&fit=crop",
    },
    {
        id: 3,
        content: "The team's expertise in enterprise tech solutions is unmatched. They've been instrumental in our digital transformation journey.",
        author: "Michael Chen",
        role: "CEO",
        company: "Digital Solutions Corp",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&h=200&fit=crop",
    },
]

export function BoldTestimonials() {
    const [currentIndex, setCurrentIndex] = useState(0)

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % testimonials.length)
        }, 5000)
        return () => clearInterval(timer)
    }, [])

    return (
        <section className="w-full bg-white py-24 sm:py-32">
            <div className="container mx-auto px-4">
                <div className="flex flex-col items-center text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                        className="flex items-center gap-2 text-[#004B93]"
                    >
                        <Quote className="h-5 w-5" />
                        <span className="text-sm font-medium uppercase tracking-wider">
                            Client Testimonials
                        </span>
                        <Quote className="h-5 w-5" />
                    </motion.div>

                    <motion.h2
                        className="mt-6 text-4xl font-black tracking-tight text-gray-800 sm:text-5xl"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        viewport={{ once: true }}
                    >
                        What Our Clients Say
                    </motion.h2>
                </div>

                <div className="relative mt-16 h-[400px] sm:h-[500px]">
                    <AnimatePresence mode="wait">
                        {testimonials.map((testimonial, index) => (
                            index === currentIndex && (
                                <motion.div
                                    key={testimonial.id}
                                    className="absolute inset-0 flex flex-col items-center"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <div className="relative h-24 w-24 rounded-full overflow-hidden border-2 border-[#004B93]/10">
                                        <img
                                            src={testimonial.image}
                                            alt={testimonial.author}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                    <blockquote className="mt-8 max-w-2xl text-center">
                                        <p className="text-xl text-gray-600 sm:text-2xl">
                                            "{testimonial.content}"
                                        </p>
                                    </blockquote>
                                    <div className="mt-8 flex flex-col items-center">
                                        <div className="text-lg font-medium text-gray-800">
                                            {testimonial.author}
                                        </div>
                                        <div className="mt-1 text-sm text-gray-600">
                                            {testimonial.role} at {testimonial.company}
                                        </div>
                                    </div>
                                </motion.div>
                            )
                        ))}
                    </AnimatePresence>

                    {/* Navigation Dots */}
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex space-x-3">
                        {testimonials.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={`h-2 rounded-full transition-all duration-300 ${index === currentIndex ? "w-8 bg-[#004B93]" : "w-2 bg-[#004B93]/30"
                                    }`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
} 