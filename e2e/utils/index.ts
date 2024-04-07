export function getFloatValue(s: string) {
  return parseFloat(parseFloat(s).toFixed(2))
}

export function compareFloats(f1: number, f2: number) {
  const diff = f1 - f2
  if (Math.abs(diff) < 0.01) {
    return 0
  } else if (diff < 0) {
    return -1
  } else {
    return 1
  }
}
