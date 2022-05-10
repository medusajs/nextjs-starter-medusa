import { Listbox, Transition } from "@headlessui/react"
import { ErrorMessage } from "@hookform/error-message"
import ChevronDown from "@modules/common/icons/chevron-down"
import clsx from "clsx"
import React, { Fragment, useEffect, useState } from "react"

export type SelectOption = {
  value: unknown
  label: string
}

type SelectProps = {
  value: unknown
  onChange: (value: unknown) => void
  options: SelectOption[]
  placeholder: string
  dropdownPosition?: "top" | "bottom"
  errors?: Record<string, unknown>
  name?: string
  required?: boolean
} & Pick<React.ButtonHTMLAttributes<HTMLButtonElement>, "className">

const Select: React.FC<SelectProps> = ({
  value,
  onChange,
  options,
  placeholder,
  dropdownPosition = "bottom",
  errors,
  name,
  required,
  className,
}) => {
  const [current, setCurrent] = useState<string | undefined>(undefined)

  useEffect(() => {
    const currentOption =
      options.find((option) => option.value === value) || undefined

    setCurrent(currentOption?.label)
  }, [value, options])

  return (
    <Listbox onChange={onChange} value={value}>
      <div className="relative mt-1">
        <Listbox.Button
          className={clsx(
            "relative w-full flex justify-between items-center px-4 py-[10px] text-left bg-white cursor-default focus:outline-none border border-gray-200 focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-gray-300 focus-visible:ring-offset-2 focus-visible:border-gray-300 sm:text-sm",
            className
          )}
        >
          {({ open }) => (
            <>
              <span
                className={clsx("block truncate", {
                  "text-gray-500": !current,
                })}
              >
                {current || placeholder}
                {!current && required && (
                  <span className="text-rose-500">*</span>
                )}
              </span>
              <ChevronDown
                size={16}
                className={clsx({ "transform rotate-180": open })}
              />
            </>
          )}
        </Listbox.Button>

        {errors && name && (
          <ErrorMessage
            errors={errors}
            name={name}
            render={({ message }) => {
              return (
                <div className="pt-2 text-gray-500 text-small-regular">
                  <span>{message}</span>
                </div>
              )
            }}
          />
        )}

        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options
            className={clsx(
              "absolute z-20 w-full py-1 overflow-auto text-small-regular bg-white border border-gray-200 border-top-0 max-h-60 focus:outline-none sm:text-sm",
              {
                "-top-[86px]": dropdownPosition === "top",
                "mt-1": dropdownPosition === "bottom",
              }
            )}
          >
            {options.map((option, index) => (
              <Listbox.Option
                key={index}
                className="cursor-default select-none relative py-2 pl-6 pr-10"
                value={option.value}
              >
                {({ selected }) => (
                  <span
                    className={`truncate ${
                      selected
                        ? "font-semibold text-gray-900"
                        : "font-normal cursor-pointer text-gray-700"
                    }`}
                  >
                    {option.label}
                  </span>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  )
}

export default Select
