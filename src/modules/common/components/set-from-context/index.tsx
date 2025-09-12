"use client"

import React, { useEffect } from "react"
import { useFrom } from "@lib/context/from-context"

type SetFromContextProps = {
  href: string
  label: string
}

const SetFromContext: React.FC<SetFromContextProps> = ({ href, label }) => {
  const { setFrom } = useFrom()

  useEffect(() => {
    setFrom({ href, label })
    // do not include setFrom to avoid stale identity; it's stable via context
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [href, label])

  return null
}

export default SetFromContext


