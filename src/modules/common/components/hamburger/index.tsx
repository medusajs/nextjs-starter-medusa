import clsx from "clsx"
import React from "react"

type HamburgerProps = {
  open: boolean
  setOpen: () => void
}

const Hamburger: React.FC<HamburgerProps> = ({ open, setOpen }) => {
  return (
    <button
      className="text-gray-700 w-10 h-10 relative focus:outline-none"
      onClick={setOpen}
    >
      <span className="sr-only">Open main menu</span>
      <div className="block w-5 absolute left-1/2 top-1/2 transform  -translate-x-1/2 -translate-y-1/2">
        <span
          aria-hidden="true"
          className={clsx(
            "block absolute h-0.5 w-5 rounded-sm bg-current transform transition duration-500 ease-in-out",
            { "rotate-45": open, " -translate-y-1.5": !open }
          )}
        ></span>
        <span
          aria-hidden="true"
          className={clsx(
            "block absolute  h-0.5 w-5 bg-current rounded-sm transform transition duration-500 ease-in-out",
            { "opacity-0": open }
          )}
        ></span>
        <span
          aria-hidden="true"
          className={clsx(
            "block absolute  h-0.5 w-5 bg-current rounded-sm transform  transition duration-500 ease-in-out",
            { "-rotate-45": open, " translate-y-1.5": !open }
          )}
        ></span>
      </div>
    </button>
  )
}

export default Hamburger
