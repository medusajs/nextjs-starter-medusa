import repeat from "@lib/util/repeat"
import Divider from "@modules/common/components/divider"
import SkeletonButton from "@modules/skeletons/components/skeleton-button"

const SkeletonProductPage = () => {
  return (
    <div>
      <div className="content-container flex flex-col small:flex-row small:items-start py-6 relative animate-pulse">
        <div className="flex flex-col small:sticky small:top-48 small:py-0 small:max-w-[300px] w-full py-8 gap-y-6">
          <div id="product-info">
            <div className="flex flex-col gap-y-4 lg:max-w-[500px] mx-auto">
              <div className="relative h-6 w-1/3 bg-gray-100"></div>
              <div className="relative h-12 w-4/5 bg-gray-100"></div>
              <div className="flex flex-col gap-y-2">
                {repeat(4).map((index) => (
                  <div key={index} className="h-4 w-62 bg-gray-100"></div>
                ))}
              </div>
              <div className="flex flex-col gap-y-2">
                {repeat(2).map((index) => (
                  <div key={index} className="h-10 w-62 bg-gray-100"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="block w-full relative">
          <div className="flex flex-col flex-1 small:mx-16 gap-y-4">
            {repeat(2).map((index) => {
              return (
                <div
                  key={index}
                  className="relative aspect-[29/34] w-full bg-gray-100 rounded-rounded"
                ></div>
              )
            })}
          </div>
        </div>
        <div className="flex flex-col small:sticky small:top-48 small:py-0 small:max-w-[300px] w-full py-8 gap-y-12">
          <div>
            <div className="flex flex-col lg:max-w-[500px] mx-auto">
              <div>
                <div className="flex flex-col gap-y-2">
                  <div className="flex flex-col gap-y-4">
                    <div className="bg-gray-100 h-6 w-16"></div>
                    <div className="grid grid-cols-3 lg:grid-cols-4 gap-2">
                      {repeat(4).map((v) => {
                        return (
                          <div
                            key={v}
                            className="bg-gray-100 w-15 h-10 rounded-rounded"
                          ></div>
                        )
                      })}
                    </div>
                    <Divider />
                    <div className="bg-gray-100 h-9 w-20"></div>
                    <SkeletonButton />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SkeletonProductPage
