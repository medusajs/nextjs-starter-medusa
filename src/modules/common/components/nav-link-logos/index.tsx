import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Image from "next/image"

const NavLinkLogos = () => (
  <LocalizedClientLink
    href="/products/mixed-bag"
    className="flex flex-row items-center uppercase gap-x-2 txt-compact-xlarge-plus hover:text-ui-fg-base"
    data-testid="nav-store-link"
  >
    <div className="flex flex-row items-center gap-x-2">
      <Image src="/coshop-logo.png" alt="" width={32} height={32} />
      <span>CoShop</span>
    </div>
    <span>&</span>
    <div className="flex flex-row items-center gap-x-2">
      <span>Hauora Kai Karori</span>
      <Image src="/coop-img.jpg" alt="" width={32} height={32} />
    </div>
  </LocalizedClientLink>
)

export default NavLinkLogos