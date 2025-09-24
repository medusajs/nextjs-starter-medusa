"use client"

import React from "react"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"

import { addCustomerAddress } from "@/utils/data/customer"
import { addressSchema } from "@/utils/validations/address"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/primitives/form"
import { Button } from "@/components/ui/primitives/button"
import { FloatingInput } from "@/components/ui/primitives/floating-input"
import { CountrySelect } from "@/components/modules/cart/country-select"

import type { HttpTypes } from "@medusajs/types"
import type { AddressFormType } from "@/utils/validations/address"

type Props = {
  region: HttpTypes.StoreRegion
  addresses: HttpTypes.StoreCustomerAddress[]
  onCancel?: () => void
  onFinish?: () => void
}

function AddAddressForm({ region, addresses, onCancel, onFinish }: Props) {
  const t = useTranslations("features.account.forms.add_address_form")

  const form = useForm<AddressFormType>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      company: "",
      address_1: "",
      address_2: "",
      postal_code: "",
      city: "",
      phone: "",
      province: "",
    },
  })

  async function onSubmit(values: AddressFormType) {
    try {
      await addCustomerAddress(
        { isDefaultShipping: addresses.length === 0 },
        values
      )
      onFinish?.()
      toast.success(t("message.success"))
    } catch {
      toast.error(t("message.error"))
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full grid grid-cols-1 gap-6"
      >
        <div className="flex items-start gap-4">
          <FormField
            control={form.control}
            name="first_name"
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
            name="last_name"
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
        </div>
        <FormField
          control={form.control}
          name="company"
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
          name="address_1"
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
          name="address_2"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <FloatingInput
                  label={t("label.address_2")}
                  data-testid="address-2-input"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex items-start gap-4">
          <FormField
            control={form.control}
            name="postal_code"
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
            name="city"
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
        </div>
        <FormField
          control={form.control}
          name="province"
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
        <FormField
          control={form.control}
          name="country_code"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <CountrySelect
                  value={field.value}
                  data-testid="city-input"
                  region={region}
                  onValueChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
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
        <div className="ml-auto w-fit flex items-center gap-4">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={onCancel}
            >
              {t("cancel_button")}
            </Button>
          )}
          <Button
            type="submit"
            size="lg"
            disabled={form.formState.isSubmitting}
            isLoading={form.formState.isSubmitting}
          >
            {t("submit")}
          </Button>
        </div>
      </form>
    </Form>
  )
}

export { AddAddressForm }
export type { Props as AddAddressProps }
