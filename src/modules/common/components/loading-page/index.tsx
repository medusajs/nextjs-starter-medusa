import Spinner from "@modules/common/icons/spinner"
import React from "react"

const LoadingPage = () => {
  return (
    <div className="flex w-full min-h-[calc(100vh-64px)] items-center justify-center">
      <Spinner size={24} />
    </div>
  )
}

export default LoadingPage
