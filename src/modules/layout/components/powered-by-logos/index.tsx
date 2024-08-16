import { Text } from "@medusajs/ui"
import Image from "next/image"

const PoweredByLogos = () => {
  return (
    <Text className="flex items-center gap-x-2 txt-compact-small-plus">
      Powered by
      <Image src="/coshop-logo.png" alt="Coshop" width={20} height={20} />
      &
      <Image src="/coop-img.jpg" alt="Hauora Kai Karori" width={20} height={20} />
    </Text>
  )
}

export default PoweredByLogos
