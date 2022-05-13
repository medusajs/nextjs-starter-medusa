import React from "react"
import { IconProps } from "types/icon"

const Gift: React.FC<IconProps> = ({
  size = "20",
  color = "currentColor",
  ...attributes
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...attributes}
    >
      <path
        d="M15.8337 9.58325V16.2499H4.16699V9.58325"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17.5 6.25H2.5V9.58333H17.5V6.25Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 16.25V6.25"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 6.24998H6.78571C6.31211 6.24998 5.85791 6.03049 5.52302 5.63979C5.18814 5.24908 5 4.71918 5 4.16665C5 3.61411 5.18814 3.08421 5.52302 2.69351C5.85791 2.30281 6.31211 2.08331 6.78571 2.08331C9.28571 2.08331 10 6.24998 10 6.24998Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 6.24998H13.2143C13.6879 6.24998 14.1421 6.03049 14.477 5.63979C14.8119 5.24908 15 4.71918 15 4.16665C15 3.61411 14.8119 3.08421 14.477 2.69351C14.1421 2.30281 13.6879 2.08331 13.2143 2.08331C10.7143 2.08331 10 6.24998 10 6.24998Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default Gift
