import { IS_BROWSER } from "@lib/constants"
import { useEffect, useState } from "react"

const getWidth = () => {
  if (IS_BROWSER) {
    return (
      window.innerWidth ||
      document.documentElement.clientWidth ||
      document.body.clientWidth
    )
  }

  return 0
}

const useCurrentWidth = () => {
  const [width, setWidth] = useState(getWidth())

  useEffect(() => {
    const resizeListener = () => {
      setWidth(getWidth())
    }

    window.addEventListener("resize", resizeListener)

    return () => {
      window.removeEventListener("resize", resizeListener)
    }
  }, [])

  return width
}

export default useCurrentWidth
