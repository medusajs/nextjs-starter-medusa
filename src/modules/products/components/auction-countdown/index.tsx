"use client"

import { Text } from "@medusajs/ui"
import { useState, useEffect } from "react"

const AuctionCountdown = ({ targetDate }: { targetDate: Date }) => {
  const calculateTimeLeft = () => {
    const difference = targetDate.getTime() - new Date().getTime()
    let timeLeft = {}

    if (difference > 0) {
      timeLeft = {
        d: Math.floor(difference / (1000 * 60 * 60 * 24)),
        h: Math.floor((difference / (1000 * 60 * 60)) % 24),
        m: Math.floor((difference / 1000 / 60) % 60),
        s: Math.floor((difference / 1000) % 60),
      }
    }

    return timeLeft
  }

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft())

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearTimeout(timer)
  })

  const timerComponents: JSX.Element[] = []

  Object.keys(timeLeft).forEach((interval) => {
    if (!timeLeft[interval as keyof typeof timeLeft]) {
      return
    }

    timerComponents.push(
      <span key={interval} suppressHydrationWarning>
        {timeLeft[interval as keyof typeof timeLeft]}
        {interval}{" "}
      </span>
    )
  })

  return (
    <div>
      {timerComponents.length ? (
        <Text className="text-ui-fg-subtle txt-compact-medium">
          Closes in{" "}
          <span className="text-ui-fg-interactive">{timerComponents}</span>
        </Text>
      ) : (
        <Text className="text-ui-fg-subtle txt-compact-medium">Closed</Text>
      )}
    </div>
  )
}

export default AuctionCountdown
