import { Cart, Customer, Order } from "@medusajs/medusa"
import CartIcon from "@modules/common/icons/cart"
import ChevronDown from "@modules/common/icons/chevron-down"
import MapPin from "@modules/common/icons/map-pin"
import Package from "@modules/common/icons/package"
import User from "@modules/common/icons/user"
import Link from "next/link"

type OverviewProps = {
  orders?: Order[]
  customer?: Omit<Customer, "password_hash">
  cart?: Omit<Cart, "refundable_amount" | "refunded_total">
}

const Overview = ({ orders, customer, cart }: OverviewProps) => {
  return (
    <div>
      <div className="small:hidden">
        <div className="text-xl-semi mb-4 px-8">
          Hello {customer?.first_name}
        </div>
        <div className="text-base-regular">
          <ul>
            <li>
              <Link href="/account/profile">
                <a className="flex items-center justify-between py-4 border-b border-gray-200 px-8">
                  <div className="flex items-center gap-x-2">
                    <User size={16} />
                    <span>Profile</span>
                  </div>
                  <ChevronDown className="transform -rotate-90" />
                </a>
              </Link>
            </li>
            <li>
              <Link href="/account/addresses">
                <a className="flex items-center justify-between py-4 border-b border-gray-200 px-8">
                  <div className="flex items-center gap-x-2">
                    <MapPin size={16} />
                    <span>Addresses</span>
                  </div>
                  <ChevronDown className="transform -rotate-90" />
                </a>
              </Link>
            </li>
            <li>
              <Link href="/account/orders">
                <a className="flex items-center justify-between py-4 border-b border-gray-200 px-8">
                  <div className="flex items-center gap-x-2">
                    <Package size={16} />
                    <span>Orders</span>
                  </div>
                  <ChevronDown className="transform -rotate-90" />
                </a>
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="hidden small:grid grid-cols-2 gap-4">
        <Link href="/account/profile">
          <a className="col-span-2">
            <div className="bg-rose-100 flex flex-col py-12 items-center justify-center gap-y-4">
              <div className="flex items-center gap-x-4">
                <div className="bg-white w-24 h-24 rounded-full flex items-center justify-center text-gray-900">
                  <CartIcon size={36} />
                </div>
                <span className="text-2xl-semi font-mono">
                  {orders?.length || 0}
                </span>
              </div>
              <span>Orders</span>
            </div>
          </a>
        </Link>
        <Link href="/account/addresses">
          <a>
            <div className="bg-fuchsia-100 flex flex-col py-12 items-center justify-center gap-y-4">
              <div className="flex items-center gap-x-4">
                <div className="bg-white w-24 h-24 rounded-full flex items-center justify-center text-gray-900">
                  <CartIcon size={36} />
                </div>
                <span className="text-2xl-semi font-mono">
                  {customer?.shipping_addresses?.length || 0}
                </span>
              </div>
              <span>Shipping Addresses</span>
            </div>
          </a>
        </Link>
        <Link href="/cart">
          <a>
            <div className="bg-sky-100 flex flex-col py-12 items-center justify-center gap-y-4">
              <div className="flex items-center gap-x-4">
                <div className="bg-white w-24 h-24 rounded-full flex items-center justify-center text-gray-900">
                  <CartIcon size={36} />
                </div>
                <span className="text-2xl-semi font-mono">
                  {cart?.items?.length || 0}
                </span>
              </div>
              <span>Shopping Bag</span>
            </div>
          </a>
        </Link>
        <Link href="/account/profile">
          <a className="col-span-2">
            <div className="bg-amber-100 flex flex-col py-12 items-center justify-center gap-y-4">
              <div className="flex items-center gap-x-4">
                <div className="bg-white w-24 h-24 rounded-full flex items-center justify-center text-gray-900">
                  <CartIcon size={36} />
                </div>
                <span className="text-2xl-semi font-mono">
                  {orders?.length || 0}
                </span>
              </div>
              <span>Orders</span>
            </div>
          </a>
        </Link>
      </div>
    </div>
  )
}

export default Overview
