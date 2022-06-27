import { Dialog, Transition } from "@headlessui/react"
import { Image as MedusaImage } from "@medusajs/medusa"
import ArrowRight from "@modules/common/icons/arrow-right"
import X from "@modules/common/icons/x"
import clsx from "clsx"
import Image from "next/image"
import React, { Fragment, useCallback, useEffect, useState } from "react"

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

  const handlePrev = useCallback(() => {
    const index = images.findIndex((image) => image.url === currentSrc)

    if (index > 0) {
      setCurrentSrc(images[index - 1].url)
    } else {
      setCurrentSrc(images[images.length - 1].url)
    }
  }, [currentSrc, images])

  const handleNext = useCallback(() => {
    const index = images.findIndex((image) => image.url === currentSrc)

    if (index < images.length - 1) {
      setCurrentSrc(images[index + 1].url)
    } else {
      setCurrentSrc(images[0].url)
    }
  }, [currentSrc, images])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        handleNext()
      } else if (e.key === "ArrowLeft") {
        handlePrev()
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [handleNext, handlePrev])

  return (
    <Transition show={open}>
      <Dialog onClose={close} className="fixed inset-0 z-[999]">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <div className="bg-white fixed inset-0 flex flex-col justify-between px-8">
            <div className="flex w-full justify-end py-4">
              <button onClick={close}>
                <X size={24} />
              </button>
            </div>
            <div className="flex items-center flex-1">
              <button onClick={handlePrev}>
                <ArrowRight className="transform rotate-180" size={24} />
              </button>
              <div className="flex-1 w-full h-full flex justify-center items-center">
                <div className="flex-1 h-full relative">
                  <Image
                    id="image-details"
                    src={currentSrc}
                    layout="fill"
                    objectFit="contain"
                    className={clsx("absolute inset-y-0")}
                    alt="Product image"
                    quality={80}
                  />
                </div>
              </div>
              <button onClick={handleNext}>
                <ArrowRight size={24} />
              </button>
            </div>
            <div className="w-full flex justify-center gap-x-4 py-8">
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
          </div>
        </Transition.Child>
      </Dialog>
    </Transition>
  )
}

export default ImagesFullscreen
