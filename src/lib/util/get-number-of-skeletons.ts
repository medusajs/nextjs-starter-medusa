/**
 * Calculates the number of spooky skeletons to show while an infinite scroll is loading the next page.
 * Per default we fetch 12 products per page, so we need to calculate the number of skeletons to show,
 * if the remaing products are less than 12.
 */

import { InfiniteProductPage } from "types/global"

const getNumberOfSkeletons = (pages?: InfiniteProductPage[]) => {
  if (!pages) {
    return 0
  }

  const count = pages[pages.length - 1].response.count
  const retrieved =
    count - pages.reduce((acc, curr) => acc + curr.response.products.length, 0)

  if (count - retrieved < 12) {
    return count - retrieved
  }

  return 12
}

export default getNumberOfSkeletons
