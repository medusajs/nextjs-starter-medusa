import { Fragment } from "react"
import { getTranslations } from "next-intl/server"

import { acceptTransferRequest } from "@/utils/data/orders"

import { TransferImage } from "@/components/ui/icons/transfer-image"

export default async function TransferPage({
  params,
}: {
  params: Promise<{ id: string; token: string }>
}) {
  const t = await getTranslations("pages.order.transfer.accept")
  const { id, token } = await params

  const { success, error } = await acceptTransferRequest(id, token)

  return (
    <div className="flex flex-col gap-y-4 items-start w-2/5 mx-auto mt-10 mb-20">
      <TransferImage />
      <div className="flex flex-col gap-y-6">
        {success && (
          <Fragment>
            <h1 className="text-xl">{t("success.title")}</h1>
            <p className="text-muted-foreground">
              {t("success.description", { id })}
            </p>
          </Fragment>
        )}
        {!success && (
          <Fragment>
            <p className="text-muted-foreground">{t("error.description")}</p>
            {error && (
              <p className="text-destructive">
                {t("error.message", { error })}
              </p>
            )}
          </Fragment>
        )}
      </div>
    </div>
  )
}
