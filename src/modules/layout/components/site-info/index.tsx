import { Disclosure } from "@headlessui/react"
import clsx from "clsx"
import React from "react"

const InfoContainer: React.FC<{ label: string }> = ({ label, children }) => {
  return (
    <div>
      <div className="hidden lg:flex lg:flex-col lg:gap-y-2">
        <span className="text-small-semi">{label}</span>
        {children}
      </div>
      <div className="lg:hidden mb-3">
        <Collapsible label={label}>{children}</Collapsible>
      </div>
    </div>
  )
}

const Collapsible: React.FC<{ label: string }> = ({ label, children }) => {
  return (
    <div className="pb-4">
      <Disclosure>
        {({ open }) => {
          return (
            <>
              <Disclosure.Button className="text-gray-900 flex items-center justify-between w-full">
                <span className="text-small-semi uppercase">{label}</span>
                <AnimatedButton open={open} />
              </Disclosure.Button>
              <Disclosure.Panel
                static
                className={clsx(
                  "transition-[max-height,opacity] duration-700 ease-in-out overflow-hidden",
                  {
                    "max-h-[300px] opacity-100": open,
                    "max-h-0 opacity-0": !open,
                  }
                )}
              >
                <div className="py-4">
                  <span>{children}</span>
                </div>
              </Disclosure.Panel>
            </>
          )
        }}
      </Disclosure>
    </div>
  )
}

const AnimatedButton = ({ open }: { open: boolean }) => {
  return (
    <div className="w-[15px] h-[15px] relative cursor-pointer">
      <div className="bg-gray-900 absolute top-[7px] inset-x-0 h-px" />
      <div
        className={clsx(
          "bg-gray-900 absolute left-[7px] inset-y-0 w-px transition-all duration-300 ease-out",
          { "rotate-90": open }
        )}
      />
    </div>
  )
}
