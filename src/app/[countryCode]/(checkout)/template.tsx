"use client"

import { motion } from "framer-motion"

export default function CheckoutTemplate(props: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="min-h-0 w-full max-w-[100vw] overflow-x-clip"
    >
      {props.children}
    </motion.div>
  )
}

