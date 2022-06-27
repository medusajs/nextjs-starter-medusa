import { Disclosure } from "@headlessui/react"
import useToggleState from "@lib/hooks/use-toggle-state"
import Button from "@modules/common/components/button"
import clsx from "clsx"
import { useEffect } from "react"

type AccountInfoProps = {
  label: string
  currentInfo: string | React.ReactNode
  isLoading?: boolean
  isSuccess?: boolean
  isError?: boolean
  errorMessage?: string
  clearState: () => void
  children?: React.ReactNode
}

const AccountInfo = ({
  label,
  currentInfo,
  isLoading,
  isSuccess,
  isError,
  clearState,
  errorMessage = "An error occurred, please try again",
  children,
}: AccountInfoProps) => {
  const { state, close, toggle } = useToggleState()

  const handleToggle = () => {
    clearState()
    setTimeout(() => toggle(), 100)
  }

  useEffect(() => {
    if (isSuccess) {
      close()
    }
  }, [isSuccess, close])

  return (
    <div className="text-small-regular">
      <div className="flex items-center justify-between">
        <span className="uppercase">{label}</span>
        <div className="flex items-center flex-1 basis-0 justify-end gap-x-4">
          {typeof currentInfo === "string" ? (
            <span className="font-semibold">{currentInfo}</span>
          ) : (
            currentInfo
          )}
          <button
            className="uppercase text-small-regular border border-gray-900 py-1 w-[80px] transition-colors duration-150 hover:border-gray-700 "
            onClick={handleToggle}
            type={state ? "reset" : "button"}
          >
            {state ? "Cancel" : "Edit"}
          </button>
        </div>
      </div>

      {/* Success state */}
      <Disclosure>
        <Disclosure.Panel
          static
          className={clsx(
            "transition-[max-height,opacity] duration-300 ease-in-out overflow-hidden",
            {
              "max-h-[1000px] opacity-100": isSuccess,
              "max-h-0 opacity-0": !isSuccess,
            }
          )}
        >
          <div className="bg-green-100 text-green-500 p-4 my-4">
            <span>{label} updated succesfully</span>
          </div>
        </Disclosure.Panel>
      </Disclosure>

      {/* Error state  */}
      <Disclosure>
        <Disclosure.Panel
          static
          className={clsx(
            "transition-[max-height,opacity] duration-300 ease-in-out overflow-hidden",
            {
              "max-h-[1000px] opacity-100": isError,
              "max-h-0 opacity-0": !isError,
            }
          )}
        >
          <div className="bg-rose-100 text-rose-500 p-4 mt-4">
            <span>{errorMessage}</span>
          </div>
        </Disclosure.Panel>
      </Disclosure>

      <Disclosure>
        <Disclosure.Panel
          static
          className={clsx(
            "transition-[max-height,opacity] duration-300 ease-in-out overflow-hidden",
            {
              "max-h-[1000px] opacity-100": state,
              "max-h-0 opacity-0": !state,
            }
          )}
        >
          <div className="flex flex-col gap-y-2 py-4">
            <div>{children}</div>
            <div className="flex items-center justify-end mt-2">
              <Button
                isLoading={isLoading}
                className="max-w-[140px]"
                type="submit"
              >
                Save changes
              </Button>
            </div>
          </div>
        </Disclosure.Panel>
      </Disclosure>
    </div>
  )
}

export default AccountInfo
