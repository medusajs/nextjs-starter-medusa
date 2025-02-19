import { RefObject, useEffect, useState } from "react"


//stors custom react hooks to simplify logic(e.g , authentication hooks, cart hooks)

//helps manages reusable functionalities like useAuth() or useCart().


export const useIntersection = (
  element: RefObject<HTMLDivElement | null>,
  rootMargin: string
) => {
  const [isVisible, setState] = useState(false)

  useEffect(() => {
    if (!element.current) {
      return
    }

    const el = element.current

    const observer = new IntersectionObserver(
      ([entry]) => {
        setState(entry.isIntersecting)
      },
      { rootMargin }
    )

    observer.observe(el)

    return () => observer.unobserve(el)
  }, [element, rootMargin])

  return isVisible
}
