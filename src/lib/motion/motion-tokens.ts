export const MotionDurations = {
  enter: { xfast: 0.12, fast: 0.2, base: 0.3, slow: 0.4 },
  exit: { xfast: 0.1, fast: 0.18, base: 0.22, slow: 0.3 },
} as const

export const MotionEasings = {
  enter: {
    standard: [0.22, 1, 0.36, 1] as [number, number, number, number],
    emphasized: [0.05, 0.7, 0.1, 1] as [number, number, number, number],
  },
  exit: {
    standard: [0.4, 0, 1, 1] as [number, number, number, number],
    emphasized: [0.3, 0, 0.8, 0.15] as [number, number, number, number],
  },
} as const

export const MotionDistances = {
  panel: { horizontal: '100%', vertical: '100%' },
  modal: 24,
  tooltip: 8,
} as const

export type MotionProfile = 'standard' | 'emphasized'

export const MotionDefaults = {
  profile: 'standard' as MotionProfile,
} as const


