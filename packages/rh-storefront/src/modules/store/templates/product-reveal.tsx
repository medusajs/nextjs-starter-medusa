"use client"

import { useIntersection } from "@lib/hooks/use-in-view"
import { motion } from "framer-motion"
import { useEffect, useRef, useState } from "react"

export default function ProductReveal({
  children,
}: {
  children: React.ReactNode
}) {
  const ref = useRef<HTMLDivElement | null>(null)
  const inView = useIntersection(ref, "0px 0px 80px 0px")
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    if (inView) setRevealed(true)
  }, [inView])

  return (
    <div ref={ref} className="h-full">
      <motion.div
        className="h-full"
        initial={{ opacity: 0, y: 28 }}
        animate={revealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }}
      >
        {children}
      </motion.div>
    </div>
  )
}

