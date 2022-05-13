import { Dialog, Transition } from "@headlessui/react"
import { Image as MedusaImage } from "@medusajs/medusa"
import ArrowRight from "@modules/common/icons/arrow-right"
import X from "@modules/common/icons/x"
import clsx from "clsx"
import Image from "next/image"
import React, { Fragment, useEffect, useState } from "react"

type ImagesFullscreenProps = {
  images: MedusaImage[]
  openOn?: string
  open: boolean
  close: () => void
}

const ImagesFullscreen: React.FC<ImagesFullscreenProps> = ({
  images,
  openOn,
  open,
  close,
}) => {
  const [currentSrc, setCurrentSrc] = useState(images[0].url)

  useEffect(() => {
    if (openOn) {
      setCurrentSrc(openOn)
    }
  }, [openOn])

  const handlePrev = () => {
    const index = images.findIndex((image) => image.url === currentSrc)

    if (index > 0) {
      setCurrentSrc(images[index - 1].url)
    } else {
      setCurrentSrc(images[images.length - 1].url)
    }
  }

  const handleNext = () => {
    const index = images.findIndex((image) => image.url === currentSrc)

    if (index < images.length - 1) {
      setCurrentSrc(images[index + 1].url)
    } else {
      setCurrentSrc(images[0].url)
    }
  }

  return (
    <Transition show={open}>
      <Dialog onClose={close} className="fixed inset-0 overflow-y-auto z-[999]">
        <div className="flex min-h-full items-center justify-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="relative bg-white flex-1">
              <div className="flex justify-end sticky inset-x-0 top-0 py-3 px-4 -mt-12 text-gray-700 z-[1000]">
                <button onClick={close}>
                  <X size={24} />
                </button>
              </div>
              <div className="flex justify-between sticky inset-x-0 top-1/2 transform -translate-y-1/2 py-3 px-4 -mt-12 text-gray-700 z-[1000]">
                <button onClick={handlePrev}>
                  <ArrowRight className="transform rotate-180" size={24} />
                </button>
                <button onClick={handleNext}>
                  <ArrowRight size={24} />
                </button>
              </div>
              <div className="sticky top-full transform -translate-y-[calc(100%)] -mt-12 inset-x-0 z-[1000] w-full flex justify-center py-4 gap-x-4">
                {images.map((image) => (
                  <div
                    key={image.id}
                    className={clsx(
                      "transition-colors duration-300 w-2 h-2 bg-gray-200 bg-opacity-75 rounded-full",
                      {
                        "!bg-gray-700": currentSrc === image.url,
                      }
                    )}
                  />
                ))}
              </div>
              <div className="flex-1">
                <div className="aspect-[29/35] w-full relative">
                  <Image
                    src={currentSrc}
                    layout="fill"
                    objectFit="cover"
                    className="absolute inset-0"
                    alt="Product image"
                  />
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  )
}

export default ImagesFullscreen
