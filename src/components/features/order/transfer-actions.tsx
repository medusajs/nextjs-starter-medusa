"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"

import {
  acceptTransferRequest,
  declineTransferRequest,
} from "@/utils/data/orders"

import { Button } from "@/components/ui/primitives/button"

type TransferStatus = "pending" | "success" | "error"

function TransferActions({ id, token }: { id: string; token: string }) {
  const t = useTranslations("pages.order.transfer_actions")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [status, setStatus] = useState<{
    accept: TransferStatus | null
    decline: TransferStatus | null
  } | null>({
    accept: null,
    decline: null,
  })

  const acceptTransfer = async () => {
    setStatus({ accept: "pending", decline: null })
    setErrorMessage(null)

    const { success, error } = await acceptTransferRequest(id, token)

    if (error) setErrorMessage(error)
    setStatus({ accept: success ? "success" : "error", decline: null })
  }

  const declineTransfer = async () => {
    setStatus({ accept: null, decline: "pending" })
    setErrorMessage(null)

    const { success, error } = await declineTransferRequest(id, token)

    if (error) setErrorMessage(error)
    setStatus({ accept: null, decline: success ? "success" : "error" })
  }

  return (
    <div className="flex flex-col gap-y-4">
      {status?.accept === "success" && (
        <p className="text-emerald-500">{t("message.accept")}</p>
      )}
      {status?.decline === "success" && (
        <p className="text-emerald-500">{t("message.decline")}</p>
      )}
      {status?.accept !== "success" && status?.decline !== "success" && (
        <div className="flex gap-x-4">
          <Button
            size="lg"
            onClick={acceptTransfer}
            isLoading={status?.accept === "pending"}
            disabled={
              status?.accept === "pending" || status?.decline === "pending"
            }
          >
            {t("button.accept")}
          </Button>
          <Button
            size="lg"
            variant="secondary"
            onClick={declineTransfer}
            isLoading={status?.decline === "pending"}
            disabled={
              status?.accept === "pending" || status?.decline === "pending"
            }
          >
            {t("button.decline")}
          </Button>
        </div>
      )}
      {errorMessage && <p className="text-destructive">{errorMessage}</p>}
    </div>
  )
}

export { TransferActions }
