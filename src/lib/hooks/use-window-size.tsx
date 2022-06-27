import { useEffect, useState } from "react"

export const useWindowSize = () => {
  const [width, setWidth] = useState<number | undefined>()
  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth)
    }

    window.addEventListener("resize", handleResize)

    handleResize()

    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return width
}
