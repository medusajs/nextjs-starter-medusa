import { Button, Heading, Text } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import TransferImage from "@modules/order/components/transfer-image"

export default async function TransferPage({
  params,
}: {
  params: { id: string; token: string }
}) {
  const { id, token } = params

  return (
    <div className="flex flex-col gap-y-4 items-start w-3/5 mx-auto mt-10 mb-20">
      <TransferImage />
      <div className="flex flex-col gap-y-6">
        <Heading level="h1" className="text-xl text-zinc-900">
          Transfer request for order {id}
        </Heading>
        <Text className="text-zinc-600">
          You've received a request to transfer ownership of your order ({id}).
          If you agree to this request, you can approve the transfer by clicking
          the button below.
        </Text>
        <div className="w-full h-px bg-zinc-200" />
        <Text className="text-zinc-600">
          If you accept, the new owner will take over all responsibilities and
          permissions associated with this order.
        </Text>
        <Text className="text-zinc-600">
          If you do not recognize this request or wish to retain ownership, no
          further action is required.
        </Text>
        <div className="w-full h-px bg-zinc-200" />
        <div className="flex gap-x-4">
          <Button size="large" asChild>
            <LocalizedClientLink href={`/order/${id}/transfer/${token}/accept`}>
              Approve transfer
            </LocalizedClientLink>
          </Button>
          <Button size="large" variant="secondary" asChild>
            <LocalizedClientLink
              href={`/order/${id}/transfer/${token}/decline`}
            >
              Decline transfer
            </LocalizedClientLink>
          </Button>
        </div>
      </div>
    </div>
  )
}
