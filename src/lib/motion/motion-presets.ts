import { MotionDurations, MotionEasings } from './motion-tokens'

export type Direction = 'left' | 'right' | 'up' | 'down'

export function panelSlidePreset(direction: Direction = 'right') {
  const isHorizontal = direction === 'left' || direction === 'right'
  const sign = (direction === 'right' || direction === 'down') ? 1 : -1

  const initial = {
    x: isHorizontal ? `${sign * 100}%` : undefined,
    y: isHorizontal ? undefined : `${sign * 100}%`,
  }

  const animate = {
    x: isHorizontal ? 0 : undefined,
    y: isHorizontal ? undefined : 0,
    transition: { duration: MotionDurations.enter.base, ease: MotionEasings.enter.standard },
  }

  const exit = {
    x: isHorizontal ? `${sign * 100}%` : undefined,
    y: isHorizontal ? undefined : `${sign * 100}%`,
    transition: { duration: MotionDurations.exit.fast, ease: MotionEasings.exit.standard },
  }

  return { initial, animate, exit }
}

export function backdropFadePreset() {
  return {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: MotionDurations.enter.fast, ease: MotionEasings.enter.standard } },
    exit: { opacity: 0, transition: { duration: MotionDurations.exit.base, ease: MotionEasings.exit.standard } },
  }
}

export function modalScaleFadePreset() {
  return {
    initial: { opacity: 0, scale: 0.95 },
    animate: {
      opacity: 1,
      scale: 1,
      transition: { duration: MotionDurations.enter.base, ease: MotionEasings.enter.standard },
    },
    exit: {
      opacity: 0,
      scale: 0.97,
      transition: { duration: MotionDurations.exit.base, ease: MotionEasings.exit.standard },
    },
  }
}

export function popoverSlidePreset(direction: Direction = 'down') {
  // Small distance slide + fade, typically for menus/popovers
  const isHorizontal = direction === 'left' || direction === 'right'
  const sign = (direction === 'right' || direction === 'down') ? 1 : -1
  const dist = 12 * sign // 12px
  const initial = {
    opacity: 0,
    x: isHorizontal ? dist : 0,
    y: isHorizontal ? 0 : dist,
  }
  const animate = {
    opacity: 1,
    x: 0,
    y: 0,
    transition: { duration: MotionDurations.enter.fast, ease: MotionEasings.enter.standard },
  }
  const exit = {
    opacity: 0,
    x: isHorizontal ? dist : 0,
    y: isHorizontal ? 0 : dist,
    transition: { duration: MotionDurations.exit.fast, ease: MotionEasings.exit.standard },
  }
  return { initial, animate, exit }
}


