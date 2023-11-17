import { Disclosure } from "@headlessui/react"
import { useCheckout } from "@lib/context/checkout-context"
import { Heading, Text } from "@medusajs/ui"
import { CheckCircleSolid } from "@medusajs/icons"
import clsx from "clsx"
import Divider from "@modules/common/components/divider"

type StepContainerProps = {
  title: string
  editState?: boolean
  toggleEditState?: () => void
  children?: React.ReactNode
} & React.HTMLAttributes<HTMLDivElement>

const StepContainer = ({
  title,
  className,
  children,
  editState,
  toggleEditState,
  ...props
}: StepContainerProps) => {
  const {
    editAddresses: { state: addressEditState },
  } = useCheckout()

  const show = !addressEditState && editState

  return (
    <div>
      <div
        className={clsx("bg-white px-8", className, {
          "opacity-50 pointer-events-none select-none": show,
        })}
        {...props}
      >
        <div className="flex flex-row items-center justify-between mb-6">
          <Heading
            level="h2"
            className="flex flex-row text-3xl-regular gap-x-2 items-baseline"
          >
            {title}
            {!show && <CheckCircleSolid />}
          </Heading>
          {!show && (
            <Text>
              <button
                onClick={toggleEditState}
                className="text-ui-fg-interactive"
              >
                Edit
              </button>
            </Text>
          )}
        </div>
        <Disclosure>
          <Disclosure.Panel
            static
            className={clsx(
              "transition-[max-height,opacity] duration-700 ease-in-out overflow-hidden",
              {
                "max-h-[9999px] opacity-100": !show,
                "max-h-0 opacity-0": show,
              }
            )}
          >
            {children}
          </Disclosure.Panel>
          <Disclosure.Panel
            static
            className={clsx(
              "transition-[max-height,opacity] duration-700 ease-in-out overflow-hidden",
              {
                "max-h-[9999px] opacity-100": show,
                "max-h-0 opacity-0": !show,
              }
            )}
          ></Disclosure.Panel>
          <Divider className="mt-8" />
        </Disclosure>
      </div>
    </div>
  )
}

export default StepContainer
