import React from 'react'
import { MotionDefaults, MotionProfile } from './motion-tokens'

export function useMotionPrefs() {
  const [prefersReduced, setPrefersReduced] = React.useState(false)
  const [isMobile, setIsMobile] = React.useState(false)
  const [profile] = React.useState<MotionProfile>(MotionDefaults.profile)

  React.useEffect(() => {
    if (typeof window === 'undefined') return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handler = () => setPrefersReduced(mq.matches)
    handler()
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  React.useEffect(() => {
    if (typeof window === 'undefined') return
    const onResize = () => setIsMobile(window.innerWidth < 768)
    onResize()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return { prefersReduced, isMobile, profile }
}


