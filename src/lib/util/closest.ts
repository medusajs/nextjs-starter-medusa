/**
 * Finds the closest number to a point in an array of numbers.
 * @param point 
 * @param arr 
 * @returns closest number
 */
export const closest = (point: number, arr: number[]) => {
    return arr.reduce((a, b) => {
      let aDiff = Math.abs(a - point)
      let bDiff = Math.abs(b - point)

      if (aDiff == bDiff) {
        return a > b ? a : b
      } else {
        return bDiff < aDiff ? b : a
      }
    })
  }