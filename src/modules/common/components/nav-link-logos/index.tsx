import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Image from "next/image"

const NavLinkLogos = () => (
        <div>
          <LocalizedClientLink
            href="/products/mixed-bag"
            className="flex flex-row items-center h-full uppercase gap-x-2 txt-compact-large-plus sm:txt-compact-xlarge-plus hover:text-ui-fg-base"
            data-testid="nav-store-link"
          >
            {/* TODO delete coshop from header if not required */}
            {/* <div className="flex flex-row items-center gap-x-1">
              <Image src="/coshop-logo.png" alt="" width={20} height={20} />
              <span>CoShop</span>
            </div>
            <span>&</span> */}
            <div className="flex flex-row items-center gap-x-1">
              <Image src="/coop-img.jpg" alt="" width={20} height={20} />
              <span>Hauora Kai Karori</span>
            </div>
          </LocalizedClientLink>
        </div>
)

export default NavLinkLogos