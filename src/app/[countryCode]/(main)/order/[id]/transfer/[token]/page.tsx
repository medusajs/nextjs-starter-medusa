import { TransferActions } from "@/components/features/order/transfer-actions"
import { TransferImage } from "@/components/ui/icons/transfer-image"
import { Separator } from "@/components/ui/primitives/separator"
import { getTranslations } from "next-intl/server"

export default async function TransferPage({
  params,
}: {
  params: Promise<{ id: string; token: string }>
}) {
  const t = await getTranslations("pages.order.detail")
  const { id, token } = await params

  return (
    <div className="flex flex-col gap-y-4 items-start w-2/5 mx-auto mt-10 mb-20">
      <TransferImage />
      <div className="flex flex-col gap-y-6">
        <h1 className="text-xl">{t("title", { id })}</h1>
        <p className="text-muted-foreground">{t("description", { id })}</p>
        <Separator />
        <p className="text-muted-foreground">{t("message_1")}</p>
        <p className="text-muted-foreground">{t("message_2")}</p>
        <div className="w-full h-px bg-zinc-200" />
        <TransferActions id={id} token={token} />
      </div>
    </div>
  )
}
