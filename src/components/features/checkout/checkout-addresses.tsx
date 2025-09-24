"use client"

import { Fragment, useMemo, useState } from "react"
import { useTranslations } from "next-intl"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { addressSchema } from "@/utils/validations/checkout"

import {
  ChevronDownIcon,
  CircleCheckIcon,
  LoaderCircleIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { setAddresses } from "@/utils/data/cart"

import { SubmitButton } from "@/components/ui/forms/submit-button"
import { Button } from "@/components/ui/primitives/button"
import { Separator } from "@/components/ui/primitives/separator"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/primitives/form"
import { FloatingInput } from "@/components/ui/primitives/floating-input"
import { CountrySelect } from "@/components/modules/cart/country-select"
import { Checkbox } from "@/components/ui/primitives/checkbox"
import { Label } from "@/components/ui/primitives/label"
import { Section } from "@/components/ui/react/design-system"
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/primitives/radio-group"

import type { HttpTypes } from "@medusajs/types"
import type { AddressFormType } from "@/utils/validations/checkout"

type Props = {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
}

function Addresses({ cart, customer }: Props) {
  const t = useTranslations("features.checkout.addresses")
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const [currentAddress, setCurrentAddress] = useState<string>("")

  const form = useForm<AddressFormType>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      same_as_billing: true,
      shipping_address: {
        first_name: "",
        last_name: "",
        company: "",
        address_1: "",
        postal_code: "",
        city: "",
        province: "",
        country_code: cart?.shipping_address?.country_code ?? "",
        phone: cart?.shipping_address?.phone ?? "",
      },
      email: customer?.email ?? "",
    },
  })

  const sameAsBilling = form.watch("same_as_billing")

  const isOpen = searchParams.get("step") === "address"

  const handleEdit = () => {
    router.push(pathname + "?step=address")
  }

  const countriesInRegion = useMemo(
    () => cart?.region?.countries?.map((c) => c.iso_2),
    [cart?.region]
  )
  const addressesInRegion = useMemo(
    () =>
      customer?.addresses.filter(
        (a) => a.country_code && countriesInRegion?.includes(a.country_code)
      ),
    [customer?.addresses, countriesInRegion]
  )

  async function onSubmit(values: AddressFormType) {
    const res = await setAddresses(values)
    if (res.success && res.redirect) {
      router.push(res.redirect)
    }
  }

  return (
    <div className="bg-background">
      <div className="flex flex-row items-center justify-between mb-6">
        <h2 className="flex text-xl lg:text-2xl font-medium gap-x-2 items-center">
          1. {t("summary.title")}
          {!isOpen && <CircleCheckIcon className="size-5 mt-0.5" />}
        </h2>
        {!isOpen && cart?.shipping_address && (
          <p>
            <Button
              onClick={handleEdit}
              variant="secondary"
              data-testid="edit-address-button"
            >
              {t("button.edit")}
            </Button>
          </p>
        )}
      </div>
      {isOpen ? (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            {customer && (addressesInRegion?.length || 0) > 0 && (
              <Section className="mb-6 flex flex-col gap-y-4">
                <p className="text-base text-muted-foreground">
                  {t("label.select_address", {
                    name: customer.first_name || "",
                  })}
                </p>
                <RadioGroup
                  value={currentAddress}
                  onValueChange={(id) => {
                    const address = customer.addresses.find((a) => a.id == id)
                    if (!address) return
                    setCurrentAddress(id)
                    form.setValue("shipping_address", {
                      first_name: address.first_name || "",
                      last_name: address.last_name || "",
                      company: address.company || "",
                      address_1: address.address_1 || "",
                      postal_code: address.postal_code || "",
                      city: address.city || "",
                      province: address.province || "",
                      country_code: address.country_code || "",
                      phone: address?.phone ?? "",
                    })
                  }}
                  className="relative grid grid-cols-1 lg:grid-cols-2 w-full"
                >
                  {customer.addresses.map((address) => {
                    return (
                      <div
                        key={address.id}
                        className={cn(
                          "select-none relative pl-6 pr-10 flex gap-x-4 items-start overflow-hidden py-4 w-full bg-card border rounded-lg transition-colors cursor-pointer",
                          {
                            "border-primary bg-primary/10":
                              currentAddress === address.id,
                          }
                        )}
                        data-testid="shipping-address-option"
                      >
                        <RadioGroupItem
                          value={address.id}
                          id={address.id + "radio"}
                          checked={currentAddress === address.id}
                          data-testid="shipping-address-radio"
                        />
                        <Label
                          htmlFor={address.id + "radio"}
                          className="flex flex-col items-start w-full"
                        >
                          <span className="text-foreground text-sm">
                            {address.first_name} {address.last_name}
                          </span>
                          {address.company && (
                            <span className="text-sm text-foreground">
                              {address.company}
                            </span>
                          )}
                          <div className="flex flex-col text-left text-base">
                            <span>
                              {address.address_1}
                              {address.address_2 && (
                                <span>, {address.address_2}</span>
                              )}
                            </span>
                            <span>
                              {address.postal_code}, {address.city}
                            </span>
                            <span>
                              {address.province && `${address.province}, `}
                              {address.country_code?.toUpperCase()}
                            </span>
                          </div>
                        </Label>
                      </div>
                    )
                  })}
                </RadioGroup>

                <Separator className="mt-4" />
              </Section>
            )}
            <div className="grid grid-cols-2 gap-5">
              <FormField
                control={form.control}
                name="shipping_address.first_name"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <FloatingInput
                        label={t("label.first_name")}
                        data-testid="first-name-input"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="shipping_address.last_name"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <FloatingInput
                        label={t("label.last_name")}
                        data-testid="last-name-input"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="shipping_address.address_1"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FloatingInput
                        label={t("label.address_1")}
                        data-testid="address-1-input"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="shipping_address.company"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FloatingInput
                        label={t("label.company")}
                        data-testid="company-input"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="shipping_address.postal_code"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <FloatingInput
                        label={t("label.postal_code")}
                        data-testid="postal-code-input"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="shipping_address.city"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <FloatingInput
                        label={t("label.city")}
                        data-testid="city-input"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="shipping_address.country_code"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <CountrySelect
                        value={field.value}
                        data-testid="city-input"
                        region={cart?.region}
                        onValueChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="shipping_address.province"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FloatingInput
                        label={t("label.province")}
                        data-testid="province-input"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="same_as_billing"
              render={({ field }) => (
                <FormItem className="flex items-center gap-1 my-8">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel>{t("label.same_as_billing")}</FormLabel>
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-5">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FloatingInput
                        label={t("label.email")}
                        data-testid="email-input"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="shipping_address.phone"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FloatingInput
                        label={t("label.phone")}
                        data-testid="phone-input"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {!sameAsBilling && (
              <div>
                <Separator className="my-10" />
                <h2 className="text-xl font-medium gap-x-4 pb-6">
                  {t("label.billing_address")}
                </h2>

                <div className="grid grid-cols-2 gap-5">
                  <FormField
                    control={form.control}
                    name="billing_address.first_name"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormControl>
                          <FloatingInput
                            label={t("label.first_name")}
                            data-testid="first-name-input"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="billing_address.last_name"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormControl>
                          <FloatingInput
                            label={t("label.last_name")}
                            data-testid="last-name-input"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="billing_address.address_1"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <FloatingInput
                            label={t("label.address_1")}
                            data-testid="address-1-input"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="billing_address.company"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <FloatingInput
                            label={t("label.company")}
                            data-testid="company-input"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="billing_address.postal_code"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormControl>
                          <FloatingInput
                            label={t("label.postal_code")}
                            data-testid="postal-code-input"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="billing_address.city"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormControl>
                          <FloatingInput
                            label={t("label.city")}
                            data-testid="city-input"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="billing_address.country_code"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <CountrySelect
                            value={field.value}
                            data-testid="city-input"
                            region={cart?.region}
                            onValueChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="billing_address.province"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <FloatingInput
                            label={t("label.province")}
                            data-testid="province-input"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            )}
            <SubmitButton
              className="mt-6"
              loading={form.formState.isSubmitting}
              data-testid="submit-address-button"
            >
              {t("button.continue")} <ChevronDownIcon />
            </SubmitButton>
          </form>
        </Form>
      ) : (
        <div>
          <div className="text-sm">
            {cart && cart.shipping_address ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-5 w-full">
                <div
                  className="flex flex-col w-full"
                  data-testid="shipping-address-summary"
                >
                  <p className="font-medium text-foreground mb-1">
                    {t("summary.shipping_address")}
                  </p>
                  <p className="font-medium text-foreground">
                    {cart.shipping_address.first_name}{" "}
                    {cart.shipping_address.last_name}
                  </p>
                  <p className="font-medium text-foreground">
                    {cart.shipping_address.address_1}{" "}
                    {cart.shipping_address.address_2}
                  </p>
                  <p className="font-medium text-foreground">
                    {cart.shipping_address.postal_code},{" "}
                    {cart.shipping_address.city}
                  </p>
                  <p className="font-medium text-foreground">
                    {cart.shipping_address.country_code?.toUpperCase()}
                  </p>
                </div>

                <div
                  className="flex flex-col w-full"
                  data-testid="shipping-contact-summary"
                >
                  <p className="font-medium text-foreground mb-1">
                    {" "}
                    {t("summary.contact")}
                  </p>
                  <p className="font-medium text-foreground">
                    {cart.shipping_address.phone}
                  </p>
                  <p className="font-medium text-foreground">{cart.email}</p>
                </div>

                <div
                  className="flex flex-col w-full"
                  data-testid="billing-address-summary"
                >
                  <p className="font-medium text-foreground mb-1">
                    {t("summary.billing_address")}
                  </p>

                  {sameAsBilling ? (
                    <p className="font-medium text-foreground">
                      {t("summary.same_billing_address")}
                    </p>
                  ) : (
                    <Fragment>
                      <p className="font-medium text-foreground">
                        {cart.billing_address?.first_name}{" "}
                        {cart.billing_address?.last_name}
                      </p>
                      <p className="font-medium text-foreground">
                        {cart.billing_address?.address_1}{" "}
                        {cart.billing_address?.address_2}
                      </p>
                      <p className="font-medium text-foreground">
                        {cart.billing_address?.postal_code},{" "}
                        {cart.billing_address?.city}
                      </p>
                      <p className="font-medium text-foreground">
                        {cart.billing_address?.country_code?.toUpperCase()}
                      </p>
                    </Fragment>
                  )}
                </div>
              </div>
            ) : (
              <div>
                <LoaderCircleIcon className="animate-spin" />
              </div>
            )}
          </div>
        </div>
      )}
      <Separator className="mt-8" />
    </div>
  )
}

export { Addresses }
